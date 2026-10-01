import { Link } from "react-router";

import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";

import MenuIcon from "@/assets/icons/menu.inline.svg?react";

interface AdminTopbarProps {
  onMenuToggle: () => void;
}

const AdminTopbar = ({ onMenuToggle }: AdminTopbarProps) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex-between h-14 shrink-0 border-b border-gray-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="icon"
          icon={MenuIcon}
          onClick={onMenuToggle}
          aria-label="切換選單"
          className="lg:hidden"
        />
      </div>
      <div className="flex items-center gap-4">
        <Link
          to="/my-account"
          className="text-sm text-gray-500 transition-colors hover:text-primary"
        >
          返回前台
        </Link>
        <span className="hidden text-sm text-gray-500 tablet:inline">
          {user?.email}
        </span>
      </div>
    </header>
  );
};

export default AdminTopbar;
