import { css } from '@emotion/react';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
import { Top, Spacing, Border, Button } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { logSectionError } from 'utils/errorLogging';
import { DateTimelineSection } from './DateTimelineSection';
import { MyReservationsSection } from './MyReservationsSection';
import { MyReservationsSkeleton } from './Skeletons';

export function ReservationStatusPage() {
  const navigate = useNavigate();

  return (
    <div
      css={css`
        background: ${colors.white};
        padding-bottom: 40px;
      `}
    >
      <Top.Top03
        css={css`
          padding-left: 24px;
          padding-right: 24px;
        `}
      >
        회의실 예약
      </Top.Top03>

      <Spacing size={24} />

      <ErrorBoundary fallbackRender={() => null} onError={(error, info) => logSectionError('날짜 타임라인', error, info)}>
        <DateTimelineSection />
      </ErrorBoundary>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 내 예약 목록 */}
      <ErrorBoundary fallbackRender={() => null} onError={(error, info) => logSectionError('내 예약 목록', error, info)}>
        <Suspense fallback={<MyReservationsSkeleton />}>
          <MyReservationsSection />
        </Suspense>
      </ErrorBoundary>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약하기 버튼 */}
      <div css={css`padding: 0 24px;`}>
        <Button display="full" onClick={() => navigate('/booking')}>
          예약하기
        </Button>
      </div>
      <Spacing size={24} />
    </div>
  );
}
