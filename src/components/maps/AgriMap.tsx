'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Farm } from '@/lib/types';
import { SILABATI_RIVER_POINTS, GHATAL_VILLAGE_BOUNDARY } from '@/lib/db/seed-data';

export type GeeLayerType = 'chf' | 'ndvi' | 'rainfall' | 'gdd' | 'fapar' | 'risk';

export interface GeeLayerInfo {
  id: GeeLayerType;
  label: string;
  shortName: string;
  icon: string;
  overlayPath?: string;
  source: string;
  unit: string;
  scaleDescription: string;
}

export const GEE_LAYERS: GeeLayerInfo[] = [
  {
    id: 'chf',
    label: 'Ghatal CHF 2025',
    shortName: 'CHF 2025',
    icon: '🌱',
    overlayPath: '/images/earth-engine/layers/chf_overlay.png',
    source: 'Google Earth Engine & Sentinel-2/1',
    unit: '0.0 - 1.0 Index',
    scaleDescription: '0.0 - 0.2 (Critical) to 0.8 - 1.0 (Optimal)'
  },
  {
    id: 'ndvi',
    label: 'Normalized Difference Vegetation Index (NDVI)',
    shortName: 'NDVI',
    icon: '🌿',
    overlayPath: '/images/earth-engine/layers/ndvi_overlay.png',
    source: 'Sentinel-2 MSI 10m Optical',
    unit: '-0.16 to 1.0',
    scaleDescription: 'Low: -0.16 (Water/Low) | High: 1.0 (Vigorous Canopy)'
  },
  {
    id: 'rainfall',
    label: 'Seasonal Rainfall (mm)',
    shortName: 'Rainfall',
    icon: '🌧️',
    overlayPath: '/images/earth-engine/layers/rainfall_overlay.png',
    source: 'CHIRPS Pentad Precipitation',
    unit: 'mm',
    scaleDescription: 'Low: 1284.68 mm | High: 1352.07 mm'
  },
  {
    id: 'gdd',
    label: 'Growing Degree Days (GDD)',
    shortName: 'GDD',
    icon: '☀️',
    overlayPath: '/images/earth-engine/layers/gdd_overlay.png',
    source: 'ERA5-Land Thermal Units',
    unit: '°C-day',
    scaleDescription: 'Low: 2859 °C-d | High: 2892 °C-d'
  },
  {
    id: 'fapar',
    label: 'Ghatal FAPAR 2025 (%)',
    shortName: 'FAPAR',
    icon: '🌾',
    overlayPath: '/images/earth-engine/layers/fapar_overlay.png',
    source: 'Sentinel-2 MSI Biophysical Processor',
    unit: 'Fraction (%)',
    scaleDescription: '0.04 - 0.18 (Green) to 0.45 - 0.89 (Red)'
  },
  {
    id: 'risk',
    label: 'Parametric Insurance Risk Tiers',
    shortName: 'Risk Tiers',
    icon: '🛡️',
    source: 'CropSure Automated Actuarial Engine',
    unit: 'Trigger Status',
    scaleDescription: 'Silabati River Floodplain vs Elevated Upland'
  }
];

// Exact bounding box of Ghatal Block from Google Earth Engine neatline coordinates:
// Lon: 87°35'00"E (87.583333°) to 87°47'30"E (87.791667°)
// Lat: 22°32'30"N (22.541667°) to 22°47'30"N (22.791667°)
const GEE_BOUNDS: [[number, number], [number, number]] = [
  [22.541667, 87.583333], // South-West [lat, lng]
  [22.791667, 87.791667]  // North-East [lat, lng]
];

interface AgriMapProps {
  farms: Farm[];
  selectedFarmId?: string;
  onSelectFarm?: (farm: Farm) => void;
  activeLayer?: string;
  center?: [number, number];
  zoom?: number;
  height?: string;
  initialShowGeeGrid?: boolean;
}

export const AgriMap: React.FC<AgriMapProps> = ({
  farms,
  selectedFarmId,
  onSelectFarm,
  activeLayer = 'chf',
  center = [22.6667, 87.6875], // Ghatal Block Geographic Center
  zoom = 12,
  height = '560px',
  initialShowGeeGrid = true
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const leafletInstanceRef = useRef<any>(null);
  const rasterOverlayRef = useRef<any>(null);
  const boundaryLayerRef = useRef<any>(null);
  const riverLayerRef = useRef<any>(null);
  const plotsLayerRef = useRef<any>(null);

  const [mapReady, setMapReady] = useState<boolean>(false);

  const normalizeLayer = (l: string): GeeLayerType => {
    if (l === 'rainfall' || l === 'gdd' || l === 'fapar' || l === 'ndvi' || l === 'risk') return l;
    return 'chf';
  };

  const [currentLayer, setCurrentLayer] = useState<GeeLayerType>(normalizeLayer(activeLayer));
  const [showGeeOverlay, setShowGeeOverlay] = useState<boolean>(initialShowGeeGrid);
  const [showVillageBoundary, setShowVillageBoundary] = useState<boolean>(true);
  const [showPlots, setShowPlots] = useState<boolean>(true);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.85);

  const [probedPixel, setProbedPixel] = useState<{
    lat: number;
    lng: number;
    chf: number;
    ndvi: number;
    rainfallMm: number;
    gdd: number;
    fapar: number;
    distToRiver: number;
    zone: string;
  } | null>(null);

  useEffect(() => {
    if (activeLayer) {
      setCurrentLayer(normalizeLayer(activeLayer));
    }
  }, [activeLayer]);

  // Initialize Map
  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (typeof window === 'undefined' || !mapRef.current) return;
      const L = (await import('leaflet')).default;
      (window as any).L = L;
      leafletInstanceRef.current = L;

      // Fix marker icon URLs
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!leafletMapRef.current && mapRef.current) {
        const map = L.map(mapRef.current, {
          center: center,
          zoom: zoom,
          zoomControl: true,
          attributionControl: false
        });

        // 100% Free Public OpenStreetMap Basemap (Zero watermark, zero API key required)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          subdomains: 'abc',
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        leafletMapRef.current = map;
        rasterOverlayRef.current = L.layerGroup().addTo(map);
        boundaryLayerRef.current = L.layerGroup().addTo(map);
        riverLayerRef.current = L.layerGroup().addTo(map);
        plotsLayerRef.current = L.layerGroup().addTo(map);

        // Frame the exact Ghatal Block boundary
        map.fitBounds(GEE_BOUNDS, { padding: [15, 15] });

        // Map Click Listener for GEE Pixel Probe
        map.on('click', (e: any) => {
          const lat = parseFloat(e.latlng.lat.toFixed(5));
          const lng = parseFloat(e.latlng.lng.toFixed(5));

          let minDist = 1e9;
          for (let r = 0; r < SILABATI_RIVER_POINTS.length - 1; r++) {
            const p1 = SILABATI_RIVER_POINTS[r];
            const p2 = SILABATI_RIVER_POINTS[r + 1];
            const px = lng * 102400, py = lat * 111000;
            const x1 = p1[1] * 102400, y1 = p1[0] * 111000;
            const x2 = p2[1] * 102400, y2 = p2[0] * 111000;
            const dx = x2 - x1, dy = y2 - y1;
            const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
            const dist = Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
            if (dist < minDist) minDist = dist;
          }

          const distRound = Math.round(minDist);
          const zone = distRound < 500 ? 'SILABATI_FLOODPLAIN' : (distRound < 1100 ? 'TRANSITION_ZONE' : 'ELEVATED_UPLAND');

          let chfVal = 0.32 + Math.min(0.55, (minDist / 1800) * 0.55);
          chfVal = Math.max(0.18, Math.min(0.92, parseFloat(chfVal.toFixed(2))));

          let ndviVal = parseFloat((chfVal * 0.92).toFixed(2));
          let rainVal = parseFloat((1284.68 + (1 - (lat - 22.54) / 0.25) * 67.39).toFixed(1));
          rainVal = Math.max(1284.7, Math.min(1352.1, rainVal));

          let gddVal = Math.round(2859 + (1 - (lat - 22.54) / 0.25) * 33);
          gddVal = Math.max(2859, Math.min(2892, gddVal));

          let faparVal = parseFloat((0.08 + chfVal * 0.65).toFixed(2));

          setProbedPixel({
            lat,
            lng,
            chf: chfVal,
            ndvi: ndviVal,
            rainfallMm: rainVal,
            gdd: gddVal,
            fapar: faparVal,
            distToRiver: distRound,
            zone
          });
        });

        if (isMounted) {
          setMapReady(true);
        }
      }
    };

    initMap();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update Raster Overlay Layer
  useEffect(() => {
    if (!mapReady || !leafletMapRef.current || !rasterOverlayRef.current || !leafletInstanceRef.current) return;
    const L = leafletInstanceRef.current;
    const rasterGroup = rasterOverlayRef.current;
    rasterGroup.clearLayers();

    if (showGeeOverlay) {
      const activeInfo = GEE_LAYERS.find(l => l.id === currentLayer);
      if (activeInfo && activeInfo.overlayPath) {
        const overlay = L.imageOverlay(activeInfo.overlayPath, GEE_BOUNDS, {
          opacity: overlayOpacity,
          interactive: false,
          zIndex: 5
        });
        overlay.addTo(rasterGroup);
      }
    }
  }, [mapReady, currentLayer, showGeeOverlay, overlayOpacity]);

  // Update Ghatal Block Boundary Polygon
  useEffect(() => {
    if (!mapReady || !leafletMapRef.current || !boundaryLayerRef.current || !leafletInstanceRef.current) return;
    const L = leafletInstanceRef.current;
    const boundaryGroup = boundaryLayerRef.current;
    boundaryGroup.clearLayers();

    if (showVillageBoundary) {
      const boundaryPoly = L.polygon(GHATAL_VILLAGE_BOUNDARY, {
        color: '#DC2626',      // Crimson Red border matching GEE FAPAR map
        weight: 3,
        dashArray: '6, 5',
        fillColor: '#FEF2F2',
        fillOpacity: 0.04,
        interactive: true
      }).addTo(boundaryGroup);

      boundaryPoly.bindTooltip('📍 Ghatal Block Boundary (Purba Medinipur)', {
        sticky: true,
        className: 'font-bold text-xs text-red-950 bg-white/95 px-2.5 py-1 rounded-lg shadow-md border border-red-300'
      });

      boundaryPoly.bindPopup(`
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 220px; padding: 4px;">
          <div style="border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 6px;">
            <strong style="color: #991B1B; font-size: 13px;">📍 Ghatal Block Boundary</strong>
            <span style="font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: #FEE2E2; color: #991B1B; float: right;">
              GEE Asset
            </span>
          </div>
          <div style="font-size: 11px; color: #334155; line-height: 1.6;">
            <div><strong>District:</strong> Purba Medinipur</div>
            <div><strong>Sub-District:</strong> Ghatal Sub-Division</div>
            <div><strong>Asset Path:</strong> projects/projectmoefcc/assets/Ghatal_block</div>
            <div><strong>Monitored Farms:</strong> 20 Cadastral Plots</div>
            <div><strong>Drainage Influx:</strong> Silabati River Corridor</div>
          </div>
        </div>
      `);
    }
  }, [mapReady, showVillageBoundary]);

  // Update Silabati River polyline
  useEffect(() => {
    if (!mapReady || !leafletMapRef.current || !riverLayerRef.current || !leafletInstanceRef.current) return;
    const L = leafletInstanceRef.current;
    const riverGroup = riverLayerRef.current;
    riverGroup.clearLayers();

    // Translucent Flood Buffer Corridor (400 m buffer along river)
    L.polyline(SILABATI_RIVER_POINTS, {
      color: '#60A5FA',
      weight: 18,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(riverGroup);

    // Active River Channel
    const river = L.polyline(SILABATI_RIVER_POINTS, {
      color: '#1D4ED8',
      weight: 4,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(riverGroup);

    river.bindTooltip('🌊 Silabati River (Ghatal Floodplain Corridor)', {
      sticky: true,
      className: 'font-semibold text-xs text-blue-900 bg-white/95 px-2 py-1 rounded shadow-md border border-blue-200'
    });
  }, [mapReady]);

  // Update Cadastral Farm Plots (20 Plots)
  useEffect(() => {
    if (!mapReady || !leafletMapRef.current || !plotsLayerRef.current || !leafletInstanceRef.current) return;
    const L = leafletInstanceRef.current;
    const plotsGroup = plotsLayerRef.current;
    plotsGroup.clearLayers();

    if (!showPlots) return;

    const getPlotColor = (f: Farm) => {
      if (currentLayer === 'risk') {
        if (f.riskLevel === 'CLAIM_TRIGGERED') return '#EF4444';
        if (f.riskLevel === 'HIGH') return '#F97316';
        if (f.riskLevel === 'MODERATE') return '#F59E0B';
        return '#10B981';
      }
      if (currentLayer === 'chf') {
        if (f.currentChf < 0.55) return '#EF4444';
        if (f.currentChf < 0.70) return '#F59E0B';
        return '#10B981';
      }
      if (currentLayer === 'ndvi') {
        if (f.ndvi < 0.50) return '#EF4444';
        if (f.ndvi < 0.65) return '#FBBF24';
        return '#059669';
      }
      if (currentLayer === 'rainfall') {
        return '#2563EB';
      }
      if (currentLayer === 'gdd') {
        return '#EA580C';
      }
      if (currentLayer === 'fapar') {
        if (f.ndvi < 0.50) return '#EF4444';
        return '#16A34A';
      }
      return '#10B981';
    };

    farms.forEach(farm => {
      const coords = farm.boundaryCoordinates.map(c => [c[1], c[0]] as [number, number]);
      const isSelected = farm.id === selectedFarmId;
      const color = getPlotColor(farm);
      const distToRiver = farm.distanceToRiverMeters || 0;
      const zone = farm.hydrologicalZone || (distToRiver < 500 ? 'SILABATI_FLOODPLAIN' : (distToRiver < 1100 ? 'TRANSITION_ZONE' : 'ELEVATED_UPLAND'));

      const polygon = L.polygon(coords, {
        color: isSelected ? '#FFFFFF' : '#0F172A',
        weight: isSelected ? 3.5 : 1.8,
        fillColor: color,
        fillOpacity: isSelected ? 0.85 : 0.65,
      });

      const popupContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 230px; padding: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E2E8F0; padding-bottom: 5px; margin-bottom: 6px;">
            <strong style="font-size: 13px; color: #0F172A;">${farm.plotNumber}</strong>
            <span style="font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: ${color}22; color: ${color};">
              ${farm.riskLevel}
            </span>
          </div>
          <div style="font-size: 11px; color: #334155; line-height: 1.6;">
            <div><strong>Farmer:</strong> ${farm.farmerName}</div>
            <div><strong>Crop:</strong> ${farm.currentCrop} (${farm.acreage} ha)</div>
            <div><strong>Location:</strong> Ghatal Village, Purba Medinipur</div>
            <div style="margin-top: 3px; padding-top: 3px; border-top: 1px dashed #CBD5E1;">
              <strong>Distance to Silabati River:</strong> <span style="font-family: monospace; font-weight: bold; color: ${distToRiver < 500 ? '#B91C1C' : '#047857'};">${distToRiver} m</span>
            </div>
            <div>
              <strong>Hydrology:</strong> <span style="font-size: 10px; font-weight: bold; color: #1E40AF;">${zone}</span>
            </div>
            <div style="margin-top: 3px; padding-top: 3px; border-top: 1px dashed #CBD5E1;">
              <strong>CHF Index:</strong> <span style="font-size: 13px; font-weight: 800; color: ${color};">${farm.currentChf}</span> 
              <span style="font-size: 10px; color: #64748B;">(Baseline: ${farm.chfBaseline})</span>
            </div>
            <div><strong>Soil Moisture:</strong> ${farm.soilMoisturePct}% ${farm.soilMoisturePct > 80 ? '⚠️ (Waterlogged)' : '✅ (Optimal)'}</div>
            <div><strong>Sentinel-2 NDVI:</strong> ${farm.ndvi} &bull; <strong>S1 VH:</strong> ${farm.vhBackscatterDb} dB</div>
          </div>
          <div style="margin-top: 8px; text-align: right;">
            <a href="/farmer/farms/${farm.id}" style="display: inline-block; font-size: 11px; padding: 4px 10px; border-radius: 6px; background: #2563EB; color: white; text-decoration: none; font-weight: 600;">
              Inspect Plot &rarr;
            </a>
          </div>
        </div>
      `;

      polygon.bindPopup(popupContent);

      polygon.on('click', () => {
        if (onSelectFarm) {
          onSelectFarm(farm);
        }
        setProbedPixel({
          lat: farm.centroid.lat,
          lng: farm.centroid.lng,
          chf: farm.currentChf,
          ndvi: farm.ndvi,
          rainfallMm: 1348.6,
          gdd: 2874,
          fapar: parseFloat((farm.ndvi * 0.9).toFixed(2)),
          distToRiver,
          zone
        });
      });

      polygon.addTo(plotsGroup);
    });

    const selected = farms.find(f => f.id === selectedFarmId);
    if (selected && leafletMapRef.current) {
      leafletMapRef.current.panTo([selected.centroid.lat, selected.centroid.lng]);
    }
  }, [mapReady, farms, selectedFarmId, currentLayer, showPlots, onSelectFarm]);

  const activeLayerConfig = GEE_LAYERS.find(l => l.id === currentLayer) || GEE_LAYERS[0];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm bg-slate-900" style={{ height }}>
      {/* Leaflet Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* TOP CONTROLS BAR: Multi-Variation Layer Switcher (NDVI, Rainfall, GDD, FAPAR, CHF) */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left: 5 GEE Variations Layer Switcher Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-xl pointer-events-auto max-w-full overflow-x-auto">
          {GEE_LAYERS.map(layer => {
            const isSelected = currentLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => {
                  setCurrentLayer(layer.id);
                  setShowGeeOverlay(true);
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap border ${
                  isSelected
                    ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                    : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                title={layer.label}
              >
                <span>{layer.icon}</span>
                <span>{layer.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Map Toggles (Boundary, Plots, Opacity) */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-md text-xs pointer-events-auto">
          {/* Ghatal Outline Toggle */}
          <button
            onClick={() => setShowVillageBoundary(!showVillageBoundary)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors border ${
              showVillageBoundary 
                ? 'bg-red-50 text-red-700 border-red-300' 
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
            title="Toggle Ghatal Block Outline Boundary"
          >
            Boundary: {showVillageBoundary ? 'ON' : 'OFF'}
          </button>

          {/* Cadastral Plots Toggle */}
          <button
            onClick={() => setShowPlots(!showPlots)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors border ${
              showPlots 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
            title="Toggle 20 Cadastral Farm Plots"
          >
            Plots ({farms.length}): {showPlots ? 'ON' : 'OFF'}
          </button>

          {/* Opacity Selector */}
          <div className="hidden sm:flex items-center space-x-1 text-[10px] text-slate-600 font-semibold pl-1 border-l border-slate-200">
            <span>Opacity:</span>
            {[0.70, 0.85, 1.0].map(val => (
              <button
                key={val}
                onClick={() => setOverlayOpacity(val)}
                className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
                  overlayOpacity === val ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {Math.round(val * 100)}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TOP-RIGHT SUB-CARD: Layer Legend Directly Matching Authentic GEE Maps */}
      <div className="absolute top-16 right-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-200 shadow-xl text-xs space-y-2 max-w-[260px] pointer-events-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
          <div className="flex items-center space-x-1.5">
            <span>{activeLayerConfig.icon}</span>
            <strong className="text-slate-900 text-[11px] font-bold truncate max-w-[170px]" title={activeLayerConfig.label}>
              {activeLayerConfig.label}
            </strong>
          </div>
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
            GEE 2025
          </span>
        </div>

        {/* Dynamic Legend Matching Current Layer */}
        {currentLayer === 'chf' && (
          <div className="space-y-1.5 text-[10px]">
            <div className="text-[9px] font-semibold text-slate-500">CHF 2025 Index Scale:</div>
            <div className="grid grid-cols-5 gap-1 text-center font-mono font-bold text-[9px]">
              <div className="bg-[#A83232] text-white py-0.5 rounded">0.0-0.2</div>
              <div className="bg-[#E78B3C] text-white py-0.5 rounded">0.2-0.4</div>
              <div className="bg-[#F0D86B] text-slate-900 py-0.5 rounded">0.4-0.6</div>
              <div className="bg-[#81BD78] text-slate-900 py-0.5 rounded">0.6-0.8</div>
              <div className="bg-[#23734B] text-white py-0.5 rounded">0.8-1.0</div>
            </div>
            <div className="flex justify-between text-[9px] text-slate-600 font-semibold pt-0.5">
              <span className="text-red-700">Silabati River (Low)</span>
              <span className="text-emerald-700">Upland (High)</span>
            </div>
          </div>
        )}

        {currentLayer === 'ndvi' && (
          <div className="space-y-1.5 text-[10px]">
            <div className="text-[9px] font-semibold text-slate-500">NDVI Scale (-0.16 to 1.0):</div>
            <div className="h-3 rounded-md bg-gradient-to-r from-[#16A34A] via-[#FACC15] to-[#EA580C] shadow-inner" />
            <div className="flex justify-between text-[9px] font-mono font-bold text-slate-700">
              <span className="text-emerald-700">Low : -0.16</span>
              <span className="text-orange-700">High : 1</span>
            </div>
            <div className="text-[9px] text-slate-500">Sentinel-2 MSI 10m Optical Canopy</div>
          </div>
        )}

        {currentLayer === 'rainfall' && (
          <div className="space-y-1.5 text-[10px]">
            <div className="text-[9px] font-semibold text-slate-500">Seasonal Rainfall (mm):</div>
            <div className="h-3 rounded-md bg-gradient-to-r from-[#38BDF8] via-[#2563EB] to-[#1E3A8A] shadow-inner" />
            <div className="flex justify-between text-[9px] font-mono font-bold text-slate-700">
              <span className="text-sky-600">Low : 1284.68</span>
              <span className="text-blue-900">High : 1352.07</span>
            </div>
            <div className="text-[9px] text-slate-500">CHIRPS Pentad Cumulative Kharif</div>
          </div>
        )}

        {currentLayer === 'gdd' && (
          <div className="space-y-1.5 text-[10px]">
            <div className="text-[9px] font-semibold text-slate-500">Growing Degree Days (ERA5):</div>
            <div className="grid grid-cols-4 gap-1 text-center font-mono font-bold text-[9px]">
              <div className="bg-[#15803D] text-white py-0.5 rounded">2859</div>
              <div className="bg-[#EAB308] text-slate-900 py-0.5 rounded">2870</div>
              <div className="bg-[#EA580C] text-white py-0.5 rounded">2882</div>
              <div className="bg-[#DC2626] text-white py-0.5 rounded">2892</div>
            </div>
            <div className="flex justify-between text-[9px] font-mono font-bold text-slate-700">
              <span className="text-emerald-700">Low : 2859</span>
              <span className="text-red-700">High : 2892</span>
            </div>
          </div>
        )}

        {currentLayer === 'fapar' && (
          <div className="space-y-1.5 text-[10px]">
            <div className="text-[9px] font-semibold text-slate-500">Ghatal FAPAR 2025 (%):</div>
            <div className="space-y-0.5 text-[9px] font-mono font-semibold">
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-2.5 rounded-xs bg-[#14532D]" />
                <span className="text-slate-700">0.04 - 0.18</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-2.5 rounded-xs bg-[#22C55E]" />
                <span className="text-slate-700">0.18 - 0.27</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-2.5 rounded-xs bg-[#FACC15]" />
                <span className="text-slate-700">0.27 - 0.35</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-2.5 rounded-xs bg-[#FB923C]" />
                <span className="text-slate-700">0.35 - 0.45</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-2.5 rounded-xs bg-[#EF4444]" />
                <span className="text-slate-700">0.45 - 0.89</span>
              </div>
            </div>
          </div>
        )}

        {currentLayer === 'risk' && (
          <div className="space-y-1 text-[10px]">
            <div className="text-[9px] font-semibold text-slate-500">Parametric Trigger Status:</div>
            <div className="flex items-center justify-between text-[9px]">
              <span className="flex items-center gap-1 font-semibold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Optimal (&gt;0.70)
              </span>
              <span className="flex items-center gap-1 font-semibold text-amber-700">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Watch (0.55-0.70)
              </span>
              <span className="flex items-center gap-1 font-semibold text-red-700">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Trigger (&lt;0.55)
              </span>
            </div>
          </div>
        )}

        {/* Silabati River Corridor Indicator */}
        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-500">
          <div className="flex items-center space-x-1.5">
            <div className="w-3.5 h-1.5 bg-blue-600 rounded-xs"></div>
            <span className="font-semibold text-blue-900">Silabati River</span>
          </div>
          <span className="font-mono text-slate-400">Purba Medinipur</span>
        </div>
      </div>

      {/* BOTTOM-LEFT: GEE Pixel Probe HUD Panel */}
      {probedPixel && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-[1000] bg-slate-950/95 text-white backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-700 shadow-2xl text-xs max-w-md pointer-events-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <strong className="text-emerald-400 font-mono text-[11px]">GEE Multi-Spectral Pixel Probe</strong>
            </div>
            <button 
              onClick={() => setProbedPixel(null)}
              className="text-slate-400 hover:text-white text-xs px-1"
            >
              &times;
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-300">
            <div>Coords: <span className="font-mono text-white">{probedPixel.lat}, {probedPixel.lng}</span></div>
            <div>River Dist: <span className="font-mono text-yellow-300 font-bold">{probedPixel.distToRiver} m</span></div>
            <div>Zone: <span className="font-bold text-blue-300">{probedPixel.zone}</span></div>
            <div>CHF 2025: <span className={`font-mono font-bold ${probedPixel.chf < 0.55 ? 'text-red-400' : 'text-emerald-400'}`}>{probedPixel.chf}</span></div>
            <div>NDVI: <span className="font-mono text-white">{probedPixel.ndvi}</span></div>
            <div>Rainfall: <span className="font-mono text-white">{probedPixel.rainfallMm} mm</span></div>
            <div>GDD: <span className="font-mono text-white">{probedPixel.gdd} °C-d</span></div>
            <div>FAPAR: <span className="font-mono text-white">{probedPixel.fapar}</span></div>
          </div>
        </div>
      )}
    </div>
  );
};
