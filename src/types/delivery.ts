export type DeliveryStatus =
  | 'READY'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'DELAYED'
  | 'RETURNED';

export type DeliveryFilterStatus = DeliveryStatus | 'ALL';

export type DeliveryStepKey = 'READY' | 'PICKED_UP' | 'MOVING' | 'DELIVERED';

export type DeliveryStepState = 'completed' | 'current' | 'pending' | 'exception';

export interface DeliveryStep {
  key: DeliveryStepKey;
  label: string;
  state: DeliveryStepState;
}

export interface DeliveryHistory {
  id: string;
  time: string;
  location: string;
  description: string;
}

export interface Delivery {
  id: string;
  invoiceNo: string;
  senderName: string;
  senderPhone: string;
  recipient: string;
  recipientPhone: string;
  origin: string;
  destination: string;
  estimatedArrival: string;
  status: DeliveryStatus;
  currentLocation: string;
  lastUpdatedAt: string;
  driverName: string;
  driverPhone: string;
  memo: string;
  steps: DeliveryStep[];
  history: DeliveryHistory[];
}
