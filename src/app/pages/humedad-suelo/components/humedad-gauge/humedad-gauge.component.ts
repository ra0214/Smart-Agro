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
      .gauge-wrap {
        background: #fff;
        border-radius: 14px;
        border: 1px solid rgba(0,0,0,0.07);
        padding: 1.1rem 1.25rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }
      .label {
        font-size: 0.72rem;
        font-weight: 700;
        color: #4a7c59;
        margin-bottom: 0.65rem;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .gauge-line {
        width: 100%;
        height: 12px;
        border-radius: 999px;
        background: #e5f5ef;
        overflow: hidden;
        border: 1px solid rgba(0,0,0,0.06);
      }
      .gauge-fill {
        height: 100%;
        background: linear-gradient(90deg, #44b78b, #0f7a56);
        border-radius: 999px;
        transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .gauge-number {
        text-align: center;
        margin-top: 0.6rem;
        font-size: 2rem;
        font-weight: 900;
        letter-spacing: -0.03em;
        color: #0f5d43;
      }
      .range {
        text-align: center;
        color: #6b7280;
        font-size: 0.75rem;
        margin-top: 0.2rem;
        font-weight: 500;
        letter-spacing: 0.02em;
      }
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
