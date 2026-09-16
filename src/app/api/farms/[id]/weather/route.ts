import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const farm = store.getFarmById(id);

  if (!farm) {
    return NextResponse.json({ success: false, error: 'Farm not found' }, { status: 404 });
  }

  // 7-day forecast for the agro-climatic zone
  const forecast = [
    { day: 'Today', tempMax: 32, tempMin: 25, condition: 'Partly Cloudy', rainMm: 4.2, humidityPct: 78, windKmh: 14 },
    { day: 'Tomorrow', tempMax: 33, tempMin: 26, condition: 'Scattered Showers', rainMm: 12.0, humidityPct: 82, windKmh: 16 },
    { day: 'Thu', tempMax: 31, tempMin: 25, condition: 'Moderate Rain', rainMm: 22.5, humidityPct: 88, windKmh: 20 },
    { day: 'Fri', tempMax: 30, tempMin: 24, condition: 'Light Drizzle', rainMm: 6.0, humidityPct: 80, windKmh: 12 },
    { day: 'Sat', tempMax: 32, tempMin: 25, condition: 'Sunny / Humid', rainMm: 0.0, humidityPct: 72, windKmh: 10 },
    { day: 'Sun', tempMax: 34, tempMin: 26, condition: 'Clear Skies', rainMm: 0.0, humidityPct: 68, windKmh: 9 },
    { day: 'Mon', tempMax: 33, tempMin: 25, condition: 'Partly Cloudy', rainMm: 1.5, humidityPct: 74, windKmh: 11 },
  ];

  return NextResponse.json({
    success: true,
    district: farm.district,
    current: {
      temperatureC: 31.4,
      relativeHumidityPct: 76,
      precipitationPast24hMm: 4.2,
      windSpeedKmh: 14.5,
      heatStressIndex: 'NORMAL',
      droughtIndex: 'MODERATE_MOISTURE',
      evapotranspirationMm: 4.1
    },
    forecast
  });
}
