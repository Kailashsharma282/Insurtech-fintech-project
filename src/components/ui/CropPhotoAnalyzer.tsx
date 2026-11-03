'use client';

import React, { useState, useRef } from 'react';
import { 
  Camera, 
  UploadCloud, 
  Droplets, 
  AlertTriangle, 
  CheckCircle2, 
  Leaf, 
  RefreshCw, 
  Beaker, 
  Check, 
  XCircle,
  FileImage,
  ArrowRight
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
    label: 'Aman Paddy — Bacterial Blight', 
    crop: 'Aman Paddy',
    waterFlag: 'NO (Drain)', 
    npkFlag: 'High N, Low K',
    previewUrl: '/samples/crop-leaf-blight.jpg' 
  },
  { 
    id: 1, 
    label: 'Aman Paddy — Brown Spot (Moisture Deficit)', 
    crop: 'Aman Paddy',
    waterFlag: 'YES (Needed)', 
    npkFlag: 'Severe Low K & N',
    previewUrl: '/samples/paddy-brown-spot.jpg' 
  },
  { 
    id: 2, 
    label: 'Potato — Late Blight (Waterlogged Soil)', 
    crop: 'Potato',
    waterFlag: 'NO (Flooded)', 
    npkFlag: 'Leached N & K',
    previewUrl: '/samples/potato-late-blight.jpg' 
  },
  { 
    id: 3, 
    label: 'Potato — Early Blight (Dry Soil 26%)', 
    crop: 'Potato',
    waterFlag: 'YES (Urgent)', 
    npkFlag: 'Low N & K',
    previewUrl: '/samples/potato-early-blight.jpg' 
  },
  { 
    id: 5, 
    label: 'Aman Paddy — Healthy Normal Canopy', 
    crop: 'Aman Paddy',
    waterFlag: 'NO (Optimal)', 
    npkFlag: 'NPK Balanced (97%)',
    previewUrl: '/samples/healthy-crop.jpg' 
  }
];

export function CropPhotoAnalyzer({ compact = false }: { compact?: boolean }) {
  const [selectedCrop, setSelectedCrop] = useState<string>('Aman Paddy');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [data, setData] = useState<PhotoAnalysisData | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<number>(1); // Default to Brown Spot (Water Required: YES)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Trigger inference
  const runAnalysis = async (sampleId?: number, file?: File) => {
    setAnalyzing(true);
    try {
      let payload: Record<string, unknown> = {
        crop: selectedCrop,
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

  // Initial load
  React.useEffect(() => {
    runAnalysis(1);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      runAnalysis(0, file);
    }
  };

  const selectSample = (sample: typeof SAMPLE_OPTIONS[0]) => {
    setSelectedSampleId(sample.id);
    setSelectedCrop(sample.crop);
    setPreviewImage(null);
    runAnalysis(sample.id);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Section Header */}
      <div className="bg-emerald-900 text-white p-5 sm:p-6 border-b border-emerald-950">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <Camera className="w-4 h-4" />
              <span>Smart Crop Diagnostic Camera</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mt-1">
              Crop Photo Analysis — NPK & Water Requirement
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
              Upload or snap a photo of your crop leaf. The system instantly detects <strong>NPK nutrient status</strong>, tells you whether <strong>water is required</strong>, and diagnoses disease threats.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-800 text-emerald-200 px-3 py-1 rounded-full font-mono font-medium">
              Ghatal Block AI Hub
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">

        {/* 1. Photo Upload / Camera Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Upload Dropzone */}
          <div className="md:col-span-5 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Upload or Take Photo
            </label>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
              {previewImage ? (
                <div className="space-y-3">
                  <div className="relative w-full h-40 bg-slate-200 rounded-lg overflow-hidden border border-slate-300 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={previewImage} 
                      alt="Uploaded Crop Leaf Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-slate-600 font-medium">Leaf Photo Uploaded</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    Snap with mobile camera or upload from gallery
                  </div>
                  <p className="text-[11px] text-slate-500">
                    JPG, PNG, WebP supported (Paddy, Potato, Jute, Mustard)
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
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
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
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
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Or pick a verified field photo:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {SAMPLE_OPTIONS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => selectSample(sample)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs border transition-all flex items-center justify-between ${
                      selectedSampleId === sample.id && !previewImage
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="truncate pr-2">{sample.label}</span>
                    <div className="flex items-center gap-1 shrink-0 text-[10px]">
                      <span className={`px-1.5 py-0.5 rounded font-mono ${
                        sample.waterFlag.includes('YES') ? 'bg-red-100 text-red-800 font-bold' : 'bg-slate-100 text-slate-700'
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
          <div className="md:col-span-7 space-y-4">
            {analyzing && (
              <div className="border border-slate-200 rounded-xl p-12 text-center bg-slate-50 flex flex-col items-center justify-center space-y-3 min-h-[300px]">
                <RefreshCw className="w-8 h-8 text-emerald-700 animate-spin" />
                <div className="text-sm font-bold text-slate-800">
                  Analyzing leaf morphology & cellular chlorophyll...
                </div>
                <p className="text-xs text-slate-500 max-w-sm">
                  Calculating soil moisture index, NPK nutrient deficits, and foliar pathology.
                </p>
              </div>
            )}

            {!analyzing && data && (
              <div className="space-y-5">
                
                {/* 2. WATER REQUIREMENT (HIGH-VISIBILITY CALLOUT) */}
                <div className={`p-5 rounded-xl border-2 text-left ${
                  data.waterRequirement.required
                    ? 'bg-red-50 border-red-500 text-red-950'
                    : data.waterRequirement.urgency === 'EXCESS_DRAINAGE_NEEDED'
                    ? 'bg-amber-50 border-amber-500 text-amber-950'
                    : 'bg-emerald-50 border-emerald-600 text-emerald-950'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-current/20">
                    <div className="flex items-center space-x-2">
                      <Droplets className={`w-6 h-6 ${
                        data.waterRequirement.required ? 'text-red-600' : 'text-emerald-700'
                      }`} />
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold opacity-80">
                          Irrigation Requirement Status
                        </span>
                        <div className={`text-xl sm:text-2xl font-black ${
                          data.waterRequirement.required ? 'text-red-700' : 'text-emerald-800'
                        }`}>
                          {data.waterRequirement.statusBadge}
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-lg font-bold font-mono">
                        {data.waterRequirement.estimatedSoilMoisturePct}% Moisture
                      </div>
                      <span className="text-[11px] opacity-80 font-medium">
                        Soil Moisture Level
                      </span>
                    </div>
                  </div>

                  {/* Water Action & Leaf Turgidity */}
                  <div className="pt-3 space-y-2 text-xs">
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
                <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center space-x-2">
                      <Beaker className="w-4 h-4 text-emerald-800" />
                      <h3 className="text-sm font-bold text-slate-900">
                        NPK Nutrient Condition & Chemical Dosages
                      </h3>
                    </div>
                    <div className="text-xs font-semibold text-slate-600">
                      Balance Score: <strong className="text-emerald-800">{data.npkCondition.overallBalanceScore}/100</strong>
                    </div>
                  </div>

                  {/* 3 NPK Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
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
                        ? 'bg-amber-50/50 border-amber-300'
                        : data.npkCondition.potassium.status === 'EXCESS'
                        ? 'bg-purple-50/50 border-purple-300'
                        : 'bg-emerald-50/50 border-emerald-300'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-slate-900">Potassium (K)</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          data.npkCondition.potassium.status === 'DEFICIENT'
                            ? 'bg-amber-200 text-amber-900'
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
                              data.npkCondition.potassium.status === 'DEFICIENT' ? 'bg-amber-500' :
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
                <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-800 font-bold">
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

                    <div className="text-left sm:text-right">
                      <div className="text-xl font-bold font-mono text-emerald-800">
                        {(data.confidence * 100).toFixed(1)}%
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Confidence Match</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
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

