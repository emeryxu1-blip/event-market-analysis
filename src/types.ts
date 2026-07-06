export type MarketTab = 'stock' | 'etf';
export type PerformancePeriod = '1M' | '3M' | '6M' | '1Y';

export interface Instrument {
  symbol: string;
  name: string;
  last: number;
  changePct: number;
  marketCap: number;
  marketCapLabel: string;
  summary: string;
}

export interface ChartPoint {
  label: string;
  date: string;
  value: number;
}

export interface ExposurePoint {
  symbol: string;
  name: string;
  exposure: number;
  expectationsRisk: number;
  pathway: string;
}

export interface TabMarketData {
  id: MarketTab;
  label: string;
  instruments: Instrument[];
  performance: Record<PerformancePeriod, ChartPoint[]>;
  exposure: ExposurePoint[];
}

export interface MarketDataSource {
  asOf: string;
  priceSource: string;
  fundamentalsSource: string;
}
