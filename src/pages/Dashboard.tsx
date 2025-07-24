import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";
import {
  Upload,
  FileText,
  TrendingUp,
  Calendar,
  Star,
  Eye,
} from "lucide-react";

interface ResumeAnalysis {
  id: string;
  fileName: string;
  score: number;
  uploadDate: Date;
  status: "analyzing" | "completed" | "failed";
}

export default function Dashboard() {
  const { currentUser, userProfile } = useAuth();
  const [recentAnalyses, setRecentAnalyses] = useState<ResumeAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    averageScore: 0,
    improvementTrend: "+12%",
  });

  useEffect(() => {
    fetchRecentAnalyses();
    // eslint-disable-next-line
  }, [currentUser]);

  const fetchRecentAnalyses = async () => {
    if (!currentUser) return;

    try {
      const q = query(
        collection(db, "resumeAnalyses"),
        where("userId", "==", currentUser.uid),
        orderBy("uploadDate", "desc")
      );

      const querySnapshot = await getDocs(q);
      const analyses: ResumeAnalysis[] = [];

      querySnapshot.forEach((doc) => {
        analyses.push({
          id: doc.id,
          ...doc.data(),
          uploadDate: doc.data().uploadDate.toDate(),
        } as ResumeAnalysis);
      });

      setRecentAnalyses(analyses.slice(0, 5));

      // Calculate stats
      const totalAnalyses = analyses.length;
      const completedAnalyses = analyses.filter(
        (a) => a.status === "completed"
      );
      const averageScore =
        completedAnalyses.length > 0
          ? Math.round(
              completedAnalyses.reduce((sum, a) => sum + a.score, 0) /
                completedAnalyses.length
            )
          : 0;

      setStats({
        totalAnalyses,
        averageScore,
        improvementTrend: "+12%",
      });
    } catch (error) {
      console.error("Error fetching analyses:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Completed
          </span>
        );
      case "analyzing":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full animate-pulse">
            Analyzing
          </span>
        );
      case "failed":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-100 to-fuchsia-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-100 to-fuchsia-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome back, {userProfile?.name || "User"}!
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mt-2">
            Track your resume improvements and analyze new versions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Analyses
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {stats.totalAnalyses}
                </p>
              </div>
              <div className="p-3 bg-sky-100 rounded-lg">
                <FileText className="h-6 w-6 text-sky-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Score
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {stats.averageScore}%
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Star className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Improvement</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {stats.improvementTrend}
                </p>
              </div>
              <div className="p-3 bg-fuchsia-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-fuchsia-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Analyses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Recent Analyses
                </h2>
              </div>
              <div className="p-6">
                {recentAnalyses.length > 0 ? (
                  <div className="space-y-4">
                    {recentAnalyses.map((analysis) => (
                      <div
                        key={analysis.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-sky-100 rounded-lg">
                            <FileText className="h-5 w-5 text-sky-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-base sm:text-lg">
                              {analysis.fileName}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <p className="text-sm text-gray-500">
                                {analysis.uploadDate.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 mt-3 sm:mt-0">
                          {analysis.status === "completed" && (
                            <div
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                                analysis.score
                              )}`}
                            >
                              {analysis.score}%
                            </div>
                          )}
                          {getStatusBadge(analysis.status)}
                          {analysis.status === "completed" && (
                            <Link
                              to={`/results/${analysis.id}`}
                              className="p-2 text-gray-400 hover:text-sky-500 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No analyses yet</p>
                    <Link
                      to="/upload"
                      className="inline-flex items-center px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-fuchsia-500 transition-colors"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Your First Resume
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/upload"
                  className="flex items-center p-3 bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100 transition-colors"
                >
                  <Upload className="h-5 w-5 mr-3" />
                  Upload New Resume
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg
                    className="h-5 w-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-r from-fuchsia-500 to-sky-500 rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">💡 Pro Tip</h3>
              <p className="text-base opacity-90">
                Upload multiple versions of your resume to track improvements
                and find the best performing format.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Custom keyframes for animated gradient and glow */}
      <style>
        {`
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 6s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}
