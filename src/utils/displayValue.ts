export const EMPTY_VALUE_TEXT = "-";
export const EMPTY_MEMO_TEXT = "등록된 메모가 없습니다.";
export const EMPTY_HISTORY_TEXT = "배송 이동 이력이 없습니다.";

export const isEmptyValue = (value?: string | null) =>
  value === null || value === undefined || value.trim() === "";

export const displayValue = (value?: string | null) => {
  if (value === null || value === undefined || value.trim() === "") {
    return EMPTY_VALUE_TEXT;
  }

  return value.trim();
};

export const displayMemo = (memo?: string | null) => {
  if (memo === null || memo === undefined || memo.trim() === "") {
    return EMPTY_MEMO_TEXT;
  }

  return memo.trim();
};
