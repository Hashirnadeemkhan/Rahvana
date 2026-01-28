# Arachnie API 

This is the backend server (FastAPI + Python) that does all the heavy work for the immigration web app.

### What does it do?

#### 1. Creates Perfect Passport Photos Automatically  
- User uploads any photo/selfie  
- AI removes background in seconds  
- Detects face and crops it exactly like official passport photo rules  
- Resizes to correct 2×2 inch size (600×600 pixels)  
- Improves lighting & smoothness  
- Returns ready-to-print passport photo  

Endpoint: `POST /api/v1/remove-bg`

#### 2. Auto-Fills USCIS I-130 Form (PDF)  
- User fills personal info on the website (name, address, DOB, etc.)  
- This server opens the real USCIS I-130 PDF  
- Automatically fills every field correctly  
- Returns a complete, ready-to-submit filled PDF  

Endpoint: `POST /api/v1/fill-pdf`

#### 3. Visa Bulletin Checker – Tells You When Your Case Becomes Current  
- Checks the latest U.S. Department of State Visa Bulletin  
- Supports Family (F1–F4) and Employment (EB-1 to EB-5) categories  
- Compares your **Priority Date** with the **Final Action Date**  
- Instantly tells you:  
  - **Current** → You can file/submit now!  
  - **Waiting** → How many days/months/years behind you are  
  - Special smart estimate for **F3 Philippines** (based on real historical movement)  

Endpoint: `POST /api/v1/visa-checker/check`

#### 4. Immigrant Visa (IV) Schedule Lookup  
- Shows latest interview scheduling dates from U.S. embassies worldwide  
- Filter by city or visa category  

Endpoint: `GET /api/v1/iv-schedule`

#### 5. Health & Debug Tools (for developers)  
- `/health` → Is the server running?  
- `/debug-fields` → See all fillable fields inside the I-130 PDF  
- `/form-structure` → Know exactly which data keys the frontend must send  

### In Simple Words:
Your website is just a beautiful form.  
This backend is the **brain** that:
- Turns selfies → passport photos  
- Turns form answers → filled government PDFs  
- Turns priority dates → "You're current!" or "Wait 3 more years"

No manual work. No Photoshop. No typing into PDFs.
Everything happens automatically when the user clicks "Submit".

Deploy it anywhere (Render, Railway, AWS, etc.) — it just works.

## Stripe Payment Setup

To fix the "No such price: 'price_...'" error, you need to configure your actual Stripe Price IDs in your environment variables.

### Prerequisites

1. A Stripe account (sign up at [stripe.com](https://stripe.com))
2. Created products and prices in your Stripe dashboard

### Steps to Configure

1. Follow the instructions in [STRIPE_PRICE_SETUP.md](./STRIPE_PRICE_SETUP.md) to get your actual Price IDs
2. Update your `.env.local` file with the correct values:

```bash
STRIPE_PRICE_ID_PLUS=your_actual_plus_price_id
STRIPE_PRICE_ID_PRO=your_actual_pro_price_id
```

3. Restart your application

### Testing

After updating the environment variables:

1. Run your application: `npm run dev`
2. Try the checkout process again
3. Check the browser console and server logs for any remaining errors

For more details about Stripe testing, see [STRIPE_TESTING.md](./STRIPE_TESTING.md).

