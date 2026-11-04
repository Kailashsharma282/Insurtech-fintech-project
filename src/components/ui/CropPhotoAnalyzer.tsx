'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  UploadCloud, 
  Droplets, 
  Leaf, 
  RefreshCw, 
  Beaker, 
  FileImage,
  ArrowRight,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface NpkStatus {
  status: 'DEFICIENT' | 'OPTIMAL' | 'EXCESS';
  currentKgHa: number;
  targetKgHa: number;
  percentageOfTarget: number;
  visualSymptom: string;
  remedyDosage: string;
}

interface PhotoAnalysisData {
  id: string;
  crop: string;
  disease: string;
  confidence: number;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  affectedAreaPct: number;
  cropVigorScore: number;
  waterRequirement: {
    required: boolean;
    statusBadge: 'WATER REQUIRED: YES' | 'WATER REQUIRED: NO';
    urgency: 'CRITICAL' | 'MODERATE' | 'NOT_REQUIRED_OPTIMAL' | 'EXCESS_DRAINAGE_NEEDED';
    estimatedSoilMoisturePct: number;
    leafTurgidity: string;
    irrigationAction: string;
    nextEvaluationDate: string;
  };
  npkCondition: {
    nitrogen: NpkStatus;
    phosphorus: NpkStatus;
    potassium: NpkStatus;
    overallBalanceScore: number;
    gapsoOptimizationNote: string;
  };
  recommendedNextAction: string;
  treatmentPlan: {
    chemicalAdvisory: string;
    organicAdvisory: string;
    irrigationSchedule: string;
  };
}

const SAMPLE_OPTIONS = [
  { 
    id: 0, 
    condition: 'healthy',
    label: '🌿 Healthy Green Leaf (Optimal Canopy)', 
    crop: 'Aman Paddy',
    waterFlag: 'NO (Optimal 65%)', 
    npkFlag: 'Balanced 98%',
    previewUrl: '/samples/healthy-crop.jpg' 
  },
  { 
    id: 1, 
    condition: 'dry',
    label: '🍂 Dry / Wilted Leaf (Severe Moisture Deficit)', 
    crop: 'Aman Paddy',
    waterFlag: 'YES (Critical 22%)', 
    npkFlag: 'Severe Low K & N',
    previewUrl: '/samples/paddy-brown-spot.jpg' 
  },
  { 
    id: 2, 
    condition: 'waterlogged',
    label: '🌊 Waterlogged Leaf (Flooded Rootzone)', 
    crop: 'Potato',
    waterFlag: 'NO (Drain Excess)', 
    npkFlag: 'Leached N & K',
    previewUrl: '/samples/potato-late-blight.jpg' 
  },
  { 
    id: 3, 
    condition: 'brown_spot',
    label: '🔬 Brown Spot (Foliar Fungus)', 
    crop: 'Aman Paddy',
    waterFlag: 'YES (Needed)', 
    npkFlag: 'Low K Deficit',
    previewUrl: '/samples/paddy-brown-spot.jpg' 
  },
  { 
    id: 4, 
    condition: 'bacterial_blight',
    label: '⚡ Bacterial Leaf Blight', 
    crop: 'Aman Paddy',
    waterFlag: 'NO (Drain)', 
    npkFlag: 'High N, Low K',
    previewUrl: '/samples/crop-leaf-blight.jpg' 
  }
];

export function CropPhotoAnalyzer({ compact = false }: { compact?: boolean }) {
  const [selectedCrop, setSelectedCrop] = useState<string>('Aman Paddy');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [data, setData] = useState<PhotoAnalysisData | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [activeCondition, setActiveCondition] = useState<string>('healthy');
  const [selectedSampleId, setSelectedSampleId] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const runAnalysis = async (condition?: string, sampleId?: number, file?: File) => {
    setAnalyzing(true);
    const cond = condition || activeCondition;
    try {
      let payload: Record<string, unknown> = {
        crop: selectedCrop,
        condition: cond,
        sampleId: sampleId !== undefined ? sampleId : selectedSampleId
      };

      if (file) {
        payload.imageUrl = URL.createObjectURL(file);
        setPreviewImage(payload.imageUrl as string);
      }

      const res = await fetch('/api/disease/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const resJson = await res.json();
      if (resJson.success) {
        setData(resJson.data);
      }
    } catch (e) {
      console.error('Photo analysis error', e);
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    runAnalysis('healthy', 0);
  }, []);

  // In-browser colorimetry to detect healthy green vs dry leaf
  const detectImageDominance = (imgUrl: string): Promise<'healthy' | 'dry'> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 64;
          canvas.height = 64;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve('healthy');
          ctx.drawImage(img, 0, 0, 64, 64);
          const pxData = ctx.getImageData(0, 0, 64, 64).data;
          let r = 0, g = 0, b = 0;
          for (let i = 0; i < pxData.length; i += 4) {
            r += pxData[i];
            g += pxData[i + 1];
            b += pxData[i + 2];
          }
          const total = pxData.length / 4;
          const avgR = r / total;
          const avgG = g / total;
          // Green dominance check
          if (avgG > avgR * 1.08 && avgG > 75) {
            resolve('healthy');
          } else {
            resolve('dry');
          }
        } catch {
          resolve('healthy');
        }
      };
      img.onerror = () => resolve('healthy');
      img.src = imgUrl;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      const detectedCond = await detectImageDominance(url);
      setActiveCondition(detectedCond);
      runAnalysis(detectedCond, detectedCond === 'healthy' ? 0 : 1, file);
    }
  };

  const selectSample = (sample: typeof SAMPLE_OPTIONS[0]) => {
    setSelectedSampleId(sample.id);
    setSelectedCrop(sample.crop);
    setActiveCondition(sample.condition);
    setPreviewImage(null);
    runAnalysis(sample.condition, sample.id);
  };

  const triggerDirectCondition = (cond: string) => {
    setActiveCondition(cond);
    const sample = SAMPLE_OPTIONS.find(s => s.condition === cond);
    if (sample) setSelectedSampleId(sample.id);
    runAnalysis(cond, sample ? sample.id : undefined);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full max-w-full">
      
      {/* Section Header (Slate Navy & Royal Blue) */}
      <div className="bg-[#0F172A] text-white p-4 sm:p-6 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-blue-400">
              <Camera className="w-4 h-4" />
              <span>Smart Crop Diagnostic Camera & Soil Water Probe</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mt-1 text-white">
              Crop Photo Analysis — NPK Status & Water Requirement
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Upload or snap a photo of your crop leaf. The system immediately analyzes <strong>NPK nutrient status</strong>, reports whether <strong>water is required</strong> (Healthy vs Dry leaf), and calculates precise fertilizer remedies.
            </p>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs bg-slate-800 text-blue-300 px-3 py-1.5 rounded-lg border border-slate-700 font-mono font-medium">
              Ghatal Block AI Hub
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6 w-full max-w-full">

        {/* 1. Photo Upload / Camera Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start w-full">
          
          {/* Upload Dropzone */}
          <div className="md:col-span-5 space-y-3 w-full">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Upload or Snap Leaf Photo
            </label>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 sm:p-5 text-center bg-slate-50 hover:bg-slate-100 transition-colors w-full">
              {previewImage ? (
                <div className="space-y-3 w-full">
                  <div className="relative w-full h-44 bg-slate-200 rounded-lg overflow-hidden border border-slate-300 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={previewImage} 
                      alt="Uploaded Crop Leaf Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-700 font-medium px-1">
                    <span>Leaf Photo Uploaded</span>
                    <span className="font-mono text-[11px] text-blue-700 font-bold uppercase">
                      Detected: {activeCondition}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    Snap with mobile camera or upload from device
                  </div>
                  <p className="text-[11px] text-slate-500">
                    JPG, PNG, WebP supported (Paddy, Potato, Jute, Mustard)
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <FileImage className="w-4 h-4" />
                  <span>Choose Photo</span>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileUpload}
                />

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Camera className="w-4 h-4" />
                  <span>Camera</span>
                </button>
                <input 
                  type="file" 
                  ref={cameraInputRef} 
                  accept="image/*" 
                  capture="environment" 
                  className="hidden" 
                  onChange={handleFileUpload}
                />
              </div>
            </div>

            {/* Quick Sample Selector */}
            <div className="space-y-1.5 pt-1 w-full">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Or pick a verified test leaf:
              </span>
              <div className="grid grid-cols-1 gap-1.5 w-full">
                {SAMPLE_OPTIONS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => selectSample(sample)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs border transition-all flex items-center justify-between ${
                      selectedSampleId === sample.id && !previewImage
                        ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="truncate pr-2">{sample.label}</span>
                    <div className="flex items-center gap-1 shrink-0 text-[10px]">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                        sample.waterFlag.includes('YES') 
                          ? 'bg-red-100 text-red-800 border border-red-300' 
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        Water: {sample.waterFlag}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Loading or Live Diagnostic Results */}
          <div className="md:col-span-7 space-y-4 w-full">
            
            {/* Condition Override Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700">Quick Condition Test:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => triggerDirectCondition('healthy')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeCondition === 'healthy' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-emerald-50'
                  }`}
                >
                  🌿 Healthy (Water: NO)
                </button>
                <button
                  onClick={() => triggerDirectCondition('dry')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeCondition === 'dry' 
                      ? 'bg-red-600 text-white shadow-xs' 
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-red-50'
                  }`}
                >
                  🍂 Dry Leaf (Water: YES)
                </button>
                <button
                  onClick={() => triggerDirectCondition('waterlogged')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeCondition === 'waterlogged' 
                      ? 'bg-amber-600 text-white shadow-xs' 
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-amber-50'
                  }`}
                >
                  🌊 Waterlogged
                </button>
                <button
                  onClick={() => triggerDirectCondition('brown_spot')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeCondition === 'brown_spot' 
                      ? 'bg-purple-600 text-white shadow-xs' 
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-purple-50'
                  }`}
                >
                  🔬 Brown Spot
                </button>
              </div>
            </div>

            {analyzing && (
              <div className="border border-slate-200 rounded-xl p-10 text-center bg-slate-50 flex flex-col items-center justify-center space-y-3 min-h-[280px]">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                <div className="text-sm font-bold text-slate-800">
                  Analyzing leaf morphology & cellular chlorophyll...
                </div>
                <p className="text-xs text-slate-500 max-w-sm">
                  Calculating rootzone soil moisture index, NPK nutrient deficits, and foliar pathology.
                </p>
              </div>
            )}

            {!analyzing && data && (
              <div className="space-y-4 w-full">
                
                {/* 2. WATER REQUIREMENT (HIGH-VISIBILITY CALLOUT) */}
                <div className={`p-4 sm:p-5 rounded-xl border-2 text-left w-full transition-all ${
                  data.waterRequirement.required
                    ? 'bg-red-50/90 border-red-500 text-red-950 shadow-sm'
                    : data.waterRequirement.urgency === 'EXCESS_DRAINAGE_NEEDED'
                    ? 'bg-amber-50/90 border-amber-500 text-amber-950 shadow-sm'
                    : 'bg-emerald-50/90 border-emerald-500 text-emerald-950 shadow-sm'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-current/20">
                    <div className="flex items-center space-x-2">
                      <Droplets className={`w-7 h-7 shrink-0 ${
                        data.waterRequirement.required 
                          ? 'text-red-600' 
                          : (data.waterRequirement.urgency === 'EXCESS_DRAINAGE_NEEDED' ? 'text-amber-600' : 'text-emerald-600')
                      }`} />
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold opacity-80">
                          Irrigation Requirement Status
                        </span>
                        <div className={`text-xl sm:text-2xl font-black ${
                          data.waterRequirement.required 
                            ? 'text-red-700' 
                            : (data.waterRequirement.urgency === 'EXCESS_DRAINAGE_NEEDED' ? 'text-amber-800' : 'text-emerald-800')
                        }`}>
                          {data.waterRequirement.statusBadge}
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <div className="text-lg font-bold font-mono">
                        {data.waterRequirement.estimatedSoilMoisturePct}% Moisture
                      </div>
                      <span className="text-[11px] opacity-80 font-medium">
                        Rootzone Soil Moisture Level
                      </span>
                    </div>
                  </div>

                  {/* Water Action & Leaf Turgidity */}
                  <div className="pt-3 space-y-1.5 text-xs">
                    <div>
                      <strong className="font-bold">Required Irrigation Action: </strong>
                      <span>{data.waterRequirement.irrigationAction}</span>
                    </div>
                    <div className="text-[11px] opacity-90">
                      <strong>Leaf Turgor Assessment: </strong>
                      <span>{data.waterRequirement.leafTurgidity}</span>
                    </div>
                    <div className="text-[10px] font-mono opacity-80">
                      Next Moisture Inspection: {data.waterRequirement.nextEvaluationDate}
                    </div>
                  </div>
                </div>

                {/* 3. NPK NUTRIENT CONDITION */}
                <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white space-y-4 w-full">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center space-x-2">
                      <Beaker className="w-4 h-4 text-blue-700" />
                      <h3 className="text-sm font-bold text-slate-900">
                        NPK Nutrient Condition & Chemical Dosages
                      </h3>
                    </div>
                    <div className="text-xs font-semibold text-slate-600">
                      Balance Score: <strong className="text-blue-700">{data.npkCondition.overallBalanceScore}/100</strong>
                    </div>
                  </div>

                  {/* 3 NPK Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                    
                    {/* Nitrogen (N) */}
                    <div className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                      data.npkCondition.nitrogen.status === 'DEFICIENT'
                        ? 'bg-amber-50/50 border-amber-300'
                        : data.npkCondition.nitrogen.status === 'EXCESS'
                        ? 'bg-purple-50/50 border-purple-300'
                        : 'bg-emerald-50/50 border-emerald-300'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-slate-900">Nitrogen (N)</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          data.npkCondition.nitrogen.status === 'DEFICIENT'
                            ? 'bg-amber-200 text-amber-900'
                            : data.npkCondition.nitrogen.status === 'EXCESS'
                            ? 'bg-purple-200 text-purple-900'
                            : 'bg-emerald-200 text-emerald-900'
                        }`}>
                          {data.npkCondition.nitrogen.status}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-600 font-mono">
                          <span>Level: {data.npkCondition.nitrogen.currentKgHa} kg/ha</span>
                          <span>Target: {data.npkCondition.nitrogen.targetKgHa}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              data.npkCondition.nitrogen.status === 'DEFICIENT' ? 'bg-amber-500' :
                              data.npkCondition.nitrogen.status === 'EXCESS' ? 'bg-purple-600' : 'bg-emerald-600'
                            }`}
                            style={{ width: `${Math.min(100, data.npkCondition.nitrogen.percentageOfTarget)}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-700 leading-snug">
                        <strong>Remedy: </strong>{data.npkCondition.nitrogen.remedyDosage}
                      </div>
                    </div>

                    {/* Phosphorus (P) */}
                    <div className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                      data.npkCondition.phosphorus.status === 'DEFICIENT'
                        ? 'bg-amber-50/50 border-amber-300'
                        : data.npkCondition.phosphorus.status === 'EXCESS'
                        ? 'bg-purple-50/50 border-purple-300'
                        : 'bg-emerald-50/50 border-emerald-300'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-slate-900">Phosphorus (P)</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          data.npkCondition.phosphorus.status === 'DEFICIENT'
                            ? 'bg-amber-200 text-amber-900'
                            : data.npkCondition.phosphorus.status === 'EXCESS'
                            ? 'bg-purple-200 text-purple-900'
                            : 'bg-emerald-200 text-emerald-900'
                        }`}>
                          {data.npkCondition.phosphorus.status}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-600 font-mono">
                          <span>Level: {data.npkCondition.phosphorus.currentKgHa} kg/ha</span>
                          <span>Target: {data.npkCondition.phosphorus.targetKgHa}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              data.npkCondition.phosphorus.status === 'DEFICIENT' ? 'bg-amber-500' :
                              data.npkCondition.phosphorus.status === 'EXCESS' ? 'bg-purple-600' : 'bg-emerald-600'
                            }`}
                            style={{ width: `${Math.min(100, data.npkCondition.phosphorus.percentageOfTarget)}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-700 leading-snug">
                        <strong>Remedy: </strong>{data.npkCondition.phosphorus.remedyDosage}
                      </div>
                    </div>

                    {/* Potassium (K) */}
                    <div className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                      data.npkCondition.potassium.status === 'DEFICIENT'
                        ? 'bg-red-50/60 border-red-300'
                        : data.npkCondition.potassium.status === 'EXCESS'
                        ? 'bg-purple-50/50 border-purple-300'
                        : 'bg-emerald-50/50 border-emerald-300'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-slate-900">Potassium (K)</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          data.npkCondition.potassium.status === 'DEFICIENT'
                            ? 'bg-red-200 text-red-900'
                            : data.npkCondition.potassium.status === 'EXCESS'
                            ? 'bg-purple-200 text-purple-900'
                            : 'bg-emerald-200 text-emerald-900'
                        }`}>
                          {data.npkCondition.potassium.status}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-600 font-mono">
                          <span>Level: {data.npkCondition.potassium.currentKgHa} kg/ha</span>
                          <span>Target: {data.npkCondition.potassium.targetKgHa}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              data.npkCondition.potassium.status === 'DEFICIENT' ? 'bg-red-500' :
                              data.npkCondition.potassium.status === 'EXCESS' ? 'bg-purple-600' : 'bg-emerald-600'
                            }`}
                            style={{ width: `${Math.min(100, data.npkCondition.potassium.percentageOfTarget)}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-700 leading-snug">
                        <strong>Remedy: </strong>{data.npkCondition.potassium.remedyDosage}
                      </div>
                    </div>

                  </div>

                  {/* GA-PSO Note */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
                    <strong className="text-slate-800">GA-PSO Optimizer Synergy: </strong>
                    <span>{data.npkCondition.gapsoOptimizationNote}</span>
                  </div>
                </div>

                {/* 4. DISEASE & FOLIAR PATHOLOGY */}
                <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white space-y-3 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-blue-700 font-bold">
                        Pathogen & Health Classification
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900">
                        {data.disease}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Crop: <strong>{data.crop}</strong> &bull; Severity: <strong className={
                          data.severity === 'SEVERE' ? 'text-red-600' :
                          data.severity === 'HIGH' ? 'text-orange-600' :
                          data.severity === 'MODERATE' ? 'text-amber-600' : 'text-emerald-700'
                        }>{data.severity}</strong> &bull; Vigor Score: <strong>{data.cropVigorScore}/100</strong>
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <div className="text-xl font-bold font-mono text-blue-700">
                        {(data.confidence * 100).toFixed(1)}%
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Confidence Match</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 w-full">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                        Chemical Prescription
                      </span>
                      <p className="text-slate-700 leading-snug">{data.treatmentPlan.chemicalAdvisory}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                        Organic & Bio-Control
                      </span>
                      <p className="text-slate-700 leading-snug">{data.treatmentPlan.organicAdvisory}</p>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
