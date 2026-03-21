import { Component, Input } from '@angular/core';
import { TemperatureHourlyPoint } from '../../domain/temperature-ambient.types';

type Point2D = { x: number; y: number; p: TemperatureHourlyPoint };

@Component({
  selector: 'app-temperature-line-chart',
  standalone: false,
  template: `
    <div class="chart">
      <div class="title">Registro de Temperatura Diaria</div>

      <svg class="svg" viewBox="0 0 640 260" preserveAspectRatio="none" role="img" aria-label="Gráfica de temperatura diaria">
        <!-- Grid Y -->
        <g class="grid">
          <line *ngFor="let t of yTicks" [attr.x1]="plotLeft" [attr.x2]="plotRight" [attr.y1]="y(t)" [attr.y2]="y(t)"></line>
        </g>

        <!-- Ejes -->
        <line class="axis" [attr.x1]="plotLeft" [attr.x2]="plotLeft" [attr.y1]="plotTop" [attr.y2]="plotBottom"></line>
        <line class="axis" [attr.x1]="plotLeft" [attr.x2]="plotRight" [attr.y1]="plotBottom" [attr.y2]="plotBottom"></line>

        <!-- Área bajo la curva -->
        <path class="area" [attr.d]="areaPath"></path>

        <!-- Curva -->
        <path class="line" [attr.d]="linePath"></path>

        <!-- Máximo / Mínimo -->
        <g *ngIf="maxMarker">
          <circle class="marker max" [attr.cx]="maxMarker.x" [attr.cy]="maxMarker.y" r="5"></circle>
          <text class="marker-label" [attr.x]="maxMarker.x + 8" [attr.y]="maxMarker.y - 8">{{ maxTemp | number:'1.1-1' }}°C</text>
        </g>
        <g *ngIf="minMarker">
          <circle class="marker min" [attr.cx]="minMarker.x" [attr.cy]="minMarker.y" r="5"></circle>
          <text class="marker-label" [attr.x]="minMarker.x + 8" [attr.y]="minMarker.y - 8">{{ minTemp | number:'1.1-1' }}°C</text>
        </g>

        <!-- Icono decorativo (nube) -->
        <g *ngIf="cloudMarker">
          <g [attr.transform]="'translate(' + (cloudMarker.x - 20) + ',' + (cloudMarker.y - 60) + ')'">
            <circle cx="14" cy="22" r="10" fill="#f2c94c" opacity="0.9"></circle>
            <path d="M10 38c-6 0-10-4-10-10 0-5 3-9 8-10 2-6 8-11 15-11 8 0 15 6 16 14 6 2 11 7 11 13 0 8-7 15-15 15H10z" fill="#e9f3ff" stroke="#b7d7ff" stroke-width="2" />
          </g>
        </g>

        <!-- Etiquetas Y -->
        <g class="y-labels">
          <text *ngFor="let t of yTicks" class="tick" [attr.x]="plotLeft - 10" [attr.y]="y(t) + 4">{{ t }} </text>
        </g>

        <!-- Etiquetas X -->
        <g class="x-labels">
          <ng-container *ngFor="let tick of xTicks">
            <text class="tick" [attr.x]="x(tick.totalMinutes) - 6" [attr.y]="plotBottom + 28">{{ tick.label }}</text>
          </ng-container>
        </g>
      </svg>
    </div>
  `,
  styles: [
    `
      .chart {
        width: 100%;
      }

      .title {
        font-weight: 900;
        text-align: center;
        margin-bottom: 0.5rem;
        color: #1d3557;
      }

      .svg {
        width: 100%;
        height: 190px;
      }

      .grid line {
        stroke: #e7eef7;
        stroke-width: 1;
      }

      .axis {
        stroke: #9bb3d6;
        stroke-width: 2;
      }

      .line {
        stroke: #2f80ed;
        stroke-width: 4;
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .area {
        fill: rgba(47, 128, 237, 0.12);
      }

      .marker {
        stroke: white;
        stroke-width: 2;
      }

      .marker.max {
        fill: #f2994a;
      }

      .marker.min {
        fill: #56ccf2;
      }

      .marker-label {
        fill: #2a2a2a;
        font-size: 11px;
        font-weight: 700;
      }

      .tick {
        font-size: 11px;
        fill: #2a2a2a;
        font-weight: 700;
      }
    `
  ]
})
export class TemperatureLineChartComponent {
  @Input({ required: true }) points: TemperatureHourlyPoint[] = [];
  @Input() maxTotalMinutes?: number;
  @Input() minTotalMinutes?: number;

  // Para que el look sea consistente con la imagen.
  private readonly yMin = 0;
  private readonly yMax = 35;

  private readonly viewWidth = 640;
  private readonly viewHeight = 260;
  plotLeft = 58;
  plotRight = this.viewWidth - 18;
  plotTop = 18;
  plotBottom = this.viewHeight - 42;

  yTicks = [0, 10, 20, 30];

  xTicks = [
    { totalMinutes: 0, label: '00:00' },
    { totalMinutes: 4 * 60, label: '04:00' },
    { totalMinutes: 8 * 60, label: '08:00' },
    { totalMinutes: 12 * 60, label: '12:00' },
    { totalMinutes: 16 * 60, label: '16:00' },
    { totalMinutes: 20 * 60, label: '20:00' },
    { totalMinutes: 24 * 60, label: '24:00' }
  ];

  private totalDayMinutes = 24 * 60;

  private toTotalMinutes(p: TemperatureHourlyPoint): number {
    return p.hour * 60 + p.minute;
  }

  x(totalMinutes: number): number {
    const t = Math.max(0, Math.min(this.totalDayMinutes, totalMinutes));
    const plotWidth = this.plotRight - this.plotLeft;
    return this.plotLeft + (t / this.totalDayMinutes) * plotWidth;
  }

  y(tempC: number): number {
    const clamped = Math.max(this.yMin, Math.min(this.yMax, tempC));
    const plotHeight = this.plotBottom - this.plotTop;
    const ratio = (clamped - this.yMin) / (this.yMax - this.yMin);
    return this.plotBottom - ratio * plotHeight;
  }

  private get plottedPoints(): Point2D[] {
    return (this.points ?? []).map((p) => ({
      p,
      x: this.x(this.toTotalMinutes(p)),
      y: this.y(p.tempC)
    }));
  }

  private getNearestPointByTotalMinutes(target?: number): Point2D | null {
    if (!target && target !== 0) return null;
    if (!this.points.length) return null;

    let nearest: Point2D | null = null;
    let best = Infinity;
    for (const pp of this.plottedPoints) {
      const d = Math.abs(this.toTotalMinutes(pp.p) - target);
      if (d < best) {
        best = d;
        nearest = pp;
      }
    }
    return nearest;
  }

  get maxMarker(): Point2D | null {
    return this.getNearestPointByTotalMinutes(this.maxTotalMinutes);
  }

  get minMarker(): Point2D | null {
    return this.getNearestPointByTotalMinutes(this.minTotalMinutes);
  }

  get cloudMarker(): Point2D | null {
    return this.getNearestPointByTotalMinutes(12 * 60);
  }

  get maxTemp(): number {
    return this.maxMarker?.p.tempC ?? 0;
  }

  get minTemp(): number {
    return this.minMarker?.p.tempC ?? 0;
  }

  get linePath(): string {
    const pts = this.plottedPoints;
    if (!pts.length) return '';

    return pts
      .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`)
      .join(' ');
  }

  get areaPath(): string {
    const pts = this.plottedPoints;
    if (!pts.length) return '';

    const bottom = this.plotBottom;
    const start = `M ${pts[0].x} ${bottom} L ${pts[0].x} ${pts[0].y}`;
    const mid = pts.slice(1).map((pt) => `L ${pt.x} ${pt.y}`).join(' ');
    const end = `L ${pts[pts.length - 1].x} ${bottom} Z`;
    return `${start} ${mid} ${end}`;
  }
}

