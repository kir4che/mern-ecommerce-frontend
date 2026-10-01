import { useState } from "react";
import { Link, useNavigate } from "react-router";

import Button from "@/components/ui/Button";
import AddressManager from "@/components/forms/AddressManager";
import ChangePasswordForm from "@/components/forms/ChangePasswordForm";
import UserOrdersTable from "@/components/features/UserOrdersTable";
import { useGetActiveCouponsQuery } from "@/store/api/apiCoupons";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";
import { addComma } from "@/utils/addComma";

import CopyButton from "@/components/shared/CopyButton";
import LogoutIcon from "@/assets/icons/logout.inline.svg?react";
import ArrowRightIcon from "@/assets/icons/nav-arrow-right.inline.svg?react";

type Tab = "orders" | "addresses" | "password" | "coupons";

interface TabItem {
  key: Tab;
  label: string;
}

const TABS: TabItem[] = [
  { key: "orders", label: "我的訂單" },
  { key: "addresses", label: "地址管理" },
  { key: "password", label: "修改密碼" },
  { key: "coupons", label: "我的優惠券" },
];

const CouponsTab = () => {
  const { data, isLoading } = useGetActiveCouponsQuery();

  if (isLoading)
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-lg border p-4">
            <div className="h-6 w-32 skeleton" />
            <div className="h-4 w-48 skeleton" />
            <div className="h-3 w-24 skeleton" />
          </div>
        ))}
      </div>
    );

  const coupons = data?.coupons ?? [];

  if (coupons.length === 0)
    return (
      <div className="flex-center min-h-32 text-sm text-gray-400">
        目前沒有可用的優惠券
      </div>
    );

  return (
    <div className="space-y-3">
      {coupons.map((c) => (
        <div
          key={c._id}
          className="flex flex-wrap items-start justify-between gap-2 rounded-lg border bg-white p-4"
        >
          <div>
            <p className="flex items-center gap-2 text-lg font-bold tracking-wider text-primary">
              {c.code}
              <CopyButton text={c.code} label="優惠券代碼" />
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {c.discountType === "percentage"
                ? `${c.discountValue}% OFF`
                : `NT$ ${addComma(c.discountValue)} 折扣`}
              {c.minPurchaseAmount > 0 &&
                ` ・ 滿 NT$${addComma(c.minPurchaseAmount)}`}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs text-gray-400">
              到期 {new Date(c.expiryDate).toLocaleDateString("zh-TW")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const TabContent = ({ activeTab }: { activeTab: Tab }) => {
  switch (activeTab) {
    case "orders":
      return <UserOrdersTable />;
    case "addresses":
      return <AddressManager />;
    case "password":
      return (
        <div className="max-w-sm">
          <ChangePasswordForm />
        </div>
      );
    case "coupons":
      return <CouponsTab />;
  }
};

const Sidebar = ({
  activeTab,
  onTabChange,
}: {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}) => (
  <nav className="flex shrink-0 gap-1 max-md:mb-4 max-md:overflow-x-auto max-md:border-b max-md:pb-2 md:mr-8 md:w-44 md:flex-col md:pr-4">
    <p className="mb-3 px-3 text-xs tracking-wider text-gray-400 uppercase max-md:hidden">
      會員中心
    </p>
    {TABS.map(({ key, label }) => (
      <Button
        key={key}
        variant="secondary"
        onClick={() => onTabChange(key)}
        className={cn(
          "h-auto justify-start gap-2 rounded border-none px-3 py-2 font-normal text-nowrap",
          activeTab === key
            ? "bg-gray-100 text-gray-900"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        )}
      >
        {label}
      </Button>
    ))}
  </nav>
);

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("orders");

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="mx-auto min-h-[calc(100vh-15rem)] w-full max-w-6xl px-5 pt-8 md:px-8">
      <div className="mb-6 flex gap-0 border-b pb-4 max-tablet:flex-col tablet:items-end tablet:justify-between">
        <div>
          <p className="font-medium">{user?.email?.split("@")[0] || "會員"}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
        <Button
          variant="link"
          icon={LogoutIcon}
          iconPosition="end"
          onClick={handleLogout}
          className="h-7 self-end p-0 hover:opacity-70 tablet:self-auto"
        >
          登出
        </Button>
      </div>
      <div className="flex max-md:flex-col">
        <div className="md:w-44 md:shrink-0">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          {user?.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="mt-4 hidden rounded border-t border-gray-200 px-3 py-2 pt-4 text-sm text-nowrap text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 md:flex"
            >
              管理後台
            </Link>
          )}
        </div>
        <main className="min-h-[60vh] min-w-0 flex-1 pb-8 md:pl-6">
          {user?.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="mb-4 flex-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 md:hidden"
            >
              管理後台
            </Link>
          )}
          <TabContent activeTab={activeTab} />
        </main>
      </div>
      <div className="border-t pt-6">
        <Link
          to="/contact"
          className="text-gray-content/70 flex items-center justify-end gap-1 text-sm transition-colors hover:text-primary"
        >
          聯繫客服 <ArrowRightIcon className="size-5" />
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
