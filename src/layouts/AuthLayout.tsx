import React from 'react';
import { Outlet } from 'react-router-dom';
import { Truck } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyek0zNiAyNnYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl gradient-accent shadow-lg">
              <Truck className="h-8 w-8 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground">TransFleet</h1>
              <p className="text-primary-foreground/70">Transport Management System</p>
            </div>
          </div>
          
          <div className="space-y-6 max-w-md">
            <h2 className="text-4xl font-bold text-primary-foreground leading-tight">
              Streamline Your Fleet Operations
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Complete digital solution for managing trips, tracking expenses, generating bills, and monitoring your transport business profitability.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { label: 'Active Trucks', value: '24+' },
                { label: 'Trips Managed', value: '1,200+' },
                { label: 'Total Revenue', value: '₹4.8Cr' },
                { label: 'Clients Served', value: '50+' },
              ].map((stat) => (
                <div key={stat.label} className="bg-primary-foreground/10 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-primary-foreground">{stat.value}</p>
                  <p className="text-sm text-primary-foreground/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
