import { NextRequest, NextResponse } from 'next/server';
import { getLiveVillageTelemetry, VILLAGE_COORDINATES, getCopernicusAccessToken } from '@/lib/services/copernicus';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const village = searchParams.get('village') || 'Ghatal';
    const listAll = searchParams.get('list') === 'true';

    // If requested list of registered villages
    if (listAll) {
      const villages = Object.entries(VILLAGE_COORDINATES).map(([key, val]) => ({
        slug: key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        district: val.district,
        block: val.block,
        coordinates: { lat: val.lat, lon: val.lon },
      }));

      const hasCopernicusToken = !!(await getCopernicusAccessToken());

      return NextResponse.json({
        totalVillages: villages.length,
        copernicusApiActive: hasCopernicusToken,
        villages,
      });
    }

    const telemetry = await getLiveVillageTelemetry(village);

    return NextResponse.json({
      success: true,
      telemetry,
    });
  } catch (error) {
    console.error('Error in village telemetry route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve village telemetry' },
      { status: 500 }
    );
  }
}
