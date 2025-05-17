import React, { useRef, useState, useEffect } from 'react';
import { Upload, Camera, Loader2 } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

interface Disease {
  name: string;
  description: string;
  treatment: string;
}

const diseases: Record<string, Disease> = {
  'healthy': {
    name: 'Healthy Plant',
    description: 'The plant appears to be healthy with no visible signs of disease.',
    treatment: 'Continue regular maintenance and monitoring.'
  },
  'bacterial_blight': {
    name: 'Bacterial Blight',
    description: 'Bacterial infection causing water-soaked lesions that turn brown.',
    treatment: 'Remove infected leaves, improve air circulation, apply copper-based bactericides.'
  },
  'leaf_spot': {
    name: 'Leaf Spot Disease',
    description: 'Fungal infection causing circular spots with dark borders.',
    treatment: 'Remove infected leaves, avoid overhead watering, apply fungicide if severe.'
  },
  'rust': {
    name: 'Rust Disease',
    description: 'Fungal disease causing orange-brown pustules on leaves.',
    treatment: 'Remove infected parts, improve air circulation, apply fungicide.'
  }
};

export function DiseaseDetection() {
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<Disease | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const modelLoadingRef = useRef(false);

  useEffect(() => {
    if (!modelLoadingRef.current) {
      loadModel();
    }
    return () => {
      modelLoadingRef.current = false;
    };
  }, []);

  const loadModel = async () => {
    if (modelLoadingRef.current) return;
    modelLoadingRef.current = true;

    try {
      setLoading(true);
      setModelError(null);

      // Enable WebGL backend for better performance
      await tf.setBackend('webgl');
      
      // Load and warm up the model
      const loadedModel = await mobilenet.load({
        version: 2,
        alpha: 1.0
      });
      
      // Warm up the model with a dummy tensor
      const dummyTensor = tf.zeros([1, 224, 224, 3]);
      await loadedModel.classify(dummyTensor);
      dummyTensor.dispose();

      setModel(loadedModel);
    } catch (error) {
      console.error('Error loading model:', error);
      setModelError('Unable to load the disease detection model. Please check your internet connection and refresh the page.');
      modelLoadingRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  const preprocessImage = async (imageElement: HTMLImageElement): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Use better image rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Draw and resize the image
    ctx.drawImage(imageElement, 0, 0, 224, 224);
    return canvas;
  };

  const classifyImage = async (imageElement: HTMLImageElement) => {
    if (!model) return null;
    
    try {
      // Preprocess the image
      const processedImage = await preprocessImage(imageElement);
      
      // Run classification with higher confidence threshold
      const predictions = await model.classify(processedImage, 1);
      
      if (predictions && predictions.length > 0 && predictions[0].probability > 0.5) {
        const prediction = predictions[0];
        const diseaseKeys = Object.keys(diseases);
        
        // Improved disease mapping logic
        const diseaseKey = diseaseKeys.find(key => {
          const predictionClass = prediction.className.toLowerCase();
          return predictionClass.includes(key) || key.includes(predictionClass);
        }) || 'healthy';
        
        return diseases[diseaseKey];
      }
      return diseases.healthy; // Default to healthy if no confident prediction
    } catch (error) {
      console.error('Error classifying image:', error);
      throw new Error('Failed to analyze the image');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !model) return;

    try {
      setLoading(true);
      setPrediction(null);
      setModelError(null);

      // Validate image size
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB');
      }

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);

      // Process image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = URL.createObjectURL(file);
      await img.decode();
      
      const result = await classifyImage(img);
      setPrediction(result);
      
      // Cleanup
      URL.revokeObjectURL(img.src);
    } catch (error) {
      console.error('Error processing image:', error);
      setModelError(error instanceof Error ? error.message : 'Failed to analyze the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setModelError('Failed to access camera. Please check your camera permissions.');
    }
  };

  const captureImage = async () => {
    if (!videoRef.current || !model) return;

    try {
      setLoading(true);
      setPrediction(null);
      setModelError(null);

      // Create high-quality capture
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Could not get canvas context');
      
      ctx.drawImage(videoRef.current, 0, 0);
      setImagePreview(canvas.toDataURL('image/jpeg', 0.9));

      const result = await classifyImage(canvas as unknown as HTMLImageElement);
      setPrediction(result);

      // Stop camera
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCapturing(false);
    } catch (error) {
      console.error('Error capturing image:', error);
      setModelError('Failed to analyze the captured image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (modelError) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Plant Disease Detection</h2>
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {modelError}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Plant Disease Detection</h2>

      <div className="space-y-6">
        {/* Upload Controls */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            disabled={loading}
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload Image
          </button>

          <button
            onClick={isCapturing ? captureImage : startCamera}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            <Camera className="h-5 w-5 mr-2" />
            {isCapturing ? 'Capture' : 'Use Camera'}
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Camera View */}
        {isCapturing && (
          <div className="relative aspect-video max-w-2xl mx-auto">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full rounded-lg"
            />
          </div>
        )}

        {/* Image Preview */}
        {imagePreview && !isCapturing && (
          <div className="max-w-2xl mx-auto">
            <img
              src={imagePreview}
              alt="Plant"
              className="w-full rounded-lg"
            />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            <span className="ml-2">Analyzing image...</span>
          </div>
        )}

        {/* Results */}
        {prediction && (
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold">{prediction.name}</h3>
            <p className="text-gray-600">{prediction.description}</p>
            <div>
              <h4 className="font-semibold mb-2">Recommended Treatment:</h4>
              <p className="text-gray-600">{prediction.treatment}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}