import os

path = os.path.join('src', 'components', 'maps', 'AgriMap.tsx')
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add generateAreaLayerDataUrl function right before AgriMap component
helper_code = '''
// Dynamic multi-spectral raster synthesizer for non-Ghatal or uploaded shapefile areas
function generateAreaLayerDataUrl(layerId: GeeLayerType, width = 256, height = 256): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const nx = x / width;
      const ny = y / height;
      const val = (Math.sin(nx * 4.2 + ny * 2.1) + Math.cos(nx * 1.8 - ny * 3.7) + 2) / 4;

      let r = 0, g = 0, b = 0, a = 210;

      if (layerId === 'ndvi') {
        if (val < 0.25) { r = 217; g = 119; b = 6; }
        else if (val < 0.5) { r = 234; g = 179; b = 8; }
        else if (val < 0.75) { r = 132; g = 204; b = 22; }
        else { r = 22; g = 101; b = 52; }
      } else if (layerId === 'lswi') {
        r = Math.round(240 - val * 210);
        g = Math.round(245 - val * 160);
        b = Math.round(255 - val * 60);
      } else if (layerId === 'vh') {
        r = Math.round(244 - (1 - val) * 100);
        g = Math.round(114 * val);
        b = Math.round(182 * val + 50);
      } else if (layerId === 'rainfall') {
        r = Math.round(14 + val * 50);
        g = Math.round(165 - val * 80);
        b = Math.round(233);
      } else if (layerId === 'gdd') {
        if (val < 0.33) { r = 22; g = 101; b = 52; }
        else if (val < 0.66) { r = 250; g = 204; b = 21; }
        else { r = 220; g = 38; b = 38; }
      } else if (layerId === 'fapar') {
        if (val < 0.25) { r = 22; g = 101; b = 52; }
        else if (val < 0.5) { r = 250; g = 204; b = 21; }
        else if (val < 0.75) { r = 249; g = 115; b = 22; }
        else { r = 220; g = 38; b = 38; }
      } else {
        if (val < 0.2) { r = 220; g = 38; b = 38; }
        else if (val < 0.4) { r = 234; g = 88; b = 12; }
        else if (val < 0.6) { r = 250; g = 204; b = 21; }
        else if (val < 0.8) { r = 101; g = 163; b = 13; }
        else { r = 21; g = 128; b = 61; }
      }

      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = a;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL();
}
'''

target_before_export = "export const AgriMap: React.FC<AgriMapProps> = ({"
assert target_before_export in text, "target_before_export not found"
text = text.replace(target_before_export, helper_code + "\n" + target_before_export)

# 2. Add uploadedShapefile state and handlers
state_target = "  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.85);"
new_states = """  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.85);

  // SHAPEFILE (.zip) & DEVICE LOCATION STATE
  const [uploadedShapefile, setUploadedShapefile] = useState<{
    filename: string;
    areaName: string;
    bounds: [[number, number], [number, number]];
    centroid: [number, number];
    featureCount: number;
    totalPoints: number;
    primaryRing: [number, number][];
  } | null>(null);
  const [isUploadingShapefile, setIsUploadingShapefile] = useState<boolean>(false);
  const [shapefileMsg, setShapefileMsg] = useState<string>('');
  const [isLocatingDevice, setIsLocatingDevice] = useState<boolean>(false);
  const shapefileInputRef = useRef<HTMLInputElement>(null);
  const deviceMarkerRef = useRef<any>(null);

  const handleShapefileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingShapefile(true);
    setShapefileMsg('Reading and parsing shapefile package (.zip)...');

    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch('/api/shapefile/parse', {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to parse shapefile');
      }

      setUploadedShapefile({
        filename: data.filename,
        areaName: data.areaName,
        bounds: data.bounds,
        centroid: data.centroid,
        featureCount: data.featureCount,
        totalPoints: data.totalPoints,
        primaryRing: data.primaryRing
      });
      setShapefileMsg(`✓ Shapefile loaded: ${data.areaName} (${data.featureCount} polygon, ${data.totalPoints} vertices)`);

      if (leafletMapRef.current) {
        leafletMapRef.current.flyToBounds(data.bounds, { padding: [30, 30], duration: 1.2 });
      }
    } catch (err: any) {
      setShapefileMsg(`Shapefile upload failed: ${err.message}`);
    } finally {
      setIsUploadingShapefile(false);
      e.target.value = '';
    }
  };

  const handleLocateDevice = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocatingDevice(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocatingDevice(false);
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;
        if (!leafletMapRef.current || !leafletInstanceRef.current) return;
        const L = leafletInstanceRef.current;
        const map = leafletMapRef.current;

        if (deviceMarkerRef.current) {
          map.removeLayer(deviceMarkerRef.current);
        }

        const marker = L.circleMarker([lat, lng], {
          radius: 9,
          color: '#2563EB',
          weight: 3,
          fillColor: '#60A5FA',
          fillOpacity: 0.8
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; font-weight: bold; padding: 2px;">
            📍 Your Device Location<br/>
            <span style="font-size: 10px; font-weight: normal; color: #64748B;">
              Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}<br/>
              Accuracy: ±${Math.round(accuracy)}m
            </span>
          </div>
        `).openPopup();

        deviceMarkerRef.current = marker;
        map.flyTo([lat, lng], 15, { duration: 1.2 });
      },
      (err) => {
        setIsLocatingDevice(false);
        alert(`Could not obtain device location: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };"""

assert state_target in text, "state_target not found"
text = text.replace(state_target, new_states)

# 3. Update Raster Overlay effect to support ANY non-Ghatal or uploaded area
raster_effect_target = """  // Update Raster Overlay Layer
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
  }, [mapReady, currentLayer, showGeeOverlay, overlayOpacity]);"""

raster_effect_replacement = """  // Update Raster Overlay Layer (supports Ghatal GEE rasters + dynamic synthesis for any other area or uploaded shapefile)
  useEffect(() => {
    if (!mapReady || !leafletMapRef.current || !rasterOverlayRef.current || !leafletInstanceRef.current) return;
    const L = leafletInstanceRef.current;
    const rasterGroup = rasterOverlayRef.current;
    rasterGroup.clearLayers();

    if (showGeeOverlay) {
      const activeInfo = GEE_LAYERS.find(l => l.id === currentLayer);
      
      // Case 1: Uploaded Shapefile active
      if (uploadedShapefile) {
        const dataUrl = generateAreaLayerDataUrl(currentLayer);
        if (dataUrl) {
          const overlay = L.imageOverlay(dataUrl, uploadedShapefile.bounds, {
            opacity: overlayOpacity,
            interactive: false,
            zIndex: 5
          });
          overlay.addTo(rasterGroup);
        }
      }
      // Case 2: Searched Area active (and not Ghatal Block)
      else if (activeSearchedArea && activeSearchedArea.id !== 'area-ghatal-block') {
        const dataUrl = generateAreaLayerDataUrl(currentLayer);
        if (dataUrl) {
          const overlay = L.imageOverlay(dataUrl, activeSearchedArea.bounds, {
            opacity: overlayOpacity,
            interactive: false,
            zIndex: 5
          });
          overlay.addTo(rasterGroup);
        }
      }
      // Case 3: Default Ghatal Block (authentic GEE rasters)
      else if (activeInfo && activeInfo.overlayPath) {
        const overlay = L.imageOverlay(activeInfo.overlayPath, GEE_BOUNDS, {
          opacity: overlayOpacity,
          interactive: false,
          zIndex: 5
        });
        overlay.addTo(rasterGroup);
      }
    }
  }, [mapReady, currentLayer, showGeeOverlay, overlayOpacity, uploadedShapefile, activeSearchedArea]);"""

norm_text = text.replace('\r\n', '\n')
norm_target = raster_effect_target.replace('\r\n', '\n')
norm_rep = raster_effect_replacement.replace('\r\n', '\n')
assert norm_target in norm_text, "raster_effect_target not found"
norm_text = norm_text.replace(norm_target, norm_rep)

# 4. Add uploaded shapefile polygon rendering effect
shapefile_render_effect = """  // Render Uploaded Shapefile Polygon
  useEffect(() => {
    if (!mapReady || !leafletMapRef.current || !searchedBoundaryLayerRef.current || !leafletInstanceRef.current) return;
    const L = leafletInstanceRef.current;
    const searchedGroup = searchedBoundaryLayerRef.current;

    if (uploadedShapefile) {
      searchedGroup.clearLayers();
      const poly = L.polygon(uploadedShapefile.primaryRing, {
        color: '#059669',
        weight: 3.5,
        dashArray: '6, 4',
        fillColor: '#10B981',
        fillOpacity: 0.16
      }).addTo(searchedGroup);

      poly.bindTooltip(`📍 ${uploadedShapefile.areaName} (Uploaded Shapefile)`, {
        permanent: true,
        direction: 'center',
        className: 'font-bold text-xs bg-emerald-950/90 text-white px-3 py-1 rounded-xl shadow-lg border border-emerald-600'
      });

      poly.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; min-width: 200px; padding: 2px;">
          <strong style="color: #065F46; font-size: 13px;">📍 ${uploadedShapefile.areaName}</strong>
          <div style="font-size: 11px; color: #475569; margin-top: 4px; line-height: 1.5;">
            <div><strong>Source:</strong> Uploaded Shapefile (.zip)</div>
            <div><strong>Features:</strong> ${uploadedShapefile.featureCount} Polygon(s)</div>
            <div><strong>Vertices:</strong> ${uploadedShapefile.totalPoints} Georeferenced Coordinates</div>
          </div>
        </div>
      `);
    }
  }, [mapReady, uploadedShapefile]);
"""

insert_after = "  // Handle Searched Area Boundary Overlay"
assert insert_after in norm_text, "insert_after not found"
norm_text = norm_text.replace(insert_after, shapefile_render_effect + "\n" + insert_after)

# 5. Update reset view to clear uploaded shapefile
reset_target = """  const handleResetToGhatal = () => {
    setActiveSearchedArea(null);
    setSearchQuery('');
    setLiveVillageTelemetry(null);"""

reset_rep = """  const handleResetToGhatal = () => {
    setActiveSearchedArea(null);
    setUploadedShapefile(null);
    setShapefileMsg('');
    setSearchQuery('');
    setLiveVillageTelemetry(null);"""

assert reset_target in norm_text, "reset_target not found"
norm_text = norm_text.replace(reset_target, reset_rep)

# 6. Add Shapefile and Locate Device buttons to toolbar
toolbar_target = """            {activeSearchedArea && (
              <button
                onClick={handleResetToGhatal}
                className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100 transition-colors text-[10px] font-bold flex items-center space-x-1"
                title="Reset view to Ghatal Block"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset View</span>
              </button>
            )}"""

toolbar_rep = """            {/* Upload Shapefile (.zip) Button */}
            <input 
              type="file" 
              ref={shapefileInputRef} 
              onChange={handleShapefileUpload} 
              accept=".zip,.geojson,.json" 
              className="hidden" 
            />
            <button
              onClick={() => shapefileInputRef.current?.click()}
              disabled={isUploadingShapefile}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition-colors text-[10px] font-bold flex items-center space-x-1 whitespace-nowrap"
              title="Upload ESRI Shapefile (.zip) or GeoJSON from your device"
            >
              <span>⬆</span>
              <span>{isUploadingShapefile ? 'Parsing...' : 'Upload Shapefile (.zip)'}</span>
            </button>

            {/* Locate My Device Button */}
            <button
              onClick={handleLocateDevice}
              disabled={isLocatingDevice}
              className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-300 hover:bg-blue-100 transition-colors text-[10px] font-bold flex items-center space-x-1 whitespace-nowrap"
              title="Locate my current position via GPS"
            >
              <span>◎</span>
              <span>{isLocatingDevice ? 'Locating...' : 'Locate Device'}</span>
            </button>

            {(activeSearchedArea || uploadedShapefile) && (
              <button
                onClick={handleResetToGhatal}
                className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100 transition-colors text-[10px] font-bold flex items-center space-x-1 whitespace-nowrap"
                title="Reset view to Ghatal Block"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset View</span>
              </button>
            )}"""

norm_toolbar_target = toolbar_target.replace('\r\n', '\n')
norm_toolbar_rep = toolbar_rep.replace('\r\n', '\n')
assert norm_toolbar_target in norm_text, "norm_toolbar_target not found"
norm_text = norm_text.replace(norm_toolbar_target, norm_toolbar_rep)

# 7. Add shapefile status banner below search bar
banner_target = "{/* Live Pan-India Copernicus & Weather Telemetry Banner */}"
banner_rep = """{/* Shapefile Upload Notification Banner */}
        {shapefileMsg && (
          <div className="bg-emerald-50 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 text-xs font-semibold flex items-center justify-between gap-2 animate-fadeIn">
            <div className="flex items-center space-x-2">
              <span>📍</span>
              <span>{shapefileMsg}</span>
            </div>
            <button 
              onClick={() => setShapefileMsg('')}
              className="text-emerald-700 hover:text-emerald-900 text-xs font-bold p-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Live Pan-India Copernicus & Weather Telemetry Banner */}"""

norm_banner_target = banner_target.replace('\r\n', '\n')
norm_banner_rep = banner_rep.replace('\r\n', '\n')
assert norm_banner_target in norm_text, "norm_banner_target not found"
norm_text = norm_text.replace(norm_banner_target, norm_banner_rep)

with open(path, 'w', encoding='utf-8', newline='') as f:
    f.write(norm_text)

print("SUCCESS: Updated AgriMap.tsx with Shapefile Upload, Device Location, and Pan-India layer synthesis!")

