import { ORDER_STATUS_MAP } from "@/constants/actionTypes";
import type { OrderStatus } from "@/types";

import { Doughnut } from "react-chartjs-2";

interface OrderStatusChartProps {
  data: Array<{ status: string; count: number }>;
}

const STATUS_COLORS: Record<string, string> = {
  created: "#94a3b8",
  paid: "#3b82f6",
  shipped: "#f59e0b",
  completed: "#22c55e",
  canceled: "#ef4444",
  returned: "#64748b",
};

const OrderStatusChart = ({ data }: OrderStatusChartProps) => {
  const isEmpty = data.length === 0 || data.every((item) => item.count === 0);

  const total = data.reduce((sum, item) => sum + item.count, 0);

  if (isEmpty) return null;

  const labels = data.map(
    (item) => ORDER_STATUS_MAP[item.status as OrderStatus] || item.status
  );
  const colors = data.map((item) => STATUS_COLORS[item.status] ?? "#94a3b8");
  const counts = data.map((item) => item.count);

  return (
    <div className="flex-center size-full gap-4 xl:gap-8">
      <div className="relative max-w-60 max-xl:w-[75%]">
        <Doughnut
          data={{
            labels,
            datasets: [
              {
                data: counts,
                backgroundColor: colors.map((color) => `${color}1A`),
                borderColor: colors,
                borderWidth: 2,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
            cutout: "58%",
            animation: {
              animateRotate: true,
              duration: 800,
            },
            plugins: {
              datalabels: { display: false },
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const percentage =
                      total > 0
                        ? ((context.parsed / total) * 100).toFixed(1)
                        : "0.0";
                    return ` ${context.parsed} 筆 (${percentage}%)`;
                  },
                },
              },
            },
          }}
          className="relative z-10"
        />
        <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 flex-center -translate-x-1/2 -translate-y-1/2 flex-col">
          <span className="text-lg font-bold text-gray-900 xl:text-2xl">
            {total}
          </span>
          <span className="text-[11px] text-gray-400 xl:text-sm">總訂單</span>
        </div>
      </div>
      <div className="space-y-2.5 max-xs:hidden">
        {data.map((item, index) => {
          const percentage =
            total > 0 ? ((item.count / total) * 100).toFixed(1) : "0.0";
          return (
            <div key={item.status} className="flex items-center text-nowrap">
              <span
                className="mr-1.5 size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: colors[index] }}
              />
              <span className="min-w-12 text-xs text-gray-600 xl:text-sm">
                {labels[index]}
              </span>
              <span className="text-xs font-semibold text-gray-900 tabular-nums xl:text-sm">
                {item.count}
              </span>
              <span className="text-xs text-gray-400 tabular-nums">
                （{percentage}%）
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusChart;
