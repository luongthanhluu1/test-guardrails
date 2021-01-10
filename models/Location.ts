export interface Location {
  _id?: string;
  id?: string;
  name: string;
  thumbnail: string;
  address: string;
  isWarehouse: boolean;
  isFactory: boolean;
  isSupplier: boolean;
  unitPrice: number;
  wastePercent: number;
}
