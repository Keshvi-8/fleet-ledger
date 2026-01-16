import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GenerateBillsPreview } from '@/components/billing/GenerateBillsPreview';
import {
  getAvailableBillingPeriods,
  generateBillsForPeriod,
  BillingPeriod,
  Bill,
} from '@/utils/billingUtils';
import { mockTrips, mockClients } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, FileText, Loader2 } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

export function GenerateBills() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const billingPeriods = useMemo(() => getAvailableBillingPeriods(), []);
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState<string>('');
  const [previewBills, setPreviewBills] = useState<Bill[]>([]);
  const [selectedBills, setSelectedBills] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasPreview, setHasPreview] = useState(false);

  const selectedPeriod = selectedPeriodIndex
    ? billingPeriods[parseInt(selectedPeriodIndex)]
    : null;

  const handlePreview = () => {
    if (!selectedPeriod) return;

    const bills = generateBillsForPeriod(mockTrips, mockClients, selectedPeriod);
    setPreviewBills(bills);
    setSelectedBills(new Set(bills.map((b) => b.id)));
    setHasPreview(true);
  };

  const handleToggleBill = (billId: string) => {
    setSelectedBills((prev) => {
      const next = new Set(prev);
      if (next.has(billId)) {
        next.delete(billId);
      } else {
        next.add(billId);
      }
      return next;
    });
  };

  const handleToggleAll = () => {
    if (selectedBills.size === previewBills.length) {
      setSelectedBills(new Set());
    } else {
      setSelectedBills(new Set(previewBills.map((b) => b.id)));
    }
  };

  const handleGenerate = async () => {
    if (selectedBills.size === 0) {
      toast({
        title: 'No bills selected',
        description: 'Please select at least one bill to generate',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const generatedCount = selectedBills.size;
    
    toast({
      title: 'Bills Generated',
      description: `Successfully generated ${generatedCount} bill(s)`,
    });

    setIsGenerating(false);
    navigate('/owner/billing/list');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/owner/billing/list')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Generate Bills</h1>
          <p className="text-muted-foreground">Create invoices for a billing period</p>
        </div>
      </div>

      {/* Period Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Select Billing Period
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Billing Period</label>
              <Select value={selectedPeriodIndex} onValueChange={setSelectedPeriodIndex}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a period" />
                </SelectTrigger>
                <SelectContent>
                  {billingPeriods.map((period, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPeriod && (
              <div className="bg-muted/50 p-4 rounded-lg text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-muted-foreground">Bill Date</p>
                    <p className="font-medium">{formatDate(selectedPeriod.billGenerationDate.toISOString())}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment Window</p>
                    <p className="font-medium">
                      {formatDate(selectedPeriod.paymentWindowStart.toISOString())} -{' '}
                      {formatDate(selectedPeriod.paymentWindowEnd.toISOString())}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handlePreview}
            disabled={!selectedPeriod}
            className="w-full sm:w-auto"
          >
            <FileText className="h-4 w-4 mr-2" />
            Preview Bills
          </Button>
        </CardContent>
      </Card>

      {/* Preview */}
      {hasPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Bill Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GenerateBillsPreview
              bills={previewBills}
              selectedBills={selectedBills}
              onToggleBill={handleToggleBill}
              onToggleAll={handleToggleAll}
            />

            {previewBills.length > 0 && (
              <div className="mt-6 flex justify-end">
                <Button
                  size="lg"
                  onClick={handleGenerate}
                  disabled={selectedBills.size === 0 || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate {selectedBills.size} Bill(s)
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">Billing Cycle Information</h3>
          <div className="grid sm:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2">First Half (1st - 15th)</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Bills generated on the 15th</li>
                <li>• Payment window: 20th - 25th</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Second Half (16th - End)</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Bills generated on the last day</li>
                <li>• Payment window: 1st - 5th (next month)</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Note: Only completed/locked trips are included in billing. GST is calculated at 18% (9% CGST + 9% SGST).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
