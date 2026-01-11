'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  onSuccess: () => void;
}

export default function TranslationUploadModal({ isOpen, onClose, requestId, onSuccess }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (notes) {
        formData.append('adminNotes', notes);
      }
      
      const response = await fetch(`/api/document-translation/${requestId}/upload-translation`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setFile(null);
        setNotes('');
        onClose();
        onSuccess();
        
        toast.success('Translated document uploaded successfully!', {
          position: 'top-right',
          duration: 3000,
        });
      } else {
        console.error('Error uploading translation:', data.error);
        toast.error(`Error uploading translation: ${data.error || 'Unknown error'}`, {
          position: 'top-right',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error uploading translation:', error);
      toast.error('Error uploading translation: Network error', {
        position: 'top-right',
        duration: 3000,
      });
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Translated Document</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Translated PDF File
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              {file ? (
                <div className="text-sm text-gray-900">{file.name}</div>
              ) : (
                <div className="text-gray-600">
                  <span className="text-primary font-medium">Click to upload</span> or drag and drop
                </div>
              )}
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Admin Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about this translation..."
            className="w-full border border-gray-300 rounded-lg p-3 min-h-[80px] focus:ring-2 focus:ring-primary focus:border-transparent"
            maxLength={500}
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={uploading}
            className="px-4 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!file || uploading}
            className="px-4 cursor-pointer"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </div>
    </div>
  );
}