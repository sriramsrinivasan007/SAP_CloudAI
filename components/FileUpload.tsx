import React, { useCallback } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;
      
      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].type === 'application/pdf') {
        onFileSelect(files[0]);
      } else {
        alert('Please upload a valid PDF file.');
      }
    },
    [onFileSelect, disabled]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full mb-8">
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Upload Legal Document (PDF)
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-colors
          flex flex-col items-center justify-center min-h-[160px]
          ${disabled ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-60' : 'bg-white border-slate-300 hover:border-indigo-500 hover:bg-slate-50 cursor-pointer'}
        `}
      >
        <input
          type="file"
          accept="application/pdf"
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className={disabled ? 'pointer-events-none' : 'cursor-pointer'}>
          <div className="bg-indigo-100 p-3 rounded-full inline-flex mb-3">
             <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
             </svg>
          </div>
          <p className="text-slate-700 font-medium">
            Drag & drop your PDF here, or <span className="text-indigo-600 underline">browse</span>
          </p>
          <p className="text-slate-400 text-xs mt-1">PDF format up to 20MB</p>
        </label>
      </div>
    </div>
  );
};