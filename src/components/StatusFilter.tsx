import styled, { css } from "styled-components";
import { FILTER_OPTIONS } from "@/constants/deliveryStatus";
import { getFilterTone } from "@/styles/theme";
import { DeliveryFilterStatus } from "@/types/delivery";

interface StatusFilterProps {
  selectedStatus: DeliveryFilterStatus;
  onChange: (status: DeliveryFilterStatus) => void;
}

const StatusFilterRoot = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  @media (max-width: 720px) {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 5px;
    width: 100%;
  }

  @media (max-width: 390px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
  }
`;

const FilterButton = styled.button<{ $tone: string; $active: boolean }>`
  ${({ $tone }) => css`
    --filter-accent: ${getFilterTone($tone)};
  `}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 8px 12px;
  border: 1px solid
    ${({ $active }) => ($active ? "var(--filter-accent)" : "var(--line)")};
  border-radius: 999px;
  color: ${({ $active }) => ($active ? "#ffffff" : "var(--text-muted)")};
  background: ${({ $active }) =>
    $active ? "var(--filter-accent)" : "transparent"};
  cursor: pointer;
  font-weight: 800;
  transition:
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;
  white-space: nowrap;

  @media (hover: hover) and (pointer: fine) {
    &:hover:not([aria-pressed="true"]) {
      border-color: var(--line-strong);
      color: var(--text);
      background: rgba(248, 250, 252, 0.72);
    }
  }

  @media (max-width: 720px) {
    min-height: 34px;
    padding: 7px 6px;
    font-size: 0.75rem;
  }
`;

export function StatusFilter({ selectedStatus, onChange }: StatusFilterProps) {
  return (
    <StatusFilterRoot role="group" aria-label="배송 상태 필터">
      {FILTER_OPTIONS.map((option) => {
        const isActive = selectedStatus === option.value;

        return (
          <FilterButton
            key={option.value}
            type="button"
            $tone={option.toneClass}
            $active={isActive}
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
          >
            <span>{option.label}</span>
          </FilterButton>
        );
      })}
    </StatusFilterRoot>
  );
}
