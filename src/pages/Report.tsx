import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Mail, 
  Calendar,
  MapPin,
  User,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useInspection } from '../context/InspectionContext';

interface InspectionReport {
  id: string;
  propertyAddress: string;
  tenantName: string;
  inspectionType: 'move_in' | 'move_out';
  inspectionDate: string;
  inspectorName: string;
  totalIssues: number;
  summary: string;
  rooms: Array<{
    name: string;
    images: number;
    issues: Array<{
      type: string;
      severity: string;
      description: string;
    }>;
  }>;
}

const Report: React.FC = () => {
  const { photos, selectedFrames } = useInspection();
  const totalImages = photos.length + selectedFrames.length;
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  // Mock report data
  const mockReport: InspectionReport = {
    id: 'INSP-2025-001',
    propertyAddress: '123 Sunset Apartments, Unit 302, Los Angeles, CA 90210',
    tenantName: 'Sarah Johnson',
    inspectionType: 'move_out',
    inspectionDate: new Date().toISOString(),
    inspectorName: 'PropertyAI System',
    totalIssues: 3,
    summary: 'Property inspection completed using video capture and AI frame extraction. Minor issues identified through automated analysis. Overall condition is acceptable with standard wear and tear.',
    rooms: [
      {
        name: 'Living Room',
        images: 3,
        issues: [
          {
            type: 'Wall Damage',
            severity: 'medium',
            description: 'Small hole in drywall near entrance'
          }
        ]
      },
      {
        name: 'Kitchen',
        images: 4,
        issues: [
          {
            type: 'Stain',
            severity: 'low',
            description: 'Water stain on ceiling above sink'
          }
        ]
      },
      {
        name: 'Bedroom',
        images: 2,
        issues: [
          {
            type: 'Scratch',
            severity: 'low',
            description: 'Scratch on hardwood floor near window'
          }
        ]
      }
    ]
  };

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
    }, 3000);
  };

  const downloadPDF = () => {
    // In a real implementation, this would generate and download an actual PDF
    alert('PDF download would be implemented here using a library like jsPDF or backend service');
  };

  const sendReport = () => {
    alert('Email sending functionality would be implemented here');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (totalImages === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Data for Report Generation
          </h3>
          <p className="text-gray-600 mb-4">
            Complete the inspection process by recording videos or capturing photos and reviewing detections first.
          </p>
          <button
            onClick={() => window.location.href = '/capture'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Start New Inspection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Inspection Report
        </h1>
        <p className="mt-2 text-gray-600">
          Generate comprehensive property condition reports with AI-detected issues from video analysis
        </p>
      </div>

      {!reportGenerated ? (
        /* Report Generation */
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <div className="mb-6">
              <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Ready to Generate Report
              </h2>
              <p className="text-gray-600">
                Based on {totalImages} analyzed images ({photos.length} photos, {selectedFrames.length} video frames) across multiple rooms
              </p>
            </div>

            {isGenerating ? (
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900">
                    Generating Report...
                  </p>
                  <p className="text-sm text-gray-600">
                    Processing images, analyzing detections, and formatting report
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={generateReport}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium text-lg"
              >
                Generate Inspection Report
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Generated Report Display */
        <>
          {/* Report Actions */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Report Generated Successfully
                </h2>
                <p className="text-sm text-gray-600">
                  Report ID: {mockReport.id}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                <button
                  onClick={downloadPDF}
                  className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={sendReport}
                  className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  <Mail className="h-4 w-4" />
                  <span>Send Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* Report Content */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Report Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Property Inspection Report
                </h1>
                <div className="text-right text-sm text-gray-600">
                  <p>Report ID: {mockReport.id}</p>
                  <p>Generated: {new Date().toLocaleString()}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Property Address</p>
                      <p className="text-sm text-gray-600">{mockReport.propertyAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Tenant</p>
                      <p className="text-sm text-gray-600">{mockReport.tenantName}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Eye className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Inspection Type</p>
                      <p className="text-sm text-gray-600">
                        {mockReport.inspectionType === 'move_in' ? 'Move-In' : 'Move-Out'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Inspection Date</p>
                      <p className="text-sm text-gray-600">
                        {new Date(mockReport.inspectionDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Executive Summary
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{totalImages}</div>
                  <div className="text-sm text-gray-600">Images Analyzed</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{mockReport.totalIssues}</div>
                  <div className="text-sm text-gray-600">Issues Detected</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">98%</div>
                  <div className="text-sm text-gray-600">AI Confidence</div>
                </div>
              </div>
              
              <p className="text-gray-700">{mockReport.summary}</p>
            </div>

            {/* Room-by-Room Breakdown */}
            <div className="px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Room-by-Room Analysis
              </h2>
              
              <div className="space-y-6">
                {mockReport.rooms.map((room, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {room.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{room.images} images</span>
                          <span>{room.issues.length} issues</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      {room.issues.length > 0 ? (
                        <div className="space-y-3">
                          {room.issues.map((issue, issueIndex) => (
                            <div key={issueIndex} className="flex items-start space-x-3">
                              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-gray-900">
                                    {issue.type}
                                  </span>
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(issue.severity)}`}>
                                    {issue.severity.toUpperCase()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {issue.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                          <span className="text-sm font-medium">
                            No issues detected in this room
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Report Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-gray-900">
                  Generated by PropertyAI Video Analysis System
                </p>
                <p className="text-xs text-gray-600">
                  This report was generated using AI-powered video analysis and frame extraction technology.
                  All detections have been reviewed and confirmed by qualified personnel.
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <span>Confidence Score: 98%</span>
                  <span>•</span>
                  <span>Processing Time: 2.3 seconds</span>
                  <span>•</span>
                  <span>Video AI Model: v2.1</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Report;