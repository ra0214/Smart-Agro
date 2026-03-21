import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TemperatureAmbientComponent } from './pages/temperatura-ambiente/temperature-ambient.component';
import { NivelDeLuzComponent } from './pages/nivel-de-luz/nivel-de-luz.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'temperatura-ambiente', component: TemperatureAmbientComponent },
  { path: 'nivel-de-luz', component: NivelDeLuzComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
