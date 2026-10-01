import { Outlet, ScrollRestoration, useNavigation } from "react-router";

import { Toaster } from "sonner";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import Loading from "@/components/ui/Loading";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import HeaderMenu from "@/components/features/HeaderMenu";
import Logo from "@/components/ui/Logo";
const AppLayout = () => {
  const navigation = useNavigation();

  return (
    <div className="flex min-h-dvh flex-col">
      <HeaderMenu />
      <main className="relative flex w-full flex-1 flex-col">
        <ErrorBoundary>
          {navigation.state === "loading" ? <Loading fullPage /> : <Outlet />}
        </ErrorBoundary>
      </main>
      <footer className="m-5 rounded-xl bg-primary p-8 text-white md:px-16 md:py-10">
        <div className="flex flex-wrap items-baseline justify-between gap-y-4">
          <Logo isWhite={true} />
          <p className="text-xs font-light">
            Copyright © 2026 日出麵包坊 all rights reserved.
          </p>
        </div>
      </footer>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { top: "5rem" },
          duration: 3000,
        }}
      />
      <ConfirmDialog />
      <ScrollRestoration />
    </div>
  );
};

export default AppLayout;
