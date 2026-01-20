import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Wrench } from 'lucide-react';
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

const Services = () => {
  const { services, addService } = useData();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    serviceCode: '',
    serviceName: '',
    servicePrice: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (services.find(s => s.serviceCode === form.serviceCode)) {
      toast.error('A service with this code already exists');
      return;
    }
    addService(form);
    toast.success('Service added successfully');
    setForm({ serviceCode: '', serviceName: '', servicePrice: 0 });
    setOpen(false);
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="Services" 
        description="Manage repair services and pricing"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">Add New Service</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceCode">Service Code</Label>
                  <Input
                    id="serviceCode"
                    value={form.serviceCode}
                    onChange={(e) => setForm({ ...form, serviceCode: e.target.value })}
                    placeholder="SVC007"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceName">Service Name</Label>
                  <Input
                    id="serviceName"
                    value={form.serviceName}
                    onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
                    placeholder="Brake inspection"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="servicePrice">Price (Rwf)</Label>
                  <Input
                    id="servicePrice"
                    type="number"
                    value={form.servicePrice}
                    onChange={(e) => setForm({ ...form, servicePrice: parseInt(e.target.value) })}
                    placeholder="50000"
                    min={0}
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="gradient-primary">
                    Add Service
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
            <Wrench className="w-5 h-5 text-primary" />
            Available Services ({services.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Service Name</TableHead>
                  <TableHead className="text-right">Price (Rwf)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service, index) => (
                  <motion.tr
                    key={service.serviceCode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border"
                  >
                    <TableCell className="font-mono text-sm">{service.serviceCode}</TableCell>
                    <TableCell className="font-medium">{service.serviceName}</TableCell>
                    <TableCell className="text-right font-display font-bold text-primary">
                      {service.servicePrice.toLocaleString()}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Services;
