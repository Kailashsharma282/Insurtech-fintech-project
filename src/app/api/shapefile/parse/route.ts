import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') || formData.get('shapefile');
    
    if (!file || typeof file !== 'object' || !('arrayBuffer' in file)) {
      return NextResponse.json({ success: false, error: 'No shapefile or geojson uploaded' }, { status: 400 });
    }

    const fileName = (file as { name?: string }).name || 'boundary.zip';
    const ab = await (file as Blob).arrayBuffer();
    const buffer = Buffer.from(ab);

    // If already a GeoJSON or JSON file
    if (fileName.toLowerCase().endsWith('.geojson') || fileName.toLowerCase().endsWith('.json')) {
      try {
        const parsed = JSON.parse(buffer.toString('utf-8'));
        // Extract features or coordinates
        let rings: [number, number][][] = [];
        if (parsed.type === 'FeatureCollection' && parsed.features) {
          for (const f of parsed.features) {
            if (f.geometry && f.geometry.coordinates) {
              const geomType = f.geometry.type;
              if (geomType === 'Polygon') {
                rings.push(f.geometry.coordinates[0].map(([lng, lat]: [number, number]) => [lat, lng]));
              } else if (geomType === 'MultiPolygon') {
                for (const poly of f.geometry.coordinates) {
                  rings.push(poly[0].map(([lng, lat]: [number, number]) => [lat, lng]));
                }
              }
            }
          }
        } else if (parsed.type === 'Polygon' && parsed.coordinates) {
          rings.push(parsed.coordinates[0].map(([lng, lat]: [number, number]) => [lat, lng]));
        }

        if (rings.length === 0) {
          return NextResponse.json({ success: false, error: 'No valid polygon found in GeoJSON' }, { status: 400 });
        }

        const allPts = rings.flat();
        const lats = allPts.map(p => p[0]);
        const lons = allPts.map(p => p[1]);

        return NextResponse.json({
          success: true,
          filename: fileName,
          areaName: fileName.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
          projection: 'WGS84',
          featureCount: rings.length,
          totalPoints: allPts.length,
          bounds: [
            [Math.min(...lats), Math.min(...lons)],
            [Math.max(...lats), Math.max(...lons)]
          ],
          centroid: [
            lats.reduce((a, b) => a + b, 0) / lats.length,
            lons.reduce((a, b) => a + b, 0) / lons.length
          ],
          primaryRing: rings[0],
          allRings: rings
        });
      } catch (err: any) {
        return NextResponse.json({ success: false, error: 'Invalid GeoJSON format: ' + err.message }, { status: 400 });
      }
    }

    // Otherwise, process as .zip ESRI Shapefile
    const uploadDir = path.resolve('tmp_uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const tmpZipPath = path.resolve(uploadDir, `shp_${Date.now()}_${Math.random().toString(36).substring(7)}.zip`);
    fs.writeFileSync(tmpZipPath, buffer);

    const scriptPath = path.resolve('scripts', 'parse_shapefile_zip.py');
    const { stdout } = await execAsync(`python "${scriptPath}" "${tmpZipPath}"`, { timeout: 15000 });

    if (fs.existsSync(tmpZipPath)) {
      fs.unlinkSync(tmpZipPath);
    }

    const lines = stdout.trim().split('\n');
    const jsonStart = lines.findIndex(l => l.trim().startsWith('{'));
    const jsonEnd = lines.length - 1 - [...lines].reverse().findIndex(l => l.trim().endsWith('}'));
    const jsonStr = (jsonStart >= 0 && jsonEnd >= jsonStart) ? lines.slice(jsonStart, jsonEnd + 1).join('\n') : stdout.trim();

    const parsed = JSON.parse(jsonStr);
    if (parsed.error) {
      return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error('Shapefile parse error:', err);
    return NextResponse.json({ success: false, error: 'Failed to parse shapefile: ' + err.message }, { status: 500 });
  }
}
