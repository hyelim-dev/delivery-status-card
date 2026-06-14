import { Search } from "lucide-react";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import styled, { css } from "styled-components";
import { DeliveryCard } from "@/components/DeliveryCard";
import { DeliveryDetailModal } from "@/components/DeliveryDetailModal";
import { Pagination } from "@/components/Pagination";
import { SkeletonCard } from "@/components/SkeletonCard";
import { StatusFilter } from "@/components/StatusFilter";
import {
  DELIVERY_STATUS_CONFIG,
  FILTER_OPTIONS,
  SUMMARY_STATUS_VALUES,
  SummaryIcon,
} from "@/constants/deliveryStatus";
import { deliveries } from "@/data/deliveries";
import { getSummaryTone } from "@/styles/theme";
import { Delivery, DeliveryFilterStatus } from "@/types/delivery";

const PAGE_SIZE = 10;
const DESKTOP_PAGE_BUTTONS = 10;
const MOBILE_PAGE_BUTTONS = 5;

const DashboardShell = styled.main`
  width: min(100% - 48px, 1280px);
  margin: 0 auto;
  padding: 40px 0;

  @media (max-width: 720px) {
    width: min(100% - 24px, 560px);
    padding-top: 28px;
  }
`;

const DashboardIntro = styled.section`
  margin-bottom: 26px;

  h1 {
    margin: 4px 0 10px;
    color: var(--text);
    font-size: clamp(1.85rem, 3vw, 2.7rem);
    line-height: 1.15;
  }

  p:last-child {
    max-width: 760px;
    margin: 0;
    color: var(--text-muted);
    line-height: 1.65;
  }

  @media (max-width: 720px) {
    margin-bottom: 18px;

    h1 {
      font-size: 1.65rem;
    }

    p:last-child {
      font-size: 0.9rem;
    }
  }
`;

const SummaryGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 720px) {
    gap: 8px;
    margin-bottom: 14px;

    > article:first-child {
      grid-column: 1 / -1;
    }
  }
`;

const SummaryCard = styled.article<{ $tone: string }>`
  ${({ $tone }) => {
    const current = getSummaryTone($tone);
    return css`
      --summary-accent: ${current.accent};
      --summary-bg: ${current.bg};
      --summary-line: ${current.line};
    `;
  }}
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px 12px;
  min-height: 78px;
  padding: 14px 16px;
  border: 1px solid var(--summary-line);
  border-radius: var(--radius-card);
  background: var(--summary-bg);
  box-shadow: 0 10px 24px rgba(20, 32, 51, 0.05);

  span:not(:first-child) {
    color: var(--text);
    font-size: 0.9rem;
    font-weight: 850;
  }

  strong {
    color: var(--text-soft);
    font-size: 0.78rem;
  }

  @media (max-width: 720px) {
    min-height: 56px;
    padding: 9px 11px;

    span:not(:first-child) {
      font-size: 0.78rem;
    }

    strong {
      font-size: 0.72rem;
    }
  }
`;

const SummaryIconBox = styled.span`
  display: grid;
  grid-row: span 2;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 999px;
  color: var(--summary-accent);
  background: color-mix(in srgb, var(--summary-accent) 12%, #ffffff);

  @media (max-width: 720px) {
    width: 28px;
    height: 28px;

    svg {
      width: 15px;
      height: 15px;
    }
  }
`;

const ListControls = styled.section`
  margin-bottom: 18px;

  @media (max-width: 720px) {
    margin-bottom: 14px;
  }
`;

const ControlRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  min-width: min(100%, 430px);

  @media (max-width: 900px) {
    width: 100%;
    min-width: 0;
  }
`;

const SearchForm = styled.form`
  display: grid;
  grid-template-columns: minmax(220px, 1fr) auto auto;
  gap: 8px;
  width: 100%;

  @media (max-width: 720px) {
    grid-template-columns: 1fr auto auto;
    gap: 6px;
  }
`;

const SearchField = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  height: 46px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius-card);
  background: var(--surface);

  svg {
    flex: 0 0 auto;
    color: var(--text-soft);
  }

  input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    color: var(--text);
    background: transparent;
    font: inherit;
    font-weight: 700;
  }

  input::placeholder {
    color: var(--text-soft);
  }

  @media (max-width: 720px) {
    grid-column: 1 / -1;
    height: 38px;
    padding: 0 11px;
    font-size: 0.92rem;
  }
`;

const ControlButton = styled.button`
  min-width: 64px;
  height: 46px;
  border-radius: var(--radius-card);
  cursor: pointer;
  font-weight: 850;
  transition:
    background 160ms ease,
    border-color 160ms ease,
    color 160ms ease;

  @media (max-width: 720px) {
    min-width: 56px;
    height: 38px;
    padding: 0 10px;
    font-size: 0.86rem;
  }
`;

const SearchButton = styled(ControlButton)`
  border: 1px solid #154b86;
  color: #ffffff;
  background: #154b86;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: #0f3f73;
      background: #0f3f73;
    }
  }
`;

const ResetButton = styled(ControlButton)`
  border: 1px solid var(--line);
  color: var(--text-muted);
  background: var(--surface);

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover:not(:disabled) {
      border-color: var(--line-strong);
      color: var(--text);
    }
  }
`;

const CountSummary = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  margin-top: 14px;
  color: var(--text-muted);
  font-size: 0.86rem;
  font-weight: 750;

  span {
    white-space: nowrap;
  }

  strong {
    color: var(--text);
  }
`;

const SearchResultCount = styled.span`
  padding-left: 14px;
  border-left: 1px solid var(--line-strong);
  color: #154b86;
`;

const DeliveryGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: start;
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  padding: 42px 24px;
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-card);
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.7);
  text-align: center;

  strong {
    display: block;
    margin-bottom: 6px;
    color: var(--text);
    font-size: 1rem;
  }

  p {
    margin: 0;
  }
`;

export function DeliveryDashboard() {
  const [selectedStatus, setSelectedStatus] =
    useState<DeliveryFilterStatus>("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [visiblePageButtons, setVisiblePageButtons] =
    useState(DESKTOP_PAGE_BUTTONS);

  useEffect(() => {
    const timerId = window.setTimeout(() => setIsLoading(false), 650);
    return () => window.clearTimeout(timerId);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 720px)");
    const updateVisiblePageCount = () => {
      setVisiblePageButtons(
        mediaQuery.matches ? MOBILE_PAGE_BUTTONS : DESKTOP_PAGE_BUTTONS,
      );
    };

    updateVisiblePageCount();
    mediaQuery.addEventListener("change", updateVisiblePageCount);

    return () =>
      mediaQuery.removeEventListener("change", updateVisiblePageCount);
  }, []);

  const counts = useMemo(() => {
    const initialCounts: Record<DeliveryFilterStatus, number> = {
      ALL: deliveries.length,
      READY: 0,
      IN_TRANSIT: 0,
      DELIVERED: 0,
      DELAYED: 0,
      RETURNED: 0,
    };

    return deliveries.reduce((acc, delivery) => {
      acc[delivery.status] += 1;
      return acc;
    }, initialCounts);
  }, []);

  const summaryItems = useMemo(
    () =>
      SUMMARY_STATUS_VALUES.map((status) => ({
        label:
          status === "ALL" ? "오늘 전체" : DELIVERY_STATUS_CONFIG[status].label,
        value: counts[status],
        status,
      })),
    [counts],
  );

  const filteredDeliveries = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return deliveries.filter((delivery) => {
      const matchesStatus =
        selectedStatus === "ALL" || delivery.status === selectedStatus;
      const matchesSearch =
        keyword.length === 0 ||
        delivery.invoiceNo.toLowerCase().includes(keyword);

      return matchesStatus && matchesSearch;
    });
  }, [selectedStatus, searchKeyword]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDeliveries.length / PAGE_SIZE),
  );

  const currentFilterLabel = useMemo(() => {
    return (
      FILTER_OPTIONS.find((option) => option.value === selectedStatus)?.label ??
      "전체"
    );
  }, [selectedStatus]);

  const visiblePages = useMemo(() => {
    const sideOffset = Math.floor(visiblePageButtons / 2);
    const maxStartPage = Math.max(totalPages - visiblePageButtons + 1, 1);
    const startPage = Math.min(
      Math.max(currentPage - sideOffset, 1),
      maxStartPage,
    );
    const pageCount = Math.min(visiblePageButtons, totalPages);

    return Array.from({ length: pageCount }, (_, index) => startPage + index);
  }, [currentPage, totalPages, visiblePageButtons]);

  const paginatedDeliveries = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredDeliveries.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredDeliveries, currentPage]);

  const handleFilterChange = useCallback((status: DeliveryFilterStatus) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchInput(event.target.value);
    },
    [],
  );

  const handleSearchSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const invoiceNo = formData.get("invoiceNo");
      setSearchKeyword(typeof invoiceNo === "string" ? invoiceNo : "");
      setCurrentPage(1);
    },
    [],
  );

  const handleSearchReset = useCallback(() => {
    setSearchInput("");
    setSearchKeyword("");
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    },
    [totalPages],
  );

  const handleOpenDetail = useCallback((delivery: Delivery) => {
    setSelectedDelivery(delivery);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedDelivery(null);
  }, []);

  return (
    <DashboardShell>
      <DashboardIntro>
        <div>
          <h1>배송 현황 모니터링</h1>
          <p>배송 상태별 카드 목록과 운송장번호 검색을 제공합니다.</p>
        </div>
      </DashboardIntro>

      <SummaryGrid aria-label="오늘 배송 요약">
        {summaryItems.map((item) => {
          const statusConfig =
            item.status === "ALL" ? null : DELIVERY_STATUS_CONFIG[item.status];
          const Icon = statusConfig?.icon ?? SummaryIcon;

          return (
            <SummaryCard
              key={item.status}
              $tone={statusConfig?.toneClass ?? "summary-total"}
            >
              <SummaryIconBox>
                <Icon size={18} aria-hidden="true" />
              </SummaryIconBox>
              <span>{item.label}</span>
              <strong>{item.value}건</strong>
            </SummaryCard>
          );
        })}
      </SummaryGrid>

      <ListControls aria-label="배송 목록 도구">
        <ControlRow>
          <StatusFilter
            selectedStatus={selectedStatus}
            onChange={handleFilterChange}
          />

          <Toolbar>
            <SearchForm onSubmit={handleSearchSubmit}>
              <SearchField>
                <Search size={18} aria-hidden="true" />
                <input
                  name="invoiceNo"
                  type="search"
                  value={searchInput}
                  onChange={handleSearchChange}
                  placeholder="운송장번호 검색"
                  aria-label="운송장번호 검색"
                />
              </SearchField>
              <SearchButton type="submit">검색</SearchButton>
              <ResetButton
                type="button"
                onClick={handleSearchReset}
                disabled={!searchInput && !searchKeyword}
              >
                초기화
              </ResetButton>
            </SearchForm>
          </Toolbar>
        </ControlRow>

        <CountSummary aria-live="polite">
          <span>
            {currentFilterLabel} <strong>{filteredDeliveries.length}</strong>건
          </span>
          {searchKeyword.trim() && (
            <SearchResultCount>
              검색결과 <strong>{filteredDeliveries.length}</strong>건
            </SearchResultCount>
          )}
        </CountSummary>
      </ListControls>

      <DeliveryGrid aria-live="polite">
        {isLoading ? (
          Array.from({ length: PAGE_SIZE }, (_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : paginatedDeliveries.length > 0 ? (
          paginatedDeliveries.map((delivery) => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              onOpenDetail={handleOpenDetail}
            />
          ))
        ) : (
          <EmptyState>
            <strong>검색 결과가 없습니다.</strong>
            <p>운송장번호 또는 상태 필터를 다시 확인해 주세요.</p>
          </EmptyState>
        )}
      </DeliveryGrid>

      {!isLoading && filteredDeliveries.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          visiblePages={visiblePages}
          onPageChange={handlePageChange}
        />
      )}

      <DeliveryDetailModal
        delivery={selectedDelivery}
        onClose={handleCloseDetail}
      />
    </DashboardShell>
  );
}
