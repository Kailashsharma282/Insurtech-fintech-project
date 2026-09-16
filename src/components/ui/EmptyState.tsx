import React from 'react';
import { 
  Satellite, 
  Radio, 
  Cpu, 
  Clock, 
  AlertCircle, 
  BellOff, 
  Sprout, 
  ImageOff,
  RefreshCw
} from 'lucide-react';

export type EmptyStateType = 
  | 'no_satellite' 
  | 'iot_disconnected' 
  | 'model_unavailable' 
  | 'claim_verification_pending' 
  | 'payout_failed' 
  | 'no_alerts' 
  | 'no_farms' 
  | 'invalid_disease_image';

interface EmptyStateProps {
  type: EmptyStateType;
  customMessage?: string;
  onRetry?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, customMessage, onRetry }) => {
  const configs = {
    no_satellite: {
      icon: Satellite,
      title: 'No Satellite Data Available',
      desc: customMessage || 'Overhead Sentinel orbital pass is delayed by dense cloud masking (>80%) or orbital scheduling window. Synthetic Aperture Radar (SAR) interpolation active.',
      actionText: 'Request SAR Interpolation'
    },
    iot_disconnected: {
      icon: Radio,
      title: 'IoT Probe Node Disconnected',
      desc: customMessage || 'Node heartbeat timed out (>15s). Cellular GSM fallback active. Checking battery voltage and RS-485 interface.',
      actionText: 'Ping Probe Node'
    },
    model_unavailable: {
      icon: Cpu,
      title: 'Agronomic AI Model Cold Starting',
      desc: customMessage || 'PyTorch MobileNetV3 inference worker is warming up weights. Fallback rule-based heuristic advisor is currently serving requests.',
      actionText: 'Retry Inference Pipeline'
    },
    claim_verification_pending: {
      icon: Clock,
      title: 'Claim Verification In Progress',
      desc: customMessage || 'Satellite and IoT telemetry cross-validation is pending. Awaiting next bi-weekly SAR pass to confirm recovery trajectory.',
      actionText: 'View Verification Queue'
    },
    payout_failed: {
      icon: AlertCircle,
      title: 'Parametric Settlement Transfer Failed',
      desc: customMessage || 'Banking switch reported IFSC code mismatch or invalid beneficiary Aadhaar bank link. Automatic retry scheduled via alternative clearing batch.',
      actionText: 'Re-verify Bank Account'
    },
    no_alerts: {
      icon: BellOff,
      title: 'All Systems Optimal — No Active Alerts',
      desc: customMessage || 'All monitored plots in this sector are exhibiting healthy Crop Health Factor scores (> 0.70) with adequate root zone moisture.',
      actionText: 'Refresh Alert Stream'
    },
    no_farms: {
      icon: Sprout,
      title: 'No Registered Plots Found',
      desc: customMessage || 'No plots match the selected district, crop, and risk filter criteria. Adjust your search parameters or register a new plot boundary.',
      actionText: 'Clear Search Filters'
    },
    invalid_disease_image: {
      icon: ImageOff,
      title: 'Unable to Detect Crop Foliage',
      desc: customMessage || 'Uploaded image does not exhibit discernible leaf or canopy features. Ensure adequate lighting and focus directly on symptomatic foliage.',
      actionText: 'Upload New Leaf Image'
    }
  };

  const c = configs[type];
  const Icon = c.icon;

  return (
    <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-sm max-w-lg mx-auto">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-bold text-base text-slate-900">{c.title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">{c.desc}</p>
      {onRetry && (
        <div className="pt-2">
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors inline-flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{c.actionText}</span>
          </button>
        </div>
      )}
    </div>
  );
};
