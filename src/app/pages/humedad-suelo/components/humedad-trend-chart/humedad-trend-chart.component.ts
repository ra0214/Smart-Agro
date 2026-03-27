import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-humedad-trend-chart',
  standalone: false,
  template: `
    <div class="chart-wrap" role="img" aria-label="Grafica de humedad semanal con pronostico">
      <div class="weather-row">
        <span *ngFor="let icon of weatherIcons">{{ icon }}</span>
      </div>

      <div class="chart-body">
        <div class="y-label">Actual Hotel (%)</div>

        <div class="plot-area">
          <svg class="grid" viewBox="0 0 320 170" preserveAspectRatio="none" aria-hidden="true">
            <line x1="30" y1="20" x2="300" y2="20"></line>
            <line x1="30" y1="47" x2="300" y2="47"></line>
            <line x1="30" y1="74" x2="300" y2="74"></line>
            <line x1="30" y1="101" x2="300" y2="101"></line>
            <line x1="30" y1="128" x2="300" y2="128"></line>
            <line x1="30" y1="20" x2="30" y2="128"></line>
            <line x1="75" y1="20" x2="75" y2="128"></line>
            <line x1="120" y1="20" x2="120" y2="128"></line>
            <line x1="165" y1="20" x2="165" y2="128"></line>
            <line x1="210" y1="20" x2="210" y2="128"></line>
            <line x1="255" y1="20" x2="255" y2="128"></line>
            <line x1="300" y1="20" x2="300" y2="128"></line>
          </svg>

          <svg class="line-layer" viewBox="0 0 320 170" preserveAspectRatio="none" aria-hidden="true">
            <rect x="30" y="47" width="270" height="54" class="zone"></rect>
            <polyline class="trend" [attr.points]="polylinePoints"></polyline>
            <circle *ngFor="let p of pointCoords" [attr.cx]="p.x" [attr.cy]="p.y" r="2.8"></circle>
          </svg>

          <div class="y-ticks">
            <span>20</span>
            <span>15</span>
            <span>10</span>
            <span>5</span>
            <span>0</span>
          </div>

          <div class="zone-label">Optimal Zone</div>

          <div class="x-axis">
            <div class="x-day" *ngFor="let day of days; let i = index">
              <span>{{ day }}</span>
              <small>{{ dates[i] }}</small>
            </div>
          </div>

          <div class="x-title">Última 7 días</div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .chart-wrap { background: #ffffff; border: 1px solid #d5d5d5; width: 100%; max-width: 560px; margin: 0 auto; padding: 0.35rem 0.5rem 0.6rem; box-sizing: border-box; }
      .weather-row { display: flex; justify-content: flex-end; gap: 0.45rem; font-size: 1.1rem; line-height: 1; margin-bottom: 0.2rem; }
      .chart-body { display: flex; align-items: stretch; gap: 0.4rem; }
      .y-label { writing-mode: vertical-rl; transform: rotate(180deg); font-size: 0.86rem; font-weight: 700; color: #1f2937; padding-bottom: 1.7rem; }
      .plot-area { position: relative; flex: 1; min-height: 230px; }
      .grid, .line-layer { position: absolute; top: 0; left: 0; width: 100%; height: 170px; }
      .grid line { stroke: #d2d6db; stroke-width: 1; }
      .zone { fill: #9fce9b; opacity: 0.45; }
      .trend { fill: none; stroke: #111111; stroke-width: 2.3; }
      circle { fill: #0f172a; }
      .y-ticks { position: absolute; top: 7px; left: -4px; height: 125px; display: flex; flex-direction: column; justify-content: space-between; font-size: 0.72rem; color: #2b2b2b; font-weight: 600; }
      .zone-label { position: absolute; top: 104px; left: 34px; background: #9ac495; color: #1f3b22; font-size: 0.74rem; font-weight: 700; padding: 0.1rem 0.25rem; border-radius: 3px; }
      .x-axis { position: absolute; top: 174px; left: 25px; right: 2px; display: grid; grid-template-columns: repeat(7, 1fr); }
      .x-day { text-align: center; color: #1f2937; font-size: 0.73rem; font-weight: 700; line-height: 1.1; }
      .x-day small { display: block; font-size: 0.68rem; font-weight: 600; margin-top: 0.12rem; }
      .x-title { position: absolute; top: 214px; left: 0; right: 0; text-align: center; font-size: 0.87rem; font-weight: 800; color: #111827; }
      @media (max-width: 640px) {
        .chart-wrap { padding: 0.3rem 0.3rem 0.5rem; }
        .y-label { font-size: 0.76rem; }
        .x-day { font-size: 0.66rem; }
        .x-day small { font-size: 0.61rem; }
      }
    `
  ]
})
export class HumedadTrendChartComponent {
  @Input({ required: true }) points!: number[];

  readonly weatherIcons = ['🌤️', '🌥️', '☀️', '🌧️'];
  readonly days = ['Wed', 'Thu', 'Fri', 'Sat', 'Mon', 'Tue', 'Ted'];
  readonly dates = ['12/07', '12/07', '12/07', '12/07', '12/07', '12/07', '13/07'];

  get pointCoords(): Array<{ x: number; y: number }> {
    const values = this.normalizedValues;
    return values.map((value, index) => ({
      x: 30 + index * 45,
      y: this.toY(value)
    }));
  }

  get polylinePoints(): string {
    return this.pointCoords.map((p) => `${p.x},${p.y}`).join(' ');
  }

  private get normalizedValues(): number[] {
    const fallback = [11, 12, 12, 12, 14, 13, 12.3];
    if (!Array.isArray(this.points) || this.points.length === 0) {
      return fallback;
    }

    return Array.from({ length: 7 }, (_, index) => {
      const value = this.points[index] ?? this.points[this.points.length - 1];
      return Number.isFinite(value) ? Number(value) : fallback[index];
    });
  }

  private toY(value: number): number {
    const min = 0;
    const max = 20;
    const clamped = Math.max(min, Math.min(max, value));
    const ratio = (clamped - min) / (max - min);
    return 128 - ratio * 108;
  }
}
