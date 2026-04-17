import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { TemperatureAmbientComponent } from './pages/temperatura-ambiente/temperature-ambient.component';
import { NivelDeLuzComponent } from './pages/nivel-de-luz/nivel-de-luz.component';
import { HumedadSueloComponent } from './pages/humedad-suelo/humedad-suelo.component';
import { HumedadAireComponent } from './pages/humedad-aire/humedad-aire.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'temperatura-ambiente', component: TemperatureAmbientComponent },
  { path: 'nivel-de-luz', component: NivelDeLuzComponent },
  { path: 'humedad-suelo', component: HumedadSueloComponent },
  { path: 'humedad-aire', component: HumedadAireComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
