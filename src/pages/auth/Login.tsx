import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Truck, User, Shield, Loader2, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('manager');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password, role);
      navigate(role === 'owner' ? '/owner' : '/manager');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Mobile Logo */}
      <div className="flex items-center gap-3 mb-8 lg:hidden">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-accent">
          <Truck className="h-6 w-6 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">TransFleet</h1>
          <p className="text-sm text-muted-foreground">Transport Management</p>
        </div>
      </div>

      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
        <p className="text-muted-foreground">Sign in to your account to continue</p>
      </div>

      {/* Role Selection */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-foreground mb-3 block">
          Select your role
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('manager')}
            className={cn(
              'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
              role === 'manager'
                ? 'border-accent bg-accent/10'
                : 'border-border hover:border-accent/50'
            )}
          >
            <div className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg',
              role === 'manager' ? 'gradient-accent' : 'bg-secondary'
            )}>
              <User className={cn(
                'h-6 w-6',
                role === 'manager' ? 'text-accent-foreground' : 'text-secondary-foreground'
              )} />
            </div>
            <span className={cn(
              'text-sm font-medium',
              role === 'manager' ? 'text-accent' : 'text-muted-foreground'
            )}>
              Manager
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRole('owner')}
            className={cn(
              'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
              role === 'owner'
                ? 'border-accent bg-accent/10'
                : 'border-border hover:border-accent/50'
            )}
          >
            <div className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg',
              role === 'owner' ? 'gradient-accent' : 'bg-secondary'
            )}>
              <Shield className={cn(
                'h-6 w-6',
                role === 'owner' ? 'text-accent-foreground' : 'text-secondary-foreground'
              )} />
            </div>
            <span className={cn(
              'text-sm font-medium',
              role === 'owner' ? 'text-accent' : 'text-muted-foreground'
            )}>
              Owner
            </span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="rounded border-border" />
            <span className="text-muted-foreground">Remember me</span>
          </label>
          <a href="#" className="text-sm text-accent hover:underline">
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          className="w-full h-11 gradient-accent text-accent-foreground font-medium"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Demo credentials: any email/password works
      </p>
    </div>
  );
};
