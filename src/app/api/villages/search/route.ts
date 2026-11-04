import { NextRequest, NextResponse } from 'next/server';
import { SEARCHABLE_AREAS, SearchableArea } from '@/lib/db/boundaries';

interface NominatimResult {
  place_id: number;
  osm_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  class: string;
  boundingbox: [string, string, string, string]; // [south, north, west, east]
  geojson?: {
    type: 'Polygon' | 'MultiPolygon' | 'Point';
    coordinates: any;
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').trim();

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        count: 0,
        results: [],
      });
    }

    const qLower = query.toLowerCase();

    // 1. Check local pre-calibrated boundaries first (Instant)
    const localMatches: SearchableArea[] = SEARCHABLE_AREAS.filter(area =>
      area.name.toLowerCase().includes(qLower) ||
      area.district.toLowerCase().includes(qLower) ||
      area.aliases.some(a => a.toLowerCase().includes(qLower))
    );

    // 2. Query OpenStreetMap Nominatim for pan-India villages, tehsils, and districts
    let panIndiaResults: SearchableArea[] = [];

    try {
      const osmUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)},+India&format=json&polygon_geojson=1&countrycodes=in&limit=6`;
      const osmRes = await fetch(osmUrl, {
        headers: {
          'User-Agent': 'AgriSure-Parametric-InsurTech/1.0 (agrisure@crop-insurance.in)',
          'Accept-Language': 'en-IN,en;q=0.9',
        },
        next: { revalidate: 3600 }, // Cache OSM response for 1 hour
      });

      if (osmRes.ok) {
        const osmData: NominatimResult[] = await osmRes.json();

        panIndiaResults = osmData.map((item) => {
          const parts = item.display_name.split(',').map(s => s.trim());
          const shortName = parts[0];
          const state = parts.length > 2 ? parts[parts.length - 2] : 'India';
          const district = parts.length > 3 ? parts[parts.length - 3] : parts[1] || 'India';

          const lat = parseFloat(item.lat);
          const lon = parseFloat(item.lon);

          // Bounding box: [south, north, west, east]
          const south = parseFloat(item.boundingbox[0]);
          const north = parseFloat(item.boundingbox[1]);
          const west = parseFloat(item.boundingbox[2]);
          const east = parseFloat(item.boundingbox[3]);

          let boundary: [number, number][] = [];

          if (item.geojson && item.geojson.type === 'Polygon' && Array.isArray(item.geojson.coordinates[0])) {
            boundary = item.geojson.coordinates[0].map((pt: [number, number]) => [pt[1], pt[0]]);
          } else if (item.geojson && item.geojson.type === 'MultiPolygon' && Array.isArray(item.geojson.coordinates[0]?.[0])) {
            boundary = item.geojson.coordinates[0][0].map((pt: [number, number]) => [pt[1], pt[0]]);
          } else {
            // Generate rectangular polygon from bounding box
            boundary = [
              [south, west],
              [north, west],
              [north, east],
              [south, east],
              [south, west],
            ];
          }

          const areaType: 'DISTRICT' | 'BLOCK' | 'VILLAGE' = 
            item.type === 'administrative' || item.class === 'boundary'
              ? (shortName.toLowerCase().includes('district') ? 'DISTRICT' : 'BLOCK')
              : 'VILLAGE';

          return {
            id: `pan-in-${item.place_id}`,
            name: `${shortName} (${district})`,
            type: areaType,
            district: `${district}`,
            state: `${state}`,
            description: `${shortName} located in ${district}, ${state}`,
            centroid: [lat, lon] as [number, number],
            bounds: [[south, west], [north, east]] as [[number, number], [number, number]],
            boundary,
            aliases: [shortName.toLowerCase(), district.toLowerCase(), state.toLowerCase()],
          };
        });
      }
    } catch (osmErr) {
      console.warn('Pan-India Nominatim query failed, falling back to local matches:', osmErr);
    }

    // Merge & deduplicate by name
    const combined: SearchableArea[] = [...localMatches];
    const seenNames = new Set(localMatches.map(m => m.name.toLowerCase()));

    for (const r of panIndiaResults) {
      if (!seenNames.has(r.name.toLowerCase())) {
        combined.push(r);
        seenNames.add(r.name.toLowerCase());
      }
    }

    return NextResponse.json({
      success: true,
      count: combined.length,
      results: combined,
    });
  } catch (error) {
    console.error('Village search route error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search villages' },
      { status: 500 }
    );
  }
}
