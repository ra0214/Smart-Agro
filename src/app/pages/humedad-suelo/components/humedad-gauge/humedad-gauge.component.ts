import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-humedad-gauge',
  standalone: false,
  template: `
    <div class="gauge-wrap">
      <div class="label">Indicador de humedad</div>
      <div class="gauge-line" role="img" aria-label="Medidor de humedad">
        <div class="gauge-fill" [style.width.%]="safeValue"></div>
      </div>
      <div class="gauge-number">{{ value }}%</div>
      <div class="range">Min {{ min }}% - Max {{ max }}%</div>
    </div>
  `,
  styles: [
    `
      .gauge-wrap { background: #fff; border-radius: 12px; border: 1px solid #c6f0e8; padding: 0.9rem; }
      .label { font-size: 0.95rem; font-weight: 800; color: #16785c; margin-bottom: 0.55rem; text-align: center; }
      .gauge-line { width: 100%; height: 16px; border-radius: 999px; background: #e5f5ef; overflow: hidden; border: 1px solid #bce8dc; }
      .gauge-fill { height: 100%; background: linear-gradient(90deg, #44b78b, #0f7a56); }
      .gauge-number { text-align: center; margin-top: 0.5rem; font-size: 1.5rem; font-weight: 900; color: #0f5d43; }
      .range { text-align: center; color: #177265; font-size: 0.85rem; margin-top: 0.25rem; }
    `
  ]
})
export class HumedadGaugeComponent {
  @Input({ required: true }) value!: number;
  @Input({ required: true }) min!: number;
  @Input({ required: true }) max!: number;

  get safeValue(): number {
    if (!Number.isFinite(this.value)) {
      return 0;
    }
    return Math.max(0, Math.min(100, this.value));
  }
}
