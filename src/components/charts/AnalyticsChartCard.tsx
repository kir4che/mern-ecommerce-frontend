import type { ReactNode } from "react";

interface AnalyticsChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  isEmpty?: boolean;
  emptyMessage?: string;
}

const AnalyticsChartCard = ({
  title,
  subtitle,
  children,
  isEmpty,
  emptyMessage = "尚無資料",
}: AnalyticsChartCardProps) => (
  <div className="rounded-lg border border-gray-200 bg-white p-6">
    <div className="mb-4">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
    </div>
    {isEmpty ? (
      <div className="flex-center min-h-48 text-sm text-gray-400">
        {emptyMessage}
      </div>
    ) : (
      children
    )}
  </div>
);

export default AnalyticsChartCard;
