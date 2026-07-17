import resultData from '../result.json';
import type { ChartPoint, Instrument, MarketDataSource, TabMarketData } from './types';

export const article = {
  title: 'AI memory',
  date: 'Jul. 9, 2026',
  dateIso: '2026-07-09',
  image: 'https://cdn.ainvest.com/news/med-image/viz_5shua4hw.png',
  imageAlt: 'Nasdaq market display and AI memory chip illustration',
  url: 'https://news.ainvest.com/deep-topic/topic/sk-hynix-lands-on-nasdaq-2607',
};

export const marketDataSource: MarketDataSource = {
  asOf: 'Jul. 16, 2026',
  priceSource: 'July 16 close / July 17 UTC market quote snapshots; historical curves are mock data',
  fundamentalsSource: 'Recent public market-cap and ETF net-asset snapshots',
};

type InstrumentSnapshot = Omit<Instrument, 'summary'>;

const stockSnapshots: Record<string, InstrumentSnapshot> = {
  SKHY: {
    symbol: 'SKHY',
    name: 'SK hynix Inc.',
    last: 152.31,
    changePct: -13.51,
    marketCap: 1134.36,
    marketCapLabel: '$1.13T',
  },
  AMAT: {
    symbol: 'AMAT',
    name: 'Applied Materials, Inc.',
    last: 560.93,
    changePct: -3.23,
    marketCap: 448.18,
    marketCapLabel: '$448.2B',
  },
  LRCX: {
    symbol: 'LRCX',
    name: 'Lam Research Corporation',
    last: 320.96,
    changePct: -4.31,
    marketCap: 403.55,
    marketCapLabel: '$403.6B',
  },
  KLAC: {
    symbol: 'KLAC',
    name: 'KLA Corporation',
    last: 219.37,
    changePct: -2.29,
    marketCap: 28.9,
    marketCapLabel: '$28.9B',
  },
  ASML: {
    symbol: 'ASML',
    name: 'ASML Holding N.V.',
    last: 1784.87,
    changePct: -1.63,
    marketCap: 702.21,
    marketCapLabel: '$702.2B',
  },
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    last: 207.4,
    changePct: -2.38,
    marketCap: 5058.69,
    marketCapLabel: '$5.06T',
  },
  AMD: {
    symbol: 'AMD',
    name: 'Advanced Micro Devices, Inc.',
    last: 500.94,
    changePct: -5.31,
    marketCap: 826.55,
    marketCapLabel: '$826.6B',
  },
  DELL: {
    symbol: 'DELL',
    name: 'Dell Technologies Inc.',
    last: 391.38,
    changePct: -5.21,
    marketCap: 256.75,
    marketCapLabel: '$256.7B',
  },
};

const etfSnapshots: Record<string, InstrumentSnapshot> = {
  SHOC: {
    symbol: 'SHOC',
    name: 'Strive U.S. Semiconductor ETF',
    last: 105.24,
    changePct: -3.93,
    marketCap: 0.24945,
    marketCapLabel: '$249.5M',
  },
  SMH: {
    symbol: 'SMH',
    name: 'VanEck Semiconductor ETF',
    last: 568.92,
    changePct: -3.75,
    marketCap: 77.2,
    marketCapLabel: '$77.2B',
  },
  SOXQ: {
    symbol: 'SOXQ',
    name: 'Invesco PHLX Semiconductor ETF',
    last: 93.4,
    changePct: -4.27,
    marketCap: 2.61,
    marketCapLabel: '$2.61B',
  },
  SOXX: {
    symbol: 'SOXX',
    name: 'iShares Semiconductor ETF',
    last: 530.5,
    changePct: -4.54,
    marketCap: 47.23,
    marketCapLabel: '$47.2B',
  },
  HBMX: {
    symbol: 'HBMX',
    name: 'Tuttle Capital Concentrated Memory Stack ETF',
    last: 24.24,
    changePct: -6.62,
    marketCap: 0.03553,
    marketCapLabel: '$35.5M',
  },
};

const riskScores: Record<string, number> = {
  SKHY: 92,
  AMAT: 70,
  LRCX: 72,
  KLAC: 65,
  ASML: 68,
  NVDA: 84,
  AMD: 82,
  DELL: 58,
  SHOC: 78,
  SMH: 84,
  SOXQ: 72,
  SOXX: 70,
  HBMX: 90,
};

const pathways: Record<string, string> = {
  SKHY: 'Direct HBM leader and Nasdaq ADR catalyst',
  AMAT: 'HBM and DRAM manufacturing equipment',
  LRCX: 'Memory etch and deposition tools',
  KLAC: 'Memory process-control equipment',
  ASML: 'Lithography capacity enabler',
  NVDA: 'AI accelerator demand for HBM',
  AMD: 'Data-center GPU demand for HBM',
  DELL: 'Downstream AI-server demand',
  SHOC: 'Broad U.S.-listed semiconductor basket',
  SMH: 'AI compute and memory-capex proxy',
  SOXQ: 'PHLX semiconductor index exposure',
  SOXX: 'Diversified semiconductor value chain',
  HBMX: 'Direct, concentrated memory-stack exposure',
};

function symbolFromMarketCode(marketCode: string) {
  const parts = marketCode.split(':');
  return parts[parts.length - 1] || marketCode;
}

function buildInstruments(
  themeEntries: typeof resultData.ThemeStocks,
  snapshots: Record<string, InstrumentSnapshot>,
): Instrument[] {
  return themeEntries.map((entry) => {
    const symbol = symbolFromMarketCode(entry.market_code);
    const snapshot = snapshots[symbol];

    if (!snapshot) {
      throw new Error(`Missing market snapshot for ${symbol}`);
    }

    return {
      ...snapshot,
      summary: entry.theme_rationale.en,
    };
  });
}

function buildExposure(themeEntries: typeof resultData.ThemeStocks) {
  return themeEntries.map((entry) => {
    const symbol = symbolFromMarketCode(entry.market_code);
    const snapshot = stockSnapshots[symbol] ?? etfSnapshots[symbol];

    return {
      symbol,
      name: snapshot?.name ?? symbol,
      exposure: entry['Theme exposure'],
      expectationsRisk: riskScores[symbol] ?? 50,
      pathway: pathways[symbol] ?? 'AI-memory theme exposure',
    };
  });
}

const stockPerformance: Record<'1M' | '3M' | '6M' | '1Y', ChartPoint[]> = {
  '1M': [
    { label: 'Jun 17', date: '2026-06-17', value: 0 },
    { label: 'Jun 24', date: '2026-06-24', value: 5.4 },
    { label: 'Jul 1', date: '2026-07-01', value: -6.8 },
    { label: 'Jul 8', date: '2026-07-08', value: -2.4 },
    { label: 'Jul 13', date: '2026-07-13', value: 3.6 },
    { label: 'Jul 16', date: '2026-07-16', value: -1.7 },
  ],
  '3M': [
    { label: 'Apr 16', date: '2026-04-16', value: 0 },
    { label: 'May 15', date: '2026-05-15', value: 18.5 },
    { label: 'Jun 16', date: '2026-06-16', value: 46.9 },
    { label: 'Jul 1', date: '2026-07-01', value: 31.2 },
    { label: 'Jul 16', date: '2026-07-16', value: 34.8 },
  ],
  '6M': [
    { label: 'Jan 16', date: '2026-01-16', value: 0 },
    { label: 'Mar 2', date: '2026-03-02', value: 14.6 },
    { label: 'Apr 16', date: '2026-04-16', value: 8.2 },
    { label: 'Jun 1', date: '2026-06-01', value: 58.7 },
    { label: 'Jul 16', date: '2026-07-16', value: 82.4 },
  ],
  '1Y': [
    { label: "Jul '25", date: '2025-07-16', value: 0 },
    { label: 'Oct 15', date: '2025-10-15', value: 24.8 },
    { label: 'Jan 16', date: '2026-01-16', value: 61.2 },
    { label: 'Apr 15', date: '2026-04-15', value: 87.6 },
    { label: 'Jul 16', date: '2026-07-16', value: 181.3 },
  ],
};

const etfPerformance: Record<'1M' | '3M' | '6M' | '1Y', ChartPoint[]> = {
  '1M': [
    { label: 'Jun 17', date: '2026-06-17', value: 0 },
    { label: 'Jun 24', date: '2026-06-24', value: 9.8 },
    { label: 'Jul 1', date: '2026-07-01', value: -1.2 },
    { label: 'Jul 8', date: '2026-07-08', value: 4.2 },
    { label: 'Jul 13', date: '2026-07-13', value: 1.4 },
    { label: 'Jul 16', date: '2026-07-16', value: -3.6 },
  ],
  '3M': [
    { label: 'Apr 16', date: '2026-04-16', value: 0 },
    { label: 'May 15', date: '2026-05-15', value: 20.1 },
    { label: 'Jun 16', date: '2026-06-16', value: 56.4 },
    { label: 'Jul 1', date: '2026-07-01', value: 49.2 },
    { label: 'Jul 16', date: '2026-07-16', value: 41.3 },
  ],
  '6M': [
    { label: 'Jan 16', date: '2026-01-16', value: 0 },
    { label: 'Mar 2', date: '2026-03-02', value: 10.4 },
    { label: 'Apr 16', date: '2026-04-16', value: 28.1 },
    { label: 'Jun 1', date: '2026-06-01', value: 72.3 },
    { label: 'Jul 16', date: '2026-07-16', value: 79.1 },
  ],
  '1Y': [
    { label: "Jul '25", date: '2025-07-16', value: 0 },
    { label: 'Oct 15', date: '2025-10-15', value: 18.4 },
    { label: 'Jan 16', date: '2026-01-16', value: 43.1 },
    { label: 'Apr 15', date: '2026-04-15', value: 61.2 },
    { label: 'Jul 16', date: '2026-07-16', value: 142.6 },
  ],
};

export const marketTabs: TabMarketData[] = [
  {
    id: 'stock',
    label: 'Stock',
    performance: stockPerformance,
    exposure: buildExposure(resultData.ThemeStocks),
    instruments: buildInstruments(resultData.ThemeStocks, stockSnapshots),
  },
  {
    id: 'etf',
    label: 'ETF',
    performance: etfPerformance,
    exposure: buildExposure(resultData.ThemeEtfs),
    instruments: buildInstruments(resultData.ThemeEtfs, etfSnapshots),
  },
];

export const themeFaq = resultData.ThemeFAQ;
