"use client";
import React, { useState } from "react";
import { isAddress } from "viem";
import { FileText } from "lucide-react";
import { useUserDocuments } from "@/hooks/useFiosContract";
import LoadingSpinner from "@/components/LoadingSpinner";

const Documents = ({ address }: { address: `0x${string}` }) => {
  const { documents, isLoading } = useUserDocuments(address);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {documents && documents.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Documents Found
          </h2>
          {documents.map((doc, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg bg-gray-50 flex items-start justify-between"
            >
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium text-gray-800">
                    Document {index + 1}
                  </p>
                  <p className="text-sm text-gray-500 font-mono mt-1">
                    {doc.cid}
                  </p>
                </div>
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
          ))}
        </div>
      )}
      {documents && documents.length === 0 && (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No documents found for this address</p>
        </div>
      )}
    </>
  );
};

export default function Lookup() {
  const [searchAddress, setSearchAddress] = useState("");
  const [showResults, setShowResults] = useState(false);

  return (
    <div className="h-[calc(100vh-12rem)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Document Lookup
        </h1>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-4 mb-8">
            <div className="flex-1">
              <input
                type="text"
                value={searchAddress}
                onChange={(e) => {
                  setSearchAddress(e.target.value);
                  if (isAddress(e.target.value)) {
                    setShowResults(true);
                  } else {
                    setShowResults(false);
                  }
                }}
                placeholder="Enter Ethereum address"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {showResults && (
            <Documents address={searchAddress as `0x${string}`} />
          )}
        </div>
      </div>
    </div>
  );
}
