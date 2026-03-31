import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { formatSize } from "~/lib/utils";

interface FileUploaderProps {
    onFileSelect: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [file, setFile] = useState<File | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const selectedFile = acceptedFiles[0] || null;

            setFile(selectedFile);
            onFileSelect(selectedFile);
        },
        [onFileSelect]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: { "application/pdf": [".pdf"] },
        maxSize: 20 * 1024 * 1024,
    });

    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()} className="p-6 text-center">
                <input {...getInputProps()} />

                <div className="space-y-4 cursor-pointer">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center">
                        <img src="/icons/info.svg" alt="upload" className="size-20" />
                    </div>

                    {file ? (
                        <div className="flex items-center space-x-3">
                            <img src="/images/pdf.png" alt="pdf" className="size-10"/>
                            <p className="text-green-600 font-semibold">{file.name}</p>
                            <p className="text-sm text-gray-500">
                                File selected ({formatSize(file.size)})
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-lg text-gray-500">
                                <span className="font-semibold">Click here to upload resume</span>{" "}
                                or drag & drop
                            </p>
                            <p className="text-sm text-gray-400">PDF (Max 20MB)</p>
                        </div>
                    )}

                    {isDragActive && (
                        <p className="text-blue-500">Drop your file here...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileUploader;
