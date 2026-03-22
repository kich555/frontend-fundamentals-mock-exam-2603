import { css } from '@emotion/react';
import { useMemo, useState } from 'react';
import { useSuspenseQueries } from '@tanstack/react-query';
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { roomsQueryOptions, reservationsQueryOptions } from 'pages/queryOptions';
import { HOUR_LABELS, TOTAL_MINUTES } from 'pages/constants';
import { timeToMinutes, groupByRoomId } from 'pages/utils';
import { ReservationBlock } from './ReservationBlock';

export function TimelineSection({ date }: { date: string }) {
  const [{ data: rooms }, { data: reservations }] = useSuspenseQueries({
    queries: [roomsQueryOptions, reservationsQueryOptions(date)],
  });
  const [activeReservation, setActiveReservation] = useState<string | null>(null);

  const reservationsByRoom = useMemo(() => groupByRoomId(reservations), [reservations]);

  return (
    <div
      css={css`
        padding: 0 24px;
      `}
    >
      <Text typography="t5" fontWeight="bold" color={colors.grey900}>
        예약 현황
      </Text>
      <Spacing size={16} />

      <div
        css={css`
          background: ${colors.grey50};
          border-radius: 14px;
          padding: 16px;
        `}
      >
        {/* 시간 헤더 */}
        <div
          css={css`
            display: flex;
            align-items: flex-end;
            margin-bottom: 8px;
          `}
        >
          <div
            css={css`
              width: 80px;
              flex-shrink: 0;
              padding-right: 8px;
            `}
          />
          <div
            css={css`
              flex: 1;
              position: relative;
              height: 18px;
            `}
          >
            {HOUR_LABELS.map(time => {
              const left = (timeToMinutes(time) / TOTAL_MINUTES) * 100;
              return (
                <Text
                  key={time}
                  typography="t7"
                  fontWeight="regular"
                  color={colors.grey400}
                  css={css`
                    position: absolute;
                    left: ${left}%;
                    transform: translateX(-50%);
                    font-size: 10px;
                    letter-spacing: -0.3px;
                  `}
                >
                  {time.slice(0, 2)}
                </Text>
              );
            })}
          </div>
        </div>

        {/* 회의실별 타임라인 */}
        {rooms.map((room, index) => (
          <div
            key={room.id}
            css={css`
              display: flex;
              align-items: center;
              height: 32px;
              ${index > 0 ? 'margin-top: 4px;' : ''}
            `}
          >
            <div
              css={css`
                width: 80px;
                flex-shrink: 0;
                padding-right: 8px;
              `}
            >
              <Text
                typography="t7"
                fontWeight="medium"
                color={colors.grey700}
                ellipsisAfterLines={1}
                css={css`
                  font-size: 12px;
                `}
              >
                {room.name}
              </Text>
            </div>
            <div
              css={css`
                flex: 1;
                height: 24px;
                background: ${colors.white};
                border-radius: 6px;
                position: relative;
                overflow: visible;
              `}
            >
              {(reservationsByRoom.get(room.id) ?? []).map(res => (
                <ReservationBlock
                  key={res.id}
                  reservation={res}
                  roomName={room.name}
                  isActive={activeReservation === res.id}
                  onToggle={() => setActiveReservation(activeReservation === res.id ? null : res.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
