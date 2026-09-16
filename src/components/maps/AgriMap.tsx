'use client';

import React, { useEffect, useRef } from 'react';
import { Farm } from '@/lib/types';

interface AgriMapProps {
  farms: Farm[];
  selectedFarmId?: string;
  onSelectFarm?: (farm: Farm) => void;
  activeLayer?: 'chf' | 'ndvi' | 'lswi' | 'vh' | 'risk';
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export const AgriMap: React.FC<AgriMapProps> = ({
  farms,
  selectedFarmId,
  onSelectFarm,
  activeLayer = 'chf',
  center = [23.2384, 88.4312], // Nadia District center
  zoom = 12,
  height = '500px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const layersGroupRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (typeof window === 'undefined' || !mapRef.current) return;
      const L = (await import('leaflet')).default;

      // Fix leaflet default icon issues
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

        // CartoDB Dark Matter / Voyager tile layer for geospatial fintech aesthetic
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
        }).addTo(map);

        leafletMapRef.current = map;
        layersGroupRef.current = L.featureGroup().addTo(map);
      }

      if (!leafletMapRef.current || !layersGroupRef.current) return;

      const map = leafletMapRef.current;
      const layerGroup = layersGroupRef.current;
      layerGroup.clearLayers();

      // Determine polygon color based on active layer
      const getColor = (f: Farm) => {
        if (activeLayer === 'risk') {
          if (f.riskLevel === 'CLAIM_TRIGGERED') return '#EF4444';
          if (f.riskLevel === 'HIGH') return '#F97316';
          if (f.riskLevel === 'MODERATE') return '#F59E0B';
          return '#10B981';
        }
        if (activeLayer === 'chf') {
          if (f.currentChf < 0.55) return '#EF4444';
          if (f.currentChf < 0.65) return '#F59E0B';
          return '#10B981';
        }
        if (activeLayer === 'ndvi') {
          if (f.ndvi < 0.40) return '#EF4444';
          if (f.ndvi < 0.60) return '#FBBF24';
          return '#059669';
        }
        if (activeLayer === 'lswi') {
          if (f.lswi < 0.20) return '#EF4444';
          if (f.lswi < 0.35) return '#38BDF8';
          return '#0284C7';
        }
        // vh radar backscatter
        if (f.vhBackscatterDb < -20.0) return '#9333EA';
        return '#6366F1';
      };

      farms.forEach(farm => {
        const coords = farm.boundaryCoordinates.map(c => [c[1], c[0]] as [number, number]);
        const isSelected = farm.id === selectedFarmId;
        const color = getColor(farm);

        const polygon = L.polygon(coords, {
          color: isSelected ? '#FFFFFF' : color,
          weight: isSelected ? 3 : 2,
          fillColor: color,
          fillOpacity: isSelected ? 0.65 : 0.45,
        });

        // Popup HTML with Palantir/Fintech styling
        const popupContent = `
          <div style="font-family: sans-serif; min-width: 200px; padding: 2px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 6px;">
              <strong style="font-size: 13px; color: #0F172A;">${farm.plotNumber}</strong>
              <span style="font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: ${color}20; color: ${color};">
                ${farm.riskLevel}
              </span>
            </div>
            <div style="font-size: 11px; color: #334155; line-height: 1.5;">
              <div><strong>Farmer:</strong> ${farm.farmerName}</div>
              <div><strong>Crop:</strong> ${farm.currentCrop} (${farm.acreage} ha)</div>
              <div><strong>District:</strong> ${farm.district} (${farm.village})</div>
              <div><strong>CHF Index:</strong> <span style="font-weight: bold; color: ${color};">${farm.currentChf}</span> (Normal: ${farm.chfBaseline})</div>
              <div><strong>Soil Moisture:</strong> ${farm.soilMoisturePct}%</div>
              <div><strong>Sentinel NDVI:</strong> ${farm.ndvi}</div>
            </div>
            <div style="margin-top: 8px; text-align: right;">
              <a href="/farmer/farms/${farm.id}" style="display: inline-block; font-size: 11px; padding: 4px 8px; border-radius: 6px; background: #059669; color: white; text-decoration: none; font-weight: 500;">
                Open Intelligence &rarr;
              </a>
            </div>
          </div>
        `;

        polygon.bindPopup(popupContent);

        polygon.on('click', () => {
          if (onSelectFarm) {
            onSelectFarm(farm);
          }
        });

        polygon.addTo(layerGroup);
      });

      // Add center marker for primary farm if selected
      const selected = farms.find(f => f.id === selectedFarmId);
      if (selected && leafletMapRef.current) {
        leafletMapRef.current.panTo([selected.centroid.lat, selected.centroid.lng]);
      }
    };

    initMap();

    return () => {
      isMounted = false;
    };
  }, [farms, selectedFarmId, activeLayer, center, zoom, onSelectFarm]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm bg-slate-900" style={{ height }}>
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Mini Layer Legend Overlay */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-md text-xs">
        <div className="font-semibold text-slate-800 mb-1 flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
          <span className="uppercase tracking-wider text-[10px]">Active Layer: {activeLayer}</span>
        </div>
        <div className="flex items-center space-x-3 text-[10px] text-slate-600">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Healthy</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Moderate</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Triggered</span>
          </span>
        </div>
      </div>
    </div>
  );
};
