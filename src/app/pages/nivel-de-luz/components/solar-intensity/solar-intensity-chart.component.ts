import { Component, Input } from '@angular/core';
import { SolarIntensityLinePoint } from '../../domain/nivel-de-luz.types';

@Component({
  selector: 'app-solar-intensity-chart',
  standalone: false,
  template: `
    <div class="chart-wrap">
      <div class="chart-title">Intensidad Lumínica (Luz Solar)</div>

      <svg class="svg" viewBox="0 0 640 240" role="img" aria-label="Gráfica de intensidad luminosa">
        <rect x="10" y="10" width="620" height="220" rx="16" fill="#ffffff" stroke="#e6eef8" stroke-width="2"></rect>

        <!-- Eje Y -->
        <text x="62" y="55" class="axis-label" transform="rotate(-90 62 55)">Intensidad (lux)</text>

        <!-- Grid + ticks Y -->
        <g class="grid-y">
          <line *ngFor="let t of yTicks" class="grid-line" [attr.x1]="plotLeft" [attr.x2]="plotRight" [attr.y1]="y(t)" [attr.y2]="y(t)"></line>
          <text *ngFor="let t of yTicks" class="y-tick" [attr.x]="plotLeft - 10" [attr.y]="y(t) + 4">
            {{ t | number:'1.0-0' }}
          </text>
        </g>

        <!-- Eje X -->
        <line class="axis" [attr.x1]="plotLeft" [attr.x2]="plotRight" [attr.y1]="plotBottom" [attr.y2]="plotBottom"></line>
        <line class="axis" [attr.x1]="plotLeft" [attr.x2]="plotLeft" [attr.y1]="plotTop" [attr.y2]="plotBottom"></line>

        <!-- Curva -->
        <path class="line-path" [attr.d]="linePath"></path>

        <!-- Puntos -->
        <g *ngFor="let p of plottedPoints; let idx = index">
          <circle class="point" [attr.cx]="p.x" [attr.cy]="p.y" r="5"></circle>
          <text class="point-label" [attr.x]="p.x" [attr.y]="p.y - 12" text-anchor="middle">
            {{ pointLetters[idx] }}
          </text>
        </g>

        <!-- Labels de tiempo -->
        <g class="time-ticks">
          <text *ngFor="let p of plottedPoints" class="time-label" [attr.x]="p.x" [attr.y]="plotBottom + 26" text-anchor="middle">
            {{ p.p.timeLabel }}
          </text>
        </g>
      </svg>
    </div>
  `,
  styles: [
    `
      .chart-wrap {
        position: relative;
      }

      .chart-title {
        font-weight: 900;
        text-align: center;
        color: #1d3557;
        margin: 0.2rem 0 0.4rem 0;
        font-size: 0.95rem;
      }

      .svg {
        width: 100%;
        height: 190px;
        display: block;
        overflow: visible;
      }

      .axis-label {
        font-size: 12px;
        font-weight: 900;
        fill: #2a2a2a;
      }

      .axis {
        stroke: #9bb3d6;
        stroke-width: 2;
      }

      .grid-line {
        stroke: #e7eef7;
        stroke-width: 1;
      }

      .y-tick {
        font-size: 10px;
        font-weight: 800;
        fill: #2a2a2a;
      }

      .time-label {
        font-size: 10px;
        font-weight: 900;
        fill: #2a2a2a;
      }

      .line-path {
        fill: none;
        stroke: #555;
        stroke-width: 3;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .point {
        fill: #111;
        stroke: #ffffff;
        stroke-width: 2;
      }

      .point-label {
        font-size: 13px;
        font-weight: 900;
        fill: #111;
      }
    `
  ]
})
export class SolarIntensityChartComponent {
  @Input({ required: true }) maxScale!: number; // normalmente 100000
  @Input({ required: true }) linePoints!: SolarIntensityLinePoint[]; // 7 points

  // Geometría del área del gráfico
  plotLeft = 120;
  plotRight = 560;
  plotTop = 60;
  plotBottom = 160;

  yTicks = [0, 20000, 40000, 60000, 80000, 100000];

  pointLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  private xForIndex(idx: number): number {
    const n = Math.max(1, this.linePoints.length);
    const t = n === 1 ? 0 : idx / (n - 1);
    return this.plotLeft + t * (this.plotRight - this.plotLeft);
  }

  y(value: number): number {
    const ratio = this.maxScale > 0 ? value / this.maxScale : 0;
    const clamped = Math.max(0, Math.min(1, ratio));
    return this.plotBottom - clamped * (this.plotBottom - this.plotTop);
  }

  get plottedPoints(): Array<{ x: number; y: number; p: SolarIntensityLinePoint }> {
    return (this.linePoints ?? []).map((p, idx) => ({
      x: this.xForIndex(idx),
      y: this.y(p.value),
      p
    }));
  }

  private catmullRomToBezierPath(pts: Array<{ x: number; y: number }>): string {
    if (pts.length < 2) return '';
    if (pts.length === 2) {
      const a = pts[0];
      const b = pts[1];
      return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
    }

    const d: string[] = [];
    d.push(`M ${pts[0].x} ${pts[0].y}`);

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] ?? p2;

      // Catmull-Rom (tensión 0.5) => Cubic Bezier
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;

      d.push(`C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`);
    }

    return d.join(' ');
  }

  get linePath(): string {
    const pts = this.plottedPoints.map((p) => ({ x: p.x, y: p.y }));
    return this.catmullRomToBezierPath(pts);
  }
}

