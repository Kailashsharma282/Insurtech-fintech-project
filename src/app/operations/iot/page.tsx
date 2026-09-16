'use client';

import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Droplets, 
  Battery, 
  Signal, 
  Activity, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Sliders,
  Play,
  Pause,
  Power
} from 'lucide-react';
import { store } from '@/lib/db/store';
import { IoTDevice } from '@/lib/types';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

export default function IotCommandCenterPage() {
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('iot-dev-1');
  const [liveStreamActive, setLiveStreamActive] = useState<boolean>(true);
  const [lastTickTime, setLastTickTime] = useState<string>('Connecting...');
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Historical telemetry stream (10 points)
  const [telemetryHistory, setTelemetryHistory] = useState<any[]>([
    { time: '10:00:00', moisture: 57.8, temp: 29.4, humidity: 76, resistance: 802 },
    { time: '10:00:03', moisture: 58.0, temp: 29.3, humidity: 76, resistance: 800 },
    { time: '10:00:06', moisture: 57.9, temp: 29.5, humidity: 75, resistance: 801 },
    { time: '10:00:09', moisture: 58.2, temp: 29.4, humidity: 77, resistance: 798 },
    { time: '10:00:12', moisture: 58.1, temp: 29.4, humidity: 76, resistance: 799 },
    { time: '10:00:15', moisture: 58.0, temp: 29.5, humidity: 76, resistance: 800 },
  ]);

  // Load devices and set up 3-second live ticker
  useEffect(() => {
    setDevices(store.getDevices());
    setLastTickTime(new Date().toLocaleTimeString());

    const interval = setInterval(async () => {
      if (!liveStreamActive) return;

      try {
        const res = await fetch('/api/iot/tick');
        const data = await res.json();
        if (data.success) {
          setDevices(data.devices);
          setLastTickTime(new Date().toLocaleTimeString());

          // Update real-time history for selected device
          const currentDev = data.devices.find((d: IoTDevice) => d.id === selectedDeviceId) || data.devices[0];
          if (currentDev) {
            setTelemetryHistory(prev => {
              const next = [
                ...prev.slice(-9),
                {
                  time: new Date().toLocaleTimeString(),
                  moisture: currentDev.currentReading.soilMoisturePct,
                  temp: currentDev.currentReading.temperatureC,
                  humidity: currentDev.currentReading.humidityPct,
                  resistance: currentDev.currentReading.soilResistanceOhm,
                }
              ];
              return next;
            });
          }
        }
      } catch {
        // Fallback to local store tick if offline
        store.tickTelemetry();
        setDevices([...store.getDevices()]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [liveStreamActive, selectedDeviceId]);

  const selectedDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];

  const handleTogglePump = async () => {
    if (!selectedDevice) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/iot/devices/${selectedDevice.id}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle' })
      });
      const data = await res.json();
      if (data.success) {
        setDevices(store.getDevices());
      }
    } catch {
      store.togglePump(selectedDevice.id);
      setDevices([...store.getDevices()]);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSimulateFailure = async () => {
    if (!selectedDevice) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/iot/devices/${selectedDevice.id}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fault' })
      });
      const data = await res.json();
      if (data.success) {
        setDevices(store.getDevices());
      }
    } catch {
      store.simulateDeviceFault(selectedDevice.id);
      setDevices([...store.getDevices()]);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header & Live Pulse Control */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                IoT Telemetry & Command Center
              </h1>
              <span className={`w-2.5 h-2.5 rounded-full ${liveStreamActive ? 'bg-[#10B981] pulse-indicator' : 'bg-slate-400'}`}></span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Live 3-second polling interval across 20 remote ESP32 hardware probe nodes & solar pump relays.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="text-slate-400">Last Poll: {lastTickTime}</span>
            <button
              onClick={() => setLiveStreamActive(!liveStreamActive)}
              className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 transition-colors ${
                liveStreamActive 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              {liveStreamActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{liveStreamActive ? 'STREAM ACTIVE (3s)' : 'PAUSED'}</span>
            </button>
          </div>
        </div>

        {/* Selected Device Telemetry Dashboard */}
        {selectedDevice && (
          <div className="p-8 rounded-3xl bg-[#071511] text-white border border-[#10B981]/30 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/60 pb-5">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-[#34D399] uppercase font-bold">
                    {selectedDevice.deviceType.replace(/_/g, ' ')}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    selectedDevice.isActive ? 'bg-emerald-500/20 text-[#34D399]' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {selectedDevice.isActive ? 'ONLINE & TRANSMITTING' : 'SENSOR OFFLINE / FAULT'}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white">
                  {selectedDevice.name}
                </h2>
                <div className="text-xs text-slate-400 font-mono">
                  UID: <strong className="text-white">{selectedDevice.deviceUid}</strong> &bull; Hardware: {selectedDevice.hardwareModel} &bull; Linked to <strong className="text-[#34D399]">{selectedDevice.farmPlot}</strong>
                </div>
              </div>

              {/* Action Controls for Selected Device */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleTogglePump}
                  disabled={actionLoading || !selectedDevice.isActive}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                    selectedDevice.pumpStatus === 'ACTIVE' 
                      ? 'bg-red-600 hover:bg-red-500 text-white' 
                      : 'bg-[#10B981] hover:bg-emerald-600 text-white'
                  } disabled:opacity-40`}
                >
                  <Droplets className="w-3.5 h-3.5" />
                  <span>{selectedDevice.pumpStatus === 'ACTIVE' ? 'Halt Pump' : 'Actuate Pump Relay'}</span>
                </button>

                <button
                  onClick={handleSimulateFailure}
                  disabled={actionLoading}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  <Power className="w-3.5 h-3.5 text-amber-400" />
                  <span>{selectedDevice.isActive ? 'Simulate Fault' : 'Recover Node'}</span>
                </button>
              </div>
            </div>

            {/* 8 Sensor Metrics Required by Section 13 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 font-mono text-center">
              
              <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-900/40">
                <span className="text-[10px] text-slate-400 block uppercase">Soil Moisture</span>
                <strong className="text-xl text-blue-400 font-black mt-1 block">
                  {selectedDevice.currentReading.soilMoisturePct}%
                </strong>
                <span className="text-[9px] text-slate-400">VWC Probe</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-900/40">
                <span className="text-[10px] text-slate-400 block uppercase">Temperature</span>
                <strong className="text-xl text-amber-300 font-black mt-1 block">
                  {selectedDevice.currentReading.temperatureC}&deg;C
                </strong>
                <span className="text-[9px] text-slate-400">DHT22 Ambient</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-900/40">
                <span className="text-[10px] text-slate-400 block uppercase">Humidity</span>
                <strong className="text-xl text-cyan-300 font-black mt-1 block">
                  {selectedDevice.currentReading.humidityPct}%
                </strong>
                <span className="text-[9px] text-slate-400">RH Level</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-900/40">
                <span className="text-[10px] text-slate-400 block uppercase">Rainfall</span>
                <strong className="text-xl text-blue-300 font-black mt-1 block">
                  {selectedDevice.currentReading.rainfallMm} mm
                </strong>
                <span className="text-[9px] text-slate-400">Tipping Bucket</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-900/40">
                <span className="text-[10px] text-slate-400 block uppercase">Soil Resistance</span>
                <strong className="text-xl text-emerald-300 font-black mt-1 block">
                  {selectedDevice.currentReading.soilResistanceOhm} &Omega;
                </strong>
                <span className="text-[9px] text-slate-400">Salinity / Cond.</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-900/40">
                <span className="text-[10px] text-slate-400 block uppercase">Pump Relay</span>
                <strong className={`text-xl font-black mt-1 block ${selectedDevice.pumpStatus === 'ACTIVE' ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {selectedDevice.pumpStatus || 'IDLE'}
                </strong>
                <span className="text-[9px] text-slate-400">Relay State</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-900/40">
                <span className="text-[10px] text-slate-400 block uppercase">Battery</span>
                <strong className="text-xl text-emerald-400 font-black mt-1 block">
                  {selectedDevice.batteryPct}%
                </strong>
                <span className="text-[9px] text-slate-400">Solar LiFePO4</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-900/40">
                <span className="text-[10px] text-slate-400 block uppercase">GSM Signal</span>
                <strong className="text-xl text-slate-300 font-black mt-1 block">
                  {selectedDevice.signalDbm} dBm
                </strong>
                <span className="text-[9px] text-slate-400">NB-IoT / 4G</span>
              </div>

            </div>

            {/* Real-time 3-Second Telemetry Chart */}
            <div className="bg-[#0B2119] p-5 rounded-2xl border border-emerald-900/40 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-300">Live 3-Second Telemetry Stream (VWC & Temperature)</span>
                <span className="text-slate-400 font-mono text-[10px]">Real-time rolling window</span>
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={telemetryHistory} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#102820" />
                    <XAxis dataKey="time" stroke="#475569" fontSize={10} />
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#475569" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#071511', borderColor: '#10B981', color: '#fff', fontSize: '11px' }} />
                    <Line type="monotone" dataKey="moisture" name="Soil Moisture (% VWC)" stroke="#38BDF8" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#FBBF24" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Device Fleet Grid (Section 13: 20 Devices) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-lg text-[#0F172A]">Field Hardware Fleet (20 Nodes)</h3>
              <p className="text-xs text-slate-500">Select any device to switch telemetry stream and test controls</p>
            </div>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {devices.filter(d => d.isActive).length} / {devices.length} Online
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {devices.map((dev) => {
              const isSelected = dev.id === selectedDeviceId;
              return (
                <div
                  key={dev.id}
                  onClick={() => setSelectedDeviceId(dev.id)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all space-y-2.5 ${
                    isSelected 
                      ? 'border-[#10B981] bg-emerald-50/50 shadow-md ring-1 ring-[#10B981]' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 font-bold">{dev.deviceUid}</span>
                    <span className={`w-2 h-2 rounded-full ${dev.isActive ? 'bg-[#10B981]' : 'bg-red-500'}`}></span>
                  </div>

                  <div className="font-bold text-xs text-slate-900 truncate">
                    {dev.name}
                  </div>

                  <div className="text-[11px] text-slate-500">
                    Bound to: <strong className="text-slate-700">{dev.farmPlot}</strong>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono pt-2 border-t border-slate-100">
                    <span className="text-blue-600 font-bold">{dev.currentReading.soilMoisturePct}% VWC</span>
                    <span className="text-slate-500">{dev.batteryPct}% Bat</span>
                    <span className="text-slate-500">{dev.signalDbm}dBm</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
