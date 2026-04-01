import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { formatDate } from 'pages/utils';
import { MESSAGES } from 'pages/messages';
import type { Equipment } from '_tosslib/server/types';
import type { BookingFilter } from './BookingFilterSection';

function parseFilter(params: URLSearchParams): BookingFilter {
  return {
    date: params.get('date') || formatDate(new Date()),
    startTime: params.get('startTime') || '',
    endTime: params.get('endTime') || '',
    attendees: Number(params.get('attendees')) || 1,
    equipment: params.get('equipment') ? params.get('equipment')!.split(',').filter(Boolean) as Equipment[] : [],
    preferredFloor: params.get('floor') ? Number(params.get('floor')) : null,
  };
}

function serializeFilter(filter: BookingFilter): Record<string, string> {
  const params: Record<string, string> = {};
  if (filter.date) params.date = filter.date;
  if (filter.startTime) params.startTime = filter.startTime;
  if (filter.endTime) params.endTime = filter.endTime;
  if (filter.attendees > 1) params.attendees = String(filter.attendees);
  if (filter.equipment.length > 0) params.equipment = filter.equipment.join(',');
  if (filter.preferredFloor !== null) params.floor = String(filter.preferredFloor);
  return params;
}

function validateFilter(filter: BookingFilter) {
  const hasTimeInputs = filter.startTime !== '' && filter.endTime !== '';
  if (!hasTimeInputs) return { validationError: null, isFilterComplete: false };
  if (filter.endTime <= filter.startTime) return { validationError: MESSAGES.VALIDATION_END_BEFORE_START, isFilterComplete: false };
  if (filter.attendees < 1) return { validationError: MESSAGES.VALIDATION_MIN_ATTENDEES, isFilterComplete: false };
  return { validationError: null, isFilterComplete: true };
}

// NOTE: searchParams를 SSOT로
export function useBookingFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filter = useMemo(() => parseFilter(searchParams), [searchParams]);

  const updateFilter = useCallback(
    (patch: Partial<BookingFilter>) => {
      setSearchParams(prev => serializeFilter({ ...parseFilter(prev), ...patch }), { replace: true });
    },
    [setSearchParams]
  );

  const { validationError, isFilterComplete } = validateFilter(filter);

  return { filter, updateFilter, validationError, isFilterComplete };
}
