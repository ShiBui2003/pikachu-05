"use client";

import { useState } from "react";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Building2,
  X
} from "lucide-react";

interface SimpleAdminActionsProps {
  issue: {
    id: string;
    status: string;
    title: string;
  };
  onAction: (action: string, issueId: string, status: string) => void;
  processing?: boolean;
}

export default function SimpleAdminActions({ 
  issue, 
  onAction, 
  processing = false 
}: SimpleAdminActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action: string) => {
    // Close dropdown immediately for better UX
    setIsOpen(false);
    
    // Call the action with a small delay to ensure dropdown closes
    setTimeout(() => {
      onAction(action, issue.id, issue.status);
    }, 100);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={processing}
        className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
        title={processing ? "Processing..." : "Actions"}
      >
        {processing ? (
          <Clock className="w-4 h-4 animate-spin text-blue-500" />
        ) : (
          <MoreHorizontal className="w-4 h-4" />
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
            <div className="py-1">
              {/* Header */}
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b">
                Quick Actions
              </div>
              
              {/* View & Edit Actions */}
              <button
                onClick={() => handleAction('view')}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
              <button
                onClick={() => handleAction('edit')}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Issue
              </button>
              
              {/* Separator */}
              <div className="border-t border-gray-100 my-1"></div>
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Status Actions
              </div>
              
              {/* Status-based Actions */}
              {issue.status === 'submitted' && (
                <>
                  <button
                    onClick={() => handleAction('accept')}
                    className="flex items-center w-full px-3 py-2 text-sm text-green-600 hover:bg-green-50"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept Issue
                  </button>
                  <button
                    onClick={() => handleAction('reject')}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Reject Issue
                  </button>
                </>
              )}
              
              {(issue.status === 'assigned' || issue.status === 'submitted') && (
                <button
                  onClick={() => handleAction('in_progress')}
                  className="flex items-center w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Start Work
                </button>
              )}
              
              {issue.status === 'in_progress' && (
                <button
                  onClick={() => handleAction('resolve')}
                  className="flex items-center w-full px-3 py-2 text-sm text-green-600 hover:bg-green-50"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Resolved
                </button>
              )}
              
              {(issue.status !== 'closed' && issue.status !== 'resolved') && (
                <>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => handleAction('close')}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Close Issue
                  </button>
                </>
              )}
              
              {/* Management Actions */}
              <div className="border-t border-gray-100 my-1"></div>
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Management
              </div>
              <button
                onClick={() => handleAction('assign')}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Assign Department
              </button>
              <button
                onClick={() => handleAction('priority')}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Change Priority
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}