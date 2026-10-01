import AdminPageHeader from "@/components/shared/AdminPageHeader";
import AnalyticsChartCard from "@/components/charts/AnalyticsChartCard";
import OrderStatusChart from "@/components/charts/OrderStatusChart";
import RevenueTrendChart from "@/components/charts/RevenueTrendChart";
import {
  useGetAdminDashboardStatsQuery,
  useGetAdminOrderAnalyticsQuery,
} from "@/store/api/apiAdmin";
import { Link } from "react-router";

import ArrowRightIcon from "@/assets/icons/nav-arrow-right.inline.svg?react";

import "@/components/charts/chartConfig";

const AdminDashboard = () => {
  const { data: stats } = useGetAdminDashboardStatsQuery();
  const { data: analyticsData } = useGetAdminOrderAnalyticsQuery({
    range: "30d",
  });

  const revenueTrend = analyticsData?.revenueTrend ?? [];
  const orderStatusDistribution = analyticsData?.orderStatusDistribution ?? [];

  const totalOrders = stats?.totalOrders ?? 0;
  const pendingCount = stats?.pendingOrders ?? 0;
  const totalProducts = stats?.totalProducts ?? 0;
  const activeCoupons = stats?.activeCoupons ?? 0;

  return (
    <>
      <AdminPageHeader title="總覽" />
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="總訂單數" value={String(totalOrders)} />
        <StatCard label="總商品數" value={String(totalProducts)} />
        <StatCard label="啟用中優惠碼" value={String(activeCoupons)} />
        <StatCard label="待出貨訂單" value={String(pendingCount)} />
      </div>
      <div className="mb-8 grid grid-cols-1 gap-4 tablet:grid-cols-2 lg:grid-cols-4">
        <QuickActionCard
          title="訂單管理"
          desc="查看及處理訂單"
          to="/admin/orders"
        />
        <QuickActionCard
          title="商品管理"
          desc="新增或編輯商品"
          to="/admin/products"
        />
        <QuickActionCard
          title="消息公告"
          desc="發佈最新消息"
          to="/admin/news"
        />
        <QuickActionCard
          title="優惠碼管理"
          desc="設定折扣活動"
          to="/admin/coupons"
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AnalyticsChartCard
          title="營收趨勢"
          subtitle="近 30 天營收變化"
          isEmpty={revenueTrend.every((d) => d.revenue === 0)}
          emptyMessage="此區間尚無營收資料"
        >
          <div className="h-64">
            <RevenueTrendChart data={revenueTrend} />
          </div>
        </AnalyticsChartCard>
        <AnalyticsChartCard
          title="訂單狀態分佈"
          subtitle="各狀態訂單佔比"
          isEmpty={orderStatusDistribution.every((d) => d.count === 0)}
          emptyMessage="此區間尚無狀態分佈資料"
        >
          <div className="flex h-64 items-center justify-center">
            <div className="w-64">
              <OrderStatusChart data={orderStatusDistribution} />
            </div>
          </div>
        </AnalyticsChartCard>
      </div>
    </>
  );
};

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-4">
    <p className="mb-1 text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-gray-900 tabular-nums">{value}</p>
  </div>
);

const QuickActionCard = ({
  title,
  desc,
  to,
}: {
  title: string;
  desc: string;
  to: string;
}) => (
  <Link
    to={to}
    className="group flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary/30 hover:shadow-sm"
  >
    <div className="min-w-0">
      <p className="font-medium text-gray-900 transition-colors group-hover:text-primary">
        {title}
      </p>
      <p className="mt-0.5 text-sm text-gray-500">{desc}</p>
    </div>
    <ArrowRightIcon className="size-4 shrink-0 text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-primary" />
  </Link>
);

export default AdminDashboard;
