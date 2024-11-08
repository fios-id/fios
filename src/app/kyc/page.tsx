"use client";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useLighthouse } from "@/hooks/useLighthouse";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useFiosContract } from "@/hooks/useFiosContract";
import { Upload, X, FileText } from "lucide-react";

interface FileWithPreview {
  file: File;
  preview: string;
}

export default function MyKYC() {
  const { address } = useAccount();
  const { uploadFile, isLoading } = useLighthouse();
  const { submitDocument, userDocuments } = useFiosContract();
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(
    null
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const preview = await readFileAsDataURL(file);
      setSelectedFile({ file, preview });
      setError(null);
    } catch (err) {
      console.error("Error reading file:", err);
      setError("Error reading file. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !selectedFile) return;

    setError(null);
    setUploadProgress(0);

    try {
      const result = await uploadFile(
        selectedFile.file,
        address,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      if (result.success && result.data) {
        await submitDocument(result.data.hash);
        setSelectedFile(null);
      } else {
        throw new Error(result.error || "Failed to upload file");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      setError(err instanceof Error ? err.message : "Failed to upload file");
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          KYC Verification
        </h1>
      </div>

      <div className="grid grid-cols-12 gap-6 h-full">
        {/* Upload Area */}
        <div className="col-span-7 bg-white border rounded-lg flex flex-col">
          {!selectedFile ? (
            <div className="flex-1 flex flex-col">
              <label className="h-full cursor-pointer flex flex-col">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  disabled={isLoading}
                />
                <div className="h-full flex flex-col items-center justify-center p-6">
                  <Upload className="w-16 h-16 mb-4 text-gray-400" />
                  <p className="text-gray-700 mb-2">
                    Drag & drop your document here
                  </p>
                  <p className="text-gray-500 text-sm">or</p>
                  <div className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    Select File
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    Supported formats: PDF, JPG, PNG
                  </p>
                </div>
              </label>
            </div>
          ) : (
            <>
              <div className="relative flex-1">
                <button
                  onClick={() => setSelectedFile(null)}
                  className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                {selectedFile.file.type.includes("image") ? (
                  <div className="relative w-full h-full">
                    {isLoading && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                        <div className="text-center">
                          <LoadingSpinner />
                          <p className="text-gray-700">
                            Uploading... {uploadProgress}%
                          </p>
                        </div>
                      </div>
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedFile.preview}
                      alt="Preview"
                      className="w-full h-full object-contain bg-gray-50"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    {isLoading && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                        <div className="text-center">
                          <LoadingSpinner />
                          <p className="text-gray-700">
                            Uploading... {uploadProgress}%
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                      <FileText className="w-24 h-24 text-gray-400 mb-4" />
                      <p className="text-gray-700 text-lg">
                        {selectedFile.file.name}
                      </p>
                      <p className="text-gray-500 mt-2">
                        {(selectedFile.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 text-red-700 mx-4 mt-4">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="p-4 border-t flex gap-4 mt-auto">
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="flex-1 px-6 py-3 border text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <LoadingSpinner />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    "Submit Document"
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Documents List */}
        <div className="col-span-5 bg-white border rounded-lg p-4 overflow-auto">
          <h2 className="text-lg font-semibold mb-4 sticky top-0 bg-white pb-4 border-b">
            Your Documents
          </h2>

          <div className="space-y-2">
            {userDocuments?.map((doc, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800 mb-1">
                      Document {index + 1}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{doc.cid}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      doc.status === 0
                        ? "bg-yellow-50 text-yellow-700"
                        : doc.status === 1
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {doc.status === 0
                      ? "Pending"
                      : doc.status === 1
                      ? "Approved"
                      : "Rejected"}
                  </span>
                </div>
              </div>
            ))}

            {(!userDocuments || userDocuments.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No documents found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
