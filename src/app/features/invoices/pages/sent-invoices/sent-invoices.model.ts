import { Params, ParamMap } from '@angular/router';

export type SentInvoiceStatusFilter = 'all' | 'pending' | 'paid';

export type SentInvoiceSort =
  | 'createdAt-desc'
  | 'createdAt-asc'
  | 'paymentDue-asc'
  | 'total-desc'
  | 'total-asc'
  | 'clientName-asc';

export type SentInvoiceFilters = {
  search: string;
  status: SentInvoiceStatusFilter;
  dateFrom: string;
  dateTo: string;
  minTotal: string;
  maxTotal: string;
  sort: SentInvoiceSort;
};

export const DEFAULT_SENT_INVOICE_FILTERS: SentInvoiceFilters = {
  search: '',
  status: 'all',
  dateFrom: '',
  dateTo: '',
  minTotal: '',
  maxTotal: '',
  sort: 'createdAt-desc'
};

const allowedStatuses = new Set<SentInvoiceStatusFilter>([
  'all',
  'pending',
  'paid'
]);

const allowedSorts = new Set<SentInvoiceSort>([
  'createdAt-desc',
  'createdAt-asc',
  'paymentDue-asc',
  'total-desc',
  'total-asc',
  'clientName-asc'
]);

export function parseSentInvoiceFilters(params: ParamMap): SentInvoiceFilters {
  const status = params.get('status') as SentInvoiceStatusFilter | null;
  const sort = params.get('sort') as SentInvoiceSort | null;

  return {
    search: (params.get('q') ?? '').trim().slice(0, 100),
    status: status && allowedStatuses.has(status) ? status : 'all',
    dateFrom: normalizeDate(params.get('from')),
    dateTo: normalizeDate(params.get('to')),
    minTotal: normalizeAmount(params.get('min')),
    maxTotal: normalizeAmount(params.get('max')),
    sort: sort && allowedSorts.has(sort) ? sort : 'createdAt-desc'
  };
}

export function serializeSentInvoiceFilters(
  filters: SentInvoiceFilters
): Params {
  const queryParams: Params = {};
  const search = filters.search.trim();

  if (search) queryParams['q'] = search;
  if (filters.status !== 'all') queryParams['status'] = filters.status;
  if (filters.dateFrom) queryParams['from'] = filters.dateFrom;
  if (filters.dateTo) queryParams['to'] = filters.dateTo;
  if (filters.minTotal) queryParams['min'] = filters.minTotal;
  if (filters.maxTotal) queryParams['max'] = filters.maxTotal;
  if (filters.sort !== 'createdAt-desc') queryParams['sort'] = filters.sort;

  return queryParams;
}

export function getSentInvoiceFilterError(
  filters: SentInvoiceFilters
): string | null {
  if (
    filters.dateFrom
    && filters.dateTo
    && filters.dateFrom > filters.dateTo
  ) {
    return 'La data iniziale non può essere successiva alla data finale.';
  }

  const minTotal = parseAmount(filters.minTotal);
  const maxTotal = parseAmount(filters.maxTotal);

  if (minTotal !== null && maxTotal !== null && minTotal > maxTotal) {
    return "L’importo minimo non può superare l’importo massimo.";
  }

  return null;
}

export function countActiveSentInvoiceFilters(
  filters: SentInvoiceFilters
): number {
  return [
    filters.search,
    filters.status !== 'all' ? filters.status : '',
    filters.dateFrom,
    filters.dateTo,
    filters.minTotal,
    filters.maxTotal
  ].filter(Boolean).length;
}

function normalizeDate(value: string | null): string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return '';
  }

  const parsedDate = new Date(`${value}T00:00:00Z`);

  return !Number.isNaN(parsedDate.getTime())
    && parsedDate.toISOString().slice(0, 10) === value
      ? value
      : '';
}

function normalizeAmount(value: string | null): string {
  const parsedValue = parseAmount(value ?? '');

  return parsedValue !== null ? String(parsedValue) : '';
}

function parseAmount(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) && parsedValue >= 0
    ? parsedValue
    : null;
}
