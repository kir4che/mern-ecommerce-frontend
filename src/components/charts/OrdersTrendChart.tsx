import { Bar } from "react-chartjs-2";

interface OrdersTrendChartProps {
  data: Array<{ label: string; orders: number }>;
}

const LABEL_FORMAT: Record<string, (label: string) => string> = {
  daily: (label) =>
    `${parseInt(label.split("-")[1], 10)}/${parseInt(label.split("-")[2], 10)}`,
  monthly: (label) => `${parseInt(label.split("-")[1], 10)}月`,
};

const OrdersTrendChart = ({ data }: OrdersTrendChartProps) => {
  const isMonthly = data.length > 0 && data[0].label.length === 7;
  const formatLabel = isMonthly ? LABEL_FORMAT.monthly : LABEL_FORMAT.daily;

  return (
    <Bar
      data={{
        labels: data.map((item) => formatLabel(item.label)),
        datasets: [
          {
            label: "訂單數",
            data: data.map((item) => item.orders),
            backgroundColor: "#93c5fd",
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
            display: false,
          },
          tooltip: {
            filter: (item) => item.parsed.y !== 0,
            callbacks: {
              label: (context) =>
                context.parsed.y !== null ? `${context.parsed.y} 筆` : "",
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
              stepSize: 1,
            },
          },
        },
      }}
    />
  );
};

export default OrdersTrendChart;
