import styled, { css, keyframes } from "styled-components";

type SkeletonVariant = "pill" | "chip" | "title" | "short" | "dot";

const skeletonPulse = keyframes`
  0% { opacity: 0.55; }
  50% { opacity: 1; }
  100% { opacity: 0.55; }
`;

const SkeletonCardRoot = styled.article`
  min-height: 305px;
  padding: 20px;
  border: 1px solid var(--line);
  border-top: 4px solid var(--line-strong);
  border-radius: var(--radius-card);
  background: var(--surface);
  box-shadow: var(--shadow-card);
`;

const SkeletonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
`;

const SkeletonBlock = styled.span<{ $variant?: SkeletonVariant }>`
  display: block;
  border-radius: 999px;
  background: linear-gradient(90deg, #eef2f7, #f8fafc, #eef2f7);
  animation: ${skeletonPulse} 1.4s ease-in-out infinite;

  ${({ $variant }) =>
    $variant === "pill" &&
    css`
      width: 180px;
      height: 18px;
    `}

  ${({ $variant }) =>
    $variant === "chip" &&
    css`
      width: 98px;
      height: 30px;
    `}

  ${({ $variant }) =>
    $variant === "title" &&
    css`
      width: 54%;
      height: 24px;
      margin-bottom: 22px;
    `}

  ${({ $variant }) =>
    !$variant &&
    css`
      width: 100%;
      height: 14px;
      margin-bottom: 10px;
    `}

  ${({ $variant }) =>
    $variant === "short" &&
    css`
      width: 68%;
      height: 14px;
      margin-bottom: 0;
    `}

  ${({ $variant }) =>
    $variant === "dot" &&
    css`
      width: 28px;
      height: 28px;
      margin: 0;
    `}
`;

const SkeletonTimeline = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 38px;
`;

export function SkeletonCard() {
  return (
    <SkeletonCardRoot aria-label="배송 카드 로딩 중">
      <SkeletonRow>
        <SkeletonBlock $variant="pill" />
        <SkeletonBlock $variant="chip" />
      </SkeletonRow>
      <SkeletonBlock $variant="title" />
      <SkeletonBlock />
      <SkeletonBlock $variant="short" />
      <SkeletonTimeline>
        <SkeletonBlock $variant="dot" />
        <SkeletonBlock $variant="dot" />
        <SkeletonBlock $variant="dot" />
        <SkeletonBlock $variant="dot" />
      </SkeletonTimeline>
    </SkeletonCardRoot>
  );
}
