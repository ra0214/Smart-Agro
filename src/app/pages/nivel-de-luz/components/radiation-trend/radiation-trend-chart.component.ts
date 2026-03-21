import { Component, Input } from '@angular/core';
import { RadiationTrendPoint } from '../../domain/nivel-de-luz.types';

type Bar2D = { x: number; y: number; w: number; h: number; p: RadiationTrendPoint };

@Component({
  selector: 'app-radiation-trend-chart',
  standalone: false,
  template: `
    <div class="chart">
      <div class="title">Radiación total</div>

      <svg class="svg" viewBox="0 0 640 220" preserveAspectRatio="none" role="img" aria-label="Gráfica de radiación total">
        <rect x="20" y="30" width="600" height="175" rx="14" fill="#ffffff" stroke="#e6eef8" stroke-width="2"></rect>
        <!-- Grid Y -->
        <g class="grid">
          <line *ngFor="let t of yTicks" [attr.x1]="plotLeft" [attr.x2]="plotRight" [attr.y1]="y(t)" [attr.y2]="y(t)"></line>
        </g>

        <!-- Axes -->
        <line class="axis" [attr.x1]="plotLeft" [attr.x2]="plotLeft" [attr.y1]="plotTop" [attr.y2]="plotBottom"></line>
        <line class="axis" [attr.x1]="plotLeft" [attr.x2]="plotRight" [attr.y1]="plotBottom" [attr.y2]="plotBottom"></line>

        <!-- Bars -->
        <g *ngFor="let bar of bars">
          <rect class="bar" [attr.x]="bar.x" [attr.y]="bar.y" [attr.width]="bar.w" [attr.height]="bar.h"></rect>
        </g>

        <!-- Y labels -->
        <g class="y-labels">
          <text *ngFor="let t of yTicks" class="tick" [attr.x]="plotLeft - 12" [attr.y]="y(t) + 4">{{ t }}</text>
        </g>

        <!-- X labels -->
        <g class="x-labels">
          <text
            *ngFor="let bar of bars"
            class="tick"
            [attr.x]="bar.x + bar.w / 2 - 22"
            [attr.y]="plotBottom + 26"
          >
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
        margin-bottom: 0.2rem;
        color: #1d3557;
      }

      .svg {
        width: 100%;
        height: 170px;
        display: block;
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
        fill: #5da49a;
        rx: 6;
      }

      .tick {
        font-size: 10px;
        fill: #2a2a2a;
        font-weight: 800;
      }
    `
  ]
})
export class RadiationTrendChartComponent {
  @Input({ required: true }) points: RadiationTrendPoint[] = [];

  private readonly yMin = 10;
  private readonly yMax = 30;
  private readonly viewWidth = 640;
  private readonly viewHeight = 220;

  plotLeft = 70;
  plotRight = this.viewWidth - 18;
  plotTop = 34;
  plotBottom = this.viewHeight - 48;

  yTicks = [10, 15, 20, 25, 30];

  y(temp: number): number {
    const clamped = Math.max(this.yMin, Math.min(this.yMax, temp));
    const ratio = (clamped - this.yMin) / (this.yMax - this.yMin);
    return this.plotBottom - ratio * (this.plotBottom - this.plotTop);
  }

  private get plotWidth(): number {
    return this.plotRight - this.plotLeft;
  }

  get bars(): Bar2D[] {
    const pts = this.points ?? [];
    if (!pts.length) return [];

    const n = pts.length;
    const step = this.plotWidth / n;
    const barW = step * 0.55;
    const gapX = (step - barW) / 2;

    return pts.map((p, i) => {
      const x = this.plotLeft + i * step + gapX;
      const yVal = this.y(p.value);
      const h = this.plotBottom - yVal;
      return { x, y: yVal, w: barW, h, p };
    });
  }
}

