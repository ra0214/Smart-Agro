import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-thermometer',
  standalone: false,
  template: `
    <div class="thermometer">
      <svg
        class="thermo-svg"
        viewBox="0 0 80 240"
        role="img"
          [attr.aria-label]="label + ': ' + (temperature | number: '1.1-1') + '°C'"
      >
        <defs>
          <clipPath [attr.id]="clipId">
            <rect [attr.x]="0" [attr.y]="mercuryLevelY" [attr.width]="80" [attr.height]="240"></rect>
          </clipPath>
        </defs>

        <!-- Contorno -->
        <rect class="tube-outline" x="30" y="20" width="20" height="180" rx="10" fill="none" [attr.stroke]="color" stroke-width="4" />
        <circle class="bulb-outline" cx="40" cy="200" r="18" fill="none" [attr.stroke]="color" stroke-width="4" />

        <!-- Mercurio -->
        <g [attr.clip-path]="'url(#' + clipId + ')'">
          <rect x="30" y="20" width="20" height="180" rx="10" [attr.fill]="color" opacity="0.9" />
          <circle cx="40" cy="200" r="18" [attr.fill]="color" opacity="0.9" />
        </g>
      </svg>

      <div class="meta">
        <div class="label">{{ label }}</div>
        <div class="value">{{ temperature | number: '1.1-1' }}°C</div>
      </div>
    </div>
  `,
  styles: [
    `
      .thermometer {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.6rem;
      }

      .thermo-svg {
        width: 70px;
        height: 200px;
      }

      .tube-outline {
        stroke-linecap: round;
      }

      .bulb-outline {
        stroke-linecap: round;
      }

      .meta {
        text-align: center;
      }

      .label {
        font-size: 0.9rem;
        font-weight: 600;
        color: #222;
      }

      .value {
        font-size: 1.05rem;
        font-weight: 800;
        color: #222;
      }
    `
  ]
})
export class ThermometerComponent {
  @Input({ required: true }) temperature!: number;
  @Input({ required: true }) label!: string;
  @Input() minRange = 0;
  @Input() maxRange = 35;
  @Input() color = '#2f80ed';

  clipId = `clip_${Math.random().toString(36).slice(2)}`;

  get mercuryLevelY(): number {
    const ratio = (this.temperature - this.minRange) / (this.maxRange - this.minRange);
    const clamped = Math.max(0, Math.min(1, ratio));

    const tubeTop = 20;
    const tubeBottom = 200;
    return tubeTop + (1 - clamped) * (tubeBottom - tubeTop);
  }
}

