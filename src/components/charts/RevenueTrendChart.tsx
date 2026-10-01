import { Line } from "react-chartjs-2";

interface RevenueTrendChartProps {
  data: Array<{ label: string; revenue: number }>;
}

const LABEL_FORMAT: Record<string, (l: string) => string> = {
  daily: (l) =>
    `${parseInt(l.split("-")[1], 10)}/${parseInt(l.split("-")[2], 10)}`,
  monthly: (l) => `${parseInt(l.split("-")[1], 10)}月`,
};

const RevenueTrendChart = ({ data }: RevenueTrendChartProps) => {
  const isMonthly = data.length > 0 && data[0].label.length === 7;
  const formatLabel = isMonthly ? LABEL_FORMAT.monthly : LABEL_FORMAT.daily;
  const maxRevenue = Math.max(...data.map((item) => item.revenue), 0);
  const roughStep = maxRevenue > 0 ? maxRevenue / 5 : 200;
  const magnitude = 10 ** Math.max(0, Math.floor(Math.log10(roughStep)));
  const yStepSize = Math.max(100, Math.ceil(roughStep / magnitude) * magnitude);

  return (
    <Line
      data={{
        labels: data.map((item) => formatLabel(item.label)),
        datasets: [
          {
            label: "營收",
            data: data.map((item) => item.revenue),
            borderColor: "#2563eb",
            backgroundColor: "rgba(37, 99, 235, 0.08)",
            fill: true,
            tension: 0.1,
            pointRadius: 3,
            pointHoverRadius: 5,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: "index" },
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: "end",
            align: "top",
            font: { size: 11, weight: 500 },
            color: "#2563eb",
            formatter: (value: number) => {
              if (value === 0) return "";
              return value >= 1000
                ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`
                : `${value}`;
            },
            offset: 2,
          },
          tooltip: {
            backgroundColor: "#1f2937",
            titleColor: "#f9fafb",
            bodyColor: "#f9fafb",
            titleFont: { size: 13, weight: 600 },
            bodyFont: { size: 12 },
            padding: 12,
            cornerRadius: 10,
            displayColors: false,
            caretSize: 6,
            callbacks: {
              title: (items) => items[0]?.label ?? "",
              label: (ctx) =>
                ctx.parsed.y !== null
                  ? `NT$ ${ctx.parsed.y.toLocaleString("zh-TW")}`
                  : "",
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { maxTicksLimit: 12, font: { size: 11 } },
          },
          y: {
            beginAtZero: true,
            ticks: {
              font: { size: 11 },
              stepSize: yStepSize,
              callback: (value) =>
                typeof value === "number"
                  ? `NT$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`
                  : "",
            },
          },
        },
      }}
    />
  );
};

export default RevenueTrendChart;
