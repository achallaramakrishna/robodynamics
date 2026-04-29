"use client";

import { useState, useEffect } from "react";
import { TrendingUp, AlertCircle, Award, Target, BarChart3, Download } from "lucide-react";
import { ParentProgressReport, parentAssessmentService } from "@/lib/parentAssessmentService";

interface ParentDashboardProps {
  studentName: string;
  onExportPDF?: (report: ParentProgressReport) => void;
}

/**
 * ParentDashboard Component
 * Displays child's learning progress, struggles, strengths, and recommendations
 * Integrates with parentAssessmentService for real-time metrics
 */
export default function ParentDashboard({
  studentName,
  onExportPDF,
}: ParentDashboardProps) {
  const [report, setReport] = useState<ParentProgressReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Generate report on mount
  useEffect(() => {
    const generateReport = () => {
      try {
        const generatedReport = parentAssessmentService.generateParentReport(studentName);
        setReport(generatedReport);
      } catch (error) {
        console.error("Error generating report:", error);
      } finally {
        setIsLoading(false);
      }
    };

    generateReport();
  }, [studentName]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center text-gray-600 py-12">
        <p>No learning data available yet. Start lessons to see progress.</p>
      </div>
    );
  }

  const masterCount = report.masteriesAchieved.length;
  const struggleCount = report.needsSupport.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">{studentName}'s Learning Dashboard</h1>
            <p className="text-blue-100 mt-1">Generated {report.reportDate.toLocaleDateString()}</p>
          </div>
          {onExportPDF && (
            <button
              onClick={() => onExportPDF(report)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          )}
        </div>

        {/* Overall Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100">Overall Progress</span>
            <span className="text-2xl font-bold">{Math.round(report.overallProgress)}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-500"
              style={{ width: `${report.overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mastered Letters Card */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-800">Mastered Letters</h3>
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">{masterCount}</div>
          <p className="text-sm text-gray-600 mb-4">
            {masterCount > 0 ? `${masterCount} letters at 80%+ accuracy` : "None yet - keep practicing!"}
          </p>
          <div className="flex flex-wrap gap-2">
            {report.masteriesAchieved.slice(0, 8).map((letter) => (
              <span
                key={letter}
                className="px-3 py-1 bg-green-200 text-green-900 rounded-full text-sm font-medium"
              >
                {letter.split(" ")[0]}
              </span>
            ))}
            {masterCount > 8 && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                +{masterCount - 8} more
              </span>
            )}
          </div>
        </div>

        {/* Needs Support Card */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-gray-800">Needs Support</h3>
          </div>
          <div className="text-3xl font-bold text-orange-600 mb-2">{struggleCount}</div>
          <p className="text-sm text-gray-600 mb-4">
            {struggleCount > 0 ? `${struggleCount} letters below 60% accuracy` : "Great! No struggling letters."}
          </p>
          <div className="space-y-2">
            {report.needsSupport.slice(0, 3).map((item) => (
              <div key={item} className="text-sm text-orange-900 bg-orange-100 px-3 py-2 rounded">
                {item}
              </div>
            ))}
            {struggleCount > 3 && (
              <p className="text-xs text-orange-700 pt-2">+{struggleCount - 3} more needing attention</p>
            )}
          </div>
        </div>

        {/* Milestones Card */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-800">Next Milestones</h3>
          </div>
          <div className="space-y-3">
            {report.nextMilestones.map((milestone, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-1">✓</span>
                <span className="text-sm text-gray-700">{milestone}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths Section */}
      {report.strengths.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Strengths</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {report.strengths.map((strength, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-blue-600 font-bold text-lg">💪</span>
                <span className="text-gray-800">{strength}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Challenges Section */}
      {report.challenges.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-800">Current Challenges</h3>
          </div>
          <div className="space-y-3">
            {report.challenges.map((challenge, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                <span className="text-orange-600 font-bold">⚠️</span>
                <span className="text-gray-800">{challenge}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Recommendations */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">This Week's Recommendations</h3>
        <div className="space-y-2">
          {report.weeklyRecommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-blue-600 text-lg">📌</span>
              <span className="text-gray-800">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tips for Parents */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">💡 Tips for Supporting Learning</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✓ Keep practice sessions short (10-15 minutes) for better focus</li>
          <li>✓ Use the mouth position guides during practice at home</li>
          <li>✓ Celebrate small wins - mastering letters is a big achievement!</li>
          <li>✓ Practice struggling letters in a fun, game-like manner</li>
          <li>✓ Record your child pronouncing letters and listen together</li>
          <li>✓ Use real Hindi words they know to reinforce letter sounds</li>
        </ul>
      </div>
    </div>
  );
}
