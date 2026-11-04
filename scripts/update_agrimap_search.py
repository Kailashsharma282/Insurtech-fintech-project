with open('src/components/maps/AgriMap.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update search state variables
old_state_block = '''  // SEARCH BAR STATE
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [activeSearchedArea, setActiveSearchedArea] = useState<SearchableArea | null>(null);'''

new_state_block = '''  // SEARCH BAR & PAN-INDIA TELEMETRY STATE
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [activeSearchedArea, setActiveSearchedArea] = useState<SearchableArea | null>(null);
  const [panIndiaMatches, setPanIndiaMatches] = useState<SearchableArea[]>([]);
  const [isSearchingPanIndia, setIsSearchingPanIndia] = useState<boolean>(false);
  const [liveVillageTelemetry, setLiveVillageTelemetry] = useState<any>(null);
  const [isLoadingTelemetry, setIsLoadingTelemetry] = useState<boolean>(false);'''

if old_state_block in text:
    text = text.replace(old_state_block, new_state_block)

# 2. Add Debounced Pan-India Search effect
old_search_results = '''  // Search Results filtering
  const searchResults = useMemo<{
    areaMatches: SearchableArea[];
    farmMatches: Farm[];
  }>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { areaMatches: [], farmMatches: [] };

    const areaMatches = SEARCHABLE_AREAS.filter(area => 
      area.name.toLowerCase().includes(q) ||
      area.district.toLowerCase().includes(q) ||
      area.aliases.some(a => a.includes(q))
    );

    const farmMatches = farms.filter(f => 
      f.plotNumber.toLowerCase().includes(q) ||
      f.farmerName.toLowerCase().includes(q) ||
      f.name.toLowerCase().includes(q)
    ).slice(0, 4);

    return { areaMatches, farmMatches };
  }, [searchQuery, farms]);'''

new_search_results = '''  // Debounced Pan-India Nominatim & Local Search
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setPanIndiaMatches([]);
      setIsSearchingPanIndia(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingPanIndia(true);
      try {
        const res = await fetch(`/api/villages/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.results)) {
          setPanIndiaMatches(data.results);
        }
      } catch (err) {
        console.warn('Pan-India search error:', err);
      } finally {
        setIsSearchingPanIndia(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Combined Search Results (Local Curated + Pan-India OSM Geocoded)
  const searchResults = useMemo<{
    areaMatches: SearchableArea[];
    farmMatches: Farm[];
  }>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { areaMatches: [], farmMatches: [] };

    // Combine local matches and pan-India API results
    const combinedAreas: SearchableArea[] = [...panIndiaMatches];
    const seen = new Set(panIndiaMatches.map(a => a.name.toLowerCase()));

    SEARCHABLE_AREAS.forEach(area => {
      if (
        (area.name.toLowerCase().includes(q) ||
        area.district.toLowerCase().includes(q) ||
        area.aliases.some(a => a.includes(q))) &&
        !seen.has(area.name.toLowerCase())
      ) {
        combinedAreas.unshift(area);
        seen.add(area.name.toLowerCase());
      }
    });

    const farmMatches = farms.filter(f => 
      f.plotNumber.toLowerCase().includes(q) ||
      f.farmerName.toLowerCase().includes(q) ||
      f.name.toLowerCase().includes(q)
    ).slice(0, 4);

    return { areaMatches: combinedAreas.slice(0, 8), farmMatches };
  }, [searchQuery, farms, panIndiaMatches]);'''

if old_search_results in text:
    text = text.replace(old_search_results, new_search_results)

# 3. Update handleSelectArea to fetch live Copernicus & OpenWeather telemetry
old_handle_select = '''  const handleSelectArea = (area: SearchableArea) => {
    setActiveSearchedArea(area);
    setIsSearchOpen(false);
    setSearchQuery(area.name);
  };'''

new_handle_select = '''  const handleSelectArea = async (area: SearchableArea) => {
    setActiveSearchedArea(area);
    setIsSearchOpen(false);
    setSearchQuery(area.name);

    // Fetch live Copernicus CDSE and OpenWeather telemetry for any Indian village
    setIsLoadingTelemetry(true);
    try {
      const lat = area.center[0];
      const lon = area.center[1];
      const res = await fetch(`/api/villages/telemetry?village=${encodeURIComponent(area.name)}&lat=${lat}&lon=${lon}&district=${encodeURIComponent(area.district)}`);
      const data = await res.json();
      if (data.success && data.telemetry) {
        setLiveVillageTelemetry(data.telemetry);
      }
    } catch (err) {
      console.warn('Telemetry fetch error:', err);
    } finally {
      setIsLoadingTelemetry(false);
    }
  };'''

if old_handle_select in text:
    text = text.replace(old_handle_select, new_handle_select)

# 4. Update handleResetToGhatal
old_handle_reset = '''  const handleResetToGhatal = () => {
    setActiveSearchedArea(null);
    setSearchQuery('');
    if (leafletMapRef.current) {
      leafletMapRef.current.flyToBounds(GEE_BOUNDS, { padding: [15, 15], duration: 1.2 });
    }
  };'''

new_handle_reset = '''  const handleResetToGhatal = () => {
    setActiveSearchedArea(null);
    setSearchQuery('');
    setLiveVillageTelemetry(null);
    if (leafletMapRef.current) {
      leafletMapRef.current.flyToBounds(GEE_BOUNDS, { padding: [15, 15], duration: 1.2 });
    }
  };'''

if old_handle_reset in text:
    text = text.replace(old_handle_reset, new_handle_reset)

# 5. Update input placeholder
old_placeholder = 'placeholder="🔍 Search Area, Village, or District for boundary (e.g. \'Ghatal\', \'Purba Medinipur\', \'Kharar\', \'Plot #204\')..."'
new_placeholder = 'placeholder="🔍 Search any village, tehsil or district across all India (e.g. \'Ghatal\', \'Varanasi\', \'Baramati\', \'Kalyani\', \'Guntur\')..."'

if old_placeholder in text:
    text = text.replace(old_placeholder, new_placeholder)

# 6. Add Live Telemetry Banner below search bar when liveVillageTelemetry is present
old_search_container_end = '        {/* Search Results Dropdown */}'
telemetry_banner_snippet = '''        {/* Live Pan-India Copernicus & Weather Telemetry Banner */}
        {liveVillageTelemetry && (
          <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-3 sm:p-4 rounded-2xl border border-blue-500/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3 animate-fadeIn">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded bg-blue-500/20 text-blue-300 text-xs">📍</span>
                <span className="font-extrabold text-xs sm:text-sm text-white">
                  {liveVillageTelemetry.village}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  {liveVillageTelemetry.district}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ✓ CDSE Live
                </span>
              </div>
              <div className="text-[11px] text-slate-300 flex items-center space-x-3">
                <span>🌡️ {liveVillageTelemetry.liveWeather.tempC}°C ({liveVillageTelemetry.liveWeather.condition})</span>
                <span>💧 Humidity {liveVillageTelemetry.liveWeather.humidityPct}%</span>
                <span>💨 Wind {liveVillageTelemetry.liveWeather.windSpeedMps} m/s</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">CHF Index</div>
                <div className="text-xs sm:text-sm font-black text-emerald-400 font-mono">
                  {liveVillageTelemetry.satelliteTelemetry.chf}
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">S2 NDVI</div>
                <div className="text-xs sm:text-sm font-black text-blue-300 font-mono">
                  {liveVillageTelemetry.satelliteTelemetry.ndvi}
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">S1 VH Radar</div>
                <div className="text-xs sm:text-sm font-black text-purple-300 font-mono">
                  {liveVillageTelemetry.satelliteTelemetry.vhRadarBackscatterDb} dB
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Status</div>
                <div className="text-xs font-bold text-emerald-300">
                  {liveVillageTelemetry.satelliteTelemetry.vegetationStatus}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Results Dropdown */}'''

if old_search_container_end in text and 'Live Pan-India Copernicus & Weather Telemetry Banner' not in text:
    text = text.replace(old_search_container_end, telemetry_banner_snippet)

with open('src/components/maps/AgriMap.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated AgriMap.tsx with Pan-India search & live telemetry!')
