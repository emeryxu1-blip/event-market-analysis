import { useLayoutEffect, useRef, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
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
import { article, marketTabs, themeFaq } from './data';
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

const exposureLabelNudges: Record<string, { dx: number; dy: number }> = {
  NVDA: { dx: 0, dy: -20 },
  SKHY: { dx: 0, dy: -20 },
  DELL: { dx: -32, dy: 18 },
  AMD: { dx: -28, dy: -22 },
  ASML: { dx: 0, dy: -44 },
  LRCX: { dx: 24, dy: 18 },
  AMAT: { dx: 32, dy: -22 },
  KLAC: { dx: 4, dy: 38 },
  SHOC: { dx: 0, dy: -20 },
  SMH: { dx: 0, dy: -20 },
  SOXX: { dx: 0, dy: -20 },
  SOXQ: { dx: 0, dy: -48 },
  HBMX: { dx: -22, dy: -20 },
};

function formatChangePct(value: number) {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function formatMarketScale(value: number) {
  if (value === 0) {
    return '$0';
  }

  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}T`;
  }

  if (value < 1) {
    return `$${(value * 1000).toFixed(0)}M`;
  }

  return `$${value.toFixed(value >= 10 ? 0 : 1)}B`;
}

function getLinearAxis(maxValue: number, targetIntervals = 4) {
  if (maxValue <= 0) {
    return { axisMax: 1, ticks: [0, 1] };
  }

  const roughStep = maxValue / targetIntervals;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const normalizedStep = roughStep / magnitude;
  const niceMultiplier =
    normalizedStep <= 1 ? 1 : normalizedStep <= 2 ? 2 : normalizedStep <= 2.5 ? 2.5 : normalizedStep <= 5 ? 5 : 10;
  const step = niceMultiplier * magnitude;
  const axisMax = Math.ceil(maxValue / step) * step;
  const ticks = Array.from({ length: Math.round(axisMax / step) + 1 }, (_, index) => index * step);

  return { axisMax, ticks };
}

function ArticleIntro() {
  return (
    <section className="article-panel" aria-labelledby="article-title">
      <div className="theme-media">
        <img src={article.image} alt={article.imageAlt} />
        <a className="analysis-button" href={article.url} target="_blank" rel="noreferrer">
          <span>Read Full Analysis</span>
          <span className="analysis-button-icon" aria-hidden="true">
            <ArrowUpRight size={15} strokeWidth={2.5} />
          </span>
        </a>
      </div>
      <div className="theme-content">
        <h1 id="article-title">{article.title}</h1>
        <time dateTime={article.dateIso}>{article.date}</time>
      </div>
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
    <ChartCard title="Performance" detail="Equal-weighted average of constituent returns">
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
          <dd>{point.exposure.toFixed(1)}/5</dd>
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
  const valueLabel = data.id === 'etf' ? 'AUM' : 'Market Cap';
  const axisLabel = data.id === 'etf' ? 'AUM' : 'Market cap';
  const detail = `Theme exposure (1–5) · ${axisLabel}`;
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
  const maxMarketValue = Math.max(...exposureMapData.map((point) => point.marketValue));
  const { axisMax: yAxisMax, ticks: yAxisTicks } = getLinearAxis(maxMarketValue);

  return (
    <ChartCard title="Exposure Map" detail={detail}>
      <div className="exposure-map-body">
        <div className="exposure-axis y-axis" aria-hidden="true">
          {axisLabel}
        </div>
        <div className="exposure-chart-plot">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 32, right: 36, bottom: 44, left: 4 }}>
              <CartesianGrid stroke="rgba(60, 60, 67, 0.10)" strokeDasharray="2 7" />
              <XAxis
                type="number"
                dataKey="exposure"
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8e8e93', fontSize: 11, fontWeight: 650 }}
                tickFormatter={(value) => Number(value).toFixed(0)}
                interval={0}
              />
              <YAxis
                type="number"
                dataKey="marketValue"
                domain={[0, yAxisMax]}
                ticks={yAxisTicks}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8e8e93', fontSize: 11, fontWeight: 650 }}
                tickFormatter={(value) => formatMarketScale(Number(value))}
                width={46}
              />
              <ZAxis type="number" dataKey="pointSize" range={[88, 88]} />
              <Tooltip
                cursor={{ stroke: 'rgba(0, 122, 255, 0.35)', strokeWidth: 1, strokeDasharray: '3 5' }}
                content={<ExposureTooltip />}
              />
              <Scatter data={exposureMapData} fill="#0a84ff" fillOpacity={0.92} stroke="#ffffff" strokeWidth={2.5}>
                <LabelList
                  dataKey="symbol"
                  content={(props) => {
                    const point = exposureMapData[props.index ?? 0];
                    const viewBox = props.viewBox as { x?: number; y?: number; width?: number; height?: number };
                    const nudge = exposureLabelNudges[point.symbol] ?? { dx: 0, dy: -20 };
                    const pointX = (viewBox.x ?? 0) + (viewBox.width ?? 0) / 2;
                    const pointY = (viewBox.y ?? 0) + (viewBox.height ?? 0) / 2;
                    const x = pointX + nudge.dx;
                    const y = pointY + nudge.dy;
                    const badgeWidth = point.symbol.length * 7.2 + 14;

                    return (
                      <g className="exposure-symbol-badge" pointerEvents="none">
                        <line
                          x1={pointX}
                          y1={pointY}
                          x2={x}
                          y2={y}
                          stroke="rgba(60, 60, 67, 0.24)"
                          strokeWidth={1}
                          strokeDasharray="2 3"
                        />
                        <rect
                          x={x - badgeWidth / 2}
                          y={y - 10}
                          width={badgeWidth}
                          height={20}
                          rx={10}
                          fill="rgba(255, 255, 255, 0.96)"
                          stroke="rgba(60, 60, 67, 0.12)"
                        />
                        <text x={x} y={y + 3.5} fill="#1d1d1f" fontSize={10.5} fontWeight={800} textAnchor="middle">
                          {point.symbol}
                        </text>
                      </g>
                    );
                  }}
                />
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="exposure-axis x-axis" aria-hidden="true">
          Theme exposure (1–5)
        </div>
      </div>
    </ChartCard>
  );
}

function RationaleDisclosure({ id, text }: { id: string; text: string }) {
  const rationaleRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsDisclosure, setNeedsDisclosure] = useState(false);

  useLayoutEffect(() => {
    const element = rationaleRef.current;

    if (!element) {
      return;
    }

    let animationFrame = 0;

    const measureOverflow = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const lineHeight = Number.parseFloat(window.getComputedStyle(element).lineHeight);
        const collapsedHeight = lineHeight * 2;
        const shouldShowDisclosure = element.scrollHeight > collapsedHeight + 1;

        setNeedsDisclosure(shouldShowDisclosure);

        if (!shouldShowDisclosure) {
          setIsExpanded(false);
        }
      });
    };

    measureOverflow();
    const resizeObserver = new ResizeObserver(measureOverflow);
    resizeObserver.observe(element);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, [text]);

  return (
    <>
      <p ref={rationaleRef} className={isExpanded ? 'instrument-rationale is-expanded' : 'instrument-rationale'} id={id}>
        {text}
      </p>
      {needsDisclosure ? (
        <button
          className="rationale-toggle"
          type="button"
          aria-controls={id}
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((current) => !current)}
        >
          <span>{isExpanded ? 'Collapse rationale' : 'Read rationale'}</span>
          <ChevronDown className="rationale-chevron" size={14} strokeWidth={2.2} aria-hidden="true" />
        </button>
      ) : null}
    </>
  );
}

function MarketTable({ data }: { data: TabMarketData }) {
  const valueColumnLabel = data.id === 'etf' ? 'Assets' : 'Mkt Cap';

  return (
    <section className="market-table" aria-label={`${data.label} instruments`}>
      <div className="table-header" aria-hidden="true">
        <span>Symbol</span>
        <span>Last</span>
        <span>%Chg</span>
        <span>{valueColumnLabel}</span>
      </div>
      <div className="instrument-list">
        {data.instruments.map((instrument) => {
          const rationaleId = `${data.id}-${instrument.symbol.toLowerCase()}-rationale`;

          return (
            <article className="instrument-row" key={instrument.symbol}>
              <div className="instrument-quote">
                <div className="instrument-symbol">
                  <strong>{instrument.symbol}</strong>
                  <span>{instrument.name}</span>
                </div>
                <div className="instrument-price">
                  <span>Last</span>
                  <strong>{currencyFormatter.format(instrument.last)}</strong>
                </div>
              </div>
              <div className="instrument-metrics">
                <div className="instrument-metric">
                  <span>Day change</span>
                  <strong className={instrument.changePct >= 0 ? 'change is-positive' : 'change is-negative'}>
                    {formatChangePct(instrument.changePct)}
                  </strong>
                </div>
                <div className="instrument-metric is-aligned-right">
                  <span>{valueColumnLabel}</span>
                  <strong className="cap">{instrument.marketCapLabel}</strong>
                </div>
              </div>
              <RationaleDisclosure id={rationaleId} text={instrument.summary} />
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ThemeFaq() {
  return (
    <section className="faq-card" aria-labelledby="faq-title">
      <div className="faq-heading">
        <h2 id="faq-title">Theme FAQ</h2>
      </div>
      <div className="faq-list">
        {themeFaq.map((item, index) => (
          <details key={item.question} open={index === 0}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
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
          <ThemeFaq />
        </section>
      </div>
    </main>
  );
}

export default App;
