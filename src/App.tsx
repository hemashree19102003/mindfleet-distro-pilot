import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import CommandCenter from "./pages/CommandCenter";
import Dashboard from "./pages/Dashboard";
import Dispatch from "./pages/Dispatch";
import Deliveries from "./pages/Deliveries";
import Shops from "./pages/Shops";
import Inventory from "./pages/Inventory";
import Invoices from "./pages/Invoices";
import Staff from "./pages/Staff";
import Insights from "./pages/Insights";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout><CommandCenter /></AppLayout>} path="/" />
          <Route element={<AppLayout><Dashboard /></AppLayout>} path="/dashboard" />
          <Route element={<AppLayout><Dispatch /></AppLayout>} path="/dispatch" />
          <Route element={<AppLayout><Deliveries /></AppLayout>} path="/deliveries" />
          <Route element={<AppLayout><Shops /></AppLayout>} path="/shops" />
          <Route element={<AppLayout><Inventory /></AppLayout>} path="/inventory" />
          <Route element={<AppLayout><Invoices /></AppLayout>} path="/invoices" />
          <Route element={<AppLayout><Staff /></AppLayout>} path="/staff" />
          <Route element={<AppLayout><Insights /></AppLayout>} path="/insights" />
          <Route element={<AppLayout><SettingsPage /></AppLayout>} path="/settings" />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
