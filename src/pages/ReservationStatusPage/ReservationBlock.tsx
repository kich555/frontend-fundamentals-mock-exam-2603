import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';
import { EQUIPMENT_LABELS, TOTAL_MINUTES } from 'pages/constants';
import { timeToMinutes } from 'pages/utils';
import type { Reservation } from '_tosslib/server/types';

export function ReservationBlock({
  reservation,
  roomName,
  isActive,
  onToggle,
}: {
  reservation: Reservation;
  roomName: string;
  isActive: boolean;
  onToggle: () => void;
}) {
  const left = (timeToMinutes(reservation.start) / TOTAL_MINUTES) * 100;
  const width = ((timeToMinutes(reservation.end) - timeToMinutes(reservation.start)) / TOTAL_MINUTES) * 100;

  return (
    <div
      css={css`
        position: absolute;
        left: ${left}%;
        width: ${width}%;
        height: 100%;
      `}
    >
      <div
        role="button"
        aria-label={`${roomName} ${reservation.start}-${reservation.end} 예약 상세`}
        onClick={onToggle}
        css={css`
          width: 100%;
          height: 100%;
          background: ${colors.blue400};
          border-radius: 4px;
          opacity: ${isActive ? 1 : 0.75};
          cursor: pointer;
          transition: opacity 0.15s;
          &:hover {
            opacity: 1;
          }
        `}
      />
      {isActive && (
        <div
          role="tooltip"
          css={css`
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 6px;
            background: ${colors.grey900};
            color: ${colors.white};
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 10;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
            line-height: 1.6;
          `}
        >
          <div>
            {reservation.start} ~ {reservation.end}
          </div>
          <div>{reservation.attendees}명</div>
          {reservation.equipment.length > 0 && (
            <div>{reservation.equipment.map(e => EQUIPMENT_LABELS[e]).join(', ')}</div>
          )}
        </div>
      )}
    </div>
  );
}
