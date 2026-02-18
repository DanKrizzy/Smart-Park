import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, CreditCard, FileText, Printer, Receipt } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

const Payments = () => {
  const { payments, addPayment, serviceRecords, getServiceByCode, getCarByPlate, getRecordByNumber } = useData();
  const { username } = useAuth();
  const [open, setOpen] = useState(false);
  const [billOpen, setBillOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [form, setForm] = useState({
    paymentNumber: '',
    amountPaid: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    recordNumber: '',
  });

  const unpaidRecords = serviceRecords.filter(
    r => !payments.find(p => p.recordNumber === r.recordNumber)
  );

  const generatePaymentNumber = () => {
    return `PAY${String(payments.length + 1).padStart(4, '0')}`;
  };

  const handleRecordSelect = (recordNumber: string) => {
    const record = getRecordByNumber(recordNumber);
    if (record) {
      const service = getServiceByCode(record.serviceCode);
      setForm({
        ...form,
        recordNumber,
        amountPaid: service?.servicePrice || 0,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const paymentNumber = generatePaymentNumber();
    addPayment({ ...form, paymentNumber });
    toast.success('Payment recorded successfully');
    setForm({
      paymentNumber: '',
      amountPaid: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      recordNumber: '',
    });
    setOpen(false);
  };

  const viewBill = (paymentNumber: string) => {
    setSelectedPayment(paymentNumber);
    setBillOpen(true);
  };

  const getPaymentDetails = (paymentNumber: string) => {
    const payment = payments.find(p => p.paymentNumber === paymentNumber);
    if (!payment) return null;
    const record = getRecordByNumber(payment.recordNumber);
    if (!record) return null;
    const service = getServiceByCode(record.serviceCode);
    const car = getCarByPlate(record.plateNumber);
    return { payment, record, service, car };
  };

  const [smallBillOpen, setSmallBillOpen] = useState(false);
  const [selectedSmallPayment, setSelectedSmallPayment] = useState<string | null>(null);

  const viewSmallBill = (paymentNumber: string) => {
    setSelectedSmallPayment(paymentNumber);
    setSmallBillOpen(true);
  };

  const billDetails = selectedPayment ? getPaymentDetails(selectedPayment) : null;
  const smallBillDetails = selectedSmallPayment ? getPaymentDetails(selectedSmallPayment) : null;

  return (
    <DashboardLayout>
      <PageHeader 
        title="Payments" 
        description="Record and manage service payments"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary" disabled={unpaidRecords.length === 0}>
                <Plus className="w-4 h-4 mr-2" />
                Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">Record Payment</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Select Service Record</Label>
                  <Select
                    value={form.recordNumber}
                    onValueChange={handleRecordSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an unpaid record" />
                    </SelectTrigger>
                    <SelectContent>
                      {unpaidRecords.map(record => {
                        const service = getServiceByCode(record.serviceCode);
                        return (
                          <SelectItem key={record.recordNumber} value={record.recordNumber}>
                            {record.recordNumber} - {service?.serviceName} ({record.plateNumber})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amountPaid">Amount Paid (Rwf)</Label>
                  <Input
                    id="amountPaid"
                    type="number"
                    value={form.amountPaid}
                    onChange={(e) => setForm({ ...form, amountPaid: parseInt(e.target.value) })}
                    min={0}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentDate">Payment Date</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={form.paymentDate}
                    onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="gradient-primary">
                    Record Payment
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {unpaidRecords.length === 0 && serviceRecords.length > 0 && (
        <div className="mb-6 p-4 rounded-lg bg-success/10 border border-success/20">
          <p className="text-success font-medium">All service records have been paid!</p>
        </div>
      )}

      {serviceRecords.length === 0 && (
        <div className="mb-6 p-4 rounded-lg bg-warning/10 border border-warning/20">
          <p className="text-warning font-medium">Create service records first to record payments.</p>
        </div>
      )}

      {/* Small Bill Dialog */}
      <Dialog open={smallBillOpen} onOpenChange={setSmallBillOpen}>
        <DialogContent className="sm:max-w-xs print:shadow-none">
          <div className="no-print">
            <DialogHeader>
              <DialogTitle className="font-display">Small Receipt</DialogTitle>
            </DialogHeader>
          </div>
          {smallBillDetails && (
            <div className="print-area-small">
              <div className="print-card-small border border-border rounded-lg p-4 text-sm font-mono">
                <div className="text-center border-b border-dashed border-border pb-3 mb-3">
                  <p className="font-bold text-base font-display">SmartPark Garage</p>
                  <p className="text-muted-foreground text-xs">Car Repair Receipt</p>
                </div>
                <div className="space-y-1 text-xs mb-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Receipt#</span>
                    <span className="font-semibold">{smallBillDetails.payment.paymentNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span>{smallBillDetails.payment.paymentDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Record#</span>
                    <span>{smallBillDetails.record.recordNumber}</span>
                  </div>
                </div>
                <div className="border-t border-dashed border-border pt-3 mb-3 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plate</span>
                    <span className="font-semibold">{smallBillDetails.car?.plateNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Model</span>
                    <span>{smallBillDetails.car?.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span className="text-right">{smallBillDetails.service?.serviceName}</span>
                  </div>
                </div>
                <div className="border-t-2 border-border pt-3 mb-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">TOTAL PAID</span>
                    <span className="font-bold text-base">{smallBillDetails.payment.amountPaid.toLocaleString()} Rwf</span>
                  </div>
                </div>
                <div className="border-t border-dashed border-border pt-3 text-center text-xs text-muted-foreground space-y-1">
                  <p>Received by: <span className="font-semibold text-foreground">{username}</span></p>
                  <p className="mt-2">Thank you for your business!</p>
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2 no-print">
                <Button variant="outline" size="sm" onClick={() => setSmallBillOpen(false)}>Close</Button>
                <Button size="sm" onClick={() => window.print()} className="gradient-primary">
                  <Printer className="w-3 h-3 mr-1" />Print
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bill Dialog */}
      <Dialog open={billOpen} onOpenChange={setBillOpen}>
        <DialogContent className="sm:max-w-lg print:shadow-none">
          <div className="no-print">
            <DialogHeader>
              <DialogTitle className="font-display">Invoice / Bill</DialogTitle>
            </DialogHeader>
          </div>
          {billDetails && (
            <div className="print-area">
              {/* Printable Invoice Content */}
              <div className="print-card p-6 rounded-lg border border-border">
                {/* Header */}
                <div className="text-center mb-6 pb-6 border-b border-border">
                  <h2 className="text-2xl font-display font-bold text-foreground">SmartPark Garage</h2>
                  <p className="text-muted-foreground print-muted">Car Repair Invoice</p>
                  <p className="text-sm text-muted-foreground print-muted">Rubavu District, Western Province, Rwanda</p>
                  <p className="text-sm text-muted-foreground print-muted mt-1">Tel: +250 XXX XXX XXX</p>
                </div>

                {/* Invoice Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground print-muted">Invoice Number</p>
                      <p className="font-semibold">{billDetails.payment.paymentNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground print-muted">Date</p>
                      <p className="font-semibold">{billDetails.payment.paymentDate}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Customer/Car Details */}
                  <div className="print-card p-4 rounded-lg bg-muted/50">
                    <p className="text-sm font-medium text-muted-foreground print-muted mb-2">CUSTOMER / VEHICLE</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground print-muted">Plate Number</p>
                        <p className="font-semibold">{billDetails.car?.plateNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground print-muted">Vehicle Model</p>
                        <p className="font-semibold">{billDetails.car?.model}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground print-muted">Driver Contact</p>
                        <p className="font-semibold">{billDetails.car?.driverPhone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="print-card p-4 rounded-lg bg-muted/50">
                    <p className="text-sm font-medium text-muted-foreground print-muted mb-2">SERVICE DETAILS</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground print-muted">Service</p>
                        <p className="font-semibold">{billDetails.service?.serviceName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground print-muted">Service Code</p>
                        <p className="font-mono font-semibold">{billDetails.service?.serviceCode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground print-muted">Record Number</p>
                        <p className="font-mono font-semibold">{billDetails.record.recordNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground print-muted">Service Date</p>
                        <p className="font-semibold">{billDetails.record.serviceDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="print-amount p-4 rounded-xl gradient-primary text-primary-foreground">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm opacity-80">Total Amount Paid</p>
                        <p className="font-medium">Payment Complete</p>
                      </div>
                      <p className="text-3xl font-display font-bold">
                        {billDetails.payment.amountPaid.toLocaleString()} Rwf
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Footer */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-sm text-muted-foreground print-muted">Payment Received By</p>
                      <p className="font-semibold">{username}</p>
                      <p className="text-sm text-muted-foreground print-muted">Chief Mechanic</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground print-muted">Signature</p>
                      <div className="mt-4 border-b border-dashed border-muted-foreground w-32 ml-auto"></div>
                    </div>
                  </div>

                  {/* Thank you message */}
                  <div className="text-center pt-4 mt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground print-muted">Thank you for choosing SmartPark Garage!</p>
                    <p className="text-xs text-muted-foreground print-muted mt-1">For any inquiries, please contact us.</p>
                  </div>
                </div>
              </div>

              {/* Print Button - Hidden when printing */}
              <div className="flex justify-end mt-6 gap-2 no-print">
                <Button variant="outline" onClick={() => setBillOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => window.print()} className="gradient-primary">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <CreditCard className="w-5 h-5 text-primary" />
            Payment Records ({payments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No payments recorded yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Service Record</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment, index) => {
                    const record = getRecordByNumber(payment.recordNumber);
                    const service = record ? getServiceByCode(record.serviceCode) : null;
                    return (
                      <motion.tr
                        key={payment.paymentNumber}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border"
                      >
                        <TableCell className="font-mono text-sm font-semibold">{payment.paymentNumber}</TableCell>
                        <TableCell>{payment.paymentDate}</TableCell>
                        <TableCell>
                          {payment.recordNumber}
                          {service && <span className="text-muted-foreground ml-2">({service.serviceName})</span>}
                        </TableCell>
                        <TableCell className="font-display font-bold text-success">
                          {payment.amountPaid.toLocaleString()} Rwf
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button size="sm" variant="ghost" onClick={() => viewSmallBill(payment.paymentNumber)} title="Small Receipt">
                              <Receipt className="w-4 h-4 mr-1" />
                              Small
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => viewBill(payment.paymentNumber)} title="Full Invoice">
                              <FileText className="w-4 h-4 mr-1" />
                              Full Bill
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Payments;
