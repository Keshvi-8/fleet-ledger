import { TripStatus, TRIP_STATUS } from './constants';

export interface Truck {
  id: string;
  registrationNumber: string;
  model: string;
  capacity: number;
  currentDriverId?: string;
  status: 'available' | 'on_trip' | 'maintenance';
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  salary: number;
  assignedTruckId?: string;
}

export interface Client {
  id: string;
  name: string;
  gstNumber: string;
  whatsappNumber: string;
  address: string;
}

export interface PetrolPump {
  id: string;
  name: string;
  location: string;
  dieselRate: number;
}

export interface Journey {
  id: string;
  tripId: string;
  clientId: string;
  clientName: string;
  fromLocation: string;
  toLocation: string;
  weight: number;
  ratePerTon: number;
  freightAmount: number;
  clientAdvance: number;
  createdAt: string;
}

export interface Trip {
  id: string;
  truckId: string;
  truckNumber: string;
  driverId: string;
  driverName: string;
  startDate: string;
  endDate?: string;
  status: TripStatus;
  driverAdvance: number;
  totalKm?: number;
  dieselQuantity?: number;
  dieselAmount?: number;
  tollExpense?: number;
  otherExpense?: number;
  totalIncome: number;
  totalExpense: number;
  profit: number;
  mileage?: number;
  journeys: Journey[];
}

export const mockTrucks: Truck[] = [
  { id: '1', registrationNumber: 'MH12AB1234', model: 'Tata Prima', capacity: 25, currentDriverId: '1', status: 'on_trip' },
  { id: '2', registrationNumber: 'MH12CD5678', model: 'Ashok Leyland', capacity: 30, currentDriverId: '2', status: 'on_trip' },
  { id: '3', registrationNumber: 'MH12EF9012', model: 'Bharat Benz', capacity: 28, status: 'available' },
  { id: '4', registrationNumber: 'MH14GH3456', model: 'Volvo FH', capacity: 35, currentDriverId: '4', status: 'maintenance' },
];

export const mockDrivers: Driver[] = [
  { id: '1', name: 'Suresh Patil', phone: '9876543210', licenseNumber: 'MH1220210001234', salary: 35000, assignedTruckId: '1' },
  { id: '2', name: 'Ramesh Singh', phone: '9876543211', licenseNumber: 'MH1220200004567', salary: 32000, assignedTruckId: '2' },
  { id: '3', name: 'Vijay Sharma', phone: '9876543212', licenseNumber: 'MH1220190007890', salary: 30000 },
  { id: '4', name: 'Manoj Yadav', phone: '9876543213', licenseNumber: 'MH1420180002345', salary: 38000, assignedTruckId: '4' },
];

export const mockClients: Client[] = [
  { id: '1', name: 'ABC Steel Industries', gstNumber: '27AABCU9603R1ZM', whatsappNumber: '9988776655', address: 'MIDC Pune' },
  { id: '2', name: 'XYZ Cement Works', gstNumber: '27AABCU9603R1ZN', whatsappNumber: '9988776656', address: 'Satara Road' },
  { id: '3', name: 'PQR Logistics', gstNumber: '27AABCU9603R1ZO', whatsappNumber: '9988776657', address: 'Hadapsar' },
];

export const mockPetrolPumps: PetrolPump[] = [
  { id: '1', name: 'HP Fuel Station', location: 'Pune Highway', dieselRate: 89.50 },
  { id: '2', name: 'Indian Oil', location: 'Mumbai Road', dieselRate: 88.75 },
  { id: '3', name: 'Bharat Petroleum', location: 'Nashik Bypass', dieselRate: 89.00 },
];

export const mockTrips: Trip[] = [
  {
    id: '1',
    truckId: '1',
    truckNumber: 'MH12AB1234',
    driverId: '1',
    driverName: 'Suresh Patil',
    startDate: '2025-01-10',
    status: TRIP_STATUS.RUNNING,
    driverAdvance: 5000,
    totalIncome: 85000,
    totalExpense: 0,
    profit: 0,
    journeys: [
      {
        id: '1',
        tripId: '1',
        clientId: '1',
        clientName: 'ABC Steel Industries',
        fromLocation: 'Pune',
        toLocation: 'Mumbai',
        weight: 22,
        ratePerTon: 2500,
        freightAmount: 55000,
        clientAdvance: 10000,
        createdAt: '2025-01-10',
      },
      {
        id: '2',
        tripId: '1',
        clientId: '2',
        clientName: 'XYZ Cement Works',
        fromLocation: 'Mumbai',
        toLocation: 'Nashik',
        weight: 15,
        ratePerTon: 2000,
        freightAmount: 30000,
        clientAdvance: 5000,
        createdAt: '2025-01-11',
      },
    ],
  },
  {
    id: '2',
    truckId: '2',
    truckNumber: 'MH12CD5678',
    driverId: '2',
    driverName: 'Ramesh Singh',
    startDate: '2025-01-08',
    status: TRIP_STATUS.RUNNING,
    driverAdvance: 3000,
    totalIncome: 42000,
    totalExpense: 0,
    profit: 0,
    journeys: [
      {
        id: '3',
        tripId: '2',
        clientId: '3',
        clientName: 'PQR Logistics',
        fromLocation: 'Pune',
        toLocation: 'Satara',
        weight: 18,
        ratePerTon: 2333,
        freightAmount: 42000,
        clientAdvance: 8000,
        createdAt: '2025-01-08',
      },
    ],
  },
  {
    id: '3',
    truckId: '3',
    truckNumber: 'MH12EF9012',
    driverId: '3',
    driverName: 'Vijay Sharma',
    startDate: '2025-01-01',
    endDate: '2025-01-07',
    status: TRIP_STATUS.COMPLETED,
    driverAdvance: 4000,
    totalKm: 850,
    dieselQuantity: 180,
    dieselAmount: 16110,
    tollExpense: 2500,
    otherExpense: 1200,
    totalIncome: 72000,
    totalExpense: 23810,
    profit: 48190,
    mileage: 4.72,
    journeys: [
      {
        id: '4',
        tripId: '3',
        clientId: '1',
        clientName: 'ABC Steel Industries',
        fromLocation: 'Mumbai',
        toLocation: 'Pune',
        weight: 24,
        ratePerTon: 3000,
        freightAmount: 72000,
        clientAdvance: 15000,
        createdAt: '2025-01-01',
      },
    ],
  },
];

export const dashboardStats = {
  totalTrips: 156,
  activeTrips: 2,
  totalIncome: 4850000,
  totalExpenses: 2890000,
  netProfit: 1960000,
  totalKm: 48500,
  avgMileage: 4.8,
  pendingBills: 12,
  pendingAmount: 425000,
};
