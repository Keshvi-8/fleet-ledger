import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Banknote, Building2, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';
import {
  Payment,
  PaymentMode,
  PAYMENT_MODES,
  paymentModeLabels,
  generatePaymentId,
} from '@/utils/paymentUtils';

const paymentSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  mode: z.enum(['cash', 'bank', 'upi'] as const),
  date: z.date({ required_error: 'Payment date is required' }),
  reference: z.string().max(100, 'Reference must be less than 100 characters').optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  billId: string;
  maxAmount: number;
  onSubmit: (payment: Payment) => void;
  onCancel: () => void;
}

export function PaymentForm({ billId, maxAmount, onSubmit, onCancel }: PaymentFormProps) {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: maxAmount,
      mode: 'upi',
      date: new Date(),
      reference: '',
      notes: '',
    },
  });

  const selectedMode = form.watch('mode');

  const handleSubmit = (values: PaymentFormValues) => {
    const payment: Payment = {
      id: generatePaymentId(),
      billId,
      amount: values.amount,
      mode: values.mode as PaymentMode,
      date: values.date.toISOString(),
      reference: values.reference?.trim() || undefined,
      notes: values.notes?.trim() || undefined,
      recordedAt: new Date().toISOString(),
    };
    onSubmit(payment);
  };

  const paymentModeOptions = [
    { value: PAYMENT_MODES.CASH, label: paymentModeLabels.cash, icon: Banknote },
    { value: PAYMENT_MODES.BANK, label: paymentModeLabels.bank, icon: Building2 },
    { value: PAYMENT_MODES.UPI, label: paymentModeLabels.upi, icon: Smartphone },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    className="pl-8"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </FormControl>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Outstanding: {formatCurrency(maxAmount)}</span>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={() => form.setValue('amount', maxAmount)}
                >
                  Pay Full Amount
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Payment Mode */}
        <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Mode</FormLabel>
              <FormControl>
                <div className="grid grid-cols-3 gap-2">
                  {paymentModeOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => field.onChange(option.value)}
                        className={cn(
                          'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                          field.value === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:border-muted-foreground/30'
                        )}
                      >
                        <Icon
                          className={cn(
                            'h-5 w-5',
                            field.value === option.value
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          )}
                        />
                        <span
                          className={cn(
                            'text-xs font-medium',
                            field.value === option.value
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          )}
                        >
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Payment Date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Payment Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Reference */}
        <FormField
          control={form.control}
          name="reference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Reference{' '}
                <span className="text-muted-foreground font-normal">
                  ({selectedMode === 'bank' ? 'Transaction ID' : selectedMode === 'upi' ? 'UPI Ref' : 'Optional'})
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    selectedMode === 'bank'
                      ? 'Enter transaction ID'
                      : selectedMode === 'upi'
                      ? 'Enter UPI reference number'
                      : 'Enter reference (optional)'
                  }
                  maxLength={100}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Notes <span className="text-muted-foreground font-normal">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional notes..."
                  className="resize-none"
                  rows={2}
                  maxLength={500}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Record Payment
          </Button>
        </div>
      </form>
    </Form>
  );
}
