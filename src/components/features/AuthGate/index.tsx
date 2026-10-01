import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

import Loading from "@/components/ui/Loading";
import { useAppSelector } from "@/store";
import { getLoginRedirectPath } from "@/routes/guards";

interface AuthGateProps {
  requireRole?: "admin";
}

const AuthGate = ({ requireRole }: AuthGateProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isInitialized, user } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      // 帶入原本的路徑，讓使用者登入後直接導回。
      const from = `${location.pathname}${location.search}${location.hash}`;
      navigate(getLoginRedirectPath(from), { replace: true });
      return;
    }

    if (requireRole === "admin" && user?.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [
    isAuthenticated,
    isInitialized,
    location,
    navigate,
    requireRole,
    user?.role,
  ]);

  if (!isInitialized || !isAuthenticated) return <Loading fullPage />;
  if (requireRole === "admin" && user?.role !== "admin")
    return <Loading fullPage />;

  return <Outlet />;
};

export default AuthGate;
