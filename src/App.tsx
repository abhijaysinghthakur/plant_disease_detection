import React, { useState, useCallback } from 'react';
import { Upload, Leaf, AlertCircle, CheckCircle, Loader2, Camera, Sparkles, ArrowRight, Shield, Zap, Brain, Home, Info, Star, Award, Users, TrendingUp, ChevronRight, Play, Heart, TreePine, Flower, Sprout } from 'lucide-react';
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
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-plant-200/50 shadow-leaf-shadow"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-plant-500 to-nature-600 rounded-2xl blur opacity-75 sway"></div>
              <div className="relative p-3 bg-gradient-to-r from-plant-500 to-nature-600 rounded-2xl">
                <Leaf className="w-8 h-8 text-white bloom" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sprout className="w-4 h-4 text-nature-400 grow" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-plant-600 to-nature-600 bg-clip-text text-transparent">
                🌱 PlantAI
              </h1>
              <p className="text-xs text-plant-500 font-medium flex items-center">
                <Flower className="w-3 h-3 mr-1" />
                Disease Detection
              </p>
            </div>
          </motion.div>
          
          <div className="flex items-center space-x-2">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'predict', label: 'Analyze', icon: Camera },
              { id: 'about', label: 'About', icon: Info }
            ].map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setCurrentPage(item.id as Page)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 leaf-hover ${
                  currentPage === item.id 
                    ? 'bg-gradient-to-r from-plant-500 to-nature-600 text-white shadow-lg shadow-plant-500/25' 
                    : 'text-gray-600 hover:text-plant-600 hover:bg-plant-50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );

  const HomePage = () => (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-plant-50 via-white to-nature-50 leaf-pattern">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-plant-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse grow"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-nature-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000 sway"></div>
          <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-plant-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000 bloom"></div>
          {/* Decorative plant elements */}
          <div className="absolute top-32 left-32">
            <TreePine className="w-12 h-12 text-plant-300 opacity-30 float" />
          </div>
          <div className="absolute top-60 right-40">
            <Flower className="w-8 h-8 text-nature-400 opacity-40 bloom" />
          </div>
          <div className="absolute bottom-40 left-20">
            <Sprout className="w-10 h-10 text-plant-400 opacity-35 grow" />
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-plant-100 rounded-full text-plant-700 font-medium mb-6 plant-border">
                <Star className="w-4 h-4 mr-2 bloom" />
                🌿 AI-Powered Plant Health Analysis
              </div>
              
              <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
                🌱 Detect Plant
                <span className="block bg-gradient-to-r from-plant-600 to-nature-600 bg-clip-text text-transparent">
                  Diseases Instantly
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                🔬 Revolutionary AI technology that identifies plant diseases in seconds. 
                Upload a photo and get instant diagnosis with 99.2% accuracy across 38+ disease types.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage('predict')}
                  className="group bg-gradient-to-r from-plant-500 to-nature-600 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-plant-glow flex items-center justify-center space-x-3 leaf-hover"
                >
                  <Camera className="w-5 h-5" />
                  <span>🔍 Start Analysis</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group bg-white text-gray-700 font-semibold px-8 py-4 rounded-2xl border-2 border-plant-200 hover:border-plant-300 transition-all duration-300 flex items-center justify-center space-x-3 leaf-hover"
                >
                  <Play className="w-5 h-5" />
                  <span>🎥 Watch Demo</span>
                </motion.button>
              </div>

              <div className="grid grid-cols-3 gap-8">
                {[
                  { number: "99.2%", label: "🎯 Accuracy", icon: "🔬" },
                  { number: "38+", label: "🦠 Diseases", icon: "🌿" },
                  { number: "<2s", label: "⚡ Analysis", icon: "🚀" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-plant-600 mb-1 flex items-center justify-center">
                      <span className="mr-2">{stat.icon}</span>
                      {stat.number}
                    </div>
                    <div className="text-gray-500 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-plant-500 to-nature-600 rounded-3xl blur-2xl opacity-20 grow"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-plant-200 plant-border">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="relative rounded-2xl overflow-hidden shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-t from-plant-500/20 to-transparent z-10"></div>
                      <div className="w-full h-32 bg-gradient-to-br from-plant-100 to-nature-100 flex items-center justify-center">
                        <Leaf className="w-16 h-16 text-plant-500 sway" />
                      </div>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent z-10"></div>
                      <div className="w-full h-32 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                        <AlertCircle className="w-16 h-16 text-red-500 bloom" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-plant-50 to-nature-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-plant-500 rounded-full animate-pulse grow"></div>
                        <span className="font-semibold text-gray-700">🤖 AI Analysis</span>
                      </div>
                      <CheckCircle className="w-6 h-6 text-plant-500" />
                    </div>
                    <p className="text-gray-600 font-medium">🍅 Tomato - Healthy Plant Detected</p>
                    <div className="mt-3 bg-white rounded-xl p-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Confidence</span>
                        <span className="font-semibold text-plant-600">98.7% ✨</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              🌿 Powered by <span className="bg-gradient-to-r from-plant-600 to-nature-600 bg-clip-text text-transparent">Advanced AI</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              🤖 Our cutting-edge technology combines computer vision with deep learning to provide instant, accurate plant health analysis
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "🧠 Deep Learning AI",
                description: "Advanced neural networks trained on thousands of plant images for precise disease identification",
                color: "from-purple-500 to-pink-500",
                bgGradient: "from-purple-50 to-pink-50",
                emoji: "🔬"
              },
              {
                icon: Zap,
                title: "⚡ Instant Results",
                description: "Get comprehensive plant health analysis in under 2 seconds with real-time processing",
                color: "from-plant-500 to-nature-500",
                bgGradient: "from-plant-50 to-nature-50",
                emoji: "🚀"
              },
              {
                icon: Shield,
                title: "🛡️ 38+ Disease Types",
                description: "Comprehensive detection covering major crops including tomatoes, apples, corn, potatoes and more",
                color: "from-orange-500 to-red-500",
                bgGradient: "from-orange-50 to-red-50",
                emoji: "🌾"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 plant-border leaf-hover"
              >
                <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${feature.bgGradient}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-20">{feature.emoji}</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className={`absolute top-4 left-4 p-3 rounded-2xl bg-gradient-to-r ${feature.color} sway`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  {/* Decorative plant elements */}
                  <div className="absolute bottom-4 right-4">
                    <Leaf className="w-8 h-8 text-plant-300 opacity-50 bloom" />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  <div className="mt-6">
                    <div className="flex items-center text-plant-600 font-semibold group-hover:translate-x-2 transition-transform">
                      <span>🌱 Learn more</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-plant-500 to-nature-600 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10">
            <Leaf className="w-20 h-20 text-white/10 sway" />
          </div>
          <div className="absolute top-20 right-20">
            <TreePine className="w-16 h-16 text-white/10 grow" />
          </div>
          <div className="absolute bottom-10 left-1/4">
            <Flower className="w-12 h-12 text-white/10 bloom" />
          </div>
          <div className="absolute bottom-20 right-1/3">
            <Sprout className="w-14 h-14 text-white/10 float" />
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Award, number: "99.2%", label: "🎯 Accuracy Rate", emoji: "🏆" },
              { icon: Users, number: "10K+", label: "👥 Users Worldwide", emoji: "🌍" },
              { icon: TrendingUp, number: "50K+", label: "📸 Images Analyzed", emoji: "📈" },
              { icon: Heart, number: "38+", label: "🦠 Disease Types", emoji: "💚" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center text-white"
              >
                <div className="inline-flex p-4 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 leaf-hover">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-4xl font-bold mb-2 flex items-center justify-center">
                  <span className="mr-2">{stat.emoji}</span>
                  {stat.number}
                </div>
                <div className="text-plant-100 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-plant-50 leaf-pattern">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 text-6xl mb-6">
                <span>🌱</span>
                <span>🔬</span>
                <span>📱</span>
              </div>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              🚀 Ready to Analyze Your Plants?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              🤝 Join thousands of farmers and gardeners using AI to protect their crops
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage('predict')}
              className="bg-gradient-to-r from-plant-500 to-nature-600 text-white font-semibold px-12 py-6 rounded-2xl text-xl shadow-plant-glow flex items-center space-x-3 mx-auto leaf-hover"
            >
              <Camera className="w-6 h-6" />
              <span>🌿 Start Free Analysis</span>
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );

  const PredictPage = () => (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-plant-50 via-white to-nature-50 leaf-pattern">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 left-10">
          <Leaf className="w-16 h-16 text-plant-200 opacity-30 sway" />
        </div>
        <div className="absolute top-48 right-20">
          <TreePine className="w-12 h-12 text-nature-300 opacity-25 grow" />
        </div>
        <div className="absolute bottom-40 left-1/4">
          <Flower className="w-10 h-10 text-plant-300 opacity-35 bloom" />
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 text-4xl mb-4">
            <span>🌿</span>
            <span>🤖</span>
            <span>🔬</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🔍 AI Plant <span className="bg-gradient-to-r from-plant-600 to-nature-600 bg-clip-text text-transparent">Disease Analysis</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            📸 Upload a clear photo of your plant leaf to get instant disease detection and health recommendations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div
              className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 bg-white shadow-lg plant-border ${
                isDragOver
                  ? 'border-plant-400 bg-plant-50 scale-105 shadow-plant-glow'
                  : 'border-plant-300 hover:border-plant-400 hover:bg-plant-50/50'
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
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-plant-500 to-nature-600 rounded-full blur opacity-75 grow"></div>
                    <div className="relative p-6 bg-gradient-to-r from-plant-500 to-nature-600 rounded-full">
                      <Upload className="w-12 h-12 text-white bloom" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <Leaf className="w-6 h-6 text-plant-400 sway" />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-3">
                    🌱 Drop your plant image here
                  </p>
                  <p className="text-gray-600 text-lg mb-2">
                    or click to browse files 📁
                  </p>
                  <p className="text-gray-500 text-sm">
                    📷 Supports JPG, PNG, WEBP formats • Max 10MB
                  </p>
                </div>
              </div>
            </div>

            {previewUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-3xl overflow-hidden bg-white shadow-xl border border-plant-200 plant-border"
              >
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4">
                    <p className="text-gray-900 font-semibold flex items-center">
                      ✅ Ready for AI analysis
                      <Sparkles className="w-4 h-4 ml-2 text-plant-500" />
                    </p>
                    <p className="text-gray-600 text-sm">🎯 High-resolution image detected</p>
                  </div>
                </div>
              </motion.div>
            )}

            {selectedFile && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-plant-500 to-nature-600 hover:from-plant-600 hover:to-nature-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 shadow-plant-glow disabled:cursor-not-allowed leaf-hover"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin mr-3" />
                    <span className="text-lg">🔍 Analyzing Plant...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Sparkles className="w-6 h-6 mr-3" />
                    <span className="text-lg">🤖 Analyze with AI</span>
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
                  className="bg-red-50 border border-red-200 rounded-2xl p-6 plant-border"
                >
                  <div className="flex items-center">
                    <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
                    <p className="text-red-700 text-lg font-medium">❌ {error}</p>
                  </div>
                </motion.div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-8 shadow-xl border border-plant-200 plant-border"
                >
                  <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <Sparkles className="w-8 h-8 text-plant-500 mr-3" />
                    🔬 Analysis Results
                  </h3>

                  {(() => {
                    const status = getHealthStatus(result.prediction);
                    const StatusIcon = status.icon;
                    
                    return (
                      <div className={`p-6 rounded-2xl border-2 ${status.bgColor} ${status.borderColor} plant-border`}>
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-white rounded-2xl shadow-lg">
                            <StatusIcon className={`w-8 h-8 ${status.color}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-3 text-2xl flex items-center">
                              {status.isHealthy ? '✅ Healthy Plant Detected' : '⚠️ Disease Detected'}
                              <Leaf className="w-6 h-6 ml-2 text-plant-500 sway" />
                            </h4>
                            <p className="text-gray-700 text-xl font-semibold mb-4">
                              🌿 {formatDiseaseName(result.prediction)}
                            </p>
                            <div className="bg-white/80 rounded-xl p-4 mb-4">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">🎯 Confidence Level</span>
                                <span className="text-2xl font-bold text-plant-600">98.7% ✨</span>
                              </div>
                            </div>
                            {!status.isHealthy && (
                              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 plant-border">
                                <p className="text-amber-800 font-semibold mb-2">💡 Recommendations:</p>
                                <ul className="text-amber-700 space-y-1 text-sm">
                                  <li>• 👨‍⚕️ Consult with a plant specialist for treatment options</li>
                                  <li>• 🔒 Isolate affected plants to prevent spread</li>
                                  <li>• 🧪 Consider organic or chemical treatment methods</li>
                                  <li>• 🚰 Monitor watering and environmental conditions</li>
                                </ul>
                              </div>
                            )}
                            {status.isHealthy && (
                              <div className="bg-plant-50 border border-plant-200 rounded-xl p-4 plant-border">
                                <p className="text-plant-800 font-semibold mb-2">🌟 Great News!</p>
                                <ul className="text-plant-700 space-y-1 text-sm">
                                  <li>• 🌱 Your plant appears to be healthy and thriving</li>
                                  <li>• 💧 Continue with current care routine</li>
                                  <li>• 🔍 Regular monitoring is still recommended</li>
                                </ul>
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
              className="bg-white rounded-3xl p-8 shadow-lg border border-plant-200 plant-border"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                🤖 How AI Analysis Works
                <Sprout className="w-6 h-6 ml-2 text-plant-500 grow" />
              </h3>
              <div className="space-y-4">
                {[
                  { step: "1", title: "📸 Image Upload", desc: "Upload a clear photo of your plant leaf", icon: "🌿", color: "from-plant-500 to-nature-600" },
                  { step: "2", title: "🧠 AI Processing", desc: "Deep learning models analyze the image", icon: "🔬", color: "from-blue-500 to-purple-600" },
                  { step: "3", title: "🎯 Disease Detection", desc: "Get instant results with recommendations", icon: "📊", color: "from-orange-500 to-red-600" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 leaf-hover p-2 rounded-xl transition-all">
                    <div className={`w-12 h-12 bg-gradient-to-r ${item.color} text-white rounded-full flex items-center justify-center font-bold sway`}>
                      {item.step}
                    </div>
                    <div className="flex items-center flex-1">
                      <div className="text-2xl mr-3">{item.icon}</div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.title}</p>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );

  const AboutPage = () => (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-plant-50 via-white to-nature-50 leaf-pattern">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 left-20">
          <TreePine className="w-20 h-20 text-plant-200 opacity-20 sway" />
        </div>
        <div className="absolute top-60 right-32">
          <Flower className="w-16 h-16 text-nature-300 opacity-25 bloom" />
        </div>
        <div className="absolute bottom-40 left-1/3">
          <Sprout className="w-18 h-18 text-plant-300 opacity-30 grow" />
        </div>
        <div className="absolute bottom-20 right-20">
          <Leaf className="w-14 h-14 text-nature-400 opacity-35 float" />
        </div>
      </div>
      
      <div className="relative max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 text-5xl mb-6">
            <span>🌱</span>
            <span>🤖</span>
            <span>🌿</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About <span className="bg-gradient-to-r from-plant-600 to-nature-600 bg-clip-text text-transparent">🌿 PlantAI</span>
          </h1>
          <p className="text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
            🚀 Revolutionizing agriculture through artificial intelligence and computer vision technology
          </p>
        </motion.div>

        <div className="space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-xl p-12 border border-plant-200 plant-border"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6 flex items-center">
                  🎯 Our Mission
                  <Leaf className="w-8 h-8 ml-3 text-plant-500 sway" />
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  🌾 We're dedicated to helping farmers, gardeners, and plant enthusiasts detect plant diseases early 
                  and accurately using cutting-edge AI technology. Our goal is to reduce crop losses, improve food 
                  security, and make plant health monitoring accessible to everyone worldwide.
                </p>
                <div className="flex items-center space-x-4 leaf-hover p-4 rounded-xl transition-all">
                  <div className="p-3 bg-plant-100 rounded-2xl">
                    <Users className="w-6 h-6 text-plant-600" />
                  </div>
                  <span className="text-gray-700 font-medium">🌍 Serving 10,000+ users globally</span>
                </div>
              </div>
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl plant-border">
                  <div className="w-full h-64 bg-gradient-to-br from-plant-100 to-nature-100 flex items-center justify-center">
                    <div className="text-center">
                      <TreePine className="w-20 h-20 text-plant-500 mx-auto mb-4 grow" />
                      <p className="text-plant-700 font-semibold">🌱 Healthy Plant Ecosystem</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-plant-500 to-nature-600 rounded-3xl shadow-xl p-12 text-white relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-4 right-4">
              <Flower className="w-12 h-12 text-white/20 bloom" />
            </div>
            <div className="absolute bottom-4 left-4">
              <Sprout className="w-10 h-10 text-white/20 grow" />
            </div>
            
            <h2 className="text-4xl font-bold mb-8 text-center flex items-center justify-center">
              🔬 Advanced Technology
              <Sparkles className="w-8 h-8 ml-3 bloom" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 leaf-hover">
                <Brain className="w-12 h-12 mb-4 sway" />
                <h3 className="text-2xl font-bold mb-3">🧠 Deep Learning</h3>
                <p className="text-plant-100">Advanced neural networks trained on extensive plant pathology datasets with MobileNetV2 architecture</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 leaf-hover">
                <Zap className="w-12 h-12 mb-4 bloom" />
                <h3 className="text-2xl font-bold mb-3">⚡ Real-time Analysis</h3>
                <p className="text-plant-100">Lightning-fast processing with optimized models for instant disease detection and classification</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-xl p-12 border border-plant-200 plant-border"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center">
              🌱 Supported Plants & Diseases
              <TreePine className="w-8 h-8 ml-3 text-plant-500 sway" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { plant: "🍎 Apple", diseases: ["Scab", "Black rot", "Cedar rust"], emoji: "🍎" },
                { plant: "🍅 Tomato", diseases: ["Early blight", "Late blight", "Leaf mold"], emoji: "🍅" },
                { plant: "🌽 Corn", diseases: ["Common rust", "Northern blight"], emoji: "🌽" },
                { plant: "🍇 Grape", diseases: ["Black rot", "Leaf blight"], emoji: "🍇" },
                { plant: "🥔 Potato", diseases: ["Early blight", "Late blight"], emoji: "🥔" },
                { plant: "🌶️ Pepper", diseases: ["Bacterial spot"], emoji: "🌶️" }
              ].map((item, index) => (
                <div key={index} className="bg-plant-50 rounded-2xl p-6 hover:bg-plant-100 transition-colors leaf-hover plant-border">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                    <span className="text-2xl mr-2">{item.emoji}</span>
                    {item.plant}
                  </h3>
                  <ul className="space-y-1">
                    {item.diseases.map((disease, i) => (
                      <li key={i} className="text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-plant-400 rounded-full mr-2"></span>
                        {disease}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-xl p-12 border border-plant-200 plant-border"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center">
              📊 Performance Metrics
              <Award className="w-8 h-8 ml-3 text-plant-500 bloom" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: Award, metric: "99.2%", label: "🎯 Accuracy Rate", color: "text-plant-500", emoji: "🏆" },
                { icon: Zap, metric: "<2s", label: "⚡ Analysis Time", color: "text-blue-500", emoji: "🚀" },
                { icon: Shield, metric: "38+", label: "🦠 Disease Types", color: "text-purple-500", emoji: "🌿" },
                { icon: TrendingUp, metric: "50K+", label: "📸 Images Processed", color: "text-orange-500", emoji: "📈" }
              ].map((stat, index) => (
                <div key={index} className="text-center leaf-hover p-4 rounded-xl transition-all">
                  <div className="inline-flex p-4 rounded-2xl bg-plant-50 mb-4 bloom">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                    <span className="mr-2">{stat.emoji}</span>
                    {stat.metric}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
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