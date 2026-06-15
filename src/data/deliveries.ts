import { RETURN_STEP_LABELS, STEP_LABELS } from "@/constants/deliveryStatus";
import {
  Delivery,
  DeliveryStep,
  DeliveryStepKey,
  DeliveryStatus,
} from "@/types/delivery";

const MOCK_DELIVERY_COUNT = 150;

const stepOrder: DeliveryStepKey[] = [
  "READY",
  "PICKED_UP",
  "MOVING",
  "DELIVERED",
];

const returnStepOrder: DeliveryStepKey[] = [
  "RETURN_REQUESTED",
  "RETURN_PICKING",
  "RETURN_COMPLETED",
];

const statusValues: DeliveryStatus[] = [
  "READY",
  "IN_TRANSIT",
  "DELIVERED",
  "DELAYED",
  "RETURNED",
];

const statusCurrentStep: Record<DeliveryStatus, DeliveryStepKey> = {
  READY: "READY",
  IN_TRANSIT: "MOVING",
  DELIVERED: "DELIVERED",
  DELAYED: "MOVING",
  RETURNED: "RETURN_PICKING",
};

const recipients = [
  "김민지",
  "박서준",
  "이현우",
  "정하윤",
  "최도윤",
  "한지우",
  "오세린",
  "유강민",
  "문서연",
  "서지후",
  "주식회사 더블유로지스틱스 운영지원팀 홍길동 매니저",
];

const origins = [
  "서울 강서 허브",
  "인천 서구 물류센터",
  "경기 이천 메가허브",
  "대전 대덕 집화센터",
  "부산 사상 터미널",
  "광주 광산 물류거점",
];

const destinations = [
  "서울특별시 마포구 월드컵북로 396 프리미엄스퀘어 14층",
  "경기도 성남시 분당구 판교역로 235",
  "부산광역시 해운대구 센텀중앙로 97",
  "대구광역시 수성구 달구벌대로 2450",
  "광주광역시 북구 첨단과기로 123",
  "제주특별자치도 제주시 연동 292-12",
  "서울특별시 강남구 테헤란로 521 파르나스타워 장기보관실 앞 무인택배함",
];

const memoSamples = [
  "오전 배차 확인 후 출고 예정",
  "고객 요청으로 경비실 위탁 가능",
  "도착 전 수령인 연락 필요",
  "주소 확인 완료",
  "",
];

const drivers = [
  { name: "김도현", phone: "010-3210-4581" },
  { name: "이서준", phone: "010-8742-1093" },
  { name: "박민규", phone: "010-5528-7731" },
  { name: "최지훈", phone: "010-2381-9044" },
];

const senders = [
  { name: "오엠니크 물류", phone: "010-4102-8831" },
  { name: "서울 리테일센터", phone: "010-2298-1047" },
  { name: "더블유커머스", phone: "010-7841-6620" },
  { name: "에이치몰 출고팀", phone: "010-3409-7512" },
  { name: "제주 신선물류", phone: "010-6105-2478" },
];

const getCurrentLocation = (
  status: DeliveryStatus,
  origin: string,
  destination: string,
) => {
  if (status === "READY") return `${origin} 출고 대기장`;
  if (status === "DELIVERED") return destination;
  if (status === "RETURNED") return `${origin} 반송 접수 구역`;

  return `${origin} 간선 이동 구간`;
};

const makeSteps = (
  current: DeliveryStepKey,
  status: DeliveryStatus,
): DeliveryStep[] => {
  const currentStepOrder = status === "RETURNED" ? returnStepOrder : stepOrder;
  const currentIndex = currentStepOrder.indexOf(current);

  return currentStepOrder.map((key, index) => {
    let state: DeliveryStep["state"] = "pending";

    if ((status === "RETURNED" || status === "DELAYED") && key === current) {
      state = "exception";
    } else if (index < currentIndex) {
      state = "completed";
    } else if (index === currentIndex) {
      state = status === "DELIVERED" ? "completed" : "current";
    }

    return {
      key,
      label:
        status === "RETURNED"
          ? RETURN_STEP_LABELS[key as keyof typeof RETURN_STEP_LABELS]
          : STEP_LABELS[key as keyof typeof STEP_LABELS],
      state,
    };
  });
};

const makeStatusSequence = (count: number): DeliveryStatus[] => {
  const balancedStatuses = Array.from(
    { length: Math.ceil(count / statusValues.length) },
    () => statusValues,
  )
    .flat()
    .slice(0, count);

  let seed = 20260612;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let index = balancedStatuses.length - 1; index > 0; index -= 1) {
    const targetIndex = Math.floor(random() * (index + 1));
    [balancedStatuses[index], balancedStatuses[targetIndex]] = [
      balancedStatuses[targetIndex],
      balancedStatuses[index],
    ];
  }

  return balancedStatuses;
};

const makeHistory = (
  index: number,
  status: DeliveryStatus,
  currentLocation: string,
): Delivery["history"] => {
  const baseHour = 7 + (index % 8);
  const invoiceSuffix = String(index + 1).padStart(4, "0");

  const commonHistory = [
    {
      id: `H-${invoiceSuffix}-1`,
      time: `2026-06-12 ${String(baseHour).padStart(2, "0")}:10`,
      location: origins[index % origins.length],
      description: "배송 주문이 접수되어 출고 준비 목록에 등록되었습니다.",
    },
    {
      id: `H-${invoiceSuffix}-2`,
      time: `2026-06-12 ${String(baseHour + 1).padStart(2, "0")}:25`,
      location: currentLocation,
      description: "배송 단계가 업데이트되었습니다.",
    },
  ];

  if (status === "DELAYED") {
    return [
      ...commonHistory,
      {
        id: `H-${invoiceSuffix}-3`,
        time: `2026-06-12 ${String(baseHour + 2).padStart(2, "0")}:40`,
        location: currentLocation,
        description: "간선 지연으로 운영 확인이 필요합니다.",
      },
    ];
  }

  if (status === "RETURNED") {
    return [
      ...commonHistory,
      {
        id: `H-${invoiceSuffix}-3`,
        time: `2026-06-12 ${String(baseHour + 2).padStart(2, "0")}:05`,
        location: currentLocation,
        description: "수령 불가로 반송 절차가 시작되었습니다.",
      },
    ];
  }

  return commonHistory;
};

const makeEdgeHistory = (
  edgeId: string,
  location: string,
): Delivery["history"] => [
  {
    id: `${edgeId}-H1`,
    time: "2026-06-12 09:10",
    location,
    description: "배송 주문이 접수되어 출고 준비 목록에 등록되었습니다.",
  },
  {
    id: `${edgeId}-H2`,
    time: "2026-06-12 10:25",
    location,
    description: "배송 단계가 업데이트되었습니다.",
  },
];

const createEdgeDelivery = (
  index: number,
  overrides: Partial<Delivery>,
): Delivery => {
  const status = overrides.status ?? "IN_TRANSIT";
  const currentStep = statusCurrentStep[status];
  const edgeId = `EDGE-${String(index).padStart(6, "0")}`;
  const origin = "서울 강서 허브";
  const destination = "서울특별시 마포구 월드컵북로 396 프리미엄스퀘어 14층";
  const currentLocation = "서울 강서 허브 간선 이동 구간";

  return {
    id: edgeId,
    invoiceNo: `KR-EDGE-${String(index).padStart(6, "0")}`,
    senderName: "오엠니크 물류",
    senderPhone: "010-4102-8831",
    recipient: "예외케이스",
    recipientPhone: "010-1000-2000",
    origin,
    destination,
    estimatedArrival: "2026-06-15",
    status,
    currentLocation,
    lastUpdatedAt: "2026-06-12 13:40",
    driverName: "최지훈",
    driverPhone: "010-2381-9044",
    memo: "주소 확인 완료",
    steps: makeSteps(currentStep, status),
    history: makeEdgeHistory(edgeId, currentLocation),
    ...overrides,
  };
};

const edgeDeliveries: Delivery[] = [
  createEdgeDelivery(1, {
    status: "READY",
    steps: makeSteps(statusCurrentStep.READY, "READY"),
    recipient: "빈값누락데이터",
    senderName: "",
    senderPhone: "",
    currentLocation: "",
    estimatedArrival: "",
    driverName: "",
    driverPhone: "",
    history: [],
    lastUpdatedAt: "",
    memo: "",
  }),
  createEdgeDelivery(2, {
    recipient: "긴수령인이름예외처리테스트용수령인입니다",
  }),
  createEdgeDelivery(3, {
    recipient: "주소2줄이상예외처리",
    origin:
      "서울특별시 강남구 테헤란로 521 파르나스타워 장기보관실 앞 출입구 오른쪽 무인택배함 3번 구역",
    destination:
      "부산광역시 해운대구 센텀중앙로 97 물류동 지하 2층 장기보관실 맞은편 고객전용 무인택배함",
  }),
];

const generateMockDeliveries = (count: number): Delivery[] => {
  const shuffledStatuses = makeStatusSequence(count);

  return Array.from({ length: count }, (_, index) => {
    const status = shuffledStatuses[index];
    const currentStep = statusCurrentStep[status];
    const recipient = recipients[index % recipients.length];
    const origin = origins[index % origins.length];
    const destination = destinations[(index * 2) % destinations.length];
    const driver = drivers[index % drivers.length];
    const sender = senders[index % senders.length];
    const currentLocation = getCurrentLocation(status, origin, destination);

    return {
      id: `DEL-${String(index + 1).padStart(4, "0")}`,
      invoiceNo: `KR-20260612-${String(100000 + index).padStart(6, "0")}`,
      senderName: sender.name,
      senderPhone: sender.phone,
      recipient,
      recipientPhone: `010-${String(1000 + (index % 9000)).padStart(4, "0")}-${String(
        2000 + (index % 7000),
      ).padStart(4, "0")}`,
      origin,
      destination,
      estimatedArrival: `2026-06-${String(12 + (index % 5)).padStart(2, "0")}`,
      status,
      currentLocation,
      lastUpdatedAt: `2026-06-12 ${String(8 + (index % 10)).padStart(2, "0")}:${String(
        (index * 7) % 60,
      ).padStart(2, "0")}`,
      driverName: driver.name,
      driverPhone: driver.phone,
      memo: memoSamples[index % memoSamples.length],
      steps: makeSteps(currentStep, status),
      history: makeHistory(index, status, currentLocation),
    };
  });
};

export const deliveries = [
  ...edgeDeliveries,
  ...generateMockDeliveries(MOCK_DELIVERY_COUNT - edgeDeliveries.length),
];
