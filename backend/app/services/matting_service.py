"""
Professional Portrait Matting Service - Remove.bg Quality
Pipeline: MODNet → Trimap → Closed-Form Matting → Smart Compositing
Enhanced with proper color decontamination for hair edges.
"""
import numpy as np
import cv2
import os
import sys
from scipy import ndimage

import torch
import torch.nn as nn
import torch.nn.functional as F

# Add MODNet source to path
MODNET_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'modnet')
sys.path.insert(0, MODNET_PATH)

from src.models.modnet import MODNet

# Model paths
CHECKPOINT_PATH = os.path.join(MODNET_PATH, 'checkpoints', 'modnet_photographic_portrait_matting.ckpt')


class MattingService:
    """
    Professional Portrait Matting Service - Remove.bg Quality
    """

    def __init__(self):
        print("=" * 60)
        print("[INIT] Initializing Professional Matting Service...")

        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"[DEVICE] Using: {self.device}")

        if not os.path.exists(CHECKPOINT_PATH):
            print(f"[ERROR] MODNet checkpoint not found at {CHECKPOINT_PATH}")
            self.model = None
            return

        try:
            print(f"[MODNET] Loading: {os.path.basename(CHECKPOINT_PATH)}")
            self.model = MODNet(backbone_pretrained=False)
            self.model = nn.DataParallel(self.model)

            if self.device == torch.device('cuda'):
                state_dict = torch.load(CHECKPOINT_PATH)
            else:
                state_dict = torch.load(CHECKPOINT_PATH, map_location=torch.device('cpu'))

            self.model.load_state_dict(state_dict)
            self.model = self.model.to(self.device)
            self.model.eval()
            print("[SUCCESS] MODNet loaded!")
        except Exception as e:
            print(f"[ERROR] Failed to load MODNet: {e}")
            import traceback
            traceback.print_exc()
            self.model = None

        print("=" * 60)

    def _modnet_inference(self, img_rgb):
        """
        Run MODNet inference with proper preprocessing.
        """
        im_h, im_w = img_rgb.shape[:2]
        
        # Use 512 as reference size
        ref_size = 512
        
        if max(im_h, im_w) < ref_size or min(im_h, im_w) > ref_size:
            if im_w >= im_h:
                im_rh = ref_size
                im_rw = int(im_w / im_h * ref_size)
            else:
                im_rw = ref_size
                im_rh = int(im_h / im_w * ref_size)
        else:
            im_rh = im_h
            im_rw = im_w
        
        # Round to multiple of 32
        im_rw = im_rw - im_rw % 32
        im_rh = im_rh - im_rh % 32
        
        # Resize
        im = cv2.resize(img_rgb, (im_rw, im_rh), interpolation=cv2.INTER_AREA)
        
        # Normalize to [-1, 1]
        im = im.astype(np.float32)
        im = (im - 127.5) / 127.5
        
        # Convert to tensor
        im = np.transpose(im, (2, 0, 1))
        im = np.expand_dims(im, axis=0)
        im_tensor = torch.from_numpy(im).to(self.device)
        
        # Inference
        with torch.no_grad():
            _, _, matte = self.model(im_tensor, inference=True)
        
        # Convert back
        matte = matte.squeeze().cpu().numpy()
        matte = cv2.resize(matte, (im_w, im_h), interpolation=cv2.INTER_CUBIC)
        matte = np.clip(matte, 0, 1)
        
        return matte

    def _generate_trimap(self, alpha, erosion=10, dilation=20):
        """
        Generate trimap for hair region refinement.
        """
        alpha_u8 = (alpha * 255).astype(np.uint8)
        
        # Definite foreground (high confidence)
        fg_mask = (alpha_u8 > 240).astype(np.uint8) * 255
        
        # Erode to get sure foreground
        kernel_fg = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (erosion, erosion))
        sure_fg = cv2.erode(fg_mask, kernel_fg, iterations=1)
        
        # Dilate to get unknown region
        kernel_unk = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (dilation, dilation))
        unknown_region = cv2.dilate(fg_mask, kernel_unk, iterations=1)
        
        # Build trimap: 0=bg, 128=unknown, 255=fg
        trimap = np.zeros_like(alpha_u8)
        trimap[sure_fg > 0] = 255
        trimap[(unknown_region > 0) & (sure_fg == 0)] = 128
        
        return trimap

    def _closed_form_matting(self, img, trimap, alpha_init):
        """
        Simplified closed-form matting for hair refinement.
        Uses color information to refine alpha in unknown regions.
        """
        img_float = img.astype(np.float64) / 255.0
        alpha = alpha_init.copy()
        
        # Find unknown region
        unknown = (trimap == 128)
        
        if not unknown.any():
            return alpha
        
        # For each unknown pixel, estimate alpha using local color statistics
        # Simple implementation using bilateral filter weighted by color similarity
        
        # Convert to grayscale for processing
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY).astype(np.float64) / 255.0
        
        # Use guided filter approach - use image as guide
        def guided_filter_alpha(guide, src, radius=8, eps=1e-6):
            mean_guide = cv2.boxFilter(guide, cv2.CV_64F, (radius, radius))
            mean_src = cv2.boxFilter(src, cv2.CV_64F, (radius, radius))
            corr_guide = cv2.boxFilter(guide * guide, cv2.CV_64F, (radius, radius))
            corr_guide_src = cv2.boxFilter(guide * src, cv2.CV_64F, (radius, radius))
            
            var_guide = corr_guide - mean_guide * mean_guide
            cov_guide_src = corr_guide_src - mean_guide * mean_src
            
            a = cov_guide_src / (var_guide + eps)
            b = mean_src - a * mean_guide
            
            mean_a = cv2.boxFilter(a, cv2.CV_64F, (radius, radius))
            mean_b = cv2.boxFilter(b, cv2.CV_64F, (radius, radius))
            
            return mean_a * guide + mean_b
        
        # Apply guided filter to refine alpha in unknown regions
        alpha_refined = guided_filter_alpha(gray, alpha, radius=8, eps=1e-6)
        
        # Blend: use refined alpha only in unknown regions
        alpha[unknown] = alpha_refined[unknown]
        
        return np.clip(alpha, 0, 1)

    def _refine_hair_edges(self, img_rgb, alpha):
        """
        Refine hair edges - EXTEND and SOFTEN edges like Remove.bg.

        Problem: MODNet cuts hair sharply at bottom-left and bottom-right.
        Solution: Detect hair color in original image and EXTEND alpha into those regions.
        """
        h, w = alpha.shape[:2]
        alpha_work = alpha.copy().astype(np.float32)

        # Step 1: Analyze ORIGINAL image colors (not just where MODNet found foreground)
        gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY).astype(np.float32) / 255.0

        # Get LAB for better color analysis
        lab = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2LAB).astype(np.float32)
        L = lab[:, :, 0] / 255.0  # Lightness

        # Hair is typically: darker than background, has specific color range
        # Brown/black hair: low L, medium a/b
        # Blonde hair: medium L, yellowish (high b)

        # Detect potential hair pixels by color (independent of alpha!)
        is_dark_hair = L < 0.55
        is_medium = (L >= 0.35) & (L < 0.7)

        # For this image specifically - hair has brownish tones
        # Look at pixels that could be hair based on color alone
        potential_hair = is_dark_hair | is_medium

        # Step 2: Find where MODNet's foreground boundary is
        fg_solid = (alpha_work > 0.7).astype(np.uint8)
        fg_any = (alpha_work > 0.05).astype(np.uint8)

        # Step 3: Create a LARGE search zone around existing foreground
        # This is where we look for cut-off hair
        search_kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (51, 51))
        search_zone = cv2.dilate(fg_any, search_kernel)

        # Step 4: Within search zone, find dark/hair-colored pixels that have low alpha
        # These are the CUT-OFF hair pixels we need to recover
        cut_off_hair = (search_zone > 0) & potential_hair & (alpha_work < 0.3)

        # Step 5: Calculate distance from solid foreground
        dist_from_solid = cv2.distanceTransform((1 - fg_solid).astype(np.uint8), cv2.DIST_L2, 5)

        # Step 6: Create smooth alpha extension based on:
        # - Distance from foreground (closer = higher alpha)
        # - How dark/hair-like the pixel is (darker = higher alpha)

        max_extension = 40  # pixels - generous extension for hair
        dist_norm = np.clip(dist_from_solid / max_extension, 0, 1)

        # Smooth falloff curve
        falloff = np.power(1.0 - dist_norm, 2.0)

        # Base extension alpha
        extension_alpha = 0.7 * falloff * cut_off_hair.astype(np.float32)

        # Modulate by darkness - darker pixels get higher alpha
        darkness_boost = np.clip((0.7 - L) / 0.5, 0, 1)  # max at L=0.2, zero at L=0.7
        extension_alpha = extension_alpha * (0.5 + 0.5 * darkness_boost)

        # Step 7: Also boost existing weak alpha in hair regions
        weak_hair = (alpha_work > 0.02) & (alpha_work < 0.5) & potential_hair
        alpha_work[weak_hair] = np.clip(alpha_work[weak_hair] * 1.5 + 0.15, 0, 1)

        # Step 8: Merge extension with original
        alpha_extended = np.maximum(alpha_work, extension_alpha)

        # Step 9: Smooth with guided filter for natural edges
        alpha_smooth = self._guided_filter(gray, alpha_extended, radius=8, eps=0.01)

        # Step 10: MINIMAL cleanup - only remove true noise far from everything
        very_far = dist_from_solid > 50
        true_noise = (alpha_smooth < 0.01) & very_far & (L > 0.8)  # Only light pixels far away
        alpha_smooth[true_noise] = 0

        # Solidify core
        alpha_smooth[alpha_smooth > 0.95] = 1.0

        return np.clip(alpha_smooth, 0, 1)

    def _soft_contrast(self, alpha, strength=0.3):
        """
        Apply soft S-curve contrast to reduce grey mid-tones while keeping smooth edges.
        Unlike hard thresholding, this preserves natural gradients.
        """
        # S-curve: pushes values towards 0 or 1, but smoothly
        # Formula: 0.5 + (alpha - 0.5) * (1 + strength * (1 - 4 * (alpha - 0.5)^2))
        centered = alpha - 0.5
        factor = 1 + strength * (1 - 4 * centered * centered)
        result = 0.5 + centered * factor
        return np.clip(result, 0, 1)

    def _smart_alpha_cleanup(self, alpha, img_rgb):
        """
        Light cleanup - PRESERVE natural hair edge gradients.
        Only remove true noise, not soft edge transitions.
        """
        alpha_float = alpha.astype(np.float32)

        # Detect where we have gradients (edges) - don't clean these aggressively
        alpha_grad_x = np.abs(cv2.Sobel(alpha_float, cv2.CV_32F, 1, 0, ksize=3))
        alpha_grad_y = np.abs(cv2.Sobel(alpha_float, cv2.CV_32F, 0, 1, ksize=3))
        alpha_gradient = alpha_grad_x + alpha_grad_y

        # Edge region detection
        is_edge = alpha_gradient > 0.005
        is_edge_dilated = cv2.dilate(is_edge.astype(np.uint8),
                                      cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))) > 0

        # Only clean noise in non-edge areas
        noise_mask = (alpha_float < 0.015) & (~is_edge_dilated)
        alpha_float[noise_mask] = 0

        # Solidify high alpha
        alpha_float[alpha_float > 0.99] = 1.0

        return alpha_float

    def _decontaminate_foreground(self, img_rgb, alpha):
        """
        Fix color contamination at edges - Professional quality like Pi7/Remove.bg.

        Key improvements:
        1. Better foreground color propagation using inpainting approach
        2. Smooth color transitions without harsh artifacts
        3. Preserve natural hair color variations
        """
        result = img_rgb.copy().astype(np.float32)
        h, w = img_rgb.shape[:2]

        # Normalize alpha
        alpha_float = alpha.astype(np.float32) if alpha.max() <= 1.0 else alpha.astype(np.float32) / 255.0

        # Define regions with gradual boundaries
        solid_fg = alpha_float > 0.85  # Solid foreground
        edge_region = (alpha_float > 0.03) & (alpha_float <= 0.85)  # Transition zone

        if not edge_region.any() or not solid_fg.any():
            return img_rgb

        # Step 1: Get reference foreground colors from solid region
        # Use weighted sampling based on proximity to edge
        fg_mask_dilated = cv2.dilate(solid_fg.astype(np.uint8),
                                      cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15)))
        near_edge_fg = (fg_mask_dilated > 0) & solid_fg

        # Step 2: Propagate foreground colors using push-pull algorithm
        # This creates smoother color transitions than simple dilation
        propagated_color = result.copy()

        for c in range(3):
            channel = result[:, :, c].copy()

            # Create mask of known (solid foreground) pixels
            known_mask = solid_fg.astype(np.float32)

            # Iterative push from known to unknown
            for iteration in range(30):
                # Smooth the channel values
                channel_smooth = cv2.GaussianBlur(channel, (5, 5), 1.5)
                known_smooth = cv2.GaussianBlur(known_mask, (5, 5), 1.5)

                # Where we have smoothed known values, use them
                new_known = known_smooth > 0.1
                channel = np.where(new_known & ~solid_fg,
                                   channel_smooth / np.maximum(known_smooth, 0.1),
                                   channel)
                known_mask = np.maximum(known_mask, (known_smooth > 0.1).astype(np.float32))

            propagated_color[:, :, c] = channel

        # Step 3: Blend original color with propagated foreground color
        # Use smooth weight based on alpha - lower alpha = more propagated color
        blend_weight = 1.0 - np.power(alpha_float, 0.5)  # sqrt for smoother curve
        blend_weight = np.clip(blend_weight, 0, 0.95)
        blend_weight[~edge_region] = 0  # Only apply to edge region

        # Smooth the blend weight to avoid harsh transitions
        blend_weight = cv2.GaussianBlur(blend_weight.astype(np.float32), (7, 7), 2.0)
        blend_weight_3ch = blend_weight[:, :, np.newaxis]

        result = result * (1 - blend_weight_3ch) + propagated_color * blend_weight_3ch

        # Step 4: Reduce grey contamination in edge pixels
        # Calculate local color variance
        r, g, b = result[:, :, 0], result[:, :, 1], result[:, :, 2]
        brightness = (r + g + b) / 3
        color_variance = (np.abs(r - brightness) + np.abs(g - brightness) + np.abs(b - brightness)) / 3

        # Find grey pixels (low variance) in edge region
        is_grey = (color_variance < 15) & edge_region & (alpha_float < 0.6)

        if is_grey.any() and solid_fg.any():
            # Get median foreground color
            fg_pixels = img_rgb[near_edge_fg].astype(np.float32)
            if len(fg_pixels) > 100:
                avg_fg_color = np.median(fg_pixels, axis=0)

                # Blend grey pixels towards foreground color
                grey_blend = is_grey.astype(np.float32) * (1.0 - alpha_float) * 0.6
                grey_blend = cv2.GaussianBlur(grey_blend, (7, 7), 2.0)

                for c in range(3):
                    result[:, :, c] = result[:, :, c] * (1 - grey_blend) + avg_fg_color[c] * grey_blend

        # Step 5: Very gentle overall smoothing of color in edge region only
        result_smooth = cv2.bilateralFilter(result.astype(np.uint8), d=5, sigmaColor=20, sigmaSpace=20)
        edge_smooth_weight = edge_region.astype(np.float32) * 0.3
        edge_smooth_weight = cv2.GaussianBlur(edge_smooth_weight, (5, 5), 1.5)
        edge_smooth_weight_3ch = edge_smooth_weight[:, :, np.newaxis]

        result = result * (1 - edge_smooth_weight_3ch) + result_smooth.astype(np.float32) * edge_smooth_weight_3ch

        return np.clip(result, 0, 255).astype(np.uint8)

    def _guided_filter(self, guide, src, radius=4, eps=1e-3):
        """
        Apply guided filter for edge-aware smoothing.
        """
        guide = guide.astype(np.float64)
        src = src.astype(np.float64)

        ksize = (2 * radius + 1, 2 * radius + 1)

        mean_guide = cv2.boxFilter(guide, cv2.CV_64F, ksize)
        mean_src = cv2.boxFilter(src, cv2.CV_64F, ksize)
        mean_guide_src = cv2.boxFilter(guide * src, cv2.CV_64F, ksize)
        mean_guide_guide = cv2.boxFilter(guide * guide, cv2.CV_64F, ksize)

        var_guide = mean_guide_guide - mean_guide * mean_guide
        cov_guide_src = mean_guide_src - mean_guide * mean_src

        a = cov_guide_src / (var_guide + eps)
        b = mean_src - a * mean_guide

        mean_a = cv2.boxFilter(a, cv2.CV_64F, ksize)
        mean_b = cv2.boxFilter(b, cv2.CV_64F, ksize)

        return (mean_a * guide + mean_b).astype(np.float32)

    def process(self, input_bytes: bytes) -> np.ndarray:
        """
        Process image with remove.bg quality pipeline.

        Pipeline:
        1. MODNet segmentation (initial alpha)
        2. Trimap generation
        3. Closed-form matting refinement
        4. Hair edge refinement
        5. Smart cleanup
        6. Foreground color decontamination

        Args:
            input_bytes: Raw image bytes

        Returns:
            numpy array (H, W, 4) - RGBA with clean alpha
        """
        if self.model is None:
            raise RuntimeError("MODNet model not initialized")

        print("=" * 60)
        print("[START] Professional Portrait Matting Pipeline")

        # 1. Decode image
        nparr = np.frombuffer(input_bytes, np.uint8)
        img_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img_bgr is None:
            raise ValueError("Failed to decode image")

        img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
        h, w = img_rgb.shape[:2]
        print(f"[IMAGE] Size: {w}x{h}")

        # 2. MODNet segmentation
        print("[STEP 1/6] MODNet segmentation...")
        alpha = self._modnet_inference(img_rgb)
        print(f"[ALPHA] Initial mean: {alpha.mean():.3f}")

        # 3. Generate trimap for refinement
        print("[STEP 2/6] Generating trimap...")
        trimap = self._generate_trimap(alpha, erosion=8, dilation=25)
        unknown_pct = np.sum(trimap == 128) * 100 / (h * w)
        print(f"[TRIMAP] Unknown region: {unknown_pct:.1f}%")

        # 4. Closed-form matting refinement
        print("[STEP 3/6] Closed-form matting refinement...")
        alpha = self._closed_form_matting(img_rgb, trimap, alpha)

        # 5. Hair edge refinement
        print("[STEP 4/6] Hair edge refinement...")
        alpha = self._refine_hair_edges(img_rgb, alpha)

        # 6. Smart cleanup
        print("[STEP 5/6] Smart cleanup...")
        alpha = self._smart_alpha_cleanup(alpha, img_rgb)

        # 7. Foreground color decontamination (removes blue/green edge bleeding)
        print("[STEP 6/6] Foreground decontamination...")
        img_rgb = self._decontaminate_foreground(img_rgb, alpha)

        print(f"[FINAL] Alpha mean: {alpha.mean():.3f}")

        # Convert to uint8
        alpha_u8 = (alpha * 255).astype(np.uint8)

        # Combine RGB and alpha
        rgba = np.dstack((img_rgb, alpha_u8))

        print("[DONE] Professional portrait matting complete!")
        print("=" * 60)

        return rgba

    def process_passport_photo(self, input_bytes: bytes, output_size: tuple = (600, 600)) -> np.ndarray:
        """
        Complete passport photo processing pipeline.

        Pipeline:
        1. AI Matting (remove background)
        2. Edge Refinement + Decontamination
        3. White Background Compositing
        4. Face Detection & Centering
        5. Resize to passport size

        Args:
            input_bytes: Raw image bytes
            output_size: Output dimensions (width, height)

        Returns:
            numpy array (H, W, 3) - RGB image with white background
        """
        print("=" * 60)
        print("[START] Passport Photo Pipeline")

        # Step 1: Get RGBA with clean matting
        rgba = self.process(input_bytes)
        h, w = rgba.shape[:2]

        # Step 2: Composite onto white background with proper alpha blending
        print("[COMPOSITE] Blending onto white background...")
        result = self._composite_on_white(rgba)

        # Step 3: Face detection and centering
        print("[FACE] Detecting and centering face...")
        result = self._center_face_crop(result, output_size)

        # Step 4: Final enhancement
        print("[ENHANCE] Applying final enhancements...")
        result = self._enhance_passport_photo(result)

        print("[DONE] Passport photo complete!")
        print("=" * 60)

        return result

    def _composite_on_white(self, rgba: np.ndarray) -> np.ndarray:
        """
        Professional composite onto white - PRESERVE all hair edge pixels.

        Key: Keep ALL semi-transparent pixels in hair regions.
        Remove.bg style = soft natural fade at hair edges.
        """
        h, w = rgba.shape[:2]

        rgb = rgba[:, :, :3].astype(np.float32)
        alpha = rgba[:, :, 3].astype(np.float32) / 255.0

        # White background
        white_bg = np.full((h, w, 3), 255, dtype=np.float32)

        # Use LAB for better hair detection
        lab = cv2.cvtColor(rgba[:, :, :3], cv2.COLOR_RGB2LAB).astype(np.float32)
        L = lab[:, :, 0] / 255.0

        # Hair = darker pixels (L < 0.7 covers brown/black hair well)
        is_hair_color = L < 0.7

        # Find foreground region
        fg_mask = (alpha > 0.3).astype(np.uint8)
        dilated_fg = cv2.dilate(fg_mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (45, 45)))
        is_near_fg = dilated_fg > 0

        # Hair edge = near foreground AND hair colored AND has ANY alpha
        is_hair_edge = is_near_fg & is_hair_color & (alpha > 0.001)

        # DO NOT modify alpha in hair regions - preserve exactly as refined
        alpha_clean = alpha.copy()

        # Only remove noise that's: very low alpha AND far from foreground AND light colored
        noise_mask = (alpha < 0.003) & (~is_near_fg) & (L > 0.85)
        alpha_clean[noise_mask] = 0

        # Standard alpha compositing - no modifications to RGB
        alpha_3ch = alpha_clean[:, :, np.newaxis]
        result = rgb * alpha_3ch + white_bg * (1 - alpha_3ch)

        return np.clip(result, 0, 255).astype(np.uint8)

    def _center_face_crop(self, img: np.ndarray, output_size: tuple) -> np.ndarray:
        """
        Detect face and create centered crop for passport photo.
        """
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

        # Face detection
        face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        )
        faces = face_cascade.detectMultiScale(gray, 1.1, 6)

        h, w = img.shape[:2]
        output_w, output_h = output_size

        if len(faces) > 0:
            # Get largest face
            x, y, fw, fh = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)[0]

            # Calculate face center
            face_cx = x + fw // 2
            face_cy = y + fh // 2

            # For passport photo: face should be about 70-80% of frame height
            # and centered with more space above than below
            crop_size = int(max(fw, fh) * 2.2)  # Face takes ~45% of crop

            # Shift up slightly (face should be in upper portion)
            y_shift = int(fh * 0.25)

            # Calculate crop bounds
            y1 = max(face_cy - crop_size // 2 - y_shift, 0)
            y2 = min(y1 + crop_size, h)
            x1 = max(face_cx - crop_size // 2, 0)
            x2 = min(x1 + crop_size, w)

            # Adjust if we hit boundaries
            if y2 - y1 < crop_size:
                if y1 == 0:
                    y2 = min(crop_size, h)
                else:
                    y1 = max(y2 - crop_size, 0)

            if x2 - x1 < crop_size:
                if x1 == 0:
                    x2 = min(crop_size, w)
                else:
                    x1 = max(x2 - crop_size, 0)

            cropped = img[y1:y2, x1:x2]
        else:
            # No face detected - center crop
            min_dim = min(h, w)
            y1 = (h - min_dim) // 2
            x1 = (w - min_dim) // 2
            cropped = img[y1:y1+min_dim, x1:x1+min_dim]

        # Resize to output size
        result = cv2.resize(cropped, output_size, interpolation=cv2.INTER_LANCZOS4)

        return result

    def _enhance_passport_photo(self, img: np.ndarray) -> np.ndarray:
        """
        Apply subtle enhancements for passport photo quality.
        """
        # Convert to LAB for better brightness control
        lab = cv2.cvtColor(img, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)

        # Slight brightness boost
        l = cv2.add(l, 5)

        # Merge back
        lab = cv2.merge((l, a, b))
        result = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)

        # Very subtle sharpening
        kernel = np.array([[-0.1, -0.1, -0.1],
                          [-0.1,  1.8, -0.1],
                          [-0.1, -0.1, -0.1]])
        result = cv2.filter2D(result, -1, kernel)

        # Gentle noise reduction
        result = cv2.bilateralFilter(result, d=5, sigmaColor=15, sigmaSpace=15)

        return np.clip(result, 0, 255).astype(np.uint8)

    def process_with_options(self, input_bytes: bytes,
                            hair_refinement: bool = True,
                            soft_edges: bool = True,
                            refinement_strength: str = "medium") -> np.ndarray:
        """
        Process with options.
        """
        return self.process(input_bytes)