'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Camera, 
  ArrowLeft,
  ShieldCheck,
  Cpu,
  FileText,
  Activity
} from 'lucide-react';
import { CropPhotoAnalyzer } from '@/components/ui/CropPhotoAnalyzer';

export default function DiseaseScannerPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/farmer/dashboard"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Farmer Dashboard</span>
          </Link>

          <Link
            href="/farmer/insurance-validation"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-emerald-800 hover:bg-emerald-50 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Insurance Validation Hub</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Computer Vision & Agronomic Rule Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Crop Photo Diagnostic & Health Analyzer
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            Snap or upload a photo of your paddy, potato, or jute crop leaf. The system inspects leaf color and cellular turgidity to immediately report <strong>NPK nutrient status</strong>, determine if <strong>water is required</strong>, and diagnose foliar pathology.
          </p>
        </div>

        {/* Main Photo Analyzer Component */}
        <CropPhotoAnalyzer />

        {/* Technical Specification for Agronomists & Officers */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Diagnostic Protocol & Multi-Spectral Validation</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 block font-bold">1. Water Requirement Analysis</strong>
              <p>Estimates relative leaf water content and cellular turgidity. Compares against Ghatal block evapotranspiration rates to issue immediate irrigation or emergency drainage directives.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 block font-bold">2. NPK Nutrient Quantification</strong>
              <p>Translates chlorophyll chlorosis patterns into Nitrogen (N), Phosphorus (P), and Potassium (K) deficiency metrics. Supplies exact chemical top-dressing rates (Urea, DAP, MOP).</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 block font-bold">3. Multi-Satellite CHF Correlation</strong>
              <p>Leaf-level health feeds into the Ghatal Block Crop Health Factor (CHF) alongside Sentinel-2 vegetation indices and Sentinel-1 radar backscatter for automated parametric insurance claim validation.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
