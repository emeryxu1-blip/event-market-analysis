import type { MarketDataSource, TabMarketData } from './types';

export const article = {
  title: 'AI storage',
  date: 'Dec. 12, 2023',
  image:
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  url: 'https://news.ainvest.com/deep-topic/topic/dt_01KW1DH72RH4MH7F9KQ7ANJ5R1',
};

export const marketDataSource: MarketDataSource = {
  asOf: 'Jul. 2, 2026',
  priceSource: 'Alpaca IEX latest trade and Yahoo daily chart history',
  fundamentalsSource: 'Public market-cap and ETF net-asset snapshots',
};

export const marketTabs: TabMarketData[] = [
  {
    id: 'stock',
    label: 'Stock',
    performance: {
      '1M': [
        { label: 'Jun 5', date: '2026-06-05', value: 0 },
        { label: 'Jun 12', date: '2026-06-12', value: 8.38 },
        { label: 'Jun 22', date: '2026-06-22', value: 28.55 },
        { label: 'Jun 26', date: '2026-06-26', value: 11.43 },
        { label: 'Jul 1', date: '2026-07-01', value: 10.18 },
        { label: 'Jul 2', date: '2026-07-02', value: 2.5 },
      ],
      '3M': [
        { label: 'Apr 2', date: '2026-04-02', value: 0 },
        { label: 'May 1', date: '2026-05-01', value: 43.88 },
        { label: 'Jun 1', date: '2026-06-01', value: 102.24 },
        { label: 'Jun 15', date: '2026-06-15', value: 118.92 },
        { label: 'Jul 2', date: '2026-07-02', value: 87.49 },
      ],
      '6M': [
        { label: 'Jan 2', date: '2026-01-02', value: 0 },
        { label: 'Feb 17', date: '2026-02-17', value: 30.18 },
        { label: 'Mar 31', date: '2026-03-31', value: 19.95 },
        { label: 'May 12', date: '2026-05-12', value: 125.4 },
        { label: 'Jun 23', date: '2026-06-23', value: 189.48 },
        { label: 'Jul 2', date: '2026-07-02', value: 146.21 },
      ],
      '1Y': [
        { label: "Jul 2 '25", date: '2025-07-02', value: 0 },
        { label: "Oct 1 '25", date: '2025-10-01', value: 59.06 },
        { label: 'Jan 2', date: '2026-01-02', value: 113.44 },
        { label: 'Apr 1', date: '2026-04-01', value: 186.25 },
        { label: 'Jul 2', date: '2026-07-02', value: 471.11 },
      ],
    },
    exposure: [
      {
        symbol: 'MU',
        name: 'Micron Technology',
        exposure: 92,
        expectationsRisk: 74,
        pathway: 'HBM and DRAM supply',
      },
      {
        symbol: 'WDC',
        name: 'Western Digital',
        exposure: 78,
        expectationsRisk: 48,
        pathway: 'Enterprise SSD and HDD',
      },
      {
        symbol: 'STX',
        name: 'Seagate Technology',
        exposure: 72,
        expectationsRisk: 43,
        pathway: 'Nearline HDD demand',
      },
      {
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        exposure: 58,
        expectationsRisk: 88,
        pathway: 'AI infrastructure read-through',
      },
    ],
    instruments: [
      {
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        last: 194.51,
        changePct: -1.39,
        marketCap: 4710.25,
        marketCapLabel: '$4.71T',
        summary:
          'GPU leadership anchors AI infrastructure demand and influences storage-adjacent capex.',
      },
      {
        symbol: 'MU',
        name: 'Micron Technology',
        last: 974.23,
        changePct: -5.49,
        marketCap: 1099.5,
        marketCapLabel: '$1.10T',
        summary:
          'HBM and DRAM supply tightness make Micron the core memory read-through.',
      },
      {
        symbol: 'WDC',
        name: 'Western Digital',
        last: 538.79,
        changePct: -9.92,
        marketCap: 185.71,
        marketCapLabel: '$185.7B',
        summary:
          'Enterprise SSD and HDD exposure ties Western Digital to data-center storage demand.',
      },
      {
        symbol: 'STX',
        name: 'Seagate Technology',
        last: 820.58,
        changePct: -10.38,
        marketCap: 185.66,
        marketCapLabel: '$185.7B',
        summary:
          'Nearline hard-drive demand links Seagate to cloud and AI data retention growth.',
      },
    ],
  },
  {
    id: 'etf',
    label: 'ETF',
    performance: {
      '1M': [
        { label: 'Jun 5', date: '2026-06-05', value: 0 },
        { label: 'Jun 12', date: '2026-06-12', value: 8.42 },
        { label: 'Jun 22', date: '2026-06-22', value: 17.38 },
        { label: 'Jun 26', date: '2026-06-26', value: 5.56 },
        { label: 'Jul 1', date: '2026-07-01', value: 8.09 },
        { label: 'Jul 2', date: '2026-07-02', value: 2.04 },
      ],
      '3M': [
        { label: 'Apr 2', date: '2026-04-02', value: 0 },
        { label: 'May 1', date: '2026-05-01', value: 38.39 },
        { label: 'Jun 1', date: '2026-06-01', value: 67.31 },
        { label: 'Jun 15', date: '2026-06-15', value: 79.26 },
        { label: 'Jul 2', date: '2026-07-02', value: 60.95 },
      ],
      '6M': [
        { label: 'Jan 2', date: '2026-01-02', value: 0 },
        { label: 'Feb 17', date: '2026-02-17', value: 9.8 },
        { label: 'Mar 31', date: '2026-03-31', value: 1.57 },
        { label: 'May 12', date: '2026-05-12', value: 59.71 },
        { label: 'Jun 23', date: '2026-06-23', value: 79.66 },
        { label: 'Jul 2', date: '2026-07-02', value: 68.32 },
      ],
      '1Y': [
        { label: "Jul 2 '25", date: '2025-07-02', value: 0 },
        { label: "Oct 1 '25", date: '2025-10-01', value: 18.32 },
        { label: 'Jan 2', date: '2026-01-02', value: 30.12 },
        { label: 'Apr 1', date: '2026-04-01', value: 35.35 },
        { label: 'Jul 2', date: '2026-07-02', value: 118.93 },
      ],
    },
    exposure: [
      {
        symbol: 'SMH',
        name: 'VanEck Semiconductor ETF',
        exposure: 76,
        expectationsRisk: 82,
        pathway: 'AI semiconductor concentration',
      },
      {
        symbol: 'SOXX',
        name: 'iShares Semiconductor ETF',
        exposure: 69,
        expectationsRisk: 74,
        pathway: 'Broad semiconductor exposure',
      },
      {
        symbol: 'XSD',
        name: 'SPDR S&P Semiconductor ETF',
        exposure: 54,
        expectationsRisk: 46,
        pathway: 'Equal-weighted chip basket',
      },
    ],
    instruments: [
      {
        symbol: 'SMH',
        name: 'VanEck Semiconductor ETF',
        last: 591.93,
        changePct: -4.54,
        marketCap: 68.78,
        marketCapLabel: '$68.8B',
        summary:
          'Largest semiconductor ETF by assets, with heavy exposure to AI compute leaders.',
      },
      {
        symbol: 'SOXX',
        name: 'iShares Semiconductor ETF',
        last: 565.9,
        changePct: -5.57,
        marketCap: 40.94,
        marketCapLabel: '$40.9B',
        summary:
          'Broad 30-stock semiconductor basket with meaningful memory and equipment exposure.',
      },
      {
        symbol: 'XSD',
        name: 'SPDR S&P Semiconductor ETF',
        last: 548.41,
        changePct: -6.74,
        marketCap: 3.05,
        marketCapLabel: '$3.05B',
        summary:
          'Equal-weighted semiconductor exposure reduces single-stock dominance in the basket.',
      },
    ],
  },
];
