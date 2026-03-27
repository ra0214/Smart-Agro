import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-humedad-relativa-chart',
  standalone: false,
  template: `
    <div class="chart-wrap" role="img" aria-label="Humedad relativa del aire y punto de rocio durante el dia">
      <div class="chart-head">Humedad Relativa del Aire y Punto de Rocio</div>

      <svg class="chart-svg" viewBox="0 0 760 430" preserveAspectRatio="none" aria-hidden="true">
        <rect x="18" y="16" width="724" height="396" class="panel"></rect>

        <defs>
          <linearGradient id="day-night" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#f8e39f"></stop>
            <stop offset="40%" stop-color="#d8e6f7"></stop>
            <stop offset="70%" stop-color="#93abd8"></stop>
            <stop offset="100%" stop-color="#31487d"></stop>
          </linearGradient>
        </defs>

        <rect x="92" y="50" width="590" height="42" fill="url(#day-night)"></rect>

        <text x="112" y="78" class="icon">⏰</text>
        <text x="184" y="78" class="icon">⏰</text>
        <text x="380" y="78" class="icon">☀️</text>
        <text x="530" y="78" class="icon">🌙</text>
        <text x="632" y="78" class="icon">⏰</text>

        <line x1="92" y1="332" x2="682" y2="332" class="axis"></line>
        <line x1="92" y1="92" x2="92" y2="332" class="axis"></line>
        <line x1="682" y1="92" x2="682" y2="332" class="axis"></line>

        <line x1="92" y1="284" x2="682" y2="284" class="grid"></line>
        <line x1="92" y1="236" x2="682" y2="236" class="grid"></line>
        <line x1="92" y1="188" x2="682" y2="188" class="grid"></line>
        <line x1="92" y1="140" x2="682" y2="140" class="grid"></line>

        <polyline class="line-rh" [attr.points]="relativePolyline"></polyline>
        <polyline class="line-dew" [attr.points]="dewPolyline"></polyline>

        <circle *ngFor="let p of relativePoints" [attr.cx]="p.x" [attr.cy]="p.y" r="4" class="dot-rh"></circle>
        <circle *ngFor="let p of dewPoints" [attr.cx]="p.x" [attr.cy]="p.y" r="3.2" class="dot-dew"></circle>

        <text x="54" y="332" class="tick">0</text>
        <text x="45" y="284" class="tick">20</text>
        <text x="45" y="236" class="tick">40</text>
        <text x="45" y="188" class="tick">60</text>
        <text x="45" y="140" class="tick">80</text>
        <text x="38" y="92" class="tick">100</text>

        <text x="695" y="332" class="tick">-15</text>
        <text x="695" y="284" class="tick">-10</text>
        <text x="695" y="236" class="tick">-5</text>
        <text x="700" y="188" class="tick">0</text>
        <text x="700" y="140" class="tick">5</text>
        <text x="700" y="92" class="tick">10</text>

        <text x="28" y="220" transform="rotate(-90 28 220)" class="axis-label">Humedad Relativa (%)</text>
        <text x="734" y="220" transform="rotate(-90 734 220)" class="axis-label">Punto de Rocio (C)</text>

        <text x="350" y="391" class="axis-label">Tiempo (Horas del Dia)</text>

        <g *ngFor="let x of xPositions; let i = index">
          <line [attr.x1]="x" y1="332" [attr.x2]="x" y2="338" class="tick-mark"></line>
          <text [attr.x]="x - 8" y="353" class="x-tick">{{ labels[i] || fallbackLabels[i] }}</text>
        </g>
      </svg>
    </div>
  `,
  styles: [
    `
      .chart-wrap { background: #ffffff; border: 1px solid #d8dde1; border-radius: 8px; padding: 0.6rem; }
      .chart-head { text-align: center; font-size: 1.35rem; font-weight: 900; color: #222; margin-bottom: 0.4rem; }
      .chart-svg { width: 100%; height: 420px; display: block; }
      .panel { fill: #f8f9fb; stroke: #c7ced6; stroke-width: 1; }
      .axis { stroke: #202938; stroke-width: 2; }
      .grid { stroke: #d8dee6; stroke-width: 1; }
      .line-rh { fill: none; stroke: #2f6fb3; stroke-width: 4; }
      .line-dew { fill: none; stroke: #5d8f40; stroke-width: 4; }
      .dot-rh { fill: #2f6fb3; }
      .dot-dew { fill: #4f7d36; }
      .tick { fill: #1f2937; font-size: 13px; font-weight: 700; }
      .x-tick { fill: #1f2937; font-size: 12px; font-weight: 700; }
      .tick-mark { stroke: #263040; stroke-width: 1.4; }
      .axis-label { fill: #1f2937; font-size: 14px; font-weight: 700; }
      .icon { font-size: 24px; }
      @media (max-width: 640px) {
        .chart-head { font-size: 1rem; }
        .chart-svg { height: 320px; }
        .tick, .x-tick { font-size: 10px; }
        .axis-label { font-size: 11px; }
      }
    `
  ]
})
export class HumedadRelativaChartComponent {
  @Input({ required: true }) relativeHumiditySeries: number[] = [];
  @Input({ required: true }) dewPointSeries: number[] = [];
  @Input({ required: true }) labels: string[] = [];

  readonly fallbackLabels = ['00', '03', '06', '08', '10', '11', '13', '15', '17', '18', '20', '22', '24'];
  readonly xPositions = [92, 141, 190, 239, 288, 337, 387, 436, 485, 534, 583, 632, 682];

  get relativePoints(): Array<{ x: number; y: number }> {
    const values = this.normalizeSeries(this.relativeHumiditySeries, [82, 80, 79, 75, 66, 52, 46, 43, 42, 45, 57, 68, 76]);
    return values.map((value, index) => ({ x: this.xPositions[index], y: this.toYRelative(value) }));
  }

  get dewPoints(): Array<{ x: number; y: number }> {
    const values = this.normalizeSeries(this.dewPointSeries, [1, 1, 0, 0, -1, -3, -4, -4, -3, -2, -2, -1, -1]);
    return values.map((value, index) => ({ x: this.xPositions[index], y: this.toYDew(value) }));
  }

  get relativePolyline(): string {
    return this.relativePoints.map((point) => `${point.x},${point.y}`).join(' ');
  }

  get dewPolyline(): string {
    return this.dewPoints.map((point) => `${point.x},${point.y}`).join(' ');
  }

  private normalizeSeries(values: number[], fallback: number[]): number[] {
    return Array.from({ length: 13 }, (_, index) => {
      const value = values[index];
      return Number.isFinite(value) ? Number(value) : fallback[index];
    });
  }

  private toYRelative(value: number): number {
    const clamped = Math.max(0, Math.min(100, value));
    return 332 - (clamped / 100) * 240;
  }

  private toYDew(value: number): number {
    const min = -15;
    const max = 10;
    const clamped = Math.max(min, Math.min(max, value));
    return 332 - ((clamped - min) / (max - min)) * 240;
  }
}
