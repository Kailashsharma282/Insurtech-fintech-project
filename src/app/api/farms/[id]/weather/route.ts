import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';
import { fetchLiveWeather } from '@/lib/weather';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const farm = store.getFarmById(id);

  if (!farm) {
    return NextResponse.json({ success: false, error: 'Farm not found' }, { status: 404 });
  }

  const weather = await fetchLiveWeather(
    farm.centroid.lat,
    farm.centroid.lng,
    farm.name,
    farm.district
  );

  return NextResponse.json({
    success: true,
    district: farm.district,
    isRealTime: weather.isRealTime,
    provider: weather.provider,
    fetchedAt: weather.fetchedAt,
    current: weather.current,
    forecast: weather.forecast
  });
}
