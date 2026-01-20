import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ClipboardList, Pencil, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';
import { ServiceRecord } from '@/types';

const ServiceRecords = () => {
  const { serviceRecords, addServiceRecord, updateServiceRecord, deleteServiceRecord, cars, services, getServiceByCode, getCarByPlate } = useData();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ServiceRecord | null>(null);
  const [form, setForm] = useState({
    recordNumber: '',
    serviceDate: new Date().toISOString().split('T')[0],
    plateNumber: '',
    serviceCode: '',
  });

  const generateRecordNumber = () => {
    return `REC${String(serviceRecords.length + 1).padStart(4, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recordNumber = form.recordNumber || generateRecordNumber();
    if (serviceRecords.find(r => r.recordNumber === recordNumber)) {
      toast.error('A record with this number already exists');
      return;
    }
    addServiceRecord({ ...form, recordNumber });
    toast.success('Service record created successfully');
    setForm({
      recordNumber: '',
      serviceDate: new Date().toISOString().split('T')[0],
      plateNumber: '',
      serviceCode: '',
    });
    setOpen(false);
  };

  const handleEdit = (record: ServiceRecord) => {
    setEditingRecord(record);
    setForm(record);
    setEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRecord) {
      updateServiceRecord(editingRecord.recordNumber, form);
      toast.success('Service record updated successfully');
      setEditOpen(false);
      setEditingRecord(null);
    }
  };

  const handleDelete = (recordNumber: string) => {
    deleteServiceRecord(recordNumber);
    toast.success('Service record deleted successfully');
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="Service Records" 
        description="Track car repair service records (CRUD operations available)"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary" disabled={cars.length === 0}>
                <Plus className="w-4 h-4 mr-2" />
                New Record
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">Create Service Record</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="recordNumber">Record Number (auto-generated)</Label>
                  <Input
                    id="recordNumber"
                    value={form.recordNumber || generateRecordNumber()}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceDate">Service Date</Label>
                  <Input
                    id="serviceDate"
                    type="date"
                    value={form.serviceDate}
                    onChange={(e) => setForm({ ...form, serviceDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Select Car</Label>
                  <Select
                    value={form.plateNumber}
                    onValueChange={(value) => setForm({ ...form, plateNumber: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a registered car" />
                    </SelectTrigger>
                    <SelectContent>
                      {cars.map(car => (
                        <SelectItem key={car.plateNumber} value={car.plateNumber}>
                          {car.plateNumber} - {car.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Select Service</Label>
                  <Select
                    value={form.serviceCode}
                    onValueChange={(value) => setForm({ ...form, serviceCode: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map(service => (
                        <SelectItem key={service.serviceCode} value={service.serviceCode}>
                          {service.serviceName} - {service.servicePrice.toLocaleString()} Rwf
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="gradient-primary">
                    Create Record
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {cars.length === 0 && (
        <div className="mb-6 p-4 rounded-lg bg-warning/10 border border-warning/20">
          <p className="text-warning font-medium">Register a car first to create service records.</p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Service Record</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="editServiceDate">Service Date</Label>
              <Input
                id="editServiceDate"
                type="date"
                value={form.serviceDate}
                onChange={(e) => setForm({ ...form, serviceDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Select Car</Label>
              <Select
                value={form.plateNumber}
                onValueChange={(value) => setForm({ ...form, plateNumber: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cars.map(car => (
                    <SelectItem key={car.plateNumber} value={car.plateNumber}>
                      {car.plateNumber} - {car.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Select Service</Label>
              <Select
                value={form.serviceCode}
                onValueChange={(value) => setForm({ ...form, serviceCode: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {services.map(service => (
                    <SelectItem key={service.serviceCode} value={service.serviceCode}>
                      {service.serviceName} - {service.servicePrice.toLocaleString()} Rwf
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="gradient-primary">
                Update Record
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <ClipboardList className="w-5 h-5 text-primary" />
            Service Records ({serviceRecords.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {serviceRecords.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No service records yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Record #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Car</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceRecords.map((record, index) => {
                    const service = getServiceByCode(record.serviceCode);
                    const car = getCarByPlate(record.plateNumber);
                    return (
                      <motion.tr
                        key={record.recordNumber}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border"
                      >
                        <TableCell className="font-mono text-sm font-semibold">{record.recordNumber}</TableCell>
                        <TableCell>{record.serviceDate}</TableCell>
                        <TableCell>{car ? `${car.plateNumber} (${car.model})` : record.plateNumber}</TableCell>
                        <TableCell>{service?.serviceName || record.serviceCode}</TableCell>
                        <TableCell className="font-display font-bold text-primary">
                          {service?.servicePrice.toLocaleString()} Rwf
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="ghost" onClick={() => handleEdit(record)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Record?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete record {record.recordNumber}. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(record.recordNumber)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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

export default ServiceRecords;
