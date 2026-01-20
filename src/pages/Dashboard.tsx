import { motion } from 'framer-motion';
import { Car, Wrench, ClipboardList, CreditCard, TrendingUp, Calendar } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/ui/page-header';
import StatCard from '@/components/ui/stat-card';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const { cars, services, serviceRecords, payments } = useData();

  const totalRevenue = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const todayRecords = serviceRecords.filter(
    r => r.serviceDate === new Date().toISOString().split('T')[0]
  ).length;

  return (
    <DashboardLayout>
      <PageHeader 
        title="Dashboard" 
        description="Welcome to SmartPark Car Repair Payment Management System"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Cars"
          value={cars.length}
          icon={Car}
          delay={0}
        />
        <StatCard
          title="Services Available"
          value={services.length}
          icon={Wrench}
          delay={1}
        />
        <StatCard
          title="Service Records"
          value={serviceRecords.length}
          icon={ClipboardList}
          delay={2}
        />
        <StatCard
          title="Total Revenue"
          value={`${totalRevenue.toLocaleString()} Rwf`}
          icon={CreditCard}
          delay={3}
        />
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <Wrench className="w-5 h-5 text-primary" />
                Available Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {services.map((service, index) => (
                  <motion.div
                    key={service.serviceCode}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium text-foreground">{service.serviceName}</p>
                      <p className="text-sm text-muted-foreground">{service.serviceCode}</p>
                    </div>
                    <p className="font-display font-bold text-primary">
                      {service.servicePrice.toLocaleString()} Rwf
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <TrendingUp className="w-5 h-5 text-primary" />
                Quick Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/10 border border-primary/20">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Records</p>
                  <p className="text-2xl font-display font-bold text-foreground">{todayRecords}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">System Status</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                    <p className="text-sm text-muted-foreground">Database</p>
                    <p className="font-semibold text-success">Connected</p>
                  </div>
                  <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                    <p className="text-sm text-muted-foreground">API Status</p>
                    <p className="font-semibold text-success">Operational</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">Location</p>
                <p className="font-medium text-foreground">SmartPark Garage</p>
                <p className="text-sm text-muted-foreground">Rubavu District, Western Province, Rwanda</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
