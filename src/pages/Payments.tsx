import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, CreditCard, FileText } from 'lucide-react';
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

  const billDetails = selectedPayment ? getPaymentDetails(selectedPayment) : null;

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

      {/* Bill Dialog */}
      <Dialog open={billOpen} onOpenChange={setBillOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Invoice / Bill</DialogTitle>
          </DialogHeader>
          {billDetails && (
            <div className="mt-4">
              <div className="text-center mb-6 pb-6 border-b border-border">
                <h2 className="text-2xl font-display font-bold text-foreground">SmartPark Garage</h2>
                <p className="text-muted-foreground">Car Repair Invoice</p>
                <p className="text-sm text-muted-foreground">Rubavu District, Western Province, Rwanda</p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Invoice Number</p>
                    <p className="font-semibold">{billDetails.payment.paymentNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold">{billDetails.payment.paymentDate}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Car Details</p>
                  <p className="font-semibold">{billDetails.car?.plateNumber} - {billDetails.car?.model}</p>
                  <p className="text-sm text-muted-foreground">Driver: {billDetails.car?.driverPhone}</p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Service Provided</p>
                  <p className="font-semibold">{billDetails.service?.serviceName}</p>
                  <p className="text-sm text-muted-foreground">Record: {billDetails.record.recordNumber}</p>
                </div>

                <div className="p-4 rounded-xl gradient-primary text-primary-foreground">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Amount Paid</p>
                    <p className="text-2xl font-display font-bold">
                      {billDetails.payment.amountPaid.toLocaleString()} Rwf
                    </p>
                  </div>
                </div>

                <div className="text-center pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">Payment Received By</p>
                  <p className="font-semibold">{username} (Chief Mechanic)</p>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={() => window.print()} variant="outline">
                  Print Bill
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
                    <TableHead className="text-right">Bill</TableHead>
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
                          <Button size="sm" variant="ghost" onClick={() => viewBill(payment.paymentNumber)}>
                            <FileText className="w-4 h-4 mr-1" />
                            View Bill
                          </Button>
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
