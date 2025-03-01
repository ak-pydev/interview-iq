'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  FileText, 
  Briefcase, 
  Send, 
  HelpCircle, 
  ChevronRight, 
  CheckCircle, 
  X, 
  LightbulbIcon,
  PlusCircle,
  Paperclip,
  AlertCircle,
  ArrowRight,
  Clock,
  Calendar,
  Star,
  BarChart,
  PlusSquare,
  BookOpen,
  History,
  ExternalLink,
  Bookmark,
  Sparkles,
  Edit
} from 'lucide-react';

export default function BehavioralInterviewTab() {
  // Add router for navigation
  const router = useRouter();
  
  // View state (setup or history)
  const [activeView, setActiveView] = useState('setup');

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [userQuestions, setUserQuestions] = useState(['']);
  const [tipVisible, setTipVisible] = useState(true);
  const [activeTip, setActiveTip] = useState(0);
  
  // Refs for file inputs
  const resumeInputRef = useRef<HTMLInputElement>(null);
  
  // Interview configuration options
  const interviewModes = [
    { id: 'beginner', name: 'Beginner Mode', description: 'Gentle feedback with guiding questions', color: 'bg-emerald-900/30 border-emerald-500/30' },
    { id: 'standard', name: 'Standard Mode', description: 'Balanced challenge and support', color: 'bg-blue-900/30 border-blue-500/30' },
    { id: 'expert', name: 'Expert Mode', description: 'Challenging questions with detailed critique', color: 'bg-purple-900/30 border-purple-500/30' }
  ];
  const [selectedMode, setSelectedMode] = useState('standard');
  
  // Sample tips for effective behavioral interviews
  const tips = [
    { 
      title: "Use the STAR Method", 
      content: "Structure your answers with Situation, Task, Action, and Result to provide clear, concise responses. This framework helps you tell compelling stories that showcase your skills."
    },
    { 
      title: "Prepare Personal Examples", 
      content: "Have 5-7 strong stories ready that showcase different skills and can be adapted to various questions. Focus on situations where you had a significant impact."
    },
    { 
      title: "Quantify Your Achievements", 
      content: "Include metrics and specific outcomes to make your accomplishments more impactful. Numbers and percentages make your contributions concrete and memorable."
    },
    { 
      title: "Listen Carefully", 
      content: "Pay attention to exactly what's being asked and answer that specific question. Avoid going off-topic and make sure to address all parts of multi-part questions."
    }
  ];

  // Sample interview history data
  const interviewHistory = [
    {
      id: 'int-001',
      date: 'Feb 28, 2025',
      company: 'Tech Solutions Inc.',
      role: 'Senior Product Manager',
      duration: '26 mins',
      score: 85,
      strengths: ['Communication', 'Leadership examples', 'Problem-solving'],
      improvement: ['Conciseness', 'More quantifiable results'],
      questions: [
        'Tell me about a time you led a project that failed',
        'Describe a situation where you had to influence without authority',
        'How have you handled conflicts within your team?'
      ]
    },
    {
      id: 'int-002',
      date: 'Feb 23, 2025',
      company: 'InnovateCorp',
      role: 'Product Manager',
      duration: '31 mins',
      score: 76,
      strengths: ['Structured answers', 'Technical knowledge'],
      improvement: ['More specific examples', 'Better time management'],
      questions: [
        'Tell me about a time you had to make a difficult decision',
        'How do you prioritize competing demands?',
        'Describe a situation where you disagreed with your manager'
      ]
    },
    {
      id: 'int-003',
      date: 'Feb 15, 2025',
      company: 'Global Enterprises',
      role: 'Associate Product Manager',
      duration: '24 mins',
      score: 72,
      strengths: ['Enthusiasm', 'Creative solutions'],
      improvement: ['STAR structure', 'More detailed examples', 'Professional language'],
      questions: [
        'Describe a time you had to adapt to a significant change',
        'How do you handle feedback?',
        'Tell me about a time you went above and beyond'
      ]
    }
  ];

  // Sort options for history
  const [sortBy, setSortBy] = useState('date');
  const [filterByCompany, setFilterByCompany] = useState('');
  
  // Function to handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };
  
  // Function to handle adding a new question field
  const handleAddQuestion = () => {
    setUserQuestions([...userQuestions, '']);
  };
  
  // Function to update a specific question
  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...userQuestions];
    updatedQuestions[index] = value;
    setUserQuestions(updatedQuestions);
  };
  
  // Function to remove a question
  const handleRemoveQuestion = (index: number) => {
    if (userQuestions.length > 1) {
      const updatedQuestions = userQuestions.filter((_, i) => i !== index);
      setUserQuestions(updatedQuestions);
    }
  };

  // Function to reset the form
  const handleResetForm = () => {
    setCompanyName('');
    setSelectedRole('');
    setResumeFile(null);
    setJobDescription('');
    setUserQuestions(['']);
    setSelectedMode('standard');
  };

  // Function to start the interview
  const startInterview = () => {
    console.log("Starting behavioral interview...");
    // You can add any validation or data processing here
    
    // Navigate to the interview session page
    router.push('/interview-session');
  };

  // Function to filter and sort history
  const getFilteredAndSortedHistory = () => {
    let filtered = [...interviewHistory];
    
    if (filterByCompany) {
      filtered = filtered.filter(item => 
        item.company.toLowerCase().includes(filterByCompany.toLowerCase())
      );
    }
    
    switch (sortBy) {
      case 'date':
        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'score':
        return filtered.sort((a, b) => b.score - a.score);
      default:
        return filtered;
    }
  };
  
  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        damping: 15, 
        stiffness: 100 
      }
    }
  };
  
  const tipContainerVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { 
      height: 'auto', 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      height: 0, 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  // Tab navigation
  const renderTabNavigation = () => (
    <div className="flex space-x-1 mb-8 border-b border-gray-700">
      <button
        className={`px-4 py-3 font-medium flex items-center space-x-2 ${activeView === 'setup' 
          ? 'text-white border-b-2 border-indigo-500' 
          : 'text-gray-400 hover:text-white'}`}
        onClick={() => setActiveView('setup')}
      >
        <PlusSquare className="w-5 h-5" />
        <span>Create New Interview</span>
      </button>
      <button
        className={`px-4 py-3 font-medium flex items-center space-x-2 ${activeView === 'history' 
          ? 'text-white border-b-2 border-indigo-500' 
          : 'text-gray-400 hover:text-white'}`}
        onClick={() => setActiveView('history')}
      >
        <History className="w-5 h-5" />
        <span>Interview History</span>
      </button>
    </div>
  );
  
  return (
    <motion.div 
      className="w-full bg-gradient-to-b from-gray-900 via-indigo-950 to-gray-900 text-white min-h-screen p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600 rounded-full opacity-10 blur-3xl" />
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400"
          variants={itemVariants}
        >
          Behavioral Interview Preparation
        </motion.h1>
        
        {renderTabNavigation()}

        <AnimatePresence mode="wait">
          {activeView === 'setup' ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Quick Tips Section */}
              <motion.div 
                className="bg-indigo-900/30 border border-indigo-500/40 rounded-xl mb-8 overflow-hidden shadow-lg shadow-indigo-900/10"
                variants={itemVariants}
              >
                <div className="flex justify-between items-center p-4 cursor-pointer bg-indigo-900/50" onClick={() => setTipVisible(!tipVisible)}>
                  <div className="flex items-center space-x-2">
                    <LightbulbIcon className="w-5 h-5 text-yellow-400" />
                    <h3 className="font-semibold text-white">Quick Interview Tips</h3>
                  </div>
                  <button className="text-gray-300 hover:text-white">
                    {tipVisible ? <X className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                  </button>
                </div>
                
                {tipVisible && (
                  <motion.div 
                    className="px-4 pb-5"
                    variants={tipContainerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="flex overflow-x-auto py-3 space-x-2 mb-4">
                      {tips.map((tip, index) => (
                        <button
                          key={index}
                          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                            activeTip === index 
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-800/20' 
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                          onClick={() => setActiveTip(index)}
                        >
                          {tip.title}
                        </button>
                      ))}
                    </div>
                    
                    <div className="bg-indigo-950/50 rounded-xl p-5 border border-indigo-800/30">
                      <h4 className="font-medium text-lg mb-2 text-indigo-200">{tips[activeTip].title}</h4>
                      <p className="text-gray-300">{tips[activeTip].content}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
              
              {/* Interview Setup Form */}
              <motion.div 
                className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-8 border border-gray-700 shadow-xl shadow-purple-900/5"
                variants={itemVariants}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                    Behavioral Interview Setup
                  </h2>
                </div>
                
                <div className="space-y-8">
                  {/* Company and Role Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-indigo-200 mb-2">
                        Company Name (Recommended)
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-indigo-400" />
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Google, Amazon, etc."
                          className="w-full bg-gray-900/70 border border-indigo-900/50 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-indigo-200 mb-2">
                        Target Role (Recommended)
                      </label>
                      <div className="relative">
                        <Edit className="absolute left-3 top-3.5 w-5 h-5 text-indigo-400" />
                        <input
                          type="text"
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          placeholder="e.g. Product Manager, Software Engineer"
                          className="w-full bg-gray-900/70 border border-indigo-900/50 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Resume and Job Description Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-indigo-200 mb-2">
                        Upload Your Resume (Required)
                      </label>
                      <div 
                        className="border-2 border-dashed border-indigo-800/50 rounded-xl p-6 cursor-pointer hover:border-indigo-500 transition-colors text-center bg-indigo-950/20"
                        onClick={() => resumeInputRef.current?.click()}
                      >
                        {resumeFile ? (
                          <div className="flex items-center justify-center space-x-2">
                            <FileText className="w-5 h-5 text-indigo-400" />
                            <span className="text-indigo-300">{resumeFile.name}</span>
                            <button 
                              className="text-gray-400 hover:text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                setResumeFile(null);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center space-y-3">
                            <Upload className="w-10 h-10 text-indigo-500" />
                            <span className="text-indigo-300">Upload your resume</span>
                            <span className="text-xs text-indigo-400">PDF, DOCX (Max: 5MB)</span>
                          </div>
                        )}
                        <input 
                          type="file" 
                          ref={resumeInputRef}
                          onChange={(e) => handleFileChange(e, setResumeFile)} 
                          accept=".pdf,.doc,.docx"
                          className="hidden" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-indigo-200 mb-2">
                        Job Description (Required)
                      </label>
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description here..."
                        className="w-full h-36 bg-gray-900/70 border border-indigo-900/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                      />
                    </div>
                  </div>
                  
                  {/* Questions for the Interviewer */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-indigo-200">
                        Your Questions for the Interviewer (Optional)
                      </label>
                      <button 
                        className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center space-x-1 bg-indigo-950/30 px-3 py-1 rounded-full"
                        onClick={handleAddQuestion}
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Add Question</span>
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {userQuestions.map((question, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="flex-grow relative">
                            <HelpCircle className="absolute left-3 top-3.5 w-5 h-5 text-indigo-400" />
                            <input
                              type="text"
                              value={question}
                              onChange={(e) => handleQuestionChange(index, e.target.value)}
                              placeholder="e.g. How would you describe the team culture?"
                              className="w-full bg-gray-900/70 border border-indigo-900/50 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            />
                          </div>
                          {userQuestions.length > 1 && (
                            <button 
                              className="text-gray-400 hover:text-white p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
                              onClick={() => handleRemoveQuestion(index)}
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-indigo-300 mt-2">
                      These questions will be available to ask at the end of your interview session.
                    </p>
                  </div>
                  
                  {/* Interview Mode Selection */}
                  <div>
                    <label className="block text-sm font-medium text-indigo-200 mb-3">
                      Interview Difficulty
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {interviewModes.map((mode) => (
                        <div 
                          key={mode.id}
                          className={`border rounded-xl p-5 cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 ${
                            selectedMode === mode.id 
                              ? `${mode.color} border-opacity-70` 
                              : 'border-gray-700 bg-gray-900/40 hover:border-gray-500'
                          }`}
                          onClick={() => setSelectedMode(mode.id)}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            <div className={`w-4 h-4 rounded-full border-2 ${selectedMode === mode.id ? 'border-indigo-500 bg-indigo-500' : 'border-gray-500'}`}></div>
                            <span className="font-medium text-white">{mode.name}</span>
                          </div>
                          <p className="ml-6 text-sm text-gray-300 mt-1">{mode.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Note about personalization */}
                  <div className="bg-gradient-to-r from-amber-900/30 to-yellow-900/20 border border-yellow-700/30 rounded-xl p-5 flex space-x-3 shadow-lg">
                    <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-yellow-200 mb-1">Personalized Experience</h4>
                      <p className="text-sm text-yellow-100/80">
                        Providing your resume and job description allows our AI to tailor questions to your background and target role, making the interview more relevant and realistic.
                      </p>
                    </div>
                  </div>
                  
                  {/* Form Action Buttons */}
                  <div className="flex justify-center mt-10 space-x-4">
                    <motion.button
                      className="border border-gray-600 hover:border-gray-400 px-6 py-3 rounded-xl font-medium text-gray-300 hover:text-white bg-gray-900/30 hover:bg-gray-800/60 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleResetForm}
                    >
                      Reset Form
                    </motion.button>
                    
                    <motion.button
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center space-x-2 transition-all"
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={startInterview}
                    >
                      <span>Start Behavioral Interview</span>
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
              
              {/* What to Expect Section */}
              <motion.div 
                className="mt-8 bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg"
                variants={itemVariants}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-indigo-400" />
                  <span>What to Expect</span>
                </h3>
                <ul className="space-y-4">
                  {[
                    "The interview will last approximately 20-30 minutes",
                    "You'll respond to 5-7 behavioral questions based on common interview topics",
                    "AI interviewer will adapt questions based on your responses",
                    "You'll receive real-time feedback on your answers",
                    "Detailed performance analysis will be available at the end"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 text-gray-300 bg-indigo-950/30 p-4 rounded-lg border border-indigo-900/30">
                  <p>Need help preparing? Check out our <Link href="#" className="text-indigo-400 hover:text-indigo-300 underline">interview preparation guide</Link> for tips on answering behavioral questions effectively.</p>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Interview History Section */}
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-8 border border-gray-700 shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Your Interview History</h2>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <label htmlFor="sortBy" className="text-sm text-indigo-200">Sort by:</label>
                      <select
                        id="sortBy"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-indigo-950/50 border border-indigo-900/50 rounded-lg text-white text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="date">Date (Recent first)</option>
                        <option value="score">Score (Highest first)</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Filter by company"
                          value={filterByCompany}
                          onChange={(e) => setFilterByCompany(e.target.value)}
                          className="bg-indigo-950/50 border border-indigo-900/50 text-white rounded-lg pl-3 pr-8 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        {filterByCompany && (
                          <button
                            onClick={() => setFilterByCompany('')}
                            className="absolute right-2 top-2.5 text-gray-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Progress Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-800/20 rounded-xl p-4 border border-indigo-500/30 shadow-md">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-5 h-5 text-indigo-400" />
                      <h3 className="font-medium">Total Interviews</h3>
                    </div>
                    <p className="text-3xl font-bold text-indigo-200">{interviewHistory.length}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 rounded-xl p-4 border border-purple-500/30 shadow-md">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-purple-400" />
<h3 className="font-medium">Practice Time</h3>
                    </div>
                    <p className="text-3xl font-bold text-purple-200">81 mins</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 rounded-xl p-4 border border-emerald-500/30 shadow-md">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-5 h-5 text-emerald-400" />
                      <h3 className="font-medium">Average Score</h3>
                    </div>
                    <p className="text-3xl font-bold text-emerald-200">78%</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 rounded-xl p-4 border border-blue-500/30 shadow-md">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart className="w-5 h-5 text-blue-400" />
                      <h3 className="font-medium">Improvement</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-200">+14%</p>
                  </div>
                </div>
                
                {/* Interview History Cards */}
                <div className="space-y-6">
                  {getFilteredAndSortedHistory().length > 0 ? (
                    getFilteredAndSortedHistory().map((interview) => (
                      <motion.div 
                        key={interview.id}
                        className="bg-gradient-to-r from-gray-900/70 to-indigo-950/50 rounded-xl border border-gray-700 p-6 hover:border-indigo-500/50 transition-all shadow-lg"
                        whileHover={{ y: -4, boxShadow: "0 15px 30px -5px rgba(79, 70, 229, 0.2)" }}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-xl text-indigo-200">{interview.company}</h3>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-300">{interview.role}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4 text-indigo-400" />
                                <span>{interview.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4 text-indigo-400" />
                                <span>{interview.duration}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <svg className="w-20 h-20" viewBox="0 0 36 36">
                                  <path
                                    d="M18 2.0845
                                      a 15.9155 15.9155 0 0 1 0 31.831
                                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#4338ca"
                                    strokeWidth="3"
                                    strokeDasharray="100, 100"
                                    strokeLinecap="round"
                                  />
                                  <path
                                    d="M18 2.0845
                                      a 15.9155 15.9155 0 0 1 0 31.831
                                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#a5b4fc"
                                    strokeWidth="3"
                                    strokeDasharray={`${interview.score}, 100`}
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                  <div className="text-2xl font-bold text-indigo-300">{interview.score}</div>
                                  <div className="text-xs text-indigo-400">score</div>
                                </div>
                              </div>
                            </div>
                            
                            <Link href={`/interview/${interview.id}`}>
                              <motion.button
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center space-x-2 shadow-md"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <span>View Details</span>
                                <ExternalLink className="w-4 h-4" />
                              </motion.button>
                            </Link>
                          </div>
                        </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                          <div>
                            <h4 className="text-sm text-indigo-300 mb-3 flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                              Strengths
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {interview.strengths.map((strength, idx) => (
                                <span key={idx} className="bg-green-900/30 text-green-300 text-xs rounded-full px-3 py-1.5 border border-green-700/30 shadow-sm">
                                  {strength}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm text-indigo-300 mb-3 flex items-center">
                              <AlertCircle className="w-4 h-4 text-amber-500 mr-2" />
                              Areas for Improvement
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {interview.improvement.map((item, idx) => (
                                <span key={idx} className="bg-amber-900/30 text-amber-300 text-xs rounded-full px-3 py-1.5 border border-amber-700/30 shadow-sm">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 bg-indigo-950/30 rounded-xl p-4 border border-indigo-900/20">
                          <h4 className="text-sm text-indigo-300 mb-3 flex items-center">
                            <HelpCircle className="w-4 h-4 text-blue-400 mr-2" />
                            Questions Covered
                          </h4>
                          <div className="text-sm text-gray-300 space-y-2">
                            {interview.questions.map((question, idx) => (
                              <div key={idx} className="flex items-start space-x-3">
                                <span className="text-xs bg-indigo-900/50 text-indigo-300 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5 border border-indigo-700/30">
                                  {idx + 1}
                                </span>
                                <span>{question}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap justify-between mt-6 pt-5 border-t border-indigo-900/30">
                          <button className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center space-x-2 bg-indigo-950/30 px-3 py-2 rounded-lg hover:bg-indigo-900/30 transition-all">
                            <Bookmark className="w-4 h-4" />
                            <span>Save to Favorites</span>
                          </button>
                          
                          <button className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center space-x-2 bg-indigo-950/30 px-3 py-2 rounded-lg hover:bg-indigo-900/30 transition-all mt-3 md:mt-0">
                            <BookOpen className="w-4 h-4" />
                            <span>Practice Similar Questions</span>
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="bg-gradient-to-r from-gray-900/70 to-indigo-950/50 rounded-xl border border-gray-700 p-10 text-center shadow-lg">
                      <div className="flex justify-center mb-6">
                        <History className="w-20 h-20 text-indigo-900/70" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-3 text-indigo-200">No interviews found</h3>
                      <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        {filterByCompany ? 
                          `No interviews matching "${filterByCompany}" found. Try a different search.` : 
                          "You haven't completed any behavioral interviews yet. Start practicing to build your skills."}
                      </p>
                      <motion.button
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-6 py-3 rounded-lg font-medium inline-flex items-center space-x-2 shadow-lg"
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveView('setup')}
                      >
                        <PlusCircle className="w-5 h-5" />
                        <span>Start Your First Interview</span>
                      </motion.button>
                    </div>
                  )}
                </div>
                
                {getFilteredAndSortedHistory().length > 0 && (
                  <div className="mt-10 text-center">
                    <motion.button
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-6 py-3 rounded-xl font-medium inline-flex items-center space-x-2 shadow-lg"
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveView('setup')}
                    >
                      <PlusCircle className="w-5 h-5" />
                      <span>Create New Interview</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
