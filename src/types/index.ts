export interface Service {
  serviceCode: string;
  serviceName: string;
  servicePrice: number;
}

export interface Car {
  plateNumber: string;
  type: string;
  model: string;
  manufacturingYear: number;
  driverPhone: string;
  mechanicName: string;
}

export interface ServiceRecord {
  recordNumber: string;
  serviceDate: string;
  plateNumber: string;
  serviceCode: string;
}

export interface Payment {
  paymentNumber: string;
  amountPaid: number;
  paymentDate: string;
  recordNumber: string;
}

export interface User {
  username: string;
  password: string;
}
