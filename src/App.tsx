import React, { useState, useCallback } from 'react';
import { Upload, Leaf, AlertCircle, CheckCircle, Loader2, Camera, Sparkles, ArrowRight, Shield, Zap, Brain, Home, FileImage, Info, Github, Mail, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface PredictionResult {
  prediction: string;
  confidence?: number;
  image_url?: string;
}

type Page = 'home' | 'predict' | 'about';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError('');
    } else {
      setError('Please select a valid image file');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const formatDiseaseName = (name: string) => {
    return name
      .replace(/___/g, ' - ')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const getHealthStatus = (prediction: string) => {
    const isHealthy = prediction.toLowerCase().includes('healthy');
    return {
      isHealthy,
      icon: isHealthy ? CheckCircle : AlertCircle,
      color: isHealthy ? 'text-emerald-400' : 'text-red-400',
      bgColor: isHealthy ? 'bg-emerald-500/20' : 'bg-red-500/20',
      borderColor: isHealthy ? 'border-emerald-500/30' : 'border-red-500/30'
    };
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('img', selectedFile);

    try {
      const response = await axios.post('/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult({
        prediction: response.data.prediction || response.data.data,
        image_url: response.data.image_url
      });
    } catch (err) {
      setError('Failed to analyze the image. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const Navigation = () => (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              PlantAI
            </span>
          </div>
          
          <div className="flex items-center space-x-8">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                currentPage === 'home' 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            
            <button
              onClick={() => setCurrentPage('predict')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                currentPage === 'predict' 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <FileImage className="w-4 h-4" />
              <span>Predict</span>
            </button>
            
            <button
              onClick={() => setCurrentPage('about')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                currentPage === 'about' 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );

  const HomePage = () => (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full backdrop-blur-sm border border-emerald-500/30">
                <Leaf className="w-16 h-16 text-emerald-400" />
              </div>
            </div>
            
            <h1 className="text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Plant Disease
              </span>
              <br />
              <span className="text-white">Detection AI</span>
            </h1>
            
            <p className="text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Revolutionary AI-powered plant health analysis using advanced deep learning technology. 
              Detect diseases instantly with just a photo.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage('predict')}
                className="group bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 flex items-center space-x-3"
              >
                <Camera className="w-5 h-5" />
                <span>Start Analysis</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage('about')}
                className="bg-slate-800/50 hover:bg-slate-700/50 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 backdrop-blur-sm border border-slate-600 hover:border-slate-500"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-800/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Cutting-Edge <span className="gradient-text">Features</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Our AI system combines state-of-the-art computer vision with extensive plant pathology knowledge
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Deep Learning AI",
                description: "Advanced neural networks trained on thousands of plant images for accurate disease detection",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Zap,
                title: "Instant Results",
                description: "Get comprehensive plant health analysis in seconds with real-time processing",
                color: "from-emerald-500 to-cyan-500"
              },
              {
                icon: Shield,
                title: "38+ Disease Types",
                description: "Comprehensive detection covering major crops including tomatoes, apples, corn, and more",
                color: "from-orange-500 to-red-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "38+", label: "Disease Types" },
              { number: "99.2%", label: "Accuracy Rate" },
              { number: "10K+", label: "Images Analyzed" },
              { number: "<2s", label: "Analysis Time" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-300 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const PredictPage = () => (
    <div className="pt-32 pb-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            AI Plant Analysis
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Upload a photo of your plant to get instant disease detection and health analysis
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div
              className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 backdrop-blur-sm ${
                isDragOver
                  ? 'border-emerald-400 bg-emerald-500/10 scale-105'
                  : 'border-slate-600 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="p-6 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full border border-emerald-500/30">
                    <Camera className="w-16 h-16 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white mb-3">
                    Drop your plant image here
                  </p>
                  <p className="text-slate-400 text-lg">
                    or click to browse files
                  </p>
                  <p className="text-slate-500 text-sm mt-2">
                    Supports JPG, PNG, WEBP formats
                  </p>
                </div>
              </div>
            </div>

            {previewUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-3xl overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-slate-700 shadow-2xl"
              >
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-medium">Ready for analysis</p>
                </div>
              </motion.div>
            )}

            {selectedFile && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-6 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin mr-3" />
                    <span className="text-lg">Analyzing Plant...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Sparkles className="w-6 h-6 mr-3" />
                    <span className="text-lg">Analyze Plant</span>
                  </div>
                )}
              </motion.button>
            )}
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm"
                >
                  <div className="flex items-center">
                    <AlertCircle className="w-6 h-6 text-red-400 mr-3" />
                    <p className="text-red-300 text-lg">{error}</p>
                  </div>
                </motion.div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 space-y-6 shadow-2xl"
                >
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <Sparkles className="w-8 h-8 text-purple-400 mr-3" />
                    Analysis Results
                  </h3>

                  {(() => {
                    const status = getHealthStatus(result.prediction);
                    const StatusIcon = status.icon;
                    
                    return (
                      <div className={`p-6 rounded-2xl border ${status.bgColor} ${status.borderColor}`}>
                        <div className="flex items-start space-x-4">
                          <StatusIcon className={`w-8 h-8 ${status.color} mt-1 flex-shrink-0`} />
                          <div className="flex-1">
                            <h4 className="font-bold text-white mb-3 text-xl">
                              {status.isHealthy ? '✅ Healthy Plant Detected' : '⚠️ Disease Detected'}
                            </h4>
                            <p className="text-slate-200 text-xl font-medium mb-4">
                              {formatDiseaseName(result.prediction)}
                            </p>
                            {!status.isHealthy && (
                              <div className="bg-slate-700/50 rounded-xl p-4 mt-4">
                                <p className="text-slate-300 font-medium mb-2">💡 Recommendation:</p>
                                <p className="text-slate-400">
                                  Consider consulting with a plant specialist or agricultural expert for proper treatment options and disease management strategies.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-3xl p-8"
            >
              <h3 className="text-2xl font-semibold text-white mb-6">How it works</h3>
              <div className="space-y-4 text-slate-300">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full mr-4"></div>
                  <span className="text-lg">Upload a clear image of your plant leaf</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full mr-4"></div>
                  <span className="text-lg">AI analyzes using deep learning models</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-400 rounded-full mr-4"></div>
                  <span className="text-lg">Get instant disease detection results</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );

  const AboutPage = () => (
    <div className="pt-32 pb-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
              About PlantAI
            </h1>
            <p className="text-2xl text-slate-300 leading-relaxed">
              Revolutionizing agriculture through artificial intelligence and computer vision
            </p>
          </div>

          <div className="space-y-12">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">🎯 Our Mission</h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                We're dedicated to helping farmers, gardeners, and plant enthusiasts detect plant diseases early 
                and accurately using cutting-edge AI technology. Our goal is to reduce crop losses, improve food 
                security, and make plant health monitoring accessible to everyone.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">🔬 The Technology</h2>
              <div className="space-y-4 text-slate-300 text-lg">
                <p>
                  Our AI system is built on advanced deep learning architectures, specifically using MobileNetV2 
                  for efficient and accurate image classification. The model has been trained on thousands of 
                  plant images covering 38+ different disease types across major crops.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-emerald-400 mb-3">🧠 Deep Learning</h3>
                    <p className="text-slate-300">Advanced neural networks trained on extensive plant pathology datasets</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-cyan-400 mb-3">📱 Mobile Optimized</h3>
                    <p className="text-slate-300">Lightweight models optimized for fast inference and real-time analysis</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">🌱 Supported Plants & Diseases</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-slate-300">
                {[
                  'Apple (Scab, Black rot, Cedar rust)',
                  'Tomato (Early blight, Late blight, Leaf mold)',
                  'Corn (Common rust, Northern blight)',
                  'Grape (Black rot, Leaf blight)',
                  'Potato (Early blight, Late blight)',
                  'Pepper (Bacterial spot)',
                  'Peach (Bacterial spot)',
                  'Cherry (Powdery mildew)',
                  'And many more...'
                ].map((plant, index) => (
                  <div key={index} className="bg-slate-700/30 rounded-xl p-4">
                    <span className="text-emerald-400">•</span> {plant}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">📊 Performance Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-400 mb-2">99.2%</div>
                  <div className="text-slate-300">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">&lt;2s</div>
                  <div className="text-slate-300">Analysis Time</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-2">38+</div>
                  <div className="text-slate-300">Disease Types</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">🚀 Future Development</h2>
              <div className="space-y-4 text-slate-300 text-lg">
                <p>We're continuously working to improve our AI models and expand our capabilities:</p>
                <ul className="space-y-3 ml-6">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                    Adding more plant species and disease types
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                    Implementing treatment recommendations
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                    Mobile app development
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                    Integration with IoT sensors
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      <Navigation />
      
      <AnimatePresence mode="wait">
        {currentPage === 'home' && <HomePage key="home" />}
        {currentPage === 'predict' && <PredictPage key="predict" />}
        {currentPage === 'about' && <AboutPage key="about" />}
      </AnimatePresence>
    </div>
  );
};

export default App;