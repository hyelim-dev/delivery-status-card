import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  LucideIcon,
  PackageCheck,
  RotateCcw,
  Truck,
} from "lucide-react";
import { DeliveryFilterStatus, DeliveryStatus } from "@/types/delivery";

export interface DeliveryStatusConfig {
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  toneClass: string;
  description: string;
  warningLabel?: string;
}

export interface DeliveryFilterOption {
  label: string;
  value: DeliveryFilterStatus;
  toneClass: string;
}

export const DELIVERY_STATUS_CONFIG: Record<
  DeliveryStatus,
  DeliveryStatusConfig
> = {
  READY: {
    label: "배송 준비 중",
    shortLabel: "준비중",
    icon: Clock3,
    toneClass: "status-ready",
    description: "출고 준비와 배차 확인이 진행 중입니다.",
  },
  IN_TRANSIT: {
    label: "배송 중",
    shortLabel: "배송중",
    icon: Truck,
    toneClass: "status-transit",
    description: "목적지로 이동 중인 배송 건입니다.",
  },
  DELIVERED: {
    label: "배송 완료",
    shortLabel: "완료",
    icon: CheckCircle2,
    toneClass: "status-delivered",
    description: "수령인에게 배송이 완료되었습니다.",
  },
  DELAYED: {
    label: "배송 지연",
    shortLabel: "지연",
    icon: AlertTriangle,
    toneClass: "status-delayed",
    description: "예정 시간 대비 지연이 발생했습니다.",
    warningLabel: "배송 지연 · 운영 확인 필요",
  },
  RETURNED: {
    label: "반송",
    shortLabel: "반송",
    icon: RotateCcw,
    toneClass: "status-returned",
    description: "배송이 중단되어 반송 절차가 진행 중입니다.",
  },
};

export const FILTER_OPTIONS: DeliveryFilterOption[] = [
  { label: "전체", value: "ALL", toneClass: "filter-all" },
  {
    label: "준비중",
    value: "READY",
    toneClass: DELIVERY_STATUS_CONFIG.READY.toneClass,
  },
  {
    label: "배송중",
    value: "IN_TRANSIT",
    toneClass: DELIVERY_STATUS_CONFIG.IN_TRANSIT.toneClass,
  },
  {
    label: "완료",
    value: "DELIVERED",
    toneClass: DELIVERY_STATUS_CONFIG.DELIVERED.toneClass,
  },
  {
    label: "지연",
    value: "DELAYED",
    toneClass: DELIVERY_STATUS_CONFIG.DELAYED.toneClass,
  },
  {
    label: "반송",
    value: "RETURNED",
    toneClass: DELIVERY_STATUS_CONFIG.RETURNED.toneClass,
  },
];

export const SUMMARY_STATUS_VALUES: DeliveryFilterStatus[] = [
  "ALL",
  "IN_TRANSIT",
  "DELIVERED",
  "DELAYED",
  "RETURNED",
];

export const STEP_LABELS = {
  READY: "배송 준비",
  PICKED_UP: "집화",
  MOVING: "이동 중",
  DELIVERED: "배송 완료",
} as const;

export const SummaryIcon = PackageCheck;
