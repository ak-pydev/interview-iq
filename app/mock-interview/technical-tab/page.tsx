'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  FileText, 
  Briefcase, 
  Edit,
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
  Code,
  FileCode,
  Server,
  Terminal,
  Database,
  Layout,
  Cpu,
  Monitor,
  GitBranch,
  Braces,
  SquareTerminal,
  Binary,
  Table,
  Languages
} from 'lucide-react';

export default function TechnicalInterviewTab() {
  // Add router for navigation
  const router = useRouter();
  
  // View state (setup or history)
  const [activeView, setActiveView] = useState('setup');

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('python');
  const [tipVisible, setTipVisible] = useState(true);
  const [activeTip, setActiveTip] = useState(0);
  
  // Interview configuration options
  const interviewTypes = [
    { 
      id: 'algorithms', 
      name: 'Algorithms & Data Structures', 
      description: 'Solve coding challenges focused on algorithms, data structures, and problem-solving skills',
      icon: <Binary className="w-5 h-5 text-blue-400" />,
      color: 'bg-blue-900/30 border-blue-500/30' 
    },
    { 
      id: 'system-design', 
      name: 'System Design', 
      description: 'Design scalable systems and discuss architecture trade-offs for complex applications',
      icon: <Server className="w-5 h-5 text-emerald-400" />,
      color: 'bg-emerald-900/30 border-emerald-500/30' 
    },
    { 
      id: 'web-dev', 
      name: 'Web Development', 
      description: 'Frontend and backend implementation questions related to web technologies',
      icon: <Layout className="w-5 h-5 text-amber-400" />,
      color: 'bg-amber-900/30 border-amber-500/30' 
    },
    { 
      id: 'database', 
      name: 'Database Design & SQL', 
      description: 'Solve database schema design problems and write efficient SQL queries',
      icon: <Database className="w-5 h-5 text-purple-400" />,
      color: 'bg-purple-900/30 border-purple-500/30' 
    }
  ];
  const [selectedInterviewType, setSelectedInterviewType] = useState('algorithms');
  
  // Difficulty levels
  const difficultyLevels = [
    { id: 'easy', name: 'Easy', description: 'Introductory level problems', color: 'bg-emerald-900/30 border-emerald-500/30' },
    { id: 'medium', name: 'Medium', description: 'Intermediate challenges', color: 'bg-blue-900/30 border-blue-500/30' },
    { id: 'hard', name: 'Hard', description: 'Advanced problems', color: 'bg-purple-900/30 border-purple-500/30' }
  ];
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');

  // Programming languages
  const programmingLanguages = [
    { id: 'python', name: 'Python', icon: <span className="font-mono text-yellow-400">Py</span> },
    { id: 'javascript', name: 'JavaScript', icon: <span className="font-mono text-yellow-400">JS</span> },
    { id: 'java', name: 'Java', icon: <span className="font-mono text-orange-400">Ja</span> },
    { id: 'cpp', name: 'C++', icon: <span className="font-mono text-blue-400">C++</span> },
    { id: 'csharp', name: 'C#', icon: <span className="font-mono text-purple-400">C#</span> },
    { id: 'golang', name: 'Go', icon: <span className="font-mono text-cyan-400">Go</span> }
  ];

  // Sample tips for technical interviews
  const tips = [
    { 
      title: "Think Aloud", 
      content: "Vocalize your thought process. Interviewers are often more interested in how you approach problems than the final solution."
    },
    { 
      title: "Start Simple", 
      content: "Begin with a naive or brute force solution, then optimize. This demonstrates your ability to iterate and improve code."
    },
    { 
      title: "Clarify Requirements", 
      content: "Ask questions to fully understand the problem before coding. Discuss edge cases and constraints with your interviewer."
    },
    { 
      title: "Test Your Code", 
      content: "Walk through your solution with test cases, including edge cases. Debug any issues methodically."
    }
  ];

  // Sample interview history data
  const interviewHistory = [
    {
      id: 'tech-001',
      date: 'Feb 27, 2025',
      company: 'TechGiant Inc.',
      role: 'Senior Software Engineer',
      type: 'Algorithms & Data Structures',
      duration: '45 mins',
      score: 88,
      language: 'Python',
      problems: [
        'Implement a linked list with O(1) deletion',
        'Find all subsets of a set',
        'Detect a cycle in a directed graph'
      ],
      strengths: ['Problem decomposition', 'Time complexity analysis', 'Code organization'],
      improvement: ['Optimize initial solutions', 'Edge case handling']
    },
    {
      id: 'tech-002',
      date: 'Feb 21, 2025',
      company: 'DataScale',
      role: 'Backend Engineer',
      type: 'System Design',
      duration: '52 mins',
      score: 79,
      language: 'N/A',
      problems: [
        'Design a URL shortening service',
        'Scale a social media news feed',
        'Implement a distributed cache'
      ],
      strengths: ['Database design knowledge', 'Scalability considerations'],
      improvement: ['Load balancing strategies', 'Caching implementation details']
    },
    {
      id: 'tech-003',
      date: 'Feb 12, 2025',
      company: 'WebFront Systems',
      role: 'Full Stack Developer',
      type: 'Web Development',
      duration: '38 mins',
      score: 92,
      language: 'JavaScript',
      problems: [
        'Implement a responsive image gallery',
        'Create a form with client-side validation',
        'Debug a React component with state issues'
      ],
      strengths: ['DOM manipulation', 'CSS layout mastery', 'React knowledge'],
      improvement: ['Accessibility considerations', 'Performance optimization']
    }
  ];

  // Sort options for history
  const [sortBy, setSortBy] = useState('date');
  const [filterByCompany, setFilterByCompany] = useState('');
  
  // Function to reset the form
  const handleResetForm = () => {
    setCompanyName('');
    setSelectedRole('');
    setJobDescription('');
    setSelectedInterviewType('algorithms');
    setSelectedDifficulty('medium');
    setPreferredLanguage('python');
  };

  // Function to start the interview
  const startInterview = () => {
    console.log("Starting technical interview...");
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
          ? 'text-white border-b-2 border-cyan-500' 
          : 'text-gray-400 hover:text-white'}`}
        onClick={() => setActiveView('setup')}
      >
        <PlusSquare className="w-5 h-5" />
        <span>Create New Interview</span>
      </button>
      <button
        className={`px-4 py-3 font-medium flex items-center space-x-2 ${activeView === 'history' 
          ? 'text-white border-b-2 border-cyan-500' 
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
      className="w-full bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900 text-white min-h-screen p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-600 rounded-full opacity-10 blur-3xl" />
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-slate-500 rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400"
          variants={itemVariants}
        >
          Technical Interview Preparation
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
                className="bg-cyan-900/30 border border-cyan-500/40 rounded-xl mb-8 overflow-hidden shadow-lg shadow-cyan-900/10"
                variants={itemVariants}
              >
                <div className="flex justify-between items-center p-4 cursor-pointer bg-cyan-900/50" onClick={() => setTipVisible(!tipVisible)}>
                  <div className="flex items-center space-x-2">
                    <LightbulbIcon className="w-5 h-5 text-yellow-400" />
                    <h3 className="font-semibold text-white">Technical Interview Tips</h3>
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
                              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-800/20' 
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                          onClick={() => setActiveTip(index)}
                        >
                          {tip.title}
                        </button>
                      ))}
                    </div>
                    
                    <div className="bg-cyan-950/50 rounded-xl p-5 border border-cyan-800/30">
                      <h4 className="font-medium text-lg mb-2 text-cyan-200">{tips[activeTip].title}</h4>
                      <p className="text-gray-300">{tips[activeTip].content}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
              
              {/* Interview Setup Form */}
              <motion.div 
                className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-8 border border-gray-700 shadow-xl shadow-cyan-900/5"
                variants={itemVariants}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Code className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                    Technical Interview Setup
                  </h2>
                </div>
                
                <div className="space-y-8">
                  {/* Company and Role Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-cyan-200 mb-2">
                        Company Name (Optional)
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-cyan-400" />
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Google, Amazon, etc."
                          className="w-full bg-gray-900/70 border border-cyan-900/50 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-cyan-200 mb-2">
                        Target Role (Optional)
                      </label>
                      <div className="relative">
                        <Edit className="absolute left-3 top-3.5 w-5 h-5 text-cyan-400" />
                        <input
                          type="text"
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          placeholder="e.g. Software Engineer, Data Scientist"
                          className="w-full bg-gray-900/70 border border-cyan-900/50 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Job Description Section */}
                  <div>
                    <label className="block text-sm font-medium text-cyan-200 mb-2">
                      Job Description (Optional)
                    </label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the job description here to help us tailor technical questions to the role requirements..."
                      className="w-full h-36 bg-gray-900/70 border border-cyan-900/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition resize-none"
                    />
                    <p className="text-xs text-cyan-300 mt-2">
                      We&apos;ll analyze the job description to focus on relevant technical skills and concepts.
                    </p>
                  </div>
                  
                  {/* Interview Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-cyan-200 mb-3">
                      Interview Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {interviewTypes.map((type) => (
                        <div 
                          key={type.id}
                          className={`border rounded-xl p-5 cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 ${
                            selectedInterviewType === type.id 
                              ? `${type.color} border-opacity-70` 
                              : 'border-gray-700 bg-gray-900/40 hover:border-gray-500'
                          }`}
                          onClick={() => setSelectedInterviewType(type.id)}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            <div className={`w-4 h-4 rounded-full border-2 ${selectedInterviewType === type.id ? 'border-cyan-500 bg-cyan-500' : 'border-gray-500'}`}></div>
                            <span className="font-medium text-white flex items-center space-x-2">
                              {type.icon}
                              <span className="ml-2">{type.name}</span>
                            </span>
                          </div>
                          <p className="ml-6 text-sm text-gray-300 mt-1">{type.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Difficulty Level and Programming Language */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-cyan-200 mb-3">
                        Difficulty Level
                      </label>
                      <div className="space-y-2">
                        {difficultyLevels.map((level) => (
                          <div 
                            key={level.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${
                              selectedDifficulty === level.id 
                                ? `${level.color} border-opacity-70` 
                                : 'border-gray-700 bg-gray-900/40 hover:border-gray-500'
                            }`}
                            onClick={() => setSelectedDifficulty(level.id)}
                          >
                            <div className="flex items-center space-x-2">
                              <div className={`w-4 h-4 rounded-full border-2 ${selectedDifficulty === level.id ? 'border-cyan-500 bg-cyan-500' : 'border-gray-500'}`}></div>
                              <span className="font-medium text-white">{level.name}</span>
                              <span className="text-sm text-gray-400 ml-2">- {level.description}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-cyan-200 mb-3">
                        Preferred Programming Language
                      </label>
                      <div className="bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden">
                        <div className="grid grid-cols-2 gap-1 p-1">
                          {programmingLanguages.map((lang) => (
                            <div 
                              key={lang.id}
                              className={`py-2 px-3 rounded flex items-center space-x-2 cursor-pointer transition-all ${
                                preferredLanguage === lang.id
                                  ? 'bg-cyan-900/50 text-white'
                                  : 'hover:bg-gray-800/70 text-gray-300'
                              }`}
                              onClick={() => setPreferredLanguage(lang.id)}
                            >
                              <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-gray-800 rounded">
                                {lang.icon}
                              </div>
                              <span>{lang.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-cyan-300 mt-2">
                        For algorithm questions, you&apos;ll be able to code in your preferred language
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
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center space-x-2 transition-all"
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(8, 145, 178, 0.4)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={startInterview}
                    >
                      <span>Start Technical Interview</span>
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
              
              {/* Technical Interview Guide */}
              <motion.div 
                className="mt-8 bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg"
                variants={itemVariants}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FileCode className="w-5 h-5 mr-2 text-cyan-400" />
                  <span>Technical Interview Guide</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700 hover:border-cyan-700 transition-all">
                    <h4 className="text-lg font-semibold mb-3 text-cyan-300 flex items-center">
                      <Terminal className="w-4 h-4 mr-2" />
                      Algorithm Interviews
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                        <span>Practice common patterns: sorting, searching, dynamic programming</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                        <span>Analyze time and space complexity of your solutions</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                        <span>Understand fundamental data structures: arrays, linked lists, trees, graphs</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700 hover:border-cyan-700 transition-all">
                    <h4 className="text-lg font-semibold mb-3 text-cyan-300 flex items-center">
                      <Server className="w-4 h-4 mr-2" />
                      System Design Interviews
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                        <span>Clarify requirements and establish constraints first</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                        <span>Consider scalability, reliability, and maintainability</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                        <span>Be prepared to make tradeoffs and justify your decisions</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-cyan-900/20 rounded-xl p-5 border border-cyan-900/30">
                  <h4 className="font-medium text-lg mb-2 text-cyan-300">What to Expect</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-cyan-500 mt-0.5" />
                      <span>45-60 minute session with focused technical challenges</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Cpu className="w-5 h-5 text-cyan-500 mt-0.5" />
                      <span>Interactive coding environment with syntax highlighting and error checking</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <GitBranch className="w-5 h-5 text-cyan-500 mt-0.5" />
                      <span>Multiple approaches encouraged - start simple and improve incrementally</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Sparkles className="w-5 h-5 text-cyan-500 mt-0.5" />
                      <span>Detailed feedback on code quality, algorithmic thinking, and technical communication</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-6 text-gray-300 bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                  <p>Need more practice? Check out our <Link href="#" className="text-cyan-400 hover:text-cyan-300 underline">technical interview resources</Link> for sample problems and study materials.</p>
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
<h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">Your Technical Interview History</h2>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <label htmlFor="sortBy" className="text-sm text-cyan-200">Sort by:</label>
                      <select
                        id="sortBy"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-slate-950/50 border border-cyan-900/50 rounded-lg text-white text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                          className="bg-slate-950/50 border border-cyan-900/50 text-white rounded-lg pl-3 pr-8 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                  <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 rounded-xl p-4 border border-cyan-500/30 shadow-md">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-5 h-5 text-cyan-400" />
                      <h3 className="font-medium">Total Interviews</h3>
                    </div>
                    <p className="text-3xl font-bold text-cyan-200">{interviewHistory.length}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 rounded-xl p-4 border border-blue-500/30 shadow-md">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <h3 className="font-medium">Practice Time</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-200">135 mins</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 rounded-xl p-4 border border-emerald-500/30 shadow-md">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-5 h-5 text-emerald-400" />
                      <h3 className="font-medium">Average Score</h3>
                    </div>
                    <p className="text-3xl font-bold text-emerald-200">86%</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 rounded-xl p-4 border border-purple-500/30 shadow-md">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart className="w-5 h-5 text-purple-400" />
                      <h3 className="font-medium">Problem Types</h3>
                    </div>
                    <p className="text-3xl font-bold text-purple-200">8</p>
                  </div>
                </div>
                
                {/* Interview History Cards */}
                <div className="space-y-6">
                  {getFilteredAndSortedHistory().length > 0 ? (
                    getFilteredAndSortedHistory().map((interview) => (
                      <motion.div 
                        key={interview.id}
                        className="bg-gradient-to-r from-gray-900/70 to-slate-950/50 rounded-xl border border-gray-700 p-6 hover:border-cyan-500/50 transition-all shadow-lg"
                        whileHover={{ y: -4, boxShadow: "0 15px 30px -5px rgba(8, 145, 178, 0.2)" }}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-xl text-cyan-200">{interview.company}</h3>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-300">{interview.role}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4 text-cyan-400" />
                                <span>{interview.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4 text-cyan-400" />
                                <span>{interview.duration}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Code className="w-4 h-4 text-cyan-400" />
                                <span>{interview.type}</span>
                              </div>
                              {interview.language !== 'N/A' && (
                                <div className="flex items-center space-x-1">
                                  <Languages className="w-4 h-4 text-cyan-400" />
                                  <span>{interview.language}</span>
                                </div>
                              )}
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
                                    stroke="#0e7490"
                                    strokeWidth="3"
                                    strokeDasharray="100, 100"
                                    strokeLinecap="round"
                                  />
                                  <path
                                    d="M18 2.0845
                                      a 15.9155 15.9155 0 0 1 0 31.831
                                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#67e8f9"
                                    strokeWidth="3"
                                    strokeDasharray={`${interview.score}, 100`}
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                  <div className="text-2xl font-bold text-cyan-300">{interview.score}</div>
                                  <div className="text-xs text-cyan-400">score</div>
                                </div>
                              </div>
                            </div>
                            
                            <Link href={`/interview/${interview.id}`}>
                              <motion.button
                                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center space-x-2 shadow-md"
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
                            <h4 className="text-sm text-cyan-300 mb-3 flex items-center">
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
                            <h4 className="text-sm text-cyan-300 mb-3 flex items-center">
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
                        
                        <div className="mt-6 bg-slate-950/30 rounded-xl p-4 border border-cyan-900/20">
                          <h4 className="text-sm text-cyan-300 mb-3 flex items-center">
                            <Braces className="w-4 h-4 text-blue-400 mr-2" />
                            Problems Covered
                          </h4>
                          <div className="text-sm text-gray-300 space-y-2">
                            {interview.problems.map((problem, idx) => (
                              <div key={idx} className="flex items-start space-x-3">
                                <span className="text-xs bg-cyan-900/50 text-cyan-300 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5 border border-cyan-700/30">
                                  {idx + 1}
                                </span>
                                <span>{problem}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap justify-between mt-6 pt-5 border-t border-cyan-900/30">
                          <button className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center space-x-2 bg-slate-950/30 px-3 py-2 rounded-lg hover:bg-cyan-900/30 transition-all">
                            <Bookmark className="w-4 h-4" />
                            <span>Save to Favorites</span>
                          </button>
                          
                          <button className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center space-x-2 bg-slate-950/30 px-3 py-2 rounded-lg hover:bg-cyan-900/30 transition-all mt-3 md:mt-0">
                            <SquareTerminal className="w-4 h-4" />
                            <span>Practice Similar Problems</span>
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="bg-gradient-to-r from-gray-900/70 to-slate-950/50 rounded-xl border border-gray-700 p-10 text-center shadow-lg">
                      <div className="flex justify-center mb-6">
                        <FileCode className="w-20 h-20 text-cyan-900/70" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-3 text-cyan-200">No technical interviews found</h3>
                      <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        {filterByCompany ? 
                          `No interviews matching "${filterByCompany}" found. Try a different search.` : 
                          "You haven't completed any technical interviews yet. Start practicing to build your coding skills."}
                      </p>
                      <motion.button
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-6 py-3 rounded-lg font-medium inline-flex items-center space-x-2 shadow-lg"
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(8, 145, 178, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveView('setup')}
                      >
                        <PlusCircle className="w-5 h-5" />
                        <span>Start Your First Technical Interview</span>
                      </motion.button>
                    </div>
                  )}
                </div>
                
                {getFilteredAndSortedHistory().length > 0 && (
                  <div className="mt-10 text-center">
                    <motion.button
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-6 py-3 rounded-xl font-medium inline-flex items-center space-x-2 shadow-lg"
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(8, 145, 178, 0.4)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveView('setup')}
                    >
                      <PlusCircle className="w-5 h-5" />
                      <span>Create New Technical Interview</span>
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