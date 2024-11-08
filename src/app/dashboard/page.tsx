"use client";

import { StatsBox } from "@/components/StatsBox";
import { Users, FileCheck, ShieldCheck, FileText } from "lucide-react";
import { useFiosContract } from "@/hooks/useFiosContract";

export default function Dashboard() {
  const { statistics, userDocuments } = useFiosContract();

  const stats = [
    {
      title: "Total Documents",
      value: statistics.totalDocuments.toString(),
      description: "Documents submitted for verification",
      icon: <FileCheck className="w-6 h-6" />,
      variant: "blue",
    },
    {
      title: "Verified Documents",
      value: statistics.totalApproved.toString(),
      description: "Successfully verified documents",
      icon: <ShieldCheck className="w-6 h-6" />,
      variant: "green",
    },
    {
      title: "Active Attesters",
      value: statistics.totalAttesters.toString(),
      description: "Registered document verifiers",
      icon: <Users className="w-6 h-6" />,
      variant: "yellow",
    },
  ] as const;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, index) => (
          <StatsBox
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            variant={stat.variant}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {userDocuments?.slice(0, 5).map((doc, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div
                  className={`p-2 rounded-full 
                  ${
                    doc.status === 0
                      ? "bg-yellow-100"
                      : doc.status === 1
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  <FileText
                    className={`w-5 h-5 
                    ${
                      doc.status === 0
                        ? "text-yellow-600"
                        : doc.status === 1
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    Document {index + 1}
                  </p>
                  <p className="text-sm text-gray-500 font-mono mt-1 truncate max-w-xs">
                    {doc.cid}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full mt-2
                    ${
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
                No recent activity
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <a
              href="/kyc"
              className="block p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Submit Document</h3>
                  <p className="text-sm text-gray-500">
                    Upload a new document for verification
                  </p>
                </div>
              </div>
            </a>
            <a
              href="/lookup"
              className="block p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Document Lookup</h3>
                  <p className="text-sm text-gray-500">
                    Search for verified documents
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
