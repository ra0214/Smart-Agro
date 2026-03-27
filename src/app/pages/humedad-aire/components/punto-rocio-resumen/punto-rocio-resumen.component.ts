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
      .summary-wrap { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.7rem; margin-bottom: 0.8rem; }
      .summary-item { background: #ffffff; border-radius: 8px; border: 1px solid #d7e8d0; padding: 0.7rem; text-align: center; }
      .summary-item span { display: block; font-size: 0.82rem; color: #374151; margin-bottom: 0.35rem; font-weight: 700; }
      .summary-item strong { font-size: 1.15rem; color: #123a6a; }
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
