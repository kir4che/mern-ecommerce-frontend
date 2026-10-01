import { NavLink } from "react-router";

import { cn } from "@/utils/cn";

import CartPlusIcon from "@/assets/icons/cart-plus.inline.svg?react";
import CreditCardIcon from "@/assets/icons/credit-card.inline.svg?react";
import DashboardIcon from "@/assets/icons/dashboard.inline.svg?react";
import DeliveryTrunkIcon from "@/assets/icons/delivery-trunk.inline.svg?react";
import MailIcon from "@/assets/icons/mail.inline.svg?react";
import MenuIcon from "@/assets/icons/menu.inline.svg?react";
import SearchIcon from "@/assets/icons/search.inline.svg?react";
import UserCircleIcon from "@/assets/icons/user-circle.inline.svg?react";

const menuItems = [
  { label: "總覽", path: "/admin/dashboard", icon: DashboardIcon },
  { label: "訂單管理", path: "/admin/orders", icon: DeliveryTrunkIcon },
  { label: "商品管理", path: "/admin/products", icon: CartPlusIcon },
  { label: "分類管理", path: "/admin/categories", icon: MenuIcon },
  { label: "標籤管理", path: "/admin/tags", icon: MenuIcon },
  { label: "會員管理", path: "/admin/users", icon: UserCircleIcon },
  { label: "消息公告", path: "/admin/news", icon: MailIcon },
  { label: "優惠碼管理", path: "/admin/coupons", icon: CreditCardIcon },
  { label: "分析報表", path: "/admin/analytics", icon: SearchIcon },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-56 transform overflow-y-auto border-r border-gray-200 bg-white transition-transform duration-200 lg:sticky lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center border-b border-gray-200 px-4">
          <NavLink
            to="/admin/dashboard"
            className="text-lg font-bold tracking-tight"
          >
            管理後台
          </NavLink>
        </div>
        <nav className="space-y-1 p-3">
          {menuItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/admin/dashboard"}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )
              }
            >
              <Icon className="size-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
