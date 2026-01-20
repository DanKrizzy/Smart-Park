import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Car as CarIcon } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';

const Cars = () => {
  const { cars, addCar } = useData();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    plateNumber: '',
    type: '',
    model: '',
    manufacturingYear: new Date().getFullYear(),
    driverPhone: '',
    mechanicName: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cars.find(c => c.plateNumber === form.plateNumber)) {
      toast.error('A car with this plate number already exists');
      return;
    }
    addCar(form);
    toast.success('Car registered successfully');
    setForm({
      plateNumber: '',
      type: '',
      model: '',
      manufacturingYear: new Date().getFullYear(),
      driverPhone: '',
      mechanicName: '',
    });
    setOpen(false);
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="Cars" 
        description="Manage registered vehicles in the garage"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Register Car
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-display">Register New Car</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plateNumber">License Plate</Label>
                    <Input
                      id="plateNumber"
                      value={form.plateNumber}
                      onChange={(e) => setForm({ ...form, plateNumber: e.target.value })}
                      placeholder="RAA 123A"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Input
                      id="type"
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      placeholder="SUV, Sedan, etc."
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={form.model}
                      onChange={(e) => setForm({ ...form, model: e.target.value })}
                      placeholder="Toyota Corolla"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Manufacturing Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={form.manufacturingYear}
                      onChange={(e) => setForm({ ...form, manufacturingYear: parseInt(e.target.value) })}
                      min={1990}
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Driver Phone</Label>
                    <Input
                      id="phone"
                      value={form.driverPhone}
                      onChange={(e) => setForm({ ...form, driverPhone: e.target.value })}
                      placeholder="+250 7XX XXX XXX"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mechanic">Mechanic Name</Label>
                    <Input
                      id="mechanic"
                      value={form.mechanicName}
                      onChange={(e) => setForm({ ...form, mechanicName: e.target.value })}
                      placeholder="Assigned mechanic"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="gradient-primary">
                    Register Car
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <CarIcon className="w-5 h-5 text-primary" />
            Registered Vehicles ({cars.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cars.length === 0 ? (
            <div className="text-center py-12">
              <CarIcon className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No cars registered yet</p>
              <p className="text-sm text-muted-foreground/70">Click "Register Car" to add the first vehicle</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plate Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Driver Phone</TableHead>
                    <TableHead>Mechanic</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cars.map((car, index) => (
                    <motion.tr
                      key={car.plateNumber}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border"
                    >
                      <TableCell className="font-semibold text-primary">{car.plateNumber}</TableCell>
                      <TableCell>{car.type}</TableCell>
                      <TableCell>{car.model}</TableCell>
                      <TableCell>{car.manufacturingYear}</TableCell>
                      <TableCell>{car.driverPhone}</TableCell>
                      <TableCell>{car.mechanicName}</TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Cars;
