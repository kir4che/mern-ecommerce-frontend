import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  title: string;
  actions?: ReactNode;
}

const AdminPageHeader = ({ title, actions }: AdminPageHeaderProps) => (
  <div className="mb-2 flex-between flex-wrap gap-4">
    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    {actions && (
      <div className="flex shrink-0 items-center gap-2">{actions}</div>
    )}
  </div>
);

export default AdminPageHeader;
