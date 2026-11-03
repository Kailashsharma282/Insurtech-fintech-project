'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  ShieldCheck,
  Cpu,
  FileText
} from 'lucide-react';
import { CropPhotoAnalyzer } from '@/components/ui/CropPhotoAnalyzer';

export default function DiseaseScannerPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8 px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6 w-full max-w-full">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <Link
            href="/farmer/dashboard"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Farmer Dashboard</span>
          </Link>

          <Link
            href="/farmer/insurance-validation"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors w-full sm:w-auto"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Insurance Validation Hub</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="bg-white p-4 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-2 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200">
            <Cpu className="w-3.5 h-3.5" />
            <span>Computer Vision & Agronomic Rule Engine</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 break-words">
            Crop Photo Diagnostic & Health Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Snap or upload a photo of your paddy, potato, or jute crop leaf. The system inspects leaf color and cellular turgidity to immediately report <strong>NPK nutrient status</strong>, determine if <strong>water is required</strong>, and diagnose foliar pathology.
          </p>
        </div>

        {/* Main Photo Analyzer Component */}
        <CropPhotoAnalyzer />

        {/* Technical Specification for Agronomists & Officers */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 w-full">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Diagnostic Protocol & Multi-Spectral Validation</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 w-full">
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
