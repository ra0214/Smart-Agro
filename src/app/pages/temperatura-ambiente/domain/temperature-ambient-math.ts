import {
  TemperatureAmbientReport,
  TemperatureHourlyPoint,
  TemperatureStats
} from './temperature-ambient.types';

export function formatTimeLabel(hour: number, minute: number): string {
  const hh = String(Math.max(0, Math.min(23, Math.floor(hour)))).padStart(2, '0');
  const mm = String(Math.max(0, Math.min(59, Math.floor(minute)))).padStart(2, '0');
  return `${hh}:${mm}`;
}

function toTotalMinutes(p: TemperatureHourlyPoint): number {
  return p.hour * 60 + p.minute;
}

export function calculateTemperatureStats(daily: TemperatureHourlyPoint[]): TemperatureStats {
  if (!daily.length) {
    return {
      maxTemp: 0,
      maxTimeLabel: '00:00',
      minTemp: 0,
      minTimeLabel: '00:00',
      avgTemp: 0,
      maxTotalMinutes: 0,
      minTotalMinutes: 0
    };
  }

  let maxPoint = daily[0];
  let minPoint = daily[0];
  let sum = 0;

  for (const p of daily) {
    sum += p.tempC;
    if (p.tempC > maxPoint.tempC) maxPoint = p;
    if (p.tempC < minPoint.tempC) minPoint = p;
  }

  const avgTemp = sum / daily.length;

  return {
    maxTemp: maxPoint.tempC,
    maxTimeLabel: formatTimeLabel(maxPoint.hour, maxPoint.minute),
    minTemp: minPoint.tempC,
    minTimeLabel: formatTimeLabel(minPoint.hour, minPoint.minute),
    avgTemp,
    maxTotalMinutes: toTotalMinutes(maxPoint),
    minTotalMinutes: toTotalMinutes(minPoint)
  };
}

export function normalizeAmbientReport(report: TemperatureAmbientReport): TemperatureAmbientReport {
  // Asegura orden temporal en el gráfico (por si en el futuro el API devuelve desordenado).
  return {
    ...report,
    daily: [...report.daily].sort((a, b) => toTotalMinutes(a) - toTotalMinutes(b))
  };
}

