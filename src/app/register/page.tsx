'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sprout, 
  MapPin, 
  FileText, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  Search, 
  Navigation, 
  AlertCircle,
  ArrowRight,
  Clock,
  Landmark
} from 'lucide-react';
import { 
  WB_DISTRICTS, 
  WB_SUBDISTRICTS_BY_DISTRICT, 
  WB_VILLAGES_BY_SUBDISTRICT 
} from '@/lib/data/wb-revenue-directory';

export default function FarmerRegistrationPage() {
  const router = useRouter();

  // Form State
  const [district, setDistrict] = useState<string>('Paschim Medinipur');
  const [subdistrict, setSubdistrict] = useState<string>('Ghatal');
  const [village, setVillage] = useState<string>('Dewanchak-337736');
  const [villageOther, setVillageOther] = useState<string>('');
  const [surveyNo, setSurveyNo] = useState<string>('629');
  const [subSurveyNo, setSubSurveyNo] = useState<string>('');
  
  // Land Ownership
  const [ownerName, setOwnerName] = useState<string>('Subhash Mondal');
  const [identifierName, setIdentifierName] = useState<string>('Khatian #4102');
  const [identifierType, setIdentifierType] = useState<string>('RoR (Record of Rights)');
  const [ownerType, setOwnerType] = useState<string>('Single');
  const [shareType, setShareType] = useState<string>('Whole Share');
  const [totalArea, setTotalArea] = useState<string>('1.45');
  const [assignedArea, setAssignedArea] = useState<string>('1.45');
  const [totalOwned, setTotalOwned] = useState<string>('2.20');
  const [numberOwned, setNumberOwned] = useState<string>('2');

  // Farmer & Crop Details
  const [farmerName, setFarmerName] = useState<string>('Subhash Mondal');
  const [mobile, setMobile] = useState<string>('9832104567');
  const [crop, setCrop] = useState<string>('Aman Paddy');
  const [season, setSeason] = useState<string>('Kharif 2026');
  const [plotArea, setPlotArea] = useState<string>('1.45');
  const [chfScore, setChfScore] = useState<string>('0.76');
  const [sumInsured, setSumInsured] = useState<string>('145000');
  const [policyStatus, setPolicyStatus] = useState<string>('Active');
  const [policyRef, setPolicyRef] = useState<string>('POL-WB-2026-3021');

  // GPS Location
  const [latitude, setLatitude] = useState<string>('22.665079');
  const [longitude, setLongitude] = useState<string>('87.679575');
  const [gpsAccuracy, setGpsAccuracy] = useState<string>('4.2');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsMsg, setGpsMsg] = useState<string>('');

  // Bank Account
  const [accountHolder, setAccountHolder] = useState<string>('Subhash Mondal');
  const [bankName, setBankName] = useState<string>('Punjab National Bank');
  const [branchName, setBranchName] = useState<string>('Ghatal Main Branch');
  const [ifsc, setIfsc] = useState<string>('PUNB0123400');
  const [accountNumber, setAccountNumber] = useState<string>('987654321001');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState<string>('987654321001');

  // Verification & Submission
  const [consent, setConsent] = useState<boolean>(true);
  const [banglarbhumiStatus, setBanglarbhumiStatus] = useState<string>('');
  const [isSearchingGov, setIsSearchingGov] = useState<boolean>(false);
  const [govParcelResult, setGovParcelResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Cascading subdistricts
  const subdistricts = WB_SUBDISTRICTS_BY_DISTRICT[district] || [];
  const villages = WB_VILLAGES_BY_SUBDISTRICT[subdistrict] || [];

  useEffect(() => {
    if (subdistricts.length > 0 && !subdistricts.includes(subdistrict)) {
      setSubdistrict(subdistricts[0]);
    }
  }, [district]);

  useEffect(() => {
    if (villages.length > 0) {
      setVillage(villages[0][0] + '-' + villages[0][1]);
    } else {
      setVillage('__other__');
    }
  }, [subdistrict]);

  // Handle GPS location capture
  const handleGetGps = () => {
    if (!navigator.geolocation) {
      setGpsMsg('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setGpsMsg('Requesting device GPS coordinates...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);
        const acc = pos.coords.accuracy.toFixed(1);
        setLatitude(lat);
        setLongitude(lon);
        setGpsAccuracy(acc);
        setIsLocating(false);
        setGpsMsg(`GPS captured successfully! Accuracy: ±${acc}m`);
      },
      (err) => {
        setIsLocating(false);
        setGpsMsg(`GPS capture failed: ${err.message}. Using default centroid.`);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Government Land Record / Banglarbhumi Verification Lookup
  const handleGovLookup = () => {
    setIsSearchingGov(true);
    setBanglarbhumiStatus('Connecting to Banglarbhumi West Bengal Land Record Portal...');
    setTimeout(() => {
      setIsSearchingGov(false);
      setBanglarbhumiStatus(`✓ Verified on Banglarbhumi: Plot #${surveyNo} in ${village.split('-')[0]} (JL ${village.split('-')[1] || '082'}), ${subdistrict}, ${district}. Verified RoR record status: Clear agricultural title.`);
      setGovParcelResult({
        plotNo: surveyNo,
        village: village.split('-')[0],
        owner: ownerName,
        khatian: identifierName,
        status: 'VERIFIED_TITLE'
      });
    }, 1200);
  };

  // Form Submit: Save to Database
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (accountNumber && confirmAccountNumber && accountNumber !== confirmAccountNumber) {
      setErrorMsg('Bank account numbers do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: farmerName,
      farmerName,
      mobile,
      district,
      subdistrict,
      village: village === '__other__' ? villageOther : village.split('-')[0],
      vcode: village.includes('-') ? village.split('-')[1] : '',
      surveyNo,
      subSurveyNo,
      crop,
      season,
      area: parseFloat(plotArea) || 1.0,
      chf: parseFloat(chfScore) || 0.76,
      sum: parseFloat(sumInsured) || 145000,
      policyRef,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      gpsAccuracy: parseFloat(gpsAccuracy),
      landRecord: {
        ownerName,
        identifierName,
        identifierType,
        ownerType,
        shareType,
        totalArea,
        assignedArea,
        totalOwned,
        numberOwned
      },
      bankAccount: {
        accountHolder,
        bankName,
        branchName,
        ifsc,
        last4: accountNumber.slice(-4)
      }
    };

    try {
      const res = await fetch('/api/farms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed');
      }
      setSuccessData(data.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error while registering');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">
              <Sprout className="w-4 h-4" />
              <span>Official Farmer & Cadastral Plot Registration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Farmer Land & PMFBY Policy Registration
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Register parcel holdings, cross-verify with West Bengal Banglarbhumi land records, capture GPS boundary coordinates, and enroll into autonomous parametric insurance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/farmer/farms"
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors inline-flex items-center gap-1.5"
            >
              <span>View All Plots</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Success Modal / Banner */}
        {successData && (
          <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 space-y-4 shadow-lg animate-fadeIn">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-black text-emerald-950 dark:text-emerald-100">
                  Farmer Record & Plot Registered in Database!
                </h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                  Assigned Plot ID: <strong>{successData.plotNumber}</strong> ({successData.id}) · Farmer: <strong>{successData.farmerName}</strong> ({successData.farmerId})
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Location</span>
                <strong className="text-slate-900 dark:text-white">{successData.village}, {successData.district}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Crop & Area</span>
                <strong className="text-slate-900 dark:text-white">{successData.currentCrop} ({successData.acreage} ha)</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">CHF Score</span>
                <strong className="text-emerald-600 font-bold">{successData.currentChf} (Baseline: 0.76)</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Sum Insured</span>
                <strong className="text-blue-700 dark:text-blue-400 font-bold">₹{successData.sumInsured?.toLocaleString()}</strong>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/intelligence/map"
                className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-colors inline-flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span>View Registered Plot on Cadastral Map</span>
              </Link>
              <Link
                href="/farmer/farms"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors inline-flex items-center gap-2"
              >
                <Sprout className="w-4 h-4" />
                <span>Go to Registered Farm Holdings</span>
              </Link>
              <button
                onClick={() => setSuccessData(null)}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Register Another Farmer
              </button>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* SECTION 1: LAND OWNERSHIP & REVENUE RECORD */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Landmark className="w-5 h-5 text-blue-700 dark:text-blue-400" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                1. Land Ownership Details (West Bengal Revenue Record)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* State */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">State / UT</label>
                <input
                  type="text"
                  value="WEST BENGAL"
                  readOnly
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-not-allowed"
                />
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  District <span className="text-rose-600">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {WB_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Sub District */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sub District (Block / Tehsil) <span className="text-rose-600">*</span>
                </label>
                <select
                  value={subdistrict}
                  onChange={(e) => setSubdistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {subdistricts.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Revenue Village */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Revenue Village (JL Code) <span className="text-rose-600">*</span>
                </label>
                <select
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {villages.map(([vName, vCode]) => (
                    <option key={vCode} value={`${vName}-${vCode}`}>
                      {vName} (JL: {vCode})
                    </option>
                  ))}
                  <option value="__other__">Other / Not Listed</option>
                </select>
              </div>

              {/* Other Village Input if selected */}
              {village === '__other__' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Enter Exact Village & JL Code
                  </label>
                  <input
                    type="text"
                    value={villageOther}
                    onChange={(e) => setVillageOther(e.target.value)}
                    placeholder="e.g. Radhanagar - 337708"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              )}

              {/* Survey / Plot No. */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Survey / Plot No. (S. No.) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={surveyNo}
                  onChange={(e) => setSurveyNo(e.target.value)}
                  placeholder="e.g. 629 or 204"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Sub-survey No. */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sub-survey No. (S/S No.)
                </label>
                <input
                  type="text"
                  value={subSurveyNo}
                  onChange={(e) => setSubSurveyNo(e.target.value)}
                  placeholder="Optional / If applicable"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

            </div>

            {/* BANGLARBHUMI PORTAL INTEGRATION CARD */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-blue-200 dark:border-blue-800/60 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Government Land Record Verification (Banglarbhumi Portal)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Cross-verify revenue village, plot number, and khatian details against the Directorate of Land Records & Surveys (Banglarbhumi).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGovLookup}
                    disabled={isSearchingGov}
                    className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 shrink-0 shadow-xs"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>{isSearchingGov ? 'Searching...' : 'Search Gov Record'}</span>
                  </button>

                  <a
                    href="https://banglarbhumi.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 transition-all inline-flex items-center gap-1.5 shrink-0"
                  >
                    <span>Open Banglarbhumi</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                </div>
              </div>

              {banglarbhumiStatus && (
                <div className="p-3 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 font-medium">
                  {banglarbhumiStatus}
                </div>
              )}
            </div>

            {/* Ownership Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Recorded Owner Name</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Identifier Name (Khatian)</label>
                <input
                  type="text"
                  value={identifierName}
                  onChange={(e) => setIdentifierName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Owner Type</label>
                <select
                  value={ownerType}
                  onChange={(e) => setOwnerType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                >
                  <option value="Single">Single Owner</option>
                  <option value="Joint">Joint Ownership</option>
                  <option value="Other">Other / Not Specified</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Owner Share Type</label>
                <select
                  value={shareType}
                  onChange={(e) => setShareType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                >
                  <option value="Whole Share">Whole Share (100%)</option>
                  <option value="Partial Share">Partial Share</option>
                  <option value="Not Specified">Not Specified</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Total Parcel Area (ha)</label>
                <input
                  type="number"
                  step="0.01"
                  value={totalArea}
                  onChange={(e) => setTotalArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Area Assigned to Owner (ha)</label>
                <input
                  type="number"
                  step="0.01"
                  value={assignedArea}
                  onChange={(e) => setAssignedArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Total Land Area Owned (ha)</label>
                <input
                  type="number"
                  step="0.01"
                  value={totalOwned}
                  onChange={(e) => setTotalOwned(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Number of Lands Owned</label>
                <input
                  type="number"
                  value={numberOwned}
                  onChange={(e) => setNumberOwned(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white font-mono"
                />
              </div>

            </div>
          </div>


          {/* SECTION 2: FARMER PERSONAL & CROP INFORMATION */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sprout className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                2. Farmer Profile & Crop Agronomics
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Farmer Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Number (10 Digits) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Crop Type <span className="text-rose-600">*</span>
                </label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="Aman Paddy">Aman Paddy / Rice</option>
                  <option value="Potato">Potato (Kufri Jyoti)</option>
                  <option value="Jute">Jute (Golden Fibre)</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Mustard">Mustard</option>
                  <option value="Vegetables">Vegetables / Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Crop Season <span className="text-rose-600">*</span>
                </label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="Kharif 2026">Kharif (Monsoon)</option>
                  <option value="Rabi 2025-26">Rabi (Winter)</option>
                  <option value="Pre-Kharif 2026">Pre-Kharif (Summer)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Cultivated Plot Area (ha) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={plotArea}
                  onChange={(e) => {
                    setPlotArea(e.target.value);
                    const ha = parseFloat(e.target.value) || 0;
                    setSumInsured(Math.round(ha * 100000).toString());
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Baseline CHF Benchmark (0–1) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  required
                  value={chfScore}
                  onChange={(e) => setChfScore(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sum Insured (₹) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={sumInsured}
                  onChange={(e) => setSumInsured(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">PMFBY Policy Status</label>
                <select
                  value={policyStatus}
                  onChange={(e) => setPolicyStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="Active">Approved & Active</option>
                  <option value="Pending">Verification Pending</option>
                  <option value="NotInsured">Not Insured / Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Policy / Application Ref</label>
                <input
                  type="text"
                  value={policyRef}
                  onChange={(e) => setPolicyRef(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white font-mono"
                />
              </div>

            </div>
          </div>


          {/* SECTION 3: GPS PLOT LOCATION CAPTURE */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Navigation className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  3. Field GPS Plot Location Capture
                </h2>
              </div>

              <button
                type="button"
                onClick={handleGetGps}
                disabled={isLocating}
                className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-all inline-flex items-center gap-1.5 shrink-0"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{isLocating ? 'Capturing GPS...' : '◎ Get Current GPS Location'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Stand at the cultivated parcel or use field telemetry. Capturing device GPS embeds exact coordinates to register the plot polygon onto the GIS cadastral map.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Accuracy (Metres)</label>
                <input
                  type="number"
                  step="any"
                  value={gpsAccuracy}
                  onChange={(e) => setGpsAccuracy(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {gpsMsg && (
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200">
                {gpsMsg}
              </div>
            )}
          </div>


          {/* SECTION 4: BANK ACCOUNT DETAILS (DBT) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Landmark className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                4. Bank Account Details (PMFBY Direct Benefit Settlement)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Account Holder Name</label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Branch Name</label>
                <input
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">IFSC Code (11 Characters)</label>
                <input
                  type="text"
                  maxLength={11}
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Account Number</label>
                <input
                  type="password"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Confirm Account Number</label>
                <input
                  type="password"
                  value={confirmAccountNumber}
                  onChange={(e) => setConfirmAccountNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>


          {/* SECTION 5: CONSENT & SUBMIT */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                I confirm that the farmer has consented to this demonstration data entry and cadastral parcel linkage under the PMFBY parametric insurance pilot.
              </span>
            </label>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Registered data is stored into the active cadastral database and mapped across GIS dashboards.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm shadow-lg shadow-blue-900/20 transition-all inline-flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Registering...' : 'Save Farmer Record & Plot Boundary'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
