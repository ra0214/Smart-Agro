import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-punto-rocio-resumen',
  standalone: false,
  template: `
    <div class="summary-wrap">
      <div class="summary-item">
        <span>Humedad relativa actual</span>
        <strong>{{ relativeHumidity }}%</strong>
      </div>

      <div class="summary-item">
        <span>Punto de rocio actual</span>
        <strong>{{ dewPoint }} C</strong>
      </div>
    </div>
  `,
  styles: [
    `
      .summary-wrap { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.85rem; margin-bottom: 1rem; }
      .summary-item {
        background: #ffffff;
        border-radius: 12px;
        border: 1px solid rgba(0,0,0,0.07);
        padding: 1rem 0.9rem;
        text-align: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.04);
        transition: box-shadow 0.2s ease;
      }
      .summary-item:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
      .summary-item span {
        display: block;
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #6b7280;
        margin-bottom: 0.45rem;
      }
      .summary-item strong {
        font-size: 1.5rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: #1d3557;
      }
      @media (max-width: 640px) {
        .summary-wrap { grid-template-columns: 1fr; }
      }
    `
  ]
})
export class PuntoRocioResumenComponent {
  @Input({ required: true }) relativeHumidity!: number;
  @Input({ required: true }) dewPoint!: number;
}
