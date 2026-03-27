export interface HumedadAireReport {
  currentRelativeHumidity: number;
  currentDewPoint: number;
  relativeHumiditySeries: number[];
  dewPointSeries: number[];
  labels: string[];
}
