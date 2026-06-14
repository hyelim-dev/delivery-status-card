import {
  AlertTriangle,
  ChevronRight,
  MapPin,
  Route,
  UserRound,
} from "lucide-react";
import { KeyboardEvent } from "react";
import styled, { css } from "styled-components";
import { DELIVERY_STATUS_CONFIG } from "@/constants/deliveryStatus";
import { DeliveryTimeline } from "@/components/DeliveryTimeline";
import { getStatusTone } from "@/styles/theme";
import { Delivery } from "@/types/delivery";

interface DeliveryCardProps {
  delivery: Delivery;
  onOpenDetail: (delivery: Delivery) => void;
}

const Card = styled.article<{ $tone: string; $isWarningStatus: boolean }>`
  ${({ $tone }) => {
    const tone = getStatusTone($tone);
    return css`
      --card-accent: ${tone.accent};
      --badge-bg: ${tone.bg};
      --card-line: ${tone.line};
    `;
  }}

  position: relative;
  overflow: hidden;
  border: 1px solid
    ${({ $isWarningStatus }) =>
      $isWarningStatus ? "var(--card-accent)" : "var(--card-line)"};
  border-top: 4px solid var(--card-accent);
  border-radius: var(--radius-card);
  background: var(--surface);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease;

  &:focus-visible {
    outline: 3px solid color-mix(in srgb, var(--card-accent) 34%, transparent);
    outline-offset: 3px;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-hover);
    }
  }

  @media (max-width: 720px) {
    border-radius: 10px;
  }
`;

const ExceptionBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-top: 1px solid var(--status-delayed);
  border-bottom: 1px solid var(--status-delayed);
  color: #92400e;
  background: #fffbeb;
  font-size: 0.88rem;
  font-weight: 900;

  svg {
    color: var(--status-delayed);
  }
`;

const CardContent = styled.div`
  display: grid;
  gap: 16px;
  width: 100%;
  padding: 20px;

  @media (max-width: 720px) {
    gap: 11px;
    padding: 16px;
  }
`;

const CardTopline = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const InvoiceGroup = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;

  strong {
    color: var(--text);
    font-size: 0.96rem;
    overflow-wrap: anywhere;
  }
`;

const Label = styled.span`
  color: var(--text-soft);
  font-size: 0.72rem;
  font-weight: 850;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border-radius: 999px;
  color: var(--card-accent);
  background: var(--badge-bg);
  box-shadow: inset 0 0 0 1px
    color-mix(in srgb, var(--card-accent) 28%, transparent);
  font-size: 0.78rem;
  font-weight: 800;
  line-height: 1.1;
  white-space: nowrap;
`;

const RecipientRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
`;

const RecipientName = styled.span`
  display: inline-flex;
  align-items: center;
  min-width: 0;
  gap: 8px;
  color: var(--text);
  font-size: 1.08rem;
  font-weight: 900;
  line-height: 1.35;
  overflow-wrap: anywhere;

  svg {
    flex: 0 0 auto;
    color: var(--card-accent);
  }
`;

const RouteSummary = styled.div`
  display: grid;
  gap: 10px;
  border-radius: var(--radius-card);
  background: var(--surface-muted);
`;

const RoutePoint = styled.div`
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr);
  align-items: flex-start;
  gap: 6px;
  min-width: 0;

  svg {
    margin-top: 2px;
    color: var(--card-accent);
  }
`;

const RouteLabel = styled.span`
  color: var(--text-soft);
  font-size: 0.78rem;
  font-weight: 850;
  white-space: nowrap;
`;

const RouteAddress = styled.span`
  color: var(--text-muted);
  font-size: 0.88rem;
  font-weight: 700;
  line-height: 1.45;
  overflow-wrap: anywhere;
`;

const ArrivalRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--text-muted);
  font-size: 0.88rem;
  font-weight: 800;

  strong {
    color: var(--text);
  }
`;

export function DeliveryCard({ delivery, onOpenDetail }: DeliveryCardProps) {
  const statusConfig = DELIVERY_STATUS_CONFIG[delivery.status];
  const StatusIcon = statusConfig.icon;
  const isWarningStatus =
    delivery.status === "DELAYED" || delivery.status === "RETURNED";

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpenDetail(delivery);
    }
  };

  return (
    <Card
      $tone={statusConfig.toneClass}
      $isWarningStatus={isWarningStatus}
      role="button"
      tabIndex={0}
      aria-label={`${delivery.invoiceNo} 배송 상세 보기`}
      onClick={() => onOpenDetail(delivery)}
      onKeyDown={handleKeyDown}
    >
      {statusConfig.warningLabel && (
        <ExceptionBanner role="status">
          <AlertTriangle size={16} aria-hidden="true" />
          {statusConfig.warningLabel}
        </ExceptionBanner>
      )}

      <CardContent>
        <CardTopline>
          <InvoiceGroup>
            <Label>송장번호</Label>
            <strong>{delivery.invoiceNo}</strong>
          </InvoiceGroup>
          <StatusBadge>
            <StatusIcon size={16} strokeWidth={2.3} />
            {statusConfig.label}
          </StatusBadge>
        </CardTopline>

        <RecipientRow>
          <RecipientName>
            <UserRound size={17} />
            {delivery.recipient}
          </RecipientName>
          <ChevronRight size={20} color="var(--text-soft)" aria-hidden="true" />
        </RecipientRow>

        <RouteSummary>
          <RoutePoint>
            <MapPin size={15} />
            <RouteLabel>출발지:</RouteLabel>
            <RouteAddress>{delivery.origin}</RouteAddress>
          </RoutePoint>
          <RoutePoint>
            <Route size={15} />
            <RouteLabel>도착지:</RouteLabel>
            <RouteAddress>{delivery.destination}</RouteAddress>
          </RoutePoint>
        </RouteSummary>

        <ArrivalRow>
          <span>예상 도착일</span>
          <strong>{delivery.estimatedArrival}</strong>
        </ArrivalRow>
      </CardContent>

      <DeliveryTimeline steps={delivery.steps} status={delivery.status} />
    </Card>
  );
}
