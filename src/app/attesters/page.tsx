"use client";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useFiosContract } from "@/hooks/useFiosContract";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FileText } from "lucide-react";

interface PendingDocument {
  address: `0x${string}`;
  index: bigint;
  cid: string;
}

export default function Attesters() {
  const { address } = useAccount();
  const {
    becomeAttester,
    isAttester,
    pendingDocuments,
    approveDocument,
    rejectDocument,
  } = useFiosContract();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<PendingDocument | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  const handleBecomeAttester = async () => {
    if (!address) return;
    setIsProcessing(true);
    setError(null);
    try {
      await becomeAttester();
    } catch (err) {
      console.error("Error becoming attester:", err);
      setError(
        err instanceof Error ? err.message : "Failed to become attester"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = async (doc: PendingDocument) => {
    if (!selectedDoc) return;
    setIsProcessing(true);
    setError(null);
    setRejectionReason(null);
    try {
      await approveDocument(doc.address, doc.index);
      setSelectedDoc(null);
    } catch (err) {
      console.error("Error approving document:", err);
      setError(
        err instanceof Error ? err.message : "Failed to approve document"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (doc: PendingDocument) => {
    if (!selectedDoc || !rejectionReason) return;
    setIsProcessing(true);
    setError(null);
    try {
      await rejectDocument(doc.address, doc.index, "No reason provided");
      setSelectedDoc(null);
      setRejectionReason(null);
    } catch (err) {
      console.error("Error rejecting document:", err);
      setError(
        err instanceof Error ? err.message : "Failed to reject document"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)]">
      <div className="flex space-x-2 items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Attestation</h1>
        {isAttester && (
          <div className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
            Active Attestor
          </div>
        )}
      </div>

      {!isAttester ? (
        <div className="bg-white border rounded-lg p-8 max-w-2xl">
          <h2 className="text-xl font-semibold mb-6">Become an Attestor</h2>
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800">
                Stake 0.001 BNB to become an attestor and start verifying
                documents
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Requirements:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Stake 0.001 BNB</li>
                <li>Review and verify submitted documents</li>
                <li>Provide clear feedback for rejections</li>
                <li>Maintain professional conduct</li>
              </ul>
            </div>
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            <button
              onClick={handleBecomeAttester}
              disabled={isProcessing}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <LoadingSpinner />
                  <span>Processing...</span>
                </>
              ) : (
                "Become Attestor (0.001 BNB)"
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-6 h-full">
          {/* Documents List */}
          <div className="col-span-5 bg-white border rounded-lg p-4 overflow-auto">
            <h2 className="text-lg font-semibold mb-4 sticky top-0 bg-white pb-4 border-b">
              Pending Documents
            </h2>

            <div className="space-y-2">
              {pendingDocuments?.map((doc, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedDoc?.cid === doc.cid
                      ? "border-blue-500 bg-blue-50"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedDoc(doc)}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div className="overflow-hidden">
                      <p className="font-medium truncate">
                        Document {index + 1}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        From: {doc.address}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview and Actions */}
          <div className="col-span-7 bg-white border rounded-lg p-6 flex flex-col">
            {selectedDoc ? (
              <>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-4">
                    Document Preview
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">
                        Document CID
                      </p>
                      <p className="mt-1 font-mono text-sm break-all">
                        {selectedDoc.cid}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">
                        Submitted By
                      </p>
                      <p className="mt-1 font-mono text-sm">
                        {selectedDoc.address}
                      </p>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
                      {error}
                    </div>
                  )}
                </div>

                <div className="border-t pt-6 mt-6">
                  {!isProcessing ? (
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleApprove(selectedDoc)}
                          className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setRejectionReason("")}
                          className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                      {rejectionReason !== null && (
                        <div className="space-y-4">
                          <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter reason for rejection..."
                            className="w-full border rounded-lg p-2"
                            rows={3}
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setRejectionReason("")}
                              className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleReject(selectedDoc)}
                              disabled={!rejectionReason}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-400"
                            >
                              Confirm Rejection
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <LoadingSpinner />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <FileText className="w-12 h-12 mb-4" />
                <p>Select a document to preview</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
