export interface SolarIntensitySegments {
  darkness: number; // Oscuridad
  direct: number; // Luz Solar Directa
  diffuse: number; // Luz Solar Difusa
  reflected: number; // Reflejada
}

export interface SolarIntensityLinePoint {
  timeLabel: string; // 00:00, 04:00, ...
  value: number; // Intensidad en lux
}

export interface SolarIntensityReport {
  totalEnergyReceived: number; // Energía total recibida (texto superior)
  maxScale: number; // para el eje (ej: 100000)
  // Para el gráfico principal (tipo "A..G" con curva).
  linePoints: SolarIntensityLinePoint[]; // 7 puntos

  // (Opcional) si más adelante quieres conservar el diagrama por segmentos.
  segments?: SolarIntensitySegments;
}

export interface RadiationTrendPoint {
  dayLabel: string; // "1 día 1" ... "7 días"
  value: number; // radiación
}

export interface NivelDeLuzReport {
  solarIntensity: SolarIntensityReport;
  radiationTrend7Days: RadiationTrendPoint[];
}

