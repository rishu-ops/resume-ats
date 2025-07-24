import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../config/firebase";
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";

export default function UploadResume() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const validateFile = (file: File) => {
    if (!allowedTypes.includes(file.type)) {
      return "Please upload a PDF, DOC, or DOCX file";
    }
    if (file.size > maxFileSize) {
      return "File size must be less than 10MB";
    }
    return null;
  };

  const handleFileSelect = (selectedFile: File) => {
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setFile(selectedFile);
    setError("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const analyzeResume = (fileContent: string, fileName: string) => {
    // Mock analysis - in a real app, this would call an AI service
    const keywords = [
      "javascript",
      "react",
      "node.js",
      "python",
      "sql",
      "aws",
      "docker",
      "git",
    ];
    const content = fileContent.toLowerCase();

    const foundKeywords = keywords.filter((keyword) =>
      content.includes(keyword)
    );
    const keywordScore = (foundKeywords.length / keywords.length) * 40;

    // Mock scoring based on various factors
    const formatScore = 25; // Good format
    const contentScore = Math.random() * 20 + 15; // Random content score
    const lengthScore = content.length > 500 ? 15 : 10; // Length bonus

    const totalScore = Math.min(
      100,
      Math.round(keywordScore + formatScore + contentScore + lengthScore)
    );

    return {
      score: totalScore,
      analysis: {
        keywords: foundKeywords,
        strengths: [
          "Professional format",
          "Clear contact information",
          "Relevant experience highlighted",
        ],
        improvements: [
          "Add more technical keywords",
          "Include quantifiable achievements",
          "Optimize for ATS systems",
        ],
        sections: {
          contact: { score: 90, feedback: "Complete and professional" },
          experience: { score: 85, feedback: "Good detail and relevance" },
          skills: {
            score: 70,
            feedback: "Could include more technical skills",
          },
          education: { score: 80, feedback: "Well formatted" },
        },
      },
    };
  };

  const handleUpload = async () => {
    if (!file || !currentUser) return;

    setUploading(true);
    setError("");

    try {
      // Upload file to Firebase Storage
      const storageRef = ref(
        storage,
        `resumes/${currentUser.uid}/${Date.now()}_${file.name}`
      );
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Mock file content for analysis (in a real app, you'd extract text from the file)
      const mockContent = `
        John Doe
        Software Developer
        john.doe@email.com
        (555) 123-4567

        Experience:
        Senior Software Developer at Tech Corp (2020-2024)
        - Developed React applications using JavaScript and Node.js
        - Worked with AWS and Docker for deployment
        - Used Git for version control and collaborated with teams
        - Built RESTful APIs with Python and SQL databases

        Skills:
        JavaScript, React, Node.js, Python, SQL, AWS, Docker, Git

        Education:
        Bachelor of Computer Science
        University of Technology (2016-2020)
      `;

      // Analyze the resume
      const analysisResult = analyzeResume(mockContent, file.name);

      // Save analysis to Firestore
      const docRef = await addDoc(collection(db, "resumeAnalyses"), {
        userId: currentUser.uid,
        fileName: file.name,
        fileURL: downloadURL,
        score: analysisResult.score,
        analysis: analysisResult.analysis,
        uploadDate: serverTimestamp(),
        status: "completed",
      });

      // Navigate to results page
      navigate(`/results/${docRef.id}`);
    } catch (error: any) {
      console.error("Upload error:", error);
      setError("Failed to upload and analyze resume. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-100 to-fuchsia-100 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Upload Your Resume
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your resume in PDF, DOC, or DOCX format to get detailed
            analysis and improvement suggestions.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all duration-200 ${
                dragActive
                  ? "border-sky-500 bg-sky-50"
                  : "border-gray-300 hover:border-sky-400 hover:bg-gray-50"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="h-14 w-14 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Drop your resume here
              </h3>
              <p className="text-gray-600 mb-6">
                or click to browse from your computer
              </p>
              <label className="inline-flex items-center px-5 sm:px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-fuchsia-500 cursor-pointer transition-colors">
                <Upload className="h-5 w-5 mr-2" />
                Choose File
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500 mt-4">
                Supported formats: PDF, DOC, DOCX (max 10MB)
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected File */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-sky-100 rounded-lg">
                    <FileText className="h-6 w-6 text-sky-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Analysis Preview */}
              <div className="bg-gradient-to-r from-sky-50 to-fuchsia-50 rounded-lg p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                  What we'll analyze:
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-700">
                      ATS Compatibility
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Keyword Optimization
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Format & Structure
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Content Quality
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-700">{error}</span>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full bg-sky-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-fuchsia-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing Resume...</span>
                  </div>
                ) : (
                  "Analyze Resume"
                )}
              </button>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="p-4 bg-sky-100 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-sky-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Instant Analysis
            </h3>
            <p className="text-sm text-gray-600">
              Get your results in seconds with our advanced AI technology
            </p>
          </div>
          <div className="text-center">
            <div className="p-4 bg-green-100 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Detailed Feedback
            </h3>
            <p className="text-sm text-gray-600">
              Comprehensive analysis of every section of your resume
            </p>
          </div>
          <div className="text-center">
            <div className="p-4 bg-fuchsia-100 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Upload className="h-8 w-8 text-fuchsia-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure Upload</h3>
            <p className="text-sm text-gray-600">
              Your resume is encrypted and stored securely in the cloud
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
