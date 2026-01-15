import React from 'react';
import { Badge } from '@/components/common/Badge';
import { TripStatus, TRIP_STATUS } from '@/utils/constants';
import { Circle, CheckCircle, Lock } from 'lucide-react';

interface TripStatusBadgeProps {
  status: TripStatus;
}

const statusConfig = {
  [TRIP_STATUS.RUNNING]: {
    variant: 'success' as const,
    label: 'Running',
    icon: Circle,
  },
  [TRIP_STATUS.COMPLETED]: {
    variant: 'warning' as const,
    label: 'Completed',
    icon: CheckCircle,
  },
  [TRIP_STATUS.LOCKED]: {
    variant: 'secondary' as const,
    label: 'Locked',
    icon: Lock,
  },
};

export const TripStatusBadge: React.FC<TripStatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1.5">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};
