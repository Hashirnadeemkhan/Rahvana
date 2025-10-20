'use client';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      console.log('File selected:', selectedFile.name, selectedFile.size);
      setFile(selectedFile);
      setError('');
      setSuccess('');
    }
  };

  const handleCompress = async () => {
    if (!file) {
      setError('Pehle PDF file select karo!');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('File 50MB se bara nahi ho sakti!');
      return;
    }

    if (file.type !== 'application/pdf') {
      setError('Sirf PDF files allowed!');
      return;
    }

    console.log('Starting compression...');
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await fetch('/api/compress', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('SERVER ERROR:', errorText);
        throw new Error(errorText || `Error: ${res.status}`);
      }

      const blob = await res.blob();
      console.log('Blob received:', blob.size);

      // AUTO DOWNLOAD
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed-${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setSuccess('✅ File compressed aur download ho gayi!');
      setFile(null);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Compression fail ho gaya!';
      console.error('Error:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          📄 PDF Compressor
        </h1>

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={loading}
          className="w-full p-4 border-2 border-dashed rounded-lg mb-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
        />

        {file && (
          <div className="bg-gray-50 p-3 rounded mb-4">
            <p className="text-sm font-medium">📁 {file.name}</p>
            <p className="text-xs text-gray-600">
              Size: {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        <button
          onClick={handleCompress}
          disabled={loading || !file}
          className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          {loading ? '🔄 Compressing...' : '✨ Compress & Download'}
        </button>

        {error && (
          <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
        )}

        {success && (
          <p className="text-green-500 text-sm mt-3 text-center">{success}</p>
        )}

        <p className="text-xs text-gray-500 text-center mt-4">
          Max 50MB | Free Forever
        </p>
      </div>
    </div>
  );
}
