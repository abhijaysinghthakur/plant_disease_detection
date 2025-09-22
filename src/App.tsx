import React, { useState, useCallback } from 'react';
import { Upload, Leaf, AlertCircle, CheckCircle, Loader2, Camera, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface PredictionResult {
  prediction: string;
  confidence?: number;
  image_url?: string;
}

const App: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Leaf className="w-12 h-12 text-emerald-400 mr-3" />
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Plant Disease AI
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Advanced AI-powered plant disease detection using cutting-edge machine learning technology
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 backdrop-blur-sm ${
                isDragOver
                  ? 'border-emerald-400 bg-emerald-500/10'
                  : 'border-slate-600 bg-slate-800/30 hover:border-slate-500'
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
              
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full">
                    <Camera className="w-12 h-12 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <p className="text-xl font-semibold text-white mb-2">
                    Drop your plant image here
                  </p>
                  <p className="text-slate-400">
                    or click to browse files
                  </p>
                </div>
              </div>
            </div>

            {previewUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-2xl overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-slate-700"
              >
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
              </motion.div>
            )}

            {selectedFile && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Analyzing Plant...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Analyze Plant
                  </div>
                )}
              </motion.button>
            )}
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm"
                >
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                    <p className="text-red-300">{error}</p>
                  </div>
                </motion.div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 space-y-4"
                >
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <Sparkles className="w-6 h-6 text-purple-400 mr-2" />
                    Analysis Results
                  </h3>

                  {(() => {
                    const status = getHealthStatus(result.prediction);
                    const StatusIcon = status.icon;
                    
                    return (
                      <div className={`p-4 rounded-xl border ${status.bgColor} ${status.borderColor}`}>
                        <div className="flex items-start space-x-3">
                          <StatusIcon className={`w-6 h-6 ${status.color} mt-1 flex-shrink-0`} />
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-2">
                              {status.isHealthy ? 'Healthy Plant' : 'Disease Detected'}
                            </h4>
                            <p className="text-slate-300 text-lg">
                              {formatDiseaseName(result.prediction)}
                            </p>
                            {!status.isHealthy && (
                              <p className="text-slate-400 text-sm mt-2">
                                Consider consulting with a plant specialist for treatment options.
                              </p>
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
              className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">How it works</h3>
              <div className="space-y-3 text-slate-300">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                  <span>Upload a clear image of your plant</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                  <span>AI analyzes the image using deep learning</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  <span>Get instant disease detection results</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default App;