import { useState } from "react";
import { useFiosContract } from "@/hooks/useFiosContract";
import LoadingSpinner from "./LoadingSpinner";

interface PendingDocument {
  address: `0x${string}`;
  index: bigint;
  cid: string;
}

export function PendingDocuments() {
  const { pendingDocuments, approveDocument, rejectDocument } =
    useFiosContract();
  const [status, setStatus] = useState<"approving" | "rejecting" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async (doc: PendingDocument) => {
    setStatus("approving");
    setError(null);
    try {
      await approveDocument(doc.address, doc.index);
    } catch (err) {
      console.error("Error approving document:", err);
      setError(
        err instanceof Error ? err.message : "Failed to approve document"
      );
    } finally {
      setStatus(null);
    }
  };

  const handleReject = async (doc: PendingDocument) => {
    setStatus("rejecting");
    setError(null);
    try {
      await rejectDocument(doc.address, doc.index, "No reason provided");
    } catch (err) {
      console.error("Error rejecting document:", err);
      setError(
        err instanceof Error ? err.message : "Failed to reject document"
      );
    } finally {
      setStatus(null);
    }
  };

  if (!pendingDocuments) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading pending documents...
      </div>
    );
  }

  if (pendingDocuments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No pending documents to review
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
      )}

      {pendingDocuments.map((doc, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="flex flex-col space-y-2">
            <p className="text-sm text-gray-600">
              From: <span className="font-mono">{doc.address}</span>
            </p>
            <p className="text-sm text-gray-600 break-all">CID: {doc.cid}</p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleApprove(doc)}
                disabled={status !== null}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
              >
                {status === "approving" ? <LoadingSpinner /> : "Approve"}
              </button>
              <button
                onClick={() => handleReject(doc)}
                disabled={status !== null}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-400"
              >
                {status === "rejecting" ? <LoadingSpinner /> : "Reject"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
