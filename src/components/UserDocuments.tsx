import { UserDocument, AttestationStatus } from "@/hooks/useFiosContract";

function getStatusBadge(status: AttestationStatus) {
  switch (status) {
    case AttestationStatus.Pending:
      return (
        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
          Pending
        </span>
      );
    case AttestationStatus.Approved:
      return (
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
          Approved
        </span>
      );
    case AttestationStatus.Rejected:
      return (
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
          Rejected
        </span>
      );
  }
}

interface UserDocumentsProps {
  documents: UserDocument[];
}

export function UserDocuments({ documents }: UserDocumentsProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No documents found</div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium mb-1">Document {index + 1}</p>
              <p className="text-sm text-gray-600 break-all">{doc.cid}</p>
            </div>
            {getStatusBadge(doc.status)}
          </div>

          <div className="mt-4 text-sm">
            {doc.status === AttestationStatus.Rejected &&
              doc.rejectionReason && (
                <p className="text-red-600 mt-2">
                  Reason: {doc.rejectionReason}
                </p>
              )}
          </div>
        </div>
      ))}
    </div>
  );
}
