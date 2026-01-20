import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

// Layouts
import { AuthLayout } from "@/layouts/AuthLayout";
import { ManagerLayout } from "@/layouts/ManagerLayout";
import { OwnerLayout } from "@/layouts/OwnerLayout";

// Auth Pages
import { Login } from "@/pages/auth/Login";

// Manager Pages
import { ManagerDashboard } from "@/pages/manager/Dashboard";
import { ActiveTrips } from "@/pages/manager/trips/ActiveTrips";
import { StartTrip } from "@/pages/manager/trips/StartTrip";
import { CompletedTrips } from "@/pages/manager/trips/CompletedTrips";
import { TripDetails } from "@/pages/manager/trips/TripDetails";
import { EndTrip } from "@/pages/manager/trips/EndTrip";
import { TruckManagement } from "@/pages/manager/master/TruckManagement";
import { DriverManagement } from "@/pages/manager/master/DriverManagement";
import { ClientManagement } from "@/pages/manager/master/ClientManagement";
import { PetrolPumpManagement } from "@/pages/manager/master/PetrolPumpManagement";

// Owner Pages
import { OwnerDashboard } from "@/pages/owner/Dashboard";
import { BillsList } from "@/pages/owner/billing/BillsList";
import ReceivablesReport from "@/pages/owner/reports/ReceivablesReport";
import ProfitLossReport from "@/pages/owner/reports/ProfitLossReport";
import ExpenseReport from "@/pages/owner/reports/ExpenseReport";
import { GenerateBills } from "@/pages/owner/billing/GenerateBills";

// Other
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Root redirect */}
            <Route path="/" element={<Index />} />

            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Manager routes */}
            <Route path="/manager" element={<ManagerLayout />}>
              <Route index element={<ManagerDashboard />} />
              <Route path="trucks" element={<TruckManagement />} />
              <Route path="drivers" element={<DriverManagement />} />
              <Route path="clients" element={<ClientManagement />} />
              <Route path="petrol-pumps" element={<PetrolPumpManagement />} />
              <Route path="trips/active" element={<ActiveTrips />} />
              <Route path="trips/start" element={<StartTrip />} />
              <Route path="trips/:tripId" element={<TripDetails />} />
              <Route path="trips/:tripId/end" element={<EndTrip />} />
              <Route path="trips/completed" element={<CompletedTrips />} />
              <Route path="expenses" element={<ManagerDashboard />} />
              <Route path="transactions" element={<ManagerDashboard />} />
            </Route>

            {/* Owner routes */}
            <Route path="/owner" element={<OwnerLayout />}>
              <Route index element={<OwnerDashboard />} />
              <Route path="reports/trucks" element={<OwnerDashboard />} />
              <Route path="reports/profit-loss" element={<ProfitLossReport />} />
              <Route path="reports/expenses" element={<ExpenseReport />} />
              <Route path="reports/receivables" element={<ReceivablesReport />} />
              <Route path="billing/list" element={<BillsList />} />
              <Route path="billing/generate" element={<GenerateBills />} />
              <Route path="monitoring/trips" element={<OwnerDashboard />} />
              <Route path="monitoring/accounts" element={<OwnerDashboard />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
