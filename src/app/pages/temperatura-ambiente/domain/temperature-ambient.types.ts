export interface TemperatureHourlyPoint {
  hour: number; // 0..23
  minute: number; // 0..59
  tempC: number;
}

export interface TemperatureTrendPoint {
  dayLabel: string;
  tempC: number;
}

export interface TemperatureAmbientReport {
  daily: TemperatureHourlyPoint[]; // 24 puntos
  trend7Days: TemperatureTrendPoint[]; // 7 puntos
}

export interface TemperatureStats {
  maxTemp: number;
  maxTimeLabel: string;
  minTemp: number;
  minTimeLabel: string;
  avgTemp: number;
  maxTotalMinutes: number;
  minTotalMinutes: number;
}

