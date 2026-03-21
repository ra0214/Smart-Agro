import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NivelDeLuzReport } from './domain/nivel-de-luz.types';
import {
  NIVEL_DE_LUZ_REPOSITORY,
  NivelDeLuzRepository
} from './data/nivel-de-luz.repository';

@Component({
  selector: 'app-nivel-de-luz',
  standalone: false,
  templateUrl: './nivel-de-luz.component.html',
  styleUrl: './nivel-de-luz.component.scss'
})
export class NivelDeLuzComponent implements OnInit, OnDestroy {
  loading = true;
  report: NivelDeLuzReport | null = null;

  private sub: Subscription | null = null;

  constructor(
    @Inject(NIVEL_DE_LUZ_REPOSITORY)
    private readonly repo: NivelDeLuzRepository
  ) {}

  ngOnInit(): void {
    this.sub = this.repo.getNivelDeLuzReport().subscribe({
      next: (r) => {
        this.report = r;
        this.loading = false;
      },
      error: (err) => {
        // eslint-disable-next-line no-console
        console.error(err);
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}

