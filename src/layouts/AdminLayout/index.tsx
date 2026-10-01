import { useState } from "react";
import { Outlet, ScrollRestoration, useNavigation } from "react-router";
import { Toaster } from "sonner";

import AdminPageSkeleton from "@/components/features/AdminPageSkeleton";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminTopbar from "@/components/layout/AdminTopbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigation = useNavigation();

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar onMenuToggle={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-auto p-6">
            <ErrorBoundary>
              {navigation.state === "loading" ? (
                <AdminPageSkeleton />
              ) : (
                <Outlet />
              )}
            </ErrorBoundary>
          </main>
        </div>
        <ScrollRestoration />
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { top: "5rem" },
          duration: 3000,
        }}
      />
      <ConfirmDialog />
    </>
  );
};

export default AdminLayout;
