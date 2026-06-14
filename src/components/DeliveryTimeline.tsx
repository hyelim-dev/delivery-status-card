import { AlertTriangle, Check, Circle, RotateCcw } from "lucide-react";
import styled, { css } from "styled-components";
import { DeliveryStatus, DeliveryStep } from "@/types/delivery";

interface DeliveryTimelineProps {
  steps: DeliveryStep[];
  status: DeliveryStatus;
}
type TimelineState = DeliveryStep["state"];

const TimelineRoot = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  padding: 0 20px 22px;

  @media (max-width: 720px) {
    padding: 0 16px 18px;
  }
`;

const TimelineTrack = styled.div`
  position: absolute;
  top: 13px;
  right: calc(12.5% + 20px);
  left: calc(12.5% + 20px);
  height: 2px;
  background: var(--line);
`;

const TimelineStep = styled.div<{ $state: TimelineState }>`
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  gap: 7px;
  color: var(--text-muted);
  text-align: center;

  ${({ $state }) =>
    ($state === "completed" || $state === "current") &&
    css`
      color: var(--text);
    `}
`;

const TimelineNode = styled.span<{ $state: TimelineState }>`
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border: 2px solid var(--line);
  border-radius: 50%;
  color: var(--text-soft);
  background: var(--surface);

  ${({ $state }) =>
    $state === "completed" &&
    css`
      border-color: var(--card-accent);
      color: #ffffff;
      background: var(--card-accent);
    `}

  ${({ $state }) =>
    ($state === "current" || $state === "exception") &&
    css`
      border-color: var(--card-accent);
      color: #ffffff;
      background: var(--card-accent);
      box-shadow: 0 0 0 5px
        color-mix(in srgb, var(--card-accent) 14%, transparent);
    `}
`;

const TimelineLabel = styled.span`
  color: currentColor;
  font-size: 0.75rem;
  font-weight: 800;
`;

export function DeliveryTimeline({ steps, status }: DeliveryTimelineProps) {
  return (
    <TimelineRoot role="group" aria-label="배송 진행 단계">
      <TimelineTrack aria-hidden="true" />
      {steps.map((step) => {
        const isException = step.state === "exception";
        const Icon = isException
          ? status === "RETURNED"
            ? RotateCcw
            : AlertTriangle
          : step.state === "completed"
            ? Check
            : Circle;

        return (
          <TimelineStep key={step.key} $state={step.state}>
            <TimelineNode $state={step.state}>
              <Icon size={14} strokeWidth={2.4} aria-hidden="true" />
            </TimelineNode>
            <TimelineLabel>{step.label}</TimelineLabel>
          </TimelineStep>
        );
      })}
    </TimelineRoot>
  );
}
