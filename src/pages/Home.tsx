import React from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Upload,
  BarChart3,
  Shield,
  Users,
  Zap,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Upload className="h-8 w-8 text-sky-500" />,
      title: "Easy Upload",
      description: "Simply upload your resume in PDF, DOC, or DOCX format",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-cyan-500" />,
      title: "Detailed Analysis",
      description:
        "Get comprehensive feedback on format, content, and keywords",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-fuchsia-500" />,
      title: "ATS Optimization",
      description: "Ensure your resume passes Applicant Tracking Systems",
    },
    {
      icon: <Shield className="h-8 w-8 text-emerald-500" />,
      title: "Secure & Private",
      description: "Your data is encrypted and never shared with third parties",
    },
    {
      icon: <Users className="h-8 w-8 text-orange-400" />,
      title: "Expert Insights",
      description: "Recommendations based on industry best practices",
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      title: "Instant Results",
      description: "Get your analysis report in seconds, not days",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-100 to-fuchsia-100 relative overflow-x-hidden">
      {/* Animated Gradient Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute w-[120vw] h-[60vw] left-1/2 top-0 -translate-x-1/2 bg-gradient-to-tr from-sky-300 via-fuchsia-200 to-indigo-300 opacity-40 rounded-full blur-3xl animate-pulse"></div>
      </div>
      {/* Hero Section */}
      <section className="relative py-10 sm:py-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight drop-shadow-lg">
            Perfect Your Resume with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-fuchsia-500 to-indigo-600 animate-gradient-x block text-3xl sm:text-5xl">
              AI-Powered Analysis
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Get instant feedback on your resume's format, content, and ATS
            compatibility.
            <br className="hidden sm:block" />
            Stand out from the competition with professional insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/register"
              className="relative bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold shadow-xl hover:from-fuchsia-500 hover:to-sky-500 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-400
                before:absolute before:inset-0 before:rounded-xl before:animate-glow before:bg-gradient-to-r before:from-fuchsia-400 before:via-sky-400 before:to-indigo-400 before:opacity-0 hover:before:opacity-30"
              style={{ overflow: "hidden" }}
            >
              <span className="relative z-10">Get Started Free</span>
            </Link>
            <Link
              to="/login"
              className="border-2 border-sky-500 text-sky-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold bg-white/80 hover:bg-sky-50 hover:text-fuchsia-600 hover:border-fuchsia-500 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-md z-10 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 sm:mb-4">
              Why Choose{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-fuchsia-500">
                ResumeCheck?
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Our advanced AI technology analyzes your resume from every angle
              to help you land your dream job.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-white via-sky-50 to-fuchsia-50 p-5 sm:p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 flex flex-col items-center text-center
                  hover:bg-gradient-to-tr hover:from-fuchsia-50 hover:to-sky-50 hover:border-fuchsia-200"
                style={{
                  transitionProperty: "box-shadow, transform, background",
                }}
              >
                <div className="mb-3 sm:mb-4 flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-fuchsia-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2 group-hover:text-fuchsia-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-base sm:text-lg text-gray-600 group-hover:text-sky-600 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-sky-500 via-fuchsia-500 to-indigo-600 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4 sm:mb-6 drop-shadow-lg">
            Ready to Boost Your Career?
          </h2>
          <p className="text-base sm:text-xl text-white/80 mb-6 sm:mb-8">
            Join thousands of professionals who have improved their resumes with
            ResumeCheck.
          </p>
          <Link
            to="/register"
            className="relative inline-block bg-white text-fuchsia-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold shadow-xl hover:bg-fuchsia-50 hover:text-sky-600 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white
              before:absolute before:inset-0 before:rounded-xl before:animate-glow before:bg-gradient-to-r before:from-fuchsia-400 before:via-sky-400 before:to-indigo-400 before:opacity-0 hover:before:opacity-30"
            style={{ overflow: "hidden" }}
          >
            <span className="relative z-10">Start Your Free Analysis</span>
          </Link>
        </div>
      </section>
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
          @keyframes glow {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.5; }
          }
          .animate-glow {
            animation: glow 2s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}
