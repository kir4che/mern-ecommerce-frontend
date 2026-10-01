import { addComma } from "@/utils/addComma";

interface AnalyticsSummaryCardProps {
  label: string;
  value: number;
  prefix?: string;
  format?: "number" | "currency";
}

const AnalyticsSummaryCard = ({
  label,
  value,
  prefix,
  format = "number",
}: AnalyticsSummaryCardProps) => {
  const display =
    format === "currency"
      ? `NT$ ${addComma(Math.round(value))}`
      : addComma(value);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="mb-1 text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 tabular-nums">
        {prefix}
        {display}
      </p>
    </div>
  );
};

export default AnalyticsSummaryCard;
