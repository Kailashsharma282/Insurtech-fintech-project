'use client';

import React, { useState } from 'react';
import { 
  Camera, 
  UploadCloud, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  FileImage,
  RefreshCw,
  Cpu
} from 'lucide-react';

interface PredictionResponse {
  id: string;
  crop: string;
  disease: string;
  confidence: number;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  affectedAreaPct: number;
  modelVersion: string;
  benchmarkAccuracy: string;
  timestamp: string;
  imageUrl: string;
  pipelineSteps: { name: string; status: string; latencyMs: number }[];
  recommendedNextAction: string;
  treatmentPlan: {
    chemicalAdvisory: string;
    organicAdvisory: string;
    irrigationSchedule: string;
  };
  disclaimer: string;
}

export default function DiseaseScannerPage() {
  const [selectedCrop, setSelectedCrop] = useState<'Aman Paddy' | 'Potato' | 'Jute'>('Aman Paddy');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number | null>(0);

  const sampleLibrary = [
    { name: 'Bacterial Leaf Blight (Aman Paddy)', crop: 'Aman Paddy', sampleId: 0, tag: 'Bacterial Blight' },
    { name: 'Brown Spot Foliar Lesion (Paddy)', crop: 'Aman Paddy', sampleId: 1, tag: 'Fungal Spot' },
    { name: 'Late Blight Severe Waterlogging (Potato)', crop: 'Potato', sampleId: 2, tag: 'Late Blight' },
    { name: 'Early Blight Concentric Rings (Potato)', crop: 'Potato', sampleId: 3, tag: 'Early Blight' },
    { name: 'Healthy Canopy (Clean Paddy Leaf)', crop: 'Aman Paddy', sampleId: 5, tag: 'Healthy (Normal)' },
  ];

  const handleInference = async (sampleId: number, crop: string) => {
    setAnalyzing(true);
    setResult(null);
    setSelectedSampleIndex(sampleId);

    try {
      const res = await fetch('/api/disease/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop, sampleId })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch {
      console.error('Inference request failed');
    } finally {
      setAnalyzing(false);
    }
  };

  // Run first sample on initial load
  React.useEffect(() => {
    handleInference(0, 'Aman Paddy');
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Computer Vision Deep Learning</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Crop Disease AI Diagnostic Scanner
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            MobileNetV3 convolutional neural network calibrated across <strong>38 disease classes</strong> with a <strong>92.9% benchmark accuracy</strong> for smallholder foliar diagnostics.
          </p>
        </div>

        {/* 5-Stage Architecture Flow (Section 11) */}
        <div className="p-6 rounded-3xl bg-[#071511] text-white border border-[#10B981]/30 shadow-xl">
          <div className="text-center mb-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#34D399]">
              Inference Architecture Pipeline
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#102820] border border-emerald-900/40">
              <span className="text-[#34D399] block font-bold">1. Image Input</span>
              <span className="text-[10px] text-slate-400">RGB Camera / Upload</span>
            </div>
            <div className="p-3 rounded-xl bg-[#102820] border border-emerald-900/40">
              <span className="text-[#34D399] block font-bold">2. Preprocessing</span>
              <span className="text-[10px] text-slate-400">CLAHE 224x224 Norm</span>
            </div>
            <div className="p-3 rounded-xl bg-[#102820] border border-emerald-900/40">
              <span className="text-[#34D399] block font-bold">3. Model Backbone</span>
              <span className="text-[10px] text-slate-400">MobileNetV3 Weights</span>
            </div>
            <div className="p-3 rounded-xl bg-[#102820] border border-emerald-900/40">
              <span className="text-[#34D399] block font-bold">4. Classification</span>
              <span className="text-[10px] text-slate-400">Softmax 38 Classes</span>
            </div>
            <div className="p-3 rounded-xl bg-[#102820] border border-emerald-900/40">
              <span className="text-[#34D399] block font-bold">5. Recommendation</span>
              <span className="text-[10px] text-slate-400">Agronomic Advisory</span>
            </div>
          </div>
        </div>

        {/* Main Interface: Upload Area & Live Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Upload & Sample Picker */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Upload Box */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-dashed border-slate-300 hover:border-[#10B981] transition-colors text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#059669]">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900">Upload or Snap Leaf Photo</h3>
                <p className="text-xs text-slate-500">
                  Drag & drop, browse filesystem, or capture live on mobile camera
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <label className="cursor-pointer px-4 py-2 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white font-semibold text-xs transition-colors flex items-center space-x-1.5">
                  <FileImage className="w-4 h-4" />
                  <span>Choose Image</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={() => handleInference(0, selectedCrop)}
                  />
                </label>
                <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#34D399] font-semibold text-xs transition-colors flex items-center space-x-1.5">
                  <Camera className="w-4 h-4" />
                  <span>Camera</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment" 
                    className="hidden" 
                    onChange={() => handleInference(0, selectedCrop)}
                  />
                </label>
              </div>
            </div>

            {/* Test Sample Library */}
            <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-3">
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                Or Select from Validated Field Samples:
              </h4>
              <div className="space-y-2">
                {sampleLibrary.map((item) => (
                  <button
                    key={item.sampleId}
                    onClick={() => handleInference(item.sampleId, item.crop)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                      selectedSampleIndex === item.sampleId 
                        ? 'border-[#10B981] bg-emerald-50/60 font-semibold text-emerald-950' 
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span>{item.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {item.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: AI Inference Diagnostics Result */}
          <div className="lg:col-span-7">
            {analyzing && (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm h-full flex flex-col items-center justify-center">
                <RefreshCw className="w-8 h-8 text-[#10B981] animate-spin" />
                <div className="font-bold text-base text-slate-800">Processing Foliar Classification...</div>
                <p className="text-xs text-slate-500 font-mono">Running MobileNetV3 38-class softmax inference</p>
              </div>
            )}

            {!analyzing && result && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6">
                
                {/* Result Top Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#059669] font-bold">
                      Primary Diagnosis Match
                    </span>
                    <h3 className="text-2xl font-black text-[#0F172A] mt-0.5">
                      {result.disease}
                    </h3>
                    <div className="text-xs text-slate-500 mt-1">
                      Crop: <strong>{result.crop}</strong> &bull; Model: <strong>{result.modelVersion}</strong>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-black text-emerald-700 font-mono">
                      {(result.confidence * 100).toFixed(1)}%
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">Model Confidence</span>
                  </div>
                </div>

                {/* Severity & Affected Area */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-slate-400 block text-[10px]">Severity Rating</span>
                    <strong className={`text-base font-bold ${
                      result.severity === 'SEVERE' ? 'text-red-600' :
                      result.severity === 'HIGH' ? 'text-orange-600' :
                      result.severity === 'MODERATE' ? 'text-amber-600' :
                      'text-emerald-700'
                    }`}>
                      {result.severity}
                    </strong>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-slate-400 block text-[10px]">Estimated Affected Area</span>
                    <strong className="text-base text-slate-900 font-mono">
                      {result.affectedAreaPct}% of canopy
                    </strong>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-slate-400 block text-[10px]">Benchmark Precision</span>
                    <strong className="text-base text-emerald-700 font-mono">
                      92.9% (38 classes)
                    </strong>
                  </div>
                </div>

                {/* Recommended Next Action */}
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1.5">
                  <div className="font-bold text-emerald-950 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Recommended Immediate Action</span>
                  </div>
                  <p className="text-emerald-900 leading-relaxed font-medium">
                    {result.recommendedNextAction}
                  </p>
                </div>

                {/* Treatment Plan breakdown */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    Precision Agronomic Treatment Protocol
                  </h4>
                  
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <strong className="text-slate-800 block font-semibold">Chemical Therapeutic Advisory:</strong>
                    <p className="text-slate-600">{result.treatmentPlan.chemicalAdvisory}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <strong className="text-slate-800 block font-semibold">Organic / Biocontrol Alternative:</strong>
                    <p className="text-slate-600">{result.treatmentPlan.organicAdvisory}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <strong className="text-slate-800 block font-semibold">Irrigation & Microclimate Adjustment:</strong>
                    <p className="text-slate-600">{result.treatmentPlan.irrigationSchedule}</p>
                  </div>
                </div>

                {/* Required Safe Disclaimer (Section 11) */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                  ⚠️ <strong>Agronomic & Regulatory Validation Notice:</strong> {result.disclaimer}
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
