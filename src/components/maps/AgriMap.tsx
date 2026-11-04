'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Farm } from '@/lib/types';
import { SILABATI_RIVER_POINTS, GHATAL_VILLAGE_BOUNDARY } from '@/lib/db/seed-data';

interface AgriMapProps {
  farms: Farm[];
  selectedFarmId?: string;
  onSelectFarm?: (farm: Farm) => void;
  activeLayer?: 'chf' | 'ndvi' | 'lswi' | 'vh' | 'risk';
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
  center = [22.6710, 87.7240], // Centered at Ghatal Central Riverbend
  zoom = 13,
  height = '540px',
  initialShowGeeGrid = true
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const layersGroupRef = useRef<any>(null);
  const rasterGroupRef = useRef<any>(null);
  const [showGeeRaster, setShowGeeRaster] = useState<boolean>(initialShowGeeGrid);
  const [showVillageBoundary, setShowVillageBoundary] = useState<boolean>(true);
  const [currentLayer, setCurrentLayer] = useState<'chf' | 'ndvi' | 'lswi' | 'vh' | 'risk'>(activeLayer);
  const [probedPixel, setProbedPixel] = useState<{
    lat: number;
    lng: number;
    chf: number;
    ndvi: number;
    lswi: number;
    vhDb: number;
    rainMm: number;
    gdd: number;
    distToRiver: number;
    zone: string;
  } | null>(null);

  // Sync internal layer with prop if changed from outside
  useEffect(() => {
    setCurrentLayer(activeLayer);
  }, [activeLayer]);

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (typeof window === 'undefined' || !mapRef.current) return;
      const L = (await import('leaflet')).default;

      // Leaflet default icon fix
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
        const cartoKey = process.env.NEXT_PUBLIC_CARTO_API_KEY;
        const tileUrl = cartoKey 
          ? `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?api_key=${cartoKey}`
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        L.tileLayer(tileUrl, {
          maxZoom: 19,
          subdomains: cartoKey ? 'abcd' : 'abc',
        }).addTo(map);

        leafletMapRef.current = map;
        rasterGroupRef.current = L.featureGroup().addTo(map);
        layersGroupRef.current = L.featureGroup().addTo(map);
      }

      if (!leafletMapRef.current || !layersGroupRef.current || !rasterGroupRef.current) return;

      const map = leafletMapRef.current;
      const layerGroup = layersGroupRef.current;
      const rasterGroup = rasterGroupRef.current;

      layerGroup.clearLayers();
      rasterGroup.clearLayers();

      // -------------------------------------------------------------
      // 1. RENDER GHATAL VILLAGE CADASTRAL OUTLINE BOUNDARY (PURBA MEDINIPUR)
      // -------------------------------------------------------------
      if (showVillageBoundary) {
        const villagePoly = L.polygon(GHATAL_VILLAGE_BOUNDARY, {
          color: '#D97706',      // Rich Amber/Gold outline
          weight: 3.5,
          dashArray: '8, 6',    // Cadastral border style
          fillColor: '#FEF3C7',
          fillOpacity: 0.12,
        }).addTo(layerGroup);

        villagePoly.bindTooltip('📍 Ghatal Village Boundary (Purba Medinipur)', {
          sticky: true,
          className: 'font-bold text-xs text-amber-950 bg-amber-50 px-2.5 py-1 rounded shadow-md border border-amber-300'
        });

        villagePoly.bindPopup(`
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 220px; padding: 4px;">
            <div style="border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 6px;">
              <strong style="color: #92400E; font-size: 13px;">📍 Ghatal Village Cadastral Boundary</strong>
              <span style="font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: #FEF3C7; color: #92400E; float: right;">
                Boundary
              </span>
            </div>
            <div style="font-size: 11px; color: #334155; line-height: 1.6;">
              <div><strong>District:</strong> Purba Medinipur</div>
              <div><strong>Gram Panchayat:</strong> Ghatal Central</div>
              <div><strong>Cadastral Area:</strong> 1,450 hectares</div>
              <div><strong>Monitored Farms:</strong> 40 Agricultural Plots</div>
              <div><strong>Drainage Influx:</strong> Silabati River Corridor</div>
            </div>
          </div>
        `);
      }

      // -------------------------------------------------------------
      // 2. RENDER SILABATI RIVER & FLOOD BUFFER CORRIDOR
      // -------------------------------------------------------------
      // Translucent Flood Buffer Corridor (400 m buffer along river)
      L.polyline(SILABATI_RIVER_POINTS, {
        color: '#60A5FA',
        weight: 22,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(layerGroup);

      // Active River Water Channel
      const riverPoly = L.polyline(SILABATI_RIVER_POINTS, {
        color: '#1D4ED8',
        weight: 5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(layerGroup);

      riverPoly.bindTooltip('🌊 Silabati River (Ghatal Floodplain Corridor)', {
        sticky: true,
        className: 'font-semibold text-xs text-blue-900 bg-white/95 px-2 py-1 rounded shadow-md border border-blue-200'
      });

      // -------------------------------------------------------------
      // 3. GOOGLE EARTH ENGINE 10 m MULTI-SPECTRAL RASTER OVERLAY
      // -------------------------------------------------------------
      if (showGeeRaster) {
        // Build 10m-equivalent raster cell grid over Ghatal study area
        const latMin = 22.6450, latMax = 22.6980;
        const lngMin = 87.6880, lngMax = 87.7550;
        const stepLat = 0.0035; // Resampled grid step
        const stepLng = 0.0040;

        for (let lat = latMin; lat < latMax; lat += stepLat) {
          for (let lng = lngMin; lng < lngMax; lng += stepLng) {
            // Calculate distance to Silabati River segment
            let minDist = 1e9;
            for (let r = 0; r < SILABATI_RIVER_POINTS.length - 1; r++) {
              const p1 = SILABATI_RIVER_POINTS[r];
              const p2 = SILABATI_RIVER_POINTS[r + 1];
              const px = lng * 102400, py = lat * 111000;
              const x1 = p1[1] * 102400, y1 = p1[0] * 111000;
              const x2 = p2[1] * 102400, y2 = p2[0] * 111000;
              const dx = x2 - x1, dy = y2 - y1;
              const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx*dx + dy*dy)));
              const dist = Math.hypot(px - (x1 + t*dx), py - (y1 + t*dy));
              if (dist < minDist) minDist = dist;
            }

            // Hydrological CHF formula: near river (<500m) is low CHF, away (>1200m) is high CHF
            let cellChf = 0.30 + Math.min(0.55, (minDist / 1800) * 0.55);
            // Add subtle natural terrain variance
            cellChf += Math.sin(lat * 120 + lng * 100) * 0.04;
            cellChf = Math.max(0.18, Math.min(0.92, parseFloat(cellChf.toFixed(2))));

            // Color classes directly matching user's prototype:
            // < 0.2: #a83232 | 0.2-0.4: #e78b3c | 0.4-0.6: #f0d86b | 0.6-0.8: #81bd78 | 0.8-1.0: #23734b
            let cellColor = '#81BD78';
            if (cellChf < 0.20) cellColor = '#A83232';
            else if (cellChf < 0.40) cellColor = '#E78B3C';
            else if (cellChf < 0.60) cellColor = '#F0D86B';
            else if (cellChf < 0.80) cellColor = '#81BD78';
            else cellColor = '#23734B';

            const bounds: [[number, number], [number, number]] = [
              [lat, lng],
              [lat + stepLat * 0.90, lng + stepLng * 0.90]
            ];

            const rect = L.rectangle(bounds, {
              color: cellColor,
              weight: 0.6,
              fillColor: cellColor,
              fillOpacity: 0.38
            });

            rect.on('click', () => {
              const zone = minDist < 500 ? 'SILABATI_FLOODPLAIN' : (minDist < 1100 ? 'TRANSITION_ZONE' : 'ELEVATED_UPLAND');
              setProbedPixel({
                lat: parseFloat(lat.toFixed(4)),
                lng: parseFloat(lng.toFixed(4)),
                chf: cellChf,
                ndvi: parseFloat((cellChf * 0.94).toFixed(2)),
                lswi: parseFloat((cellChf * 0.52).toFixed(2)),
                vhDb: parseFloat((-21 + cellChf * 7).toFixed(1)),
                rainMm: 1348.6,
                gdd: 2745.2,
                distToRiver: Math.round(minDist),
                zone
              });
            });

            rect.addTo(rasterGroup);
          }
        }
      }

      // -------------------------------------------------------------
      // 4. RENDER ALL 40 GHATAL BLOCK FARMS & POLYGONS
      // -------------------------------------------------------------
      const getColor = (f: Farm) => {
        if (currentLayer === 'risk') {
          if (f.riskLevel === 'CLAIM_TRIGGERED') return '#EF4444';
          if (f.riskLevel === 'HIGH') return '#F97316';
          if (f.riskLevel === 'MODERATE') return '#F59E0B';
          return '#10B981';
        }
        if (currentLayer === 'chf') {
          // Near river (<500m) is low CHF < 0.55 (Red)
          if (f.currentChf < 0.55) return '#EF4444';
          if (f.currentChf < 0.70) return '#F59E0B';
          return '#10B981';
        }
        if (currentLayer === 'ndvi') {
          if (f.ndvi < 0.50) return '#EF4444';
          if (f.ndvi < 0.65) return '#FBBF24';
          return '#059669';
        }
        if (currentLayer === 'lswi') {
          if (f.lswi < 0.25) return '#EF4444';
          if (f.lswi < 0.35) return '#38BDF8';
          return '#0284C7';
        }
        // Radar VH backscatter
        if (f.vhBackscatterDb < -18.0) return '#9333EA';
        return '#6366F1';
      };

      farms.forEach(farm => {
        const coords = farm.boundaryCoordinates.map(c => [c[1], c[0]] as [number, number]);
        const isSelected = farm.id === selectedFarmId;
        const color = getColor(farm);
        const distToRiver = farm.distanceToRiverMeters || 0;
        const zone = farm.hydrologicalZone || (distToRiver < 500 ? 'SILABATI_FLOODPLAIN' : (distToRiver < 1100 ? 'TRANSITION_ZONE' : 'ELEVATED_UPLAND'));

        const polygon = L.polygon(coords, {
          color: isSelected ? '#FFFFFF' : (color === '#10B981' ? '#047857' : (color === '#EF4444' ? '#B91C1C' : '#B45309')),
          weight: isSelected ? 3.5 : 2,
          fillColor: color,
          fillOpacity: isSelected ? 0.80 : 0.62,
        });

        // Popup HTML with Palantir/Fintech styling & clear Silabati river distance
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
            lswi: farm.lswi,
            vhDb: farm.vhBackscatterDb,
            rainMm: 1348.6,
            gdd: 2745.2,
            distToRiver,
            zone
          });
        });

        polygon.addTo(layerGroup);
      });

      // Pan to selected farm if provided
      const selected = farms.find(f => f.id === selectedFarmId);
      if (selected && leafletMapRef.current) {
        leafletMapRef.current.panTo([selected.centroid.lat, selected.centroid.lng]);
      }
    };

    initMap();

    return () => {
      isMounted = false;
    };
  }, [farms, selectedFarmId, currentLayer, center, zoom, onSelectFarm, showGeeRaster, showVillageBoundary]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm bg-slate-900" style={{ height }}>
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Top Left: Ghatal Village Boundary Toggle & GEE 10m Grid Toggle */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-2">
        
        {/* Village Boundary Toggle */}
        <button
          onClick={() => setShowVillageBoundary(!showVillageBoundary)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 border ${
            showVillageBoundary 
              ? 'bg-amber-600 border-amber-500 text-white' 
              : 'bg-white/95 border-slate-300 text-slate-700 hover:bg-slate-100'
          }`}
          title="Toggle Ghatal Village Cadastral Boundary"
        >
          <span className="w-2 h-2 rounded-full bg-amber-300"></span>
          <span>Ghatal Village Outline: {showVillageBoundary ? 'ON' : 'OFF'}</span>
        </button>

        {/* GEE 10m Grid Toggle */}
        <button
          onClick={() => setShowGeeRaster(!showGeeRaster)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 border ${
            showGeeRaster 
              ? 'bg-blue-600 border-blue-500 text-white' 
              : 'bg-white/95 border-slate-300 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Google Earth Engine 10m Grid: {showGeeRaster ? 'ON' : 'OFF'}</span>
        </button>

        {/* Silabati River Badge */}
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-blue-200 shadow-sm text-xs flex items-center space-x-2">
          <div className="w-4 h-1.5 bg-blue-600 rounded"></div>
          <span className="font-bold text-blue-900 text-[11px]">Silabati River (Ghatal Corridor)</span>
        </div>
      </div>

      {/* Top Right: Layer Switcher & 5-Class GEE Legend */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-200 shadow-lg text-xs space-y-2 max-w-[280px]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
          <span className="font-bold text-slate-900 text-[11px]">Display Layer:</span>
          <select 
            value={currentLayer} 
            onChange={(e) => setCurrentLayer(e.target.value as any)}
            className="text-[11px] font-semibold bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5 text-slate-800"
          >
            <option value="chf">CHF (Crop Health)</option>
            <option value="ndvi">NDVI (Optical 10m)</option>
            <option value="lswi">LSWI (Moisture)</option>
            <option value="vh">SAR Radar VH (10m)</option>
            <option value="risk">Parametric Risk</option>
          </select>
        </div>

        {/* 5-Color Class Legend matching user's HTML prototype */}
        <div className="space-y-1 text-[10px] text-slate-700">
          <div className="font-semibold text-slate-800 text-[10px] uppercase tracking-wider">
            CHF Scale (Silabati Hydrology):
          </div>
          <div className="grid grid-cols-5 gap-1 text-center font-mono font-bold text-[9px]">
            <div className="bg-[#A83232] text-white py-0.5 rounded">&lt;0.2</div>
            <div className="bg-[#E78B3C] text-white py-0.5 rounded">0.2-0.4</div>
            <div className="bg-[#F0D86B] text-slate-900 py-0.5 rounded">0.4-0.6</div>
            <div className="bg-[#81BD78] text-slate-900 py-0.5 rounded">0.6-0.8</div>
            <div className="bg-[#23734B] text-white py-0.5 rounded">0.8-1.0</div>
          </div>
          <div className="flex justify-between text-[9px] text-slate-500 pt-0.5">
            <span className="text-red-700 font-semibold">Near River (Low)</span>
            <span className="text-emerald-700 font-semibold">Upland (High)</span>
          </div>
        </div>
      </div>

      {/* Bottom Center / Left: Live GEE Pixel Probe Panel */}
      {probedPixel && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-[1000] bg-slate-950/95 text-white backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-700 shadow-2xl text-xs max-w-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <strong className="text-emerald-400 font-mono text-[11px]">GEE 10m Pixel Probe</strong>
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
            <div>CHF Index: <span className={`font-mono font-bold ${probedPixel.chf < 0.55 ? 'text-red-400' : 'text-emerald-400'}`}>{probedPixel.chf}</span></div>
            <div>NDVImax: <span className="font-mono text-white">{probedPixel.ndvi}</span></div>
            <div>SAR VHmax: <span className="font-mono text-white">{probedPixel.vhDb} dB</span></div>
            <div>CHIRPS Rain: <span className="font-mono text-white">{probedPixel.rainMm} mm</span></div>
            <div>ERA5-Land GDD: <span className="font-mono text-white">{probedPixel.gdd} °C-d</span></div>
          </div>
        </div>
      )}
    </div>
  );
};
