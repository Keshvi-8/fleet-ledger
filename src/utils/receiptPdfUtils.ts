import jsPDF from 'jspdf';
import { Payment, paymentModeLabels } from './paymentUtils';
import { Bill } from './billingUtils';
import { formatCurrency, formatDate } from './formatters';

// Company details for letterhead
const COMPANY_DETAILS = {
  name: 'Krishna Transport Services',
  tagline: 'Reliable Logistics Solutions',
  address: '123, Industrial Area, Phase 2',
  city: 'Ahmedabad, Gujarat - 380015',
  phone: '+91 98765 43210',
  email: 'accounts@krishnatransport.com',
  gst: '24AABCK1234F1ZP',
  pan: 'AABCK1234F',
};

export interface ReceiptData {
  payment: Payment;
  bill: Bill;
  receiptNumber: string;
  balanceAfterPayment: number;
}

function generateReceiptNumber(paymentId: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const suffix = paymentId.slice(-4).toUpperCase();
  return `RCP-${timestamp}-${suffix}`;
}

export function generatePaymentReceipt(
  payment: Payment,
  bill: Bill,
  previousPayments: Payment[]
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  
  let yPos = margin;

  // ===== LETTERHEAD =====
  
  // Company name
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(41, 128, 185); // Blue color
  doc.text(COMPANY_DETAILS.name, pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;

  // Tagline
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text(COMPANY_DETAILS.tagline, pageWidth / 2, yPos, { align: 'center' });
  yPos += 6;

  // Address line
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `${COMPANY_DETAILS.address}, ${COMPANY_DETAILS.city}`,
    pageWidth / 2,
    yPos,
    { align: 'center' }
  );
  yPos += 5;

  // Contact details
  doc.text(
    `Phone: ${COMPANY_DETAILS.phone} | Email: ${COMPANY_DETAILS.email}`,
    pageWidth / 2,
    yPos,
    { align: 'center' }
  );
  yPos += 5;

  // GST & PAN
  doc.setFont('helvetica', 'bold');
  doc.text(
    `GSTIN: ${COMPANY_DETAILS.gst} | PAN: ${COMPANY_DETAILS.pan}`,
    pageWidth / 2,
    yPos,
    { align: 'center' }
  );
  yPos += 10;

  // Divider line
  doc.setDrawColor(41, 128, 185);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // ===== RECEIPT TITLE =====
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('PAYMENT RECEIPT', pageWidth / 2, yPos, { align: 'center' });
  yPos += 12;

  // Receipt details box
  const receiptNumber = generateReceiptNumber(payment.id);
  
  doc.setFillColor(245, 247, 250);
  doc.rect(margin, yPos - 4, contentWidth, 20, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Left side - Receipt No & Date
  doc.text(`Receipt No: ${receiptNumber}`, margin + 5, yPos + 4);
  doc.text(`Date: ${formatDate(payment.recordedAt)}`, margin + 5, yPos + 11);
  
  // Right side - Bill No & Payment Date
  doc.text(`Bill No: ${bill.billNumber}`, pageWidth - margin - 60, yPos + 4);
  doc.text(`Payment Date: ${formatDate(payment.date)}`, pageWidth - margin - 60, yPos + 11);
  
  yPos += 24;

  // ===== CLIENT DETAILS =====
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Received From:', margin, yPos);
  yPos += 6;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(bill.clientName, margin, yPos);
  yPos += 5;
  
  if (bill.clientAddress) {
    const addressLines = doc.splitTextToSize(bill.clientAddress, contentWidth * 0.6);
    addressLines.forEach((line: string) => {
      doc.text(line, margin, yPos);
      yPos += 4;
    });
  }
  
  if (bill.clientGst) {
    doc.text(`GSTIN: ${bill.clientGst}`, margin, yPos);
    yPos += 5;
  }
  
  yPos += 8;

  // ===== PAYMENT DETAILS TABLE =====
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Details:', margin, yPos);
  yPos += 8;

  // Table header
  doc.setFillColor(41, 128, 185);
  doc.rect(margin, yPos - 4, contentWidth, 10, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('Description', margin + 5, yPos + 2);
  doc.text('Details', pageWidth - margin - 50, yPos + 2);
  yPos += 12;

  // Table rows
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  
  const tableRows = [
    ['Payment Mode', paymentModeLabels[payment.mode]],
    ['Amount Received', formatCurrency(payment.amount)],
    ['Payment Date', formatDate(payment.date)],
  ];

  if (payment.reference) {
    tableRows.push(['Reference / Transaction ID', payment.reference]);
  }

  if (payment.notes) {
    tableRows.push(['Notes', payment.notes]);
  }

  tableRows.forEach((row, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, yPos - 4, contentWidth, 8, 'F');
    }
    doc.text(row[0], margin + 5, yPos);
    doc.text(row[1], pageWidth - margin - 5, yPos, { align: 'right' });
    yPos += 8;
  });

  yPos += 8;

  // ===== BILL SUMMARY =====
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill Summary:', margin, yPos);
  yPos += 8;

  // Calculate totals
  const totalPaidBefore = previousPayments
    .filter(p => p.id !== payment.id && new Date(p.recordedAt) < new Date(payment.recordedAt))
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPaidAfter = totalPaidBefore + payment.amount;
  const balanceAfter = Math.max(0, bill.netPayable - totalPaidAfter);

  const summaryRows = [
    ['Bill Amount', formatCurrency(bill.grandTotal)],
    ['Less: Total Advance', `- ${formatCurrency(bill.totalAdvance)}`],
    ['Net Payable', formatCurrency(bill.netPayable)],
    ['Previously Paid', formatCurrency(totalPaidBefore)],
    ['This Payment', formatCurrency(payment.amount)],
    ['Balance Due', formatCurrency(balanceAfter)],
  ];

  summaryRows.forEach((row, index) => {
    const isHighlight = index === summaryRows.length - 1;
    
    if (isHighlight) {
      doc.setFillColor(41, 128, 185);
      doc.rect(margin, yPos - 4, contentWidth, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
    } else if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, yPos - 4, contentWidth, 8, 'F');
    }
    
    doc.text(row[0], margin + 5, yPos);
    doc.text(row[1], pageWidth - margin - 5, yPos, { align: 'right' });
    
    if (isHighlight) {
      yPos += 10;
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
    } else {
      yPos += 8;
    }
  });

  yPos += 15;

  // ===== AMOUNT IN WORDS =====
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Amount in Words:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(numberToWords(payment.amount), margin + 35, yPos);
  
  yPos += 20;

  // ===== FOOTER =====
  
  // Signature line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  // Receiver signature
  doc.line(margin, yPos + 15, margin + 60, yPos + 15);
  doc.text("Receiver's Signature", margin, yPos + 20);
  
  // Authorized signature
  doc.line(pageWidth - margin - 60, yPos + 15, pageWidth - margin, yPos + 15);
  doc.text('Authorized Signatory', pageWidth - margin - 50, yPos + 20);
  
  yPos += 35;

  // Disclaimer
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    'This is a computer-generated receipt and does not require a physical signature.',
    pageWidth / 2,
    yPos,
    { align: 'center' }
  );
  yPos += 5;
  doc.text(
    'Thank you for your payment!',
    pageWidth / 2,
    yPos,
    { align: 'center' }
  );

  // Save the PDF
  const filename = `Receipt-${receiptNumber}-${bill.clientName.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
}

// Helper function to convert number to words (Indian format)
function numberToWords(num: number): string {
  if (num === 0) return 'Zero Rupees Only';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  function convert(n: number): string {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
  }
  
  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  
  let result = convert(rupees) + ' Rupees';
  if (paise > 0) {
    result += ' and ' + convert(paise) + ' Paise';
  }
  result += ' Only';
  
  return result;
}
