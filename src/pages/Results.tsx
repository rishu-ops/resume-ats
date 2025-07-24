import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowLeft,
  Download,
  Share2,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  FileText,
  Star,
} from "lucide-react";

interface AnalysisData {
  id: string;
  fileName: string;
  score: number;
  analysis: {
    keywords: string[];
    strengths: string[];
    improvements: string[];
    sections: {
      [key: string]: {
        score: number;
        feedback: string;
      };
    };
  };
  uploadDate: Date;
}

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchAnalysisData();
  }, [id, currentUser]);

  const fetchAnalysisData = async () => {
    if (!id || !currentUser) return;

    try {
      const docRef = doc(db, "resumeAnalyses", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setAnalysisData({
          id: docSnap.id,
          ...data,
          uploadDate: data.uploadDate.toDate(),
        } as AnalysisData);
      }
    } catch (error) {
      console.error("Error fetching analysis:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getGrade = (score: number) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    return "D";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Analysis Not Found
          </h2>
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-700">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
                {analysisData.fileName}
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Analyzed on {analysisData.uploadDate.toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 mt-2 md:mt-0">
              <button className="flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </button>
              <button className="flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base">
                <Share2 className="h-4 w-4 mr-2" />
                Share Results
              </button>
            </div>
          </div>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="text-center">
            <div
              className={`inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full ${getScoreBackground(
                analysisData.score
              )} mb-4`}
            >
              <span
                className={`text-3xl sm:text-4xl font-bold ${getScoreColor(
                  analysisData.score
                )}`}
              >
                {analysisData.score}%
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
              Grade: {getGrade(analysisData.score)}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              {analysisData.score >= 80
                ? "Excellent! Your resume is well-optimized and ready to impress employers."
                : analysisData.score >= 60
                ? "Good foundation! A few improvements will make your resume even stronger."
                : "There's room for improvement. Follow our recommendations to boost your score."}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex flex-wrap gap-2 sm:gap-0 sm:space-x-8 overflow-x-auto">
              {["overview", "sections", "keywords", "recommendations"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-sm sm:text-base whitespace-nowrap ${
                      activeTab === tab
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                )
              )}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Strengths */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex items-center mb-3 sm:mb-4">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mr-2" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Strengths
                </h3>
              </div>
              <ul className="space-y-2 sm:space-y-3">
                {analysisData.analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">
                      {strength}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex items-center mb-3 sm:mb-4">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 mr-2" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Areas for Improvement
                </h3>
              </div>
              <ul className="space-y-2 sm:space-y-3">
                {analysisData.analysis.improvements.map(
                  (improvement, index) => (
                    <li key={index} className="flex items-start">
                      <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm sm:text-base">
                        {improvement}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "sections" && (
          <div className="grid gap-4 sm:gap-6">
            {Object.entries(analysisData.analysis.sections).map(
              ([section, data]) => (
                <div
                  key={section}
                  className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 capitalize">
                      {section} Section
                    </h3>
                    <div
                      className={`px-2 sm:px-3 py-1 rounded-full ${getScoreBackground(
                        data.score
                      )}`}
                    >
                      <span
                        className={`font-semibold text-sm sm:text-base ${getScoreColor(
                          data.score
                        )}`}
                      >
                        {data.score}%
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base">
                    {data.feedback}
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-3 sm:mt-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          data.score >= 80
                            ? "bg-green-600"
                            : data.score >= 60
                            ? "bg-yellow-600"
                            : "bg-red-600"
                        }`}
                        style={{ width: `${data.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {activeTab === "keywords" && (
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex items-center mb-4 sm:mb-6">
              <Target className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Keywords Found
              </h3>
            </div>

            {analysisData.analysis.keywords.length > 0 ? (
              <div>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                  We found {analysisData.analysis.keywords.length} relevant
                  keywords in your resume:
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysisData.analysis.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-sm sm:text-base">
                No specific keywords were detected. Consider adding relevant
                technical skills and industry terms.
              </p>
            )}
          </div>
        )}

        {activeTab === "recommendations" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex items-center mb-3 sm:mb-4">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mr-2" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Top Recommendations
                </h3>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-1 sm:mb-2 text-sm sm:text-base">
                    1. Optimize for ATS Systems
                  </h4>
                  <p className="text-blue-800 text-xs sm:text-sm">
                    Use standard section headings and avoid complex formatting
                    to ensure your resume passes through Applicant Tracking
                    Systems.
                  </p>
                </div>

                <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-1 sm:mb-2 text-sm sm:text-base">
                    2. Add Quantifiable Achievements
                  </h4>
                  <p className="text-green-800 text-xs sm:text-sm">
                    Include specific numbers, percentages, and metrics to
                    demonstrate the impact of your work.
                  </p>
                </div>

                <div className="p-3 sm:p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-1 sm:mb-2 text-sm sm:text-base">
                    3. Include More Technical Keywords
                  </h4>
                  <p className="text-purple-800 text-xs sm:text-sm">
                    Research job descriptions in your field and incorporate
                    relevant technical terms and skills.
                  </p>
                </div>

                <div className="p-3 sm:p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-1 sm:mb-2 text-sm sm:text-base">
                    4. Improve Resume Structure
                  </h4>
                  <p className="text-orange-800 text-xs sm:text-sm">
                    Ensure your resume has clear sections, consistent
                    formatting, and professional typography.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            to="/upload"
            className="flex items-center justify-center px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <FileText className="h-5 w-5 mr-2" />
            Upload New Version
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center justify-center px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            View All Analyses
          </Link>
        </div>
      </div>
    </div>
  );
}
