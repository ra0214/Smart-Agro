import { Component, Input } from '@angular/core';
import { TemperatureTrendPoint } from '../../domain/temperature-ambient.types';

type Bar2D = { x: number; y: number; w: number; h: number; p: TemperatureTrendPoint };

@Component({
  selector: 'app-temperature-trend-chart',
  standalone: false,
  template: `
    <div class="chart">
      <div class="title">Temperatura trend 7 días</div>

      <svg class="svg" viewBox="0 0 640 240" preserveAspectRatio="none" role="img" aria-label="Gráfica de tendencia de temperatura (7 días)">
        <!-- Grid Y -->
        <g class="grid">
          <line *ngFor="let t of yTicks" [attr.x1]="plotLeft" [attr.x2]="plotRight" [attr.y1]="y(t)" [attr.y2]="y(t)"></line>
        </g>

        <!-- Ejes -->
        <line class="axis" [attr.x1]="plotLeft" [attr.x2]="plotLeft" [attr.y1]="plotTop" [attr.y2]="plotBottom"></line>
        <line class="axis" [attr.x1]="plotLeft" [attr.x2]="plotRight" [attr.y1]="plotBottom" [attr.y2]="plotBottom"></line>

        <!-- Barras -->
        <g *ngFor="let bar of bars">
          <rect class="bar" [attr.x]="bar.x" [attr.y]="bar.y" [attr.width]="bar.w" [attr.height]="bar.h"></rect>
        </g>

        <!-- Etiquetas Y -->
        <g class="y-labels">
          <text *ngFor="let t of yTicks" class="tick" [attr.x]="plotLeft - 10" [attr.y]="y(t) + 4">{{ t }}°</text>
        </g>

        <!-- Etiquetas X -->
        <g class="x-labels">
          <text *ngFor="let bar of bars" class="tick" [attr.x]="bar.x + bar.w / 2 - 20" [attr.y]="plotBottom + 26">
            {{ bar.p.dayLabel }}
          </text>
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
        height: 180px;
      }

      .grid line {
        stroke: #e7eef7;
        stroke-width: 1;
      }

      .axis {
        stroke: #9bb3d6;
        stroke-width: 2;
      }

      .bar {
        fill: #56ccf2;
        stroke: rgba(0, 0, 0, 0.05);
        stroke-width: 1;
        rx: 6;
      }

      .tick {
        font-size: 11px;
        fill: #2a2a2a;
        font-weight: 700;
      }
    `
  ]
})
export class TemperatureTrendChartComponent {
  @Input({ required: true }) points: TemperatureTrendPoint[] = [];

  private readonly yMin = 0;
  private readonly yMax = 35;
  private readonly viewWidth = 640;
  private readonly viewHeight = 240;

  plotLeft = 58;
  plotRight = this.viewWidth - 18;
  plotTop = 26;
  plotBottom = this.viewHeight - 46;

  yTicks = [0, 10, 20, 30];

  y(tempC: number): number {
    const clamped = Math.max(this.yMin, Math.min(this.yMax, tempC));
    const plotHeight = this.plotBottom - this.plotTop;
    const ratio = (clamped - this.yMin) / (this.yMax - this.yMin);
    return this.plotBottom - ratio * plotHeight;
  }

  private get plotWidth(): number {
    return this.plotRight - this.plotLeft;
  }

  get bars(): Bar2D[] {
    const pts = this.points ?? [];
    if (!pts.length) return [];

    const n = pts.length;
    const step = this.plotWidth / n;
    const barW = step * 0.6;
    const gapX = (step - barW) / 2;

    return pts.map((p, i) => {
      const x = this.plotLeft + i * step + gapX;
      const y = this.y(p.tempC);
      const h = this.plotBottom - y;
      return { x, y, w: barW, h, p };
    });
  }
}

