import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { TemperatureAmbientComponent } from './pages/temperatura-ambiente/temperature-ambient.component';
import { NivelDeLuzComponent } from './pages/nivel-de-luz/nivel-de-luz.component';
import { HumedadSueloComponent } from './pages/humedad-suelo/humedad-suelo.component';
import { HumedadGaugeComponent } from './pages/humedad-suelo/components/humedad-gauge/humedad-gauge.component';
import { HumedadTrendChartComponent } from './pages/humedad-suelo/components/humedad-trend-chart/humedad-trend-chart.component';
import { TemperatureLineChartComponent } from './pages/temperatura-ambiente/components/temperature-line-chart/temperature-line-chart.component';
import { TemperatureTrendChartComponent } from './pages/temperatura-ambiente/components/temperature-trend-chart/temperature-trend-chart.component';
import { ThermometerComponent } from './pages/temperatura-ambiente/components/thermometer/thermometer.component';
import { TEMPERATURE_AMBIENT_REPOSITORY } from './pages/temperatura-ambiente/data/temperature-ambient.repository';
import { MockTemperatureAmbientRepository } from './pages/temperatura-ambiente/data/mock-temperature-ambient.repository';
import { SolarIntensityChartComponent } from './pages/nivel-de-luz/components/solar-intensity/solar-intensity-chart.component';
import { RadiationTrendChartComponent } from './pages/nivel-de-luz/components/radiation-trend/radiation-trend-chart.component';
import { NIVEL_DE_LUZ_REPOSITORY } from './pages/nivel-de-luz/data/nivel-de-luz.repository';
import { MockNivelDeLuzRepository } from './pages/nivel-de-luz/data/mock-nivel-de-luz.repository';
import { HUMEDAD_SUELO_REPOSITORY } from './pages/humedad-suelo/data/humedad-suelo.repository';
import { MockHumedadSueloRepository } from './pages/humedad-suelo/data/mock-humedad-suelo.repository';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    TemperatureAmbientComponent,
    TemperatureLineChartComponent,
    TemperatureTrendChartComponent,
    ThermometerComponent,
    NivelDeLuzComponent,
    HumedadSueloComponent,
    HumedadGaugeComponent,
    HumedadTrendChartComponent,
    SolarIntensityChartComponent,
    RadiationTrendChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: TEMPERATURE_AMBIENT_REPOSITORY,
      useClass: MockTemperatureAmbientRepository
    },
    {
      provide: NIVEL_DE_LUZ_REPOSITORY,
      useClass: MockNivelDeLuzRepository
    },
    {
      provide: HUMEDAD_SUELO_REPOSITORY,
      useClass: MockHumedadSueloRepository
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
