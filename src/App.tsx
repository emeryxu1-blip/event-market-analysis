import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { article, marketTabs } from './data';
import type { ExposurePoint, MarketTab, PerformancePeriod, TabMarketData } from './types';

type ExposurePlotPoint = ExposurePoint & {
  marketValue: number;
  marketValueLabel: string;
  marketValueName: string;
  pointSize: number;
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const periodOptions: PerformancePeriod[] = ['1M', '3M', '6M', '1Y'];

function formatChangePct(value: number) {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function formatMarketScale(value: number) {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}T`;
  }

  return `$${value.toFixed(value >= 10 ? 0 : 1)}B`;
}

function ArticleIntro() {
  return (
    <section className="article-panel" aria-labelledby="article-title">
      <h1 id="article-title">{article.title}</h1>
      <time dateTime="2023-12-12">{article.date}</time>
      <a className="analysis-button" href={article.url} target="_blank" rel="noreferrer">
        <span>Read Full Analysis</span>
        <ArrowUpRight size={17} strokeWidth={2.4} />
      </a>
    </section>
  );
}

function TabSwitcher({
  activeTab,
  onChange,
}: {
  activeTab: MarketTab;
  onChange: (tab: MarketTab) => void;
}) {
  return (
    <div className="tab-switcher" role="tablist" aria-label="Market type">
      {marketTabs.map((tab) => (
        <button
          key={tab.id}
          className={tab.id === activeTab ? 'tab-button is-active' : 'tab-button'}
          type="button"
          role="tab"
          aria-selected={tab.id === activeTab}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function ChartCard({
  title,
  eyebrow,
  detail,
  children,
}: {
  title: string;
  eyebrow?: string;
  detail?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="chart-card" aria-label={title}>
      <div className="chart-heading">
        <div>
          {eyebrow ? <p>{eyebrow}</p> : null}
          <h2>{title}</h2>
          {detail ? <span className="chart-detail">{detail}</span> : null}
        </div>
      </div>
      <div className="chart-frame">{children}</div>
    </section>
  );
}

function PerformanceChart({
  data,
  gradientId,
  period,
  onPeriodChange,
}: {
  data: TabMarketData['performance'][PerformancePeriod];
  gradientId: string;
  period: PerformancePeriod;
  onPeriodChange: (period: PerformancePeriod) => void;
}) {
  return (
    <ChartCard title="Performance" detail="Equal-weighted basket">
      <div className="performance-chart-body">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#007aff" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#007aff" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e8eaef" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              padding={{ left: 12, right: 12 }}
              tickLine={false}
              tick={{ fill: '#86868b', fontSize: 11, fontWeight: 600 }}
              dy={8}
              interval={0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#86868b', fontSize: 11, fontWeight: 600 }}
              tickFormatter={(value) => `${Number(value).toFixed(0)}%`}
              width={34}
            />
            <Tooltip
              cursor={{ stroke: '#007aff', strokeWidth: 1, strokeDasharray: '4 4' }}
              formatter={(value) => [`${Number(value).toFixed(2)}%`, 'Change']}
              labelStyle={{ color: '#1d1d1f', fontWeight: 700 }}
              contentStyle={{
                border: '0',
                borderRadius: 14,
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.14)',
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#007aff"
              strokeWidth={3}
              fill={`url(#${gradientId})`}
              activeDot={{ r: 5, fill: '#007aff', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="period-switcher" role="tablist" aria-label="Performance period">
        {periodOptions.map((option) => (
          <button
            key={option}
            className={option === period ? 'period-button is-active' : 'period-button'}
            type="button"
            role="tab"
            aria-selected={option === period}
            onClick={() => onPeriodChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </ChartCard>
  );
}

function getExposureColor(point: ExposurePoint) {
  if (point.expectationsRisk >= 78) {
    return '#ff9f0a';
  }

  if (point.exposure >= 75) {
    return '#16a060';
  }

  return '#007aff';
}

function ExposureTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ExposurePlotPoint }>;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0].payload;

  return (
    <div className="exposure-tooltip">
      <strong>{point.symbol}</strong>
      <span>{point.name}</span>
      <dl>
        <div>
          <dt>Exposure</dt>
          <dd>{point.exposure}/100</dd>
        </div>
        <div>
          <dt>{point.marketValueName}</dt>
          <dd>{point.marketValueLabel}</dd>
        </div>
        <div>
          <dt>Risk</dt>
          <dd>{point.expectationsRisk}/100</dd>
        </div>
      </dl>
      <p>{point.pathway}</p>
    </div>
  );
}

function ExposureMap({ data }: { data: TabMarketData }) {
  const valueLabel = data.id === 'etf' ? 'Assets' : 'Market Cap';
  const axisLabel = data.id === 'etf' ? 'Assets' : 'Market cap';
  const detail = data.id === 'etf' ? 'Theme exposure vs assets' : 'Theme exposure vs market cap';
  const exposureMapData: ExposurePlotPoint[] = data.exposure.map((point) => {
    const instrument = data.instruments.find((item) => item.symbol === point.symbol);

    return {
      ...point,
      marketValue: instrument?.marketCap ?? 0,
      marketValueLabel: instrument?.marketCapLabel ?? 'N/A',
      marketValueName: valueLabel,
      pointSize: 1,
    };
  });
  const maxMarketScale = Math.max(...exposureMapData.map((point) => point.marketValue));
  const marketScaleStep = maxMarketScale >= 1000 ? 500 : maxMarketScale >= 100 ? 50 : maxMarketScale >= 10 ? 10 : 1;
  const yAxisMax = Math.ceil((maxMarketScale * 1.15) / marketScaleStep) * marketScaleStep;
  const yAxisTicks = [0, yAxisMax / 2, yAxisMax];

  return (
    <ChartCard title="Exposure Map" detail={detail}>
      <div className="exposure-map-body">
        <div className="exposure-axis y-axis" aria-hidden="true">
          {axisLabel}
        </div>
        <div className="exposure-chart-plot">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 16, right: 12, bottom: 4, left: 4 }}>
              <CartesianGrid stroke="#e8eaef" strokeDasharray="3 4" />
              <XAxis
                type="number"
                dataKey="exposure"
                domain={[0, 100]}
                ticks={[0, 50, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#86868b', fontSize: 11, fontWeight: 650 }}
                tickFormatter={(value) => (Number(value) === 0 ? 'Low' : Number(value) === 100 ? 'High' : '')}
              />
              <YAxis
                type="number"
                dataKey="marketValue"
                domain={[0, yAxisMax]}
                ticks={yAxisTicks}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#86868b', fontSize: 11, fontWeight: 650 }}
                tickFormatter={(value) => formatMarketScale(Number(value))}
                width={46}
              />
              <ZAxis type="number" dataKey="pointSize" range={[220, 220]} />
              <Tooltip cursor={{ stroke: '#007aff', strokeWidth: 1, strokeDasharray: '4 4' }} content={<ExposureTooltip />} />
              <Scatter data={exposureMapData}>
                {exposureMapData.map((point) => (
                  <Cell key={point.symbol} fill={getExposureColor(point)} fillOpacity={0.86} stroke="#ffffff" strokeWidth={2} />
                ))}
                <LabelList
                  className="exposure-point-label"
                  dataKey="symbol"
                  position="top"
                  offset={8}
                  style={{ fill: '#1d1d1f', fontSize: 13, fontWeight: 850 }}
                />
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="exposure-axis x-axis" aria-hidden="true">
          Theme exposure
        </div>
      </div>
      <div className="exposure-legend" aria-label="Exposure map legend">
        {data.exposure.map((point) => (
          <span key={point.symbol}>
            <i style={{ backgroundColor: getExposureColor(point) }} />
            {point.symbol}
          </span>
        ))}
      </div>
    </ChartCard>
  );
}

function MarketTable({ data }: { data: TabMarketData }) {
  const valueColumnLabel = data.id === 'etf' ? 'Assets' : 'Mkt Cap';

  return (
    <section className="market-table" aria-label={`${data.label} instruments`}>
      <div className="table-header">
        <span>Symbol</span>
        <button type="button" aria-label="Sort by last price">
          Last <span aria-hidden="true">↕</span>
        </button>
        <button type="button" aria-label="Sort by percent change">
          %Chg <span aria-hidden="true">↕</span>
        </button>
        <button type="button" aria-label={`Sort by ${valueColumnLabel.toLowerCase()}`}>
          {valueColumnLabel} <span aria-hidden="true">↕</span>
        </button>
      </div>
      <div className="instrument-list">
        {data.instruments.map((instrument) => (
          <article className="instrument-row" key={instrument.symbol}>
            <div className="instrument-main">
              <div className="instrument-symbol">
                <strong>{instrument.symbol}</strong>
                <span>{instrument.name}</span>
              </div>
              <strong className="last-price">{currencyFormatter.format(instrument.last)}</strong>
              <strong className={instrument.changePct >= 0 ? 'change is-positive' : 'change is-negative'}>
                {formatChangePct(instrument.changePct)}
              </strong>
              <strong className="cap">{instrument.marketCapLabel}</strong>
            </div>
            <p>{instrument.summary}</p>
            <button className="more-button" type="button">
              More <ChevronDown size={16} strokeWidth={2.4} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<MarketTab>('stock');
  const [period, setPeriod] = useState<PerformancePeriod>('1M');
  const activeData = marketTabs.find((tab) => tab.id === activeTab) ?? marketTabs[0];

  return (
    <main className="app-shell">
      <div className="phone-canvas">
        <section className="story-panel" aria-label="Article">
          <ArticleIntro />
        </section>
        <section className="market-panel" aria-label="Market analysis">
          <TabSwitcher activeTab={activeTab} onChange={setActiveTab} />
          <div className="charts-grid" key={activeData.id}>
            <PerformanceChart
              data={activeData.performance[period]}
              gradientId={`${activeData.id}-${period}-performance-fill`}
              period={period}
              onPeriodChange={setPeriod}
            />
            <ExposureMap data={activeData} />
          </div>
          <MarketTable data={activeData} />
        </section>
      </div>
    </main>
  );
}

export default App;
