import { Bar } from "react-chartjs-2";

interface TopProductItem {
  title: string;
  quantity: number;
  revenue: number;
}

const BAR_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

const truncate = (value: string, maxLength: number) =>
  value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;

const TopProductsChart = ({ data }: { data: TopProductItem[] }) => {
  const isEmpty =
    data.length === 0 || data.every((item) => item.quantity === 0);
  if (isEmpty) return null;

  return (
    <Bar
      data={{
        labels: data.map((item) => truncate(item.title, 18)),
        datasets: [
          {
            label: "銷量",
            data: data.map((item) => item.quantity),
            backgroundColor: data.map(
              (_, index) => BAR_COLORS[index % BAR_COLORS.length]
            ),
          },
        ],
      }}
      options={{
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            display: false,
          },
          legend: { display: false },
          tooltip: {
            displayColors: false,
            callbacks: {
              title: (items) => {
                const index = items[0]?.dataIndex ?? -1;
                return data[index]?.title ?? "";
              },
              label: (context) => {
                const item = data[context.dataIndex];
                if (!item) return "";
                return [
                  `銷量: ${item.quantity}`,
                  `營收: NT$ ${item.revenue.toLocaleString("zh-TW")}`,
                ];
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { stepSize: 1, font: { size: 11 } },
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 11 } },
          },
        },
      }}
    />
  );
};

export default TopProductsChart;
