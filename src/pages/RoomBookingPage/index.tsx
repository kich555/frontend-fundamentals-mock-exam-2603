import { css } from '@emotion/react';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Top, Spacing, Border } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { roomsQueryOptions } from 'pages/queryOptions';
import { logSectionError } from 'utils/errorLogging';
import { BookingFilterSection } from './BookingFilterSection';
import { AvailableRoomsSection } from './AvailableRoomsSection';
import { useBookingFilter } from './useBookingFilter';

export function RoomBookingPage() {
  const navigate = useNavigate();
  const { filter, updateFilter, validationError, isFilterComplete } = useBookingFilter();

  const { data: rooms = [] } = useQuery(roomsQueryOptions);
  const floors = [...new Set(rooms.map(r => r.floor))].sort((a, b) => a - b);

  return (
    <div
      css={css`
        background: ${colors.white};
        padding-bottom: 40px;
      `}
    >
      <div
        css={css`
          padding: 12px 24px 0;
        `}
      >
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="뒤로가기"
          css={css`
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            font-size: 14px;
            color: ${colors.grey600};
            &:hover {
              color: ${colors.grey900};
            }
          `}
        >
          ← 예약 현황으로
        </button>
      </div>
      <Top.Top03
        css={css`
          padding-left: 24px;
          padding-right: 24px;
        `}
      >
        예약하기
      </Top.Top03>

      <Spacing size={24} />

      <ErrorBoundary fallbackRender={() => null} onError={(error, info) => logSectionError('예약 필터', error, info)}>
        <BookingFilterSection filter={filter} onChange={updateFilter} floors={floors} validationError={validationError} />
      </ErrorBoundary>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {isFilterComplete && (
        <ErrorBoundary fallbackRender={() => null} onError={(error, info) => logSectionError('예약 가능한 회의실', error, info)}>
          <Suspense fallback={null}>
            <AvailableRoomsSection filter={filter} />
          </Suspense>
        </ErrorBoundary>
      )}

      <Spacing size={24} />
    </div>
  );
}
