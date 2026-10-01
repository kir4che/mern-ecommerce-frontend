import { useState } from "react";
import Button from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import AdminPageSkeleton from "@/components/features/AdminPageSkeleton";
import AdminPageHeader from "@/components/shared/AdminPageHeader";
import AnalyticsChartCard from "@/components/charts/AnalyticsChartCard";
import AnalyticsSummaryCard from "@/components/charts/AnalyticsSummaryCard";
import OrderStatusChart from "@/components/charts/OrderStatusChart";
import OrdersTrendChart from "@/components/charts/OrdersTrendChart";
import RevenueTrendChart from "@/components/charts/RevenueTrendChart";
import TopProductsChart from "@/components/charts/TopProductsChart";
import { useGetAdminOrderAnalyticsQuery } from "@/store/api/apiAdmin";
import type { AnalyticsRange } from "@/types";
import { getErrorMessage } from "@/utils/getErrorMessage";

import RefreshIcon from "@/assets/icons/refresh.inline.svg?react";

import "@/components/charts/chartConfig";

const RANGE_OPTIONS: { value: AnalyticsRange; label: string }[] = [
  { value: "7d", label: "7 天" },
  { value: "30d", label: "30 天" },
  { value: "90d", label: "90 天" },
  { value: "12m", label: "12 個月" },
];

const AdminAnalyticsPage = () => {
  const [range, setRange] = useState<AnalyticsRange>("30d");

  const { data, isLoading, isError, error, refetch } =
    useGetAdminOrderAnalyticsQuery({ range });

  const summary = data?.summary;
  const revenueTrend = data?.revenueTrend ?? [];
  const orderTrend = data?.orderTrend ?? [];
  const orderStatusDistribution = data?.orderStatusDistribution ?? [];
  const topProducts = data?.topProducts ?? [];

  const hasNoData =
    !isLoading &&
    !isError &&
    summary &&
    summary.totalOrders === 0 &&
    summary.totalRevenue === 0;

  return (
    <>
      <AdminPageHeader
        title="分析報表"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-gray-200 bg-white p-0.5">
              {RANGE_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  variant="icon"
                  onClick={() => setRange(opt.value)}
                  className={cn(
                    "h-auto rounded-md px-3 py-1.5 text-sm font-normal",
                    range === opt.value
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  )}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
            <Button
              variant="icon"
              icon={RefreshIcon}
              onClick={refetch}
              aria-label="重新載入"
              className="transition-transform hover:rotate-30"
            />
          </div>
        }
      />
      {isError && (
        <div className="flex-center h-64 flex-col gap-4">
          <p className="text-gray-600">
            {getErrorMessage(error, "無法載入分析資料")}
          </p>
          <Button onClick={refetch} icon={RefreshIcon}>
            重新載入
          </Button>
        </div>
      )}
      {isLoading && <AdminPageSkeleton tableRows={3} />}
      {hasNoData && (
        <div className="flex-center h-96 flex-col gap-2">
          <p className="text-sm text-gray-400">
            此區間尚無訂單資料，請嘗試切換時間範圍
          </p>
        </div>
      )}
      {!isLoading && !isError && !hasNoData && summary && (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <AnalyticsSummaryCard
              label="總營收"
              value={summary.totalRevenue}
              format="currency"
            />
            <AnalyticsSummaryCard
              label="訂單總數"
              value={summary.totalOrders}
            />
            <AnalyticsSummaryCard
              label="平均客單價"
              value={Math.round(summary.averageOrderValue)}
              format="currency"
            />
            <AnalyticsSummaryCard
              label="已完成訂單"
              value={summary.completedOrders}
            />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <AnalyticsChartCard
              title="營收趨勢"
              subtitle={`近 ${RANGE_OPTIONS.find((r) => r.value === range)?.label ?? range} 營收變化`}
              isEmpty={revenueTrend.every((d) => d.revenue === 0)}
              emptyMessage="此區間尚無營收資料"
            >
              <div className="h-64">
                <RevenueTrendChart data={revenueTrend} />
              </div>
            </AnalyticsChartCard>
            <AnalyticsChartCard
              title="訂單趨勢"
              subtitle={`近 ${RANGE_OPTIONS.find((r) => r.value === range)?.label ?? range} 訂單數量變化`}
              isEmpty={orderTrend.every((d) => d.orders === 0)}
              emptyMessage="此區間尚無訂單資料"
            >
              <div className="h-64">
                <OrdersTrendChart data={orderTrend} />
              </div>
            </AnalyticsChartCard>
            <AnalyticsChartCard
              title="訂單狀態分佈"
              subtitle="各狀態訂單佔比"
              isEmpty={orderStatusDistribution.every((d) => d.count === 0)}
              emptyMessage="此區間尚無狀態分佈資料"
            >
              <div className="flex-center h-64">
                <div className="w-64">
                  <OrderStatusChart data={orderStatusDistribution} />
                </div>
              </div>
            </AnalyticsChartCard>
            <AnalyticsChartCard
              title="熱銷商品排行"
              subtitle="依銷售量排序 Top 5"
              isEmpty={topProducts.every((d) => d.quantity === 0)}
              emptyMessage="此區間尚無熱銷商品資料"
            >
              <div className="h-64">
                <TopProductsChart data={topProducts} />
              </div>
            </AnalyticsChartCard>
          </div>
        </>
      )}
    </>
  );
};

export default AdminAnalyticsPage;
