"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WarpBackground } from "@/components/ui/warp-background";

// Uncomment the next two lines if you have access to ScrollSmoother
// import { ScrollSmoother } from "gsap/ScrollSmoother";
// gsap.registerPlugin(ScrollTrigger, ScrollSmoother);


gsap.registerPlugin(ScrollTrigger);

const Section = () => {
  const [activeTab, setActiveTab] = useState("students");
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If premium ScrollSmoother is used, we can create a smoother instance like this:
    // if (smoothWrapperRef.current && smoothContentRef.current && ScrollSmoother) {
    //   ScrollSmoother.create({
    //     wrapper: smoothWrapperRef.current,
    //     content: smoothContentRef.current,
    //     smooth: 1.5,
    //     effects: true,
    //   });
    // }
    // GSAP animation for hero section
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div id="smooth-wrapper" ref={smoothWrapperRef}>
      <div id="smooth-content" ref={smoothContentRef}>
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Hero Section */}
          <motion.section
            ref={heroRef}
            className="px-4 pt-16 pb-20 max-w-6xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-indigo-900 mb-6">
                  Your AI Career Mentor
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                  Personalized career guidance, resume optimization, skill gap
                  analysis, and AI mock interviews—all in one platform.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a
                    href="#"
                    className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-300 shadow-lg hover:shadow-xl"
                  >
                    Start Your Career Journey
                  </a>
                  <a
                    href="#"
                    className="px-8 py-4 bg-white text-indigo-600 border border-indigo-200 rounded-lg font-medium hover:border-indigo-600 transition duration-300 shadow-md hover:shadow-lg"
                  >
                    Watch Demo
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Product Demo */}
            <WarpBackground>
            <motion.div
              className="relative max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <div className="w-full h-96 bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                <div className="w-full h-6 bg-gray-700 flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="p-4 h-full bg-gradient-to-br from-indigo-900 to-purple-900 text-white flex flex-col items-center justify-center">
                  <p className="text-lg mb-4">AI Mock Interview in Progress</p>
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mr-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="8" r="5" />
                        <path d="M20 21a8 8 0 0 0-16 0" />
                      </svg>
                    </div>
                    <div className="flex-1 p-4 bg-indigo-800 rounded-lg">
                      <p>
                        "Tell me about a time you solved a difficult problem at
                        work."
                      </p>
                    </div>
                  </div>
                  <div className="w-full max-w-md p-3 bg-indigo-700 rounded-lg">
                    <p className="text-sm mb-2">Real-time Analysis:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-indigo-800 rounded">
                        <p className="text-xs font-medium">Confidence</p>
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                          <div
                            className="bg-green-500 h-2.5 rounded-full"
                            style={{ width: "85%" }}
                          ></div>
                        </div>
                      </div>
                      <div className="p-2 bg-indigo-800 rounded">
                        <p className="text-xs font-medium">Structure</p>
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                          <div
                            className="bg-yellow-500 h-2.5 rounded-full"
                            style={{ width: "65%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            </WarpBackground>
           
          </motion.section>

          {/* Features Section */}
          <section className="px-4 py-16 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4"
                >
                  Career Tools Built With AI
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="text-xl text-gray-600 max-w-3xl mx-auto"
                >
                  Our platform uses cutting-edge AI to help you navigate your
                  career journey from start to finish.
                </motion.p>
              </div>

              {/* Bento Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    title: "AI Resume Feedback",
                    description:
                      "Get personalized feedback on your resume with AI-powered analysis.",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    ),
                  },
                  {
                    title: "Skill Gap Analysis",
                    description:
                      "Identify the skills you need to develop for your dream role.",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m7 10 5 5 5-5" />
                        <path d="M12 15V3" />
                        <path d="M20 21H4" />
                      </svg>
                    ),
                  },
                  {
                    title: "AI Mock Interviews",
                    description:
                      "Practice interviews with AI and get detailed performance feedback.",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    ),
                  },
                  {
                    title: "Job Market Insights",
                    description:
                      "Get real-time insights on job market trends and opportunities.",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                        <path d="M2 20h20" />
                      </svg>
                    ),
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-indigo-50 p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300"
                  >
                    <div className="text-indigo-600 mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-indigo-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Who Benefits Section */}
          <section className="px-4 py-16 bg-indigo-50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
                  Who Benefits?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our platform is designed for everyone at different career
                  stages.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="flex border-b border-gray-200">
                  <button
                    className={`flex-1 py-4 px-6 text-center font-medium ${
                      activeTab === "students"
                        ? "text-indigo-600 border-b-2 border-indigo-600"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("students")}
                  >
                    Students
                  </button>
                  <button
                    className={`flex-1 py-4 px-6 text-center font-medium ${
                      activeTab === "job-seekers"
                        ? "text-indigo-600 border-b-2 border-indigo-600"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("job-seekers")}
                  >
                    Job Seekers
                  </button>
                  <button
                    className={`flex-1 py-4 px-6 text-center font-medium ${
                      activeTab === "professionals"
                        ? "text-indigo-600 border-b-2 border-indigo-600"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("professionals")}
                  >
                    Professionals
                  </button>
                </div>

                <div className="p-6">
                  {activeTab === "students" && (
                    <div className="flex flex-col md:flex-row items-center">
                      <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6">
                        <h3 className="text-2xl font-bold text-indigo-900 mb-4">
                          For Students
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Starting your career journey can be challenging. Our AI
                          mentor helps you:
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-green-500 mr-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Discover career paths based on your studies
                          </li>
                          <li className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-green-500 mr-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Build an effective resume with no experience
                          </li>
                          <li className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-green-500 mr-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Prepare for internship interviews
                          </li>
                          <li className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-green-500 mr-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Learn in-demand skills for your field
                          </li>
                        </ul>
                      </div>
                      <div className="md:w-1/2 bg-indigo-100 rounded-xl p-6">
                        <div className="bg-white rounded-lg p-4 shadow-md">
                          <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5.5 20H8M17 9l-7 7-3-3 7-7 3 3z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-indigo-900">
                                Resume Feedback
                              </p>
                              <p className="text-sm text-gray-500">Today, 2:30 PM</p>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3">
                            Here's my feedback on your resume:
                          </p>
                          <div className="bg-indigo-50 p-3 rounded-lg text-sm">
                            <p className="mb-2">
                              Your resume needs a clearer description of your project
                              work. Try using action verbs and quantifiable achievements.
                            </p>
                            <p className="font-medium text-indigo-700">
                              I've suggested edits that could increase your interview
                              chances by 40%.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "job-seekers" && (
                    <div className="flex flex-col md:flex-row items-center">
                      <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6">
                        <h3 className="text-2xl font-bold text-indigo-900 mb-4">
                          For Job Seekers
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Finding the right job can be stressful. Our AI mentor helps
                          you:
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-green-500 mr-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Optimize your resume for ATS systems
                          </li>
                          <li className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-green-500 mr-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Practice job-specific interview questions
                          </li>
                          <li className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-green-500 mr-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Negotiate salary with market insights
                          </li>
                        </ul>
                      </div>
                      <div className="md:w-1/2 bg-indigo-100 rounded-xl p-6">
                        <div className="bg-white rounded-lg p-4 shadow-md">
                          <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-indigo-900">
                                Mock Interview Analysis
                              </p>
                              <p className="text-sm text-gray-500">Today, 4:15 PM</p>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3">
                            Your interview performance analysis:
                          </p>
                          <div className="bg-indigo-50 p-3 rounded-lg text-sm">
                            <div className="mb-2">
                              <span className="font-medium">
                                Technical Knowledge:{" "}
                              </span>
                              <span className="text-green-600">Strong</span>
                            </div>
                            <div className="mb-2">
                              <span className="font-medium">Communication: </span>
                              <span className="text-yellow-600">
                                Needs improvement
                              </span>
                            </div>
                            <p className="font-medium text-indigo-700 mt-2">
                              Try using more concrete examples in your STAR responses.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "professionals" && (
                    <div className="flex flex-col md:flex-row items-center">
                      <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6">
                        <h3 className="text-2xl font-bold text-indigo-900 mb-4">
                          For Professionals
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Looking to advance your career? Our AI mentor helps you:
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-green-500 mr-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Identify promotion-ready skills
                          </li>
                          <li className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-green-500 mr-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Plan career transitions to new fields
                          </li>
                          <li className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-green-500 mr-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Stay current with industry trends
                          </li>
                          <li className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-green-500 mr-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Enhance leadership and management skills
                          </li>
                        </ul>
                      </div>
                      <div className="md:w-1/2 bg-indigo-100 rounded-xl p-6">
                        <div className="bg-white rounded-lg p-4 shadow-md">
                          <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 2L2 12h3v8h8v-8h3L12 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-indigo-900">
                                Leadership Evaluation
                              </p>
                              <p className="text-sm text-gray-500">Today, 5:30 PM</p>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3">
                            Your leadership and management skills assessment:
                          </p>
                          <div className="bg-indigo-50 p-3 rounded-lg text-sm">
                            <div className="mb-2">
                              <span className="font-medium">
                                Team Collaboration:{" "}
                              </span>
                              <span className="text-green-600">Excellent</span>
                            </div>
                            <div className="mb-2">
                              <span className="font-medium">Decision Making: </span>
                              <span className="text-yellow-600">Good</span>
                            </div>
                            <p className="font-medium text-indigo-700 mt-2">
                              Focus on strategic planning to further enhance your impact.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </motion.main>
      </div>
    </div>
  );
};

export default Section;
