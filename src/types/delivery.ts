export type DeliveryStatus =
  | "READY"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "DELAYED"
  | "RETURNED";

export type DeliveryFilterStatus = DeliveryStatus | "ALL";

export type DeliveryStepKey =
  | "READY"
  | "PICKED_UP"
  | "MOVING"
  | "DELIVERED"
  | "RETURN_REQUESTED"
  | "RETURN_PICKING"
  | "RETURN_COMPLETED";

export type DeliveryStepState =
  | "completed"
  | "current"
  | "pending"
  | "exception";

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
  senderName?: string | null;
  senderPhone?: string | null;
  recipient: string;
  recipientPhone?: string | null;
  origin?: string | null;
  destination?: string | null;
  estimatedArrival?: string | null;
  status: DeliveryStatus;
  currentLocation?: string | null;
  lastUpdatedAt?: string | null;
  driverName?: string | null;
  driverPhone?: string | null;
  memo?: string | null;
  steps: DeliveryStep[];
  history?: DeliveryHistory[] | null;
}
