import { BILL_STATUS } from '@/utils/constants';
import { cn } from '@/lib/utils';
import { CheckCircle, Send, FileText } from 'lucide-react';

interface BillStatusBadgeProps {
  status: typeof BILL_STATUS[keyof typeof BILL_STATUS];
  className?: string;
}

const statusConfig = {
  [BILL_STATUS.GENERATED]: {
    label: 'Generated',
    icon: FileText,
    className: 'bg-muted text-muted-foreground',
  },
  [BILL_STATUS.SENT]: {
    label: 'Sent',
    icon: Send,
    className: 'bg-accent/20 text-accent',
  },
  [BILL_STATUS.PAID]: {
    label: 'Paid',
    icon: CheckCircle,
    className: 'bg-success/20 text-success',
  },
};

export function BillStatusBadge({ status, className }: BillStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig[BILL_STATUS.GENERATED];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
