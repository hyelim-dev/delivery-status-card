export const statusTone = {
  'status-ready': {
    accent: 'var(--status-ready)',
    bg: 'var(--status-ready-bg)',
    line: 'var(--status-ready-line)',
  },
  'status-transit': {
    accent: 'var(--status-transit)',
    bg: 'var(--status-transit-bg)',
    line: 'var(--status-transit-line)',
  },
  'status-delivered': {
    accent: 'var(--status-delivered)',
    bg: 'var(--status-delivered-bg)',
    line: 'var(--status-delivered-line)',
  },
  'status-delayed': {
    accent: 'var(--status-delayed)',
    bg: 'var(--status-delayed-bg)',
    line: 'var(--status-delayed-line)',
  },
  'status-returned': {
    accent: 'var(--status-returned)',
    bg: 'var(--status-returned-bg)',
    line: 'var(--status-returned-line)',
  },
} as const;

export const summaryTone = {
  'summary-total': { accent: '#154b86', bg: '#f4f8fd', line: '#c7d7eb' },
  ...statusTone,
} as const;

export const filterTone = {
  'filter-all': '#154b86',
  'status-ready': 'var(--status-ready)',
  'status-transit': 'var(--status-transit)',
  'status-delivered': 'var(--status-delivered)',
  'status-delayed': 'var(--status-delayed)',
  'status-returned': 'var(--status-returned)',
} as const;

export type StatusToneKey = keyof typeof statusTone;
export type SummaryToneKey = keyof typeof summaryTone;
export type FilterToneKey = keyof typeof filterTone;

export const getStatusTone = (toneClass: string) =>
  statusTone[toneClass as StatusToneKey] ?? statusTone['status-ready'];

export const getSummaryTone = (toneClass: string) =>
  summaryTone[toneClass as SummaryToneKey] ?? summaryTone['status-ready'];

export const getFilterTone = (toneClass: string) =>
  filterTone[toneClass as FilterToneKey] ?? filterTone['filter-all'];
