import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { DELIVERY_STATUS_CONFIG } from "@/constants/deliveryStatus";
import { getStatusTone } from "@/styles/theme";
import { Delivery } from "@/types/delivery";
import {
  displayMemo,
  displayValue,
  EMPTY_HISTORY_TEXT,
  isEmptyValue,
} from "@/utils/displayValue";

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.42);

  @media (max-width: 720px) {
    align-items: center;
    padding: 10px;
  }
`;

const ModalPanel = styled.section<{ $tone: string }>`
  ${({ $tone }) => {
    const current = getStatusTone($tone);
    return css`
      --card-accent: ${current.accent};
      --badge-bg: ${current.bg};
      --card-line: ${current.line};
    `;
  }}
  width: min(760px, 100%);
  max-height: min(760px, calc(100vh - 48px));
  overflow: auto;
  border: 1px solid var(--card-line);
  border-top: 4px solid var(--card-accent);
  border-radius: var(--radius-card);
  background: var(--surface);
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.26);

  @media (max-width: 720px) {
    width: 100%;
    max-height: calc(100vh - 20px);
    border-radius: 12px;
  }
`;

const ModalHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 22px;
  border-bottom: 1px solid var(--line);
  background: var(--surface);

  h2 {
    margin: 4px 0 0;
    color: var(--text);
    font-size: 1.25rem;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  @media (max-width: 720px) {
    padding: 16px 16px 14px;

    h2 {
      font-size: 1.05rem;
    }
  }
`;

const Label = styled.span`
  color: var(--text-soft);
  font-size: 0.72rem;
  font-weight: 850;
`;

const IconButton = styled.button`
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: var(--radius-card);
  color: var(--text-muted);
  background: var(--surface);
  cursor: pointer;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: var(--line-strong);
      color: var(--text);
    }
  }
`;

const ModalStatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 22px;
  border-bottom: 1px solid var(--line);
  color: var(--text-muted);
  font-size: 0.92rem;
  font-weight: 500;

  > span:last-child {
    line-height: 1.35;
  }

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 14px 16px;
  }
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

const ModalInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  p {
    margin: 5px 0 0;
    color: var(--text);
    font-size: 0.92rem;
    font-weight: 500;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 11px;

    p {
      font-size: 0.86rem;
    }
  }
`;

const DetailLabel = styled.span`
  color: var(--text-soft);
  font-size: 0.74rem;
  font-weight: 850;
`;

const ModalSection = styled.div`
  padding: 18px 22px;
  border-top: 1px solid var(--line);

  h3 {
    margin: 0 0 14px;
    color: var(--text);
    font-size: 0.98rem;
  }

  @media (max-width: 720px) {
    padding: 14px 16px;

    h3 {
      margin-bottom: 10px;
      font-size: 0.9rem;
    }
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;

  h3 {
    margin: 0;
  }

  span {
    color: var(--text-soft);
    font-size: 0.76rem;
    font-weight: 800;
    line-height: 1.4;
    text-align: right;
  }

  @media (max-width: 720px) {
    display: grid;
    gap: 4px;
    margin-bottom: 10px;

    span {
      text-align: left;
    }
  }
`;

const ContactInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  p {
    margin: 5px 0 0;
    color: var(--text);
    font-size: 0.9rem;
    font-weight: 500;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 11px;

    p {
      font-size: 0.86rem;
    }
  }
`;

const HistoryList = styled.ol`
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    display: grid;
    grid-template-columns: 76px 1fr;
    gap: 14px;
    padding-left: 18px;
  }

  li::before {
    position: absolute;
    top: 6px;
    left: 0;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--card-accent);
    box-shadow: 0 0 0 4px
      color-mix(in srgb, var(--card-accent) 14%, transparent);
    content: "";
  }

  time {
    color: var(--text-soft);
    font-size: 0.78rem;
    font-weight: 850;
  }

  strong,
  p {
    margin: 0;
    color: var(--text);
    font-size: 0.9rem;
    line-height: 1.5;
  }

  p {
    color: var(--text-muted);
  }

  @media (max-width: 720px) {
    gap: 11px;

    li {
      grid-template-columns: 1fr;
      gap: 4px;
    }

    strong,
    p {
      font-size: 0.82rem;
    }
  }
`;

const EmptyStateText = styled.p`
  margin: 0;
  color: var(--text-soft);
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.5;
`;

const MemoText = styled.p<{ $empty: boolean }>`
  margin: 0;
  color: ${({ $empty }) => ($empty ? "var(--text-soft)" : "var(--text)")};
  font-size: 0.92rem;
  font-weight: 500;
  line-height: 1.55;
`;

interface DeliveryDetailModalProps {
  delivery: Delivery | null;
  onClose: () => void;
}

export function DeliveryDetailModal({
  delivery,
  onClose,
}: DeliveryDetailModalProps) {
  const modalRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!delivery) {
      return undefined;
    }

    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) {
        return;
      }

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElement?.focus();
    };
  }, [delivery, onClose]);

  if (!delivery) {
    return null;
  }

  const statusConfig = DELIVERY_STATUS_CONFIG[delivery.status];
  const StatusIcon = statusConfig.icon;
  const memoText = displayMemo(delivery.memo);
  const hasHistory = Boolean(delivery.history?.length);

  return (
    <ModalBackdrop onMouseDown={onClose}>
      <ModalPanel
        ref={modalRef}
        $tone={statusConfig.toneClass}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delivery-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <ModalHeader>
          <div>
            <Label>송장번호</Label>
            <h2 id="delivery-modal-title">{delivery.invoiceNo}</h2>
          </div>
          <IconButton
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="상세 닫기"
          >
            <X size={20} aria-hidden="true" />
          </IconButton>
        </ModalHeader>

        <ModalStatusRow>
          <StatusBadge>
            <StatusIcon size={16} strokeWidth={2.3} aria-hidden="true" />
            {statusConfig.label}
          </StatusBadge>
          <span>{statusConfig.description}</span>
        </ModalStatusRow>

        <ModalSection>
          <h3>수령 및 배송 정보</h3>
          <ModalInfoGrid>
            <div>
              <DetailLabel>보낸 사람</DetailLabel>
              <p>{displayValue(delivery.senderName)}</p>
            </div>
            <div>
              <DetailLabel>보낸 사람 연락처</DetailLabel>
              <p>{displayValue(delivery.senderPhone)}</p>
            </div>
            <div>
              <DetailLabel>수령인</DetailLabel>
              <p>{displayValue(delivery.recipient)}</p>
            </div>
            <div>
              <DetailLabel>수령인 연락처</DetailLabel>
              <p>{displayValue(delivery.recipientPhone)}</p>
            </div>
            <div>
              <DetailLabel>출발지</DetailLabel>
              <p>{displayValue(delivery.origin)}</p>
            </div>
            <div>
              <DetailLabel>도착지</DetailLabel>
              <p>{displayValue(delivery.destination)}</p>
            </div>
            <div>
              <DetailLabel>현재 위치</DetailLabel>
              <p>{displayValue(delivery.currentLocation)}</p>
            </div>
            <div>
              <DetailLabel>예상 도착일</DetailLabel>
              <p>{displayValue(delivery.estimatedArrival)}</p>
            </div>
          </ModalInfoGrid>
        </ModalSection>

        <ModalSection>
          <h3>배송 담당자 정보</h3>
          <ContactInfoGrid>
            <div>
              <DetailLabel>배송 담당자</DetailLabel>
              <p>{displayValue(delivery.driverName)}</p>
            </div>
            <div>
              <DetailLabel>담당자 연락처</DetailLabel>
              <p>{displayValue(delivery.driverPhone)}</p>
            </div>
          </ContactInfoGrid>
        </ModalSection>

        <ModalSection>
          <SectionHeader>
            <h3>배송 이동 이력</h3>
            <span>최근 업데이트 {displayValue(delivery.lastUpdatedAt)}</span>
          </SectionHeader>
          {hasHistory ? (
            <HistoryList>
              {delivery.history?.map((history) => (
                <li key={history.id}>
                  <time>{displayValue(history.time)}</time>
                  <div>
                    <strong>{displayValue(history.location)}</strong>
                    <p>{displayValue(history.description)}</p>
                  </div>
                </li>
              ))}
            </HistoryList>
          ) : (
            <EmptyStateText>{EMPTY_HISTORY_TEXT}</EmptyStateText>
          )}
        </ModalSection>

        <ModalSection>
          <h3>메모</h3>
          <MemoText $empty={isEmptyValue(delivery.memo)}>{memoText}</MemoText>
        </ModalSection>
      </ModalPanel>
    </ModalBackdrop>
  );
}
