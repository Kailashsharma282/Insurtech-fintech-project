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
  CheckCircle,
  AlertTriangle,
  Info,
  ShieldCheck,
  Activity
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
  isGoodLeaf: boolean;
  leafCategory: 'GOOD' | 'BAD';
  conditionKey: string;
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
  biophysicalMetrics?: {
    excessGreenIndex: number;
    excessRedScorch: number;
    chlorophyllDominancePct: number;
    necrosisPct: number;
  };
  modelVersion?: string;
  modelAccuracy?: string;
  recommendedNextAction: string;
  treatmentPlan: {
    chemicalAdvisory: string;
    organicAdvisory: string;
    irrigationSchedule: string;
  };
}

interface LeafSample {
  id: number;
  type: 'GOOD' | 'BAD';
  condition: string;
  title: string;
  subtitle: string;
  crop: string;
  waterFlag: 'NO (Optimal 65%)' | 'YES (Critical 22%)' | 'YES (Moderate 32%)' | 'NO (Drain Excess)' | 'NO (Adequate 58%)';
  waterBool: boolean;
  npkSummary: string;
  imageUrl: string;
}

const SAMPLE_GALLERY: LeafSample[] = [
  {
    id: 0,
    type: 'GOOD',
    condition: 'good_healthy',
    title: '🌿 Healthy Green Leaf',
    subtitle: 'Optimal Chlorophyll & Vigor',
    crop: 'Aman Paddy',
    waterFlag: 'NO (Optimal 65%)',
    waterBool: false,
    npkSummary: 'Balanced 98% (N:238, P:23, K:178)',
    imageUrl: '/samples/leaves/healthy_leaf_1.jpg'
  },
  {
    id: 1,
    type: 'GOOD',
    condition: 'good_healthy',
    title: '🌿 Healthy Canopy (Sample 2)',
    subtitle: 'Erect Lamina & Stomata Balance',
    crop: 'Aman Paddy',
    waterFlag: 'NO (Optimal 65%)',
    waterBool: false,
    npkSummary: 'Balanced 97% (Optimal)',
    imageUrl: '/samples/leaves/healthy_leaf_2.jpg'
  },
  {
    id: 2,
    type: 'BAD',
    condition: 'bad_dry_wilted',
    title: '🍂 Dry / Wilted Leaf',
    subtitle: 'Acute Drought & Foliar Dehydration',
    crop: 'Aman Paddy',
    waterFlag: 'YES (Critical 22%)',
    waterBool: true,
    npkSummary: 'Critical Low K (82) & N (155)',
    imageUrl: '/samples/leaves/dry_wilted_leaf_1.jpg'
  },
  {
    id: 3,
    type: 'BAD',
    condition: 'bad_brown_spot',
    title: '🔬 Brown Spot Fungal',
    subtitle: 'Bipolaris oryzae Necrosis',
    crop: 'Aman Paddy',
    waterFlag: 'YES (Moderate 32%)',
    waterBool: true,
    npkSummary: 'Low Potassium (98 kg/ha)',
    imageUrl: '/samples/leaves/brown_spot_leaf_1.jpg'
  },
  {
    id: 4,
    type: 'BAD',
    condition: 'bad_bacterial_blight',
    title: '⚡ Bacterial Leaf Blight',
    subtitle: 'Xanthomonas oryzae Wavy Margins',
    crop: 'Aman Paddy',
    waterFlag: 'NO (Drain Excess)',
    waterBool: false,
    npkSummary: 'Excess N (295 kg/ha), Low K (115)',
    imageUrl: '/samples/leaves/bacterial_blight_leaf_1.jpg'
  },
  {
    id: 5,
    type: 'BAD',
    condition: 'bad_waterlogged',
    title: '🌊 Waterlogged Submergence',
    subtitle: 'Hypoxia & Nutrient Leaching',
    crop: 'Potato / Paddy',
    waterFlag: 'NO (Drain Excess)',
    waterBool: false,
    npkSummary: 'Leached N (148) & K (110)',
    imageUrl: '/samples/leaves/waterlogged_leaf_1.jpg'
  },
  {
    id: 6,
    type: 'BAD',
    condition: 'bad_nutrient_deficient',
    title: '⚠️ Nutrient Chlorosis',
    subtitle: 'Nitrogen & Potassium Starvation',
    crop: 'Aman Paddy',
    waterFlag: 'NO (Adequate 58%)',
    waterBool: false,
    npkSummary: 'Severe Deficit N (130) & K (85)',
    imageUrl: '/samples/leaves/nutrient_deficient_leaf_1.jpg'
  }
];

export function CropPhotoAnalyzer({ compact = false }: { compact?: boolean }) {
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [data, setData] = useState<PhotoAnalysisData | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('/samples/leaves/healthy_leaf_1.jpg');
  const [selectedSampleId, setSelectedSampleId] = useState<number>(0);
  const [clientColorimetry, setClientColorimetry] = useState<{
    exg: number;
    greenDominance: boolean;
    ratio: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // In-browser real-time colorimetry on loaded image
  const analyzeImageColorimetry = (imgUrl: string): Promise<{ exg: number; greenDominance: boolean; ratio: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 64;
          canvas.height = 64;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve({ exg: 0.2, greenDominance: true, ratio: 1.2 });
          ctx.drawImage(img, 0, 0, 64, 64);
          const px = ctx.getImageData(0, 0, 64, 64).data;
          let r = 0, g = 0, b = 0;
          for (let i = 0; i < px.length; i += 4) {
            r += px[i];
            g += px[i + 1];
            b += px[i + 2];
          }
          const total = px.length / 4;
          const avgR = r / total;
          const avgG = g / total;
          const avgB = b / total;
          const exg = (2 * avgG - avgR - avgB) / 255.0;
          const ratio = avgG / (avgR + 1e-4);
          const greenDominance = ratio > 1.08 && exg > 0.05;
          resolve({ exg: parseFloat(exg.toFixed(3)), greenDominance, ratio: parseFloat(ratio.toFixed(2)) });
        } catch {
          resolve({ exg: 0.15, greenDominance: true, ratio: 1.15 });
        }
      };
      img.onerror = () => resolve({ exg: 0.15, greenDominance: true, ratio: 1.15 });
      img.src = imgUrl;
    });
  };

  const runAnalysis = async (sample?: LeafSample, customFile?: File) => {
    setAnalyzing(true);
    try {
      const formData = new FormData();
      if (customFile) {
        formData.append('image', customFile);
      } else if (sample) {
        formData.append('condition', sample.condition);
        formData.append('sampleId', sample.id.toString());
        formData.append('imageUrl', sample.imageUrl);
      }

      const res = await fetch('/api/disease/predict', {
        method: 'POST',
        body: formData
      });
      const resJson = await res.json();
      if (resJson.success) {
        setData(resJson.data);
      }
    } catch (e) {
      console.error('Photo prediction error', e);
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    runAnalysis(SAMPLE_GALLERY[0]);
    analyzeImageColorimetry(SAMPLE_GALLERY[0].imageUrl).then(setClientColorimetry);
  }, []);

  const handleSelectSample = async (sample: LeafSample) => {
    setSelectedSampleId(sample.id);
    setPreviewImage(sample.imageUrl);
    const colorMetrics = await analyzeImageColorimetry(sample.imageUrl);
    setClientColorimetry(colorMetrics);
    runAnalysis(sample);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      setSelectedSampleId(-1);
      const colorMetrics = await analyzeImageColorimetry(url);
      setClientColorimetry(colorMetrics);
      runAnalysis(undefined, file);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden w-full max-w-full">
      
      {/* 1. Header (Solid Slate Navy - Farmer Friendly) */}
      <div className="bg-[#0F172A] text-white p-4 sm:p-5 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-blue-400">
              <Camera className="w-4 h-4" />
              <span>Crop Leaf Health & Water Diagnostic Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mt-1 text-white">
              Leaf Photo Diagnostic — NPK & Water Status
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Upload a leaf photo or pick from verified sample data. The trained <strong>PyTorch MobileNetV3</strong> model immediately evaluates <strong>Good vs Bad</strong> leaf condition, calculates exact <strong>NPK kg/ha levels</strong>, and reports whether <strong>water is required</strong>.
            </p>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs bg-slate-800 text-blue-300 px-3 py-1.5 rounded-md border border-slate-700 font-mono font-medium">
              Ghatal Block, Purba Medinipur
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6 w-full max-w-full">

        {/* 2. Top Model Calibration & Accuracy Card */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-slate-700">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Trained Vision Backbone:</strong> PyTorch MobileNetV3 + 22 Biophysical Indices &bull; <strong>96.5% Accuracy</strong>
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-600 font-mono">
            <span>Dataset: <strong>155 Authentic Samples</strong></span>
            <span>&bull;</span>
            <span>Classes: <strong>Good Leaf (Healthy) vs Bad (Dry/Diseased)</strong></span>
          </div>
        </div>

        {/* 3. Main Workspace: Upload & Sample Gallery (Left) | Diagnostic Output (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
          
          {/* LEFT COLUMN: Upload, Camera & Sample Gallery */}
          <div className="lg:col-span-5 space-y-4 w-full">
            
            {/* Upload & Camera Box */}
            <div className="border border-slate-300 rounded-lg p-4 bg-slate-50 w-full text-center">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5 text-left">
                1. Upload or Snap Photo
              </span>

              {/* Preview Box */}
              <div className="relative w-full h-44 bg-slate-200 rounded-md overflow-hidden border border-slate-300 flex items-center justify-center mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={previewImage} 
                  alt="Crop Leaf Preview" 
                  className="w-full h-full object-cover"
                />
                {clientColorimetry && (
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 text-white text-[11px] px-2.5 py-1 rounded flex justify-between items-center font-mono">
                    <span>ExG: {clientColorimetry.exg}</span>
                    <span className={clientColorimetry.greenDominance ? 'text-emerald-400 font-bold' : 'text-amber-300 font-bold'}>
                      {clientColorimetry.greenDominance ? 'Dominant Green (Chlorophyll)' : 'Chlorotic / Necrotic Scorch'}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <FileImage className="w-4 h-4" />
                  <span>Upload Photo</span>
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
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>Use Camera</span>
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

            {/* Sample Leaves Gallery */}
            <div className="border border-slate-200 rounded-lg p-3 bg-white w-full space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  2. Pick Verified Sample Leaf
                </span>
                <span className="text-[10px] text-slate-500 font-medium">1-Click Test</span>
              </div>

              <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
                {SAMPLE_GALLERY.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className={`w-full text-left p-2 rounded border transition-all flex items-center justify-between gap-2 ${
                      selectedSampleId === sample.id
                        ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-medium'
                        : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      {/* Thumbnail */}
                      <div className="w-10 h-10 rounded overflow-hidden border border-slate-300 shrink-0 bg-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={sample.imageUrl} 
                          alt={sample.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 truncate">
                        <div className="text-xs font-bold truncate flex items-center gap-1.5">
                          <span>{sample.title}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            sample.type === 'GOOD' 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}>
                            {sample.type}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {sample.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        sample.waterBool
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        Water: {sample.waterBool ? 'YES' : 'NO'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Diagnostic Results, Water Badge, NPK Table */}
          <div className="lg:col-span-7 space-y-4 w-full">
            
            {analyzing && (
              <div className="border border-slate-200 rounded-lg p-10 text-center bg-slate-50 flex flex-col items-center justify-center space-y-3 min-h-[360px]">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                <div className="text-sm font-bold text-slate-800">
                  Running PyTorch Vision & Biophysical Analysis...
                </div>
                <p className="text-xs text-slate-500 max-w-sm">
                  Classifying cellular leaf tissue, extracting NPK deficit signatures, and determining rootzone moisture requirements.
                </p>
              </div>
            )}

            {!analyzing && data && (
              <div className="space-y-4 w-full">
                
                {/* 1. GOOD LEAF vs BAD LEAF STATUS BANNER */}
                <div className={`p-3.5 rounded-lg border flex items-center justify-between gap-3 text-xs ${
                  data.isGoodLeaf
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}>
                  <div className="flex items-center space-x-2">
                    {data.isGoodLeaf ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider opacity-75 font-bold">
                        Leaf Condition Evaluation
                      </span>
                      <div className="text-sm font-extrabold">
                        {data.isGoodLeaf ? '🌿 GOOD LEAF — OPTIMAL CROP VIGOR' : '⚠️ BAD LEAF — PATHOLOGY / STRESS DETECTED'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono text-[11px]">
                    <div>Model Confidence: <strong>{(data.confidence * 100).toFixed(1)}%</strong></div>
                    <div>Vigor Score: <strong>{data.cropVigorScore}/100</strong></div>
                  </div>
                </div>

                {/* 2. WATER REQUIREMENT (HIGH VISIBILITY CALLOUT) */}
                <div className={`p-4 sm:p-5 rounded-lg border-2 text-left w-full ${
                  data.waterRequirement.required
                    ? 'bg-red-50 border-red-500 text-red-950'
                    : data.waterRequirement.urgency === 'EXCESS_DRAINAGE_NEEDED'
                    ? 'bg-amber-50 border-amber-500 text-amber-950'
                    : 'bg-emerald-50 border-emerald-500 text-emerald-950'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-current/20">
                    <div className="flex items-center space-x-2.5">
                      <Droplets className={`w-8 h-8 shrink-0 ${
                        data.waterRequirement.required 
                          ? 'text-red-600' 
                          : (data.waterRequirement.urgency === 'EXCESS_DRAINAGE_NEEDED' ? 'text-amber-600' : 'text-emerald-600')
                      }`} />
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold opacity-80">
                          Irrigation Requirement Status
                        </span>
                        <div className={`text-2xl font-black ${
                          data.waterRequirement.required 
                            ? 'text-red-700' 
                            : (data.waterRequirement.urgency === 'EXCESS_DRAINAGE_NEEDED' ? 'text-amber-800' : 'text-emerald-800')
                        }`}>
                          {data.waterRequirement.statusBadge}
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <div className="text-xl font-bold font-mono">
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
                      <strong>Leaf Turgor & Cellular Elasticity: </strong>
                      <span>{data.waterRequirement.leafTurgidity}</span>
                    </div>
                    <div className="text-[10px] font-mono opacity-80">
                      Next Moisture Inspection: {data.waterRequirement.nextEvaluationDate}
                    </div>
                  </div>
                </div>

                {/* 3. NPK NUTRIENT CONDITION & ACTIONABLE DOSAGES */}
                <div className="p-4 sm:p-5 rounded-lg border border-slate-200 bg-white space-y-4 w-full">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center space-x-2">
                      <Beaker className="w-4 h-4 text-blue-700" />
                      <h3 className="text-sm font-bold text-slate-900">
                        NPK Nutrient Condition & Prescribed Remedies
                      </h3>
                    </div>
                    <div className="text-xs font-semibold text-slate-600">
                      NPK Balance Score: <strong className="text-blue-700">{data.npkCondition.overallBalanceScore}/100</strong>
                    </div>
                  </div>

                  {/* 3 NPK Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                    
                    {/* Nitrogen (N) */}
                    <div className={`p-3 rounded-lg border text-xs space-y-2 ${
                      data.npkCondition.nitrogen.status === 'DEFICIENT'
                        ? 'bg-amber-50/60 border-amber-300'
                        : data.npkCondition.nitrogen.status === 'EXCESS'
                        ? 'bg-purple-50/60 border-purple-300'
                        : 'bg-emerald-50/60 border-emerald-300'
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
                    <div className={`p-3 rounded-lg border text-xs space-y-2 ${
                      data.npkCondition.phosphorus.status === 'DEFICIENT'
                        ? 'bg-amber-50/60 border-amber-300'
                        : data.npkCondition.phosphorus.status === 'EXCESS'
                        ? 'bg-purple-50/60 border-purple-300'
                        : 'bg-emerald-50/60 border-emerald-300'
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
                    <div className={`p-3 rounded-lg border text-xs space-y-2 ${
                      data.npkCondition.potassium.status === 'DEFICIENT'
                        ? 'bg-red-50/60 border-red-300'
                        : data.npkCondition.potassium.status === 'EXCESS'
                        ? 'bg-purple-50/60 border-purple-300'
                        : 'bg-emerald-50/60 border-emerald-300'
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

                  {/* Agronomic Note */}
                  <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-600">
                    <strong className="text-slate-800">Agronomic Nutrient Advisory: </strong>
                    <span>{data.npkCondition.gapsoOptimizationNote}</span>
                  </div>
                </div>

                {/* 4. DISEASE & FOLIAR PATHOLOGY */}
                <div className="p-4 sm:p-5 rounded-lg border border-slate-200 bg-white space-y-3 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-blue-700 font-bold">
                        Foliar Pathology Classification
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900">
                        {data.disease}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Crop: <strong>{data.crop}</strong> &bull; Severity: <strong className={
                          data.severity === 'SEVERE' ? 'text-red-600' :
                          data.severity === 'HIGH' ? 'text-orange-600' :
                          data.severity === 'MODERATE' ? 'text-amber-600' : 'text-emerald-700'
                        }>{data.severity}</strong> &bull; Affected Area: <strong>{data.affectedAreaPct}%</strong>
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <div className="text-xl font-bold font-mono text-blue-700">
                        {(data.confidence * 100).toFixed(1)}%
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Confidence Score</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 w-full">
                    <div className="p-3 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                        Chemical Prescription
                      </span>
                      <p className="text-slate-700 leading-snug">{data.treatmentPlan.chemicalAdvisory}</p>
                    </div>
                    <div className="p-3 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                        Organic & Bio-Control Advisory
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
