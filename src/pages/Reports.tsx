import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Calendar, TrendingUp, Download } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useData } from '@/context/DataContext';

const Reports = () => {
  const { payments, serviceRecords, getServiceByCode, getCarByPlate, getRecordByNumber } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Get daily report data
  const dailyRecords = serviceRecords.filter(r => r.serviceDate === selectedDate);
  const dailyPayments = payments.filter(p => p.paymentDate === selectedDate);

  const dailyData = dailyRecords.map(record => {
    const service = getServiceByCode(record.serviceCode);
    const car = getCarByPlate(record.plateNumber);
    const payment = payments.find(p => p.recordNumber === record.recordNumber);
    return {
      record,
      service,
      car,
      payment,
    };
  });

  const totalDailyRevenue = dailyPayments.reduce((sum, p) => sum + p.amountPaid, 0);

  // Summary stats
  const totalRevenue = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const totalServices = serviceRecords.length;
  const paidRecords = payments.length;
  const unpaidRecords = serviceRecords.length - paidRecords;

  return (
    <DashboardLayout>
      <PageHeader 
        title="Reports" 
        description="Daily reports showing services offered and payments received"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="glass-card rounded-xl p-6"
        >
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-display font-bold text-primary mt-2">
            {totalRevenue.toLocaleString()} Rwf
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-6"
        >
          <p className="text-sm text-muted-foreground">Total Services</p>
          <p className="text-2xl font-display font-bold text-foreground mt-2">{totalServices}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-6"
        >
          <p className="text-sm text-muted-foreground">Paid Records</p>
          <p className="text-2xl font-display font-bold text-success mt-2">{paidRecords}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-6"
        >
          <p className="text-sm text-muted-foreground">Unpaid Records</p>
          <p className="text-2xl font-display font-bold text-warning mt-2">{unpaidRecords}</p>
        </motion.div>
      </div>

      {/* Daily Report */}
      <Card className="glass-card mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-display">
              <Calendar className="w-5 h-5 text-primary" />
              Daily Report
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="reportDate">Date:</Label>
                <Input
                  id="reportDate"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-auto"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {dailyData.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No service records for {selectedDate}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Record #</TableHead>
                      <TableHead>Car</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Service Price</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Amount Paid</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyData.map(({ record, service, car, payment }, index) => (
                      <motion.tr
                        key={record.recordNumber}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border"
                      >
                        <TableCell className="font-mono text-sm">{record.recordNumber}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold">{car?.plateNumber}</p>
                            <p className="text-sm text-muted-foreground">{car?.model}</p>
                          </div>
                        </TableCell>
                        <TableCell>{service?.serviceName}</TableCell>
                        <TableCell className="font-display font-semibold">
                          {service?.servicePrice.toLocaleString()} Rwf
                        </TableCell>
                        <TableCell>
                          {payment ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                              Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                              Pending
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="font-display font-bold text-success">
                          {payment ? `${payment.amountPaid.toLocaleString()} Rwf` : '-'}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Daily Summary */}
              <div className="mt-6 p-6 rounded-xl gradient-primary text-primary-foreground">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8" />
                    <div>
                      <p className="text-sm opacity-80">Daily Revenue ({selectedDate})</p>
                      <p className="text-3xl font-display font-bold">
                        {totalDailyRevenue.toLocaleString()} Rwf
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-80">Services Completed</p>
                    <p className="text-2xl font-display font-bold">{dailyRecords.length}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* All Payments Report */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <BarChart3 className="w-5 h-5 text-primary" />
            All Payments Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No payment records available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Car</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment, index) => {
                    const record = getRecordByNumber(payment.recordNumber);
                    const service = record ? getServiceByCode(record.serviceCode) : null;
                    const car = record ? getCarByPlate(record.plateNumber) : null;
                    return (
                      <motion.tr
                        key={payment.paymentNumber}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-border"
                      >
                        <TableCell className="font-mono text-sm">{payment.paymentNumber}</TableCell>
                        <TableCell>{payment.paymentDate}</TableCell>
                        <TableCell>{car?.plateNumber} ({car?.model})</TableCell>
                        <TableCell>{service?.serviceName}</TableCell>
                        <TableCell className="text-right font-display font-bold text-success">
                          {payment.amountPaid.toLocaleString()} Rwf
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

export default Reports;
