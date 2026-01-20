import { createContext, useContext, useState, ReactNode } from 'react';
import { Service, Car, ServiceRecord, Payment } from '@/types';

interface DataContextType {
  services: Service[];
  cars: Car[];
  serviceRecords: ServiceRecord[];
  payments: Payment[];
  addService: (service: Service) => void;
  addCar: (car: Car) => void;
  addServiceRecord: (record: ServiceRecord) => void;
  updateServiceRecord: (recordNumber: string, record: ServiceRecord) => void;
  deleteServiceRecord: (recordNumber: string) => void;
  addPayment: (payment: Payment) => void;
  getServiceByCode: (code: string) => Service | undefined;
  getCarByPlate: (plate: string) => Car | undefined;
  getRecordByNumber: (num: string) => ServiceRecord | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial services as per the exam requirements
const initialServices: Service[] = [
  { serviceCode: 'SVC001', serviceName: 'Engine repair', servicePrice: 150000 },
  { serviceCode: 'SVC002', serviceName: 'Transmission repair', servicePrice: 80000 },
  { serviceCode: 'SVC003', serviceName: 'Oil Change', servicePrice: 60000 },
  { serviceCode: 'SVC004', serviceName: 'Chain replacement', servicePrice: 40000 },
  { serviceCode: 'SVC005', serviceName: 'Disc replacement', servicePrice: 400000 },
  { serviceCode: 'SVC006', serviceName: 'Wheel alignment', servicePrice: 5000 },
];

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [cars, setCars] = useState<Car[]>([]);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const addService = (service: Service) => {
    setServices(prev => [...prev, service]);
  };

  const addCar = (car: Car) => {
    setCars(prev => [...prev, car]);
  };

  const addServiceRecord = (record: ServiceRecord) => {
    setServiceRecords(prev => [...prev, record]);
  };

  const updateServiceRecord = (recordNumber: string, record: ServiceRecord) => {
    setServiceRecords(prev => prev.map(r => r.recordNumber === recordNumber ? record : r));
  };

  const deleteServiceRecord = (recordNumber: string) => {
    setServiceRecords(prev => prev.filter(r => r.recordNumber !== recordNumber));
  };

  const addPayment = (payment: Payment) => {
    setPayments(prev => [...prev, payment]);
  };

  const getServiceByCode = (code: string) => services.find(s => s.serviceCode === code);
  const getCarByPlate = (plate: string) => cars.find(c => c.plateNumber === plate);
  const getRecordByNumber = (num: string) => serviceRecords.find(r => r.recordNumber === num);

  return (
    <DataContext.Provider value={{
      services,
      cars,
      serviceRecords,
      payments,
      addService,
      addCar,
      addServiceRecord,
      updateServiceRecord,
      deleteServiceRecord,
      addPayment,
      getServiceByCode,
      getCarByPlate,
      getRecordByNumber,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
