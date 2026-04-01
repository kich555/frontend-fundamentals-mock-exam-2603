import { css } from '@emotion/react';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuspenseQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Text, Spacing } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { createReservation } from 'pages/remotes';
import { roomsQueryOptions, reservationsQueryOptions, myReservationsQueryOptions } from 'pages/queryOptions';
import { useToast } from '../../ToastContext';
import { groupByRoomId } from 'pages/utils';
import { MESSAGES } from 'pages/messages';
import type { BookingFilter } from './BookingFilterSection';
import { RoomCard } from './RoomCard';
import axios from 'axios';

function hasMessage(value: unknown): value is { message: string } {
  return value != null && typeof value === 'object' && 'message' in value && typeof (value as { message: unknown }).message === 'string';
}

export function AvailableRoomsSection({ filter }: { filter: BookingFilter }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { date, startTime, endTime, attendees, equipment, preferredFloor } = filter;

  const [{ data: rooms }, { data: reservations }] = useSuspenseQueries({
    queries: [roomsQueryOptions, reservationsQueryOptions(date)],
  });

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  // 필터 변경 시 선택 초기화
  useEffect(() => {
    setSelectedRoomId(null);
  }, [date, startTime, endTime, attendees, equipment, preferredFloor]);

  const reservationsByRoom = useMemo(() => groupByRoomId(reservations), [reservations]);

  const availableRooms = rooms
    .filter(room => {
      if (room.capacity < attendees) return false;
      if (!equipment.every(eq => room.equipment.includes(eq))) return false;
      if (preferredFloor !== null && room.floor !== preferredFloor) return false;
      const hasConflict = (reservationsByRoom.get(room.id) ?? []).some(
        r => r.date === date && r.start < endTime && r.end > startTime
      );
      return !hasConflict;
    })
    .sort((a, b) => {
      if (a.floor !== b.floor) return a.floor - b.floor;
      return a.name.localeCompare(b.name);
    });

  const createMutation = useMutation((data: Parameters<typeof createReservation>[0]) => createReservation(data), {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: reservationsQueryOptions(variables.date).queryKey });
      queryClient.invalidateQueries({ queryKey: myReservationsQueryOptions.queryKey });
    },
  });

  const handleBook = async () => {
    if (!selectedRoomId) {
      showToast({ type: 'error', text: MESSAGES.BOOKING_NO_ROOM_SELECTED });
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        roomId: selectedRoomId,
        date,
        start: startTime,
        end: endTime,
        attendees,
        equipment,
      });

      if (result.ok) {
        showToast({ type: 'success', text: MESSAGES.BOOKING_SUCCESS });
        navigate('/');
        return;
      }

      showToast({ type: 'error', text: result.message ?? MESSAGES.BOOKING_FAILED });
      setSelectedRoomId(null);
    } catch (err) {
      let serverMessage: string = MESSAGES.BOOKING_FAILED;
      if (axios.isAxiosError(err) && hasMessage(err.response?.data)) {
        serverMessage = err.response.data.message;
      }
      showToast({ type: 'error', text: serverMessage });
      setSelectedRoomId(null);
    }
  };

  return (
    <div
      css={css`
        padding: 0 24px;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: baseline;
          gap: 6px;
        `}
      >
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 가능 회의실
        </Text>
        <Text typography="t7" fontWeight="medium" color={colors.grey500}>
          {availableRooms.length}개
        </Text>
      </div>
      <Spacing size={16} />

      {availableRooms.length === 0 ? (
        <div
          css={css`
            padding: 40px 0;
            text-align: center;
            background: ${colors.grey50};
            border-radius: 14px;
          `}
        >
          <Text typography="t6" color={colors.grey500}>
            조건에 맞는 회의실이 없습니다.
          </Text>
        </div>
      ) : (
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 10px;
          `}
        >
          {availableRooms.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              isSelected={selectedRoomId === room.id}
              onSelect={() => setSelectedRoomId(room.id)}
            />
          ))}
        </div>
      )}

      <Spacing size={16} />
      <Button display="full" onClick={handleBook} disabled={createMutation.isLoading}>
        {createMutation.isLoading ? '예약 중...' : '확정'}
      </Button>
    </div>
  );
}
