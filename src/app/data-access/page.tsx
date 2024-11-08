"use client";
import React from "react";
import { FileKey, Clock } from "lucide-react";

export default function DataAccess() {
  return (
    <div className="h-full">
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">Data Access</h1>

      <div className="bg-white border rounded-lg p-8 max-w-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="bg-blue-50 p-4 rounded-full mb-6">
            <FileKey className="w-8 h-8 text-blue-500" />
          </div>

          <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>

          <p className="text-gray-600 mb-6">
            Track who accessed your KYC data and when. Get complete visibility
            into your data access history.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 w-full">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              Upcoming Features
            </h3>
            <ul className="text-left space-y-3 text-gray-600">
              <li>• Real-time access notifications</li>
              <li>• Detailed access logs with timestamps</li>
              <li>• Access control management</li>
              <li>• Data usage analytics</li>
              <li>• Audit trail exports</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
