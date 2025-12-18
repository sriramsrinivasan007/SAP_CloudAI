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
    <div className="w-full">
      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
        Tender / Legal Document
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          border-2 border-dashed rounded-2xl p-8 text-center transition-all
          flex flex-col items-center justify-center min-h-[140px]
          ${disabled ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-60' : 'bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-white cursor-pointer group'}
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
          <div className="bg-indigo-50 p-3 rounded-xl inline-flex mb-3 group-hover:scale-110 transition-transform">
             <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
             </svg>
          </div>
          <p className="text-slate-800 font-bold">
            Drop your PDF or <span className="text-indigo-600">select file</span>
          </p>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">PDF max 20MB</p>
        </label>
      </div>
    </div>
  );
};