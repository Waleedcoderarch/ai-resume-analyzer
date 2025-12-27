import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { formatSize } from "~/lib/utils";

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [file, setFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0] || null;
        setFile(selectedFile);

        if (onFileSelect) {
            onFileSelect(selectedFile);
        }
    }, [onFileSelect]);

    // 1. Created a proper remove function
    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevents the uploader from opening when clicking 'X'
        setFile(null);
        if (onFileSelect) {
            onFileSelect(null);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false,
        maxSize: 20 * 1024 * 1024,
    });

    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()} className="p-10 cursor-pointer text-center bg-white/50 rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                <input {...getInputProps()} />

                <div className="space-y-4">
                    {file ? (
                        <div className="flex flex-col items-center gap-2 relative">
                            {/* Ensure these paths match your public folder structure */}
                            <img src="pdf.png" alt="pdf" className="w-10 h-10 object-contain" />

                            <p className="text-lg font-medium text-blue-600">
                                {file.name}
                            </p>

                            <p className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {formatSize(file.size)}
                            </p>

                            {/* 2. Fixed the Button syntax and image closing tag */}
                            <button
                                type="button"
                                className="p-2 cursor-pointer hover:bg-red-50 rounded-full transition-colors mt-2"
                                onClick={handleRemove}
                            >
                                <img src="cross.svg" alt="remove" className="w-4 h-4" />
                            </button>

                            <p className="text-xs text-gray-400 italic">
                                Click box to replace file
                            </p>
                        </div>
                    ) : (
                        <div>
                            <div className="mx-auto w-16 flex items-center justify-center mb-2">
                                <img src="info.svg" alt="upload" className="w-12 h-12" />
                            </div>
                            <p className="text-lg text-gray-500">
                                <span className="font-semibold text-blue-600">
                                    {isDragActive ? "Drop it here!" : "Click to Upload"}
                                </span> or drag and drop
                            </p>
                            <p className="text-sm text-gray-400 mt-2">PDF (max 20 MB)</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileUploader;