import { css } from '@emotion/react';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Spacing, Button, Text, ListRow } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { cancelReservation } from 'pages/remotes';
import { roomsQueryOptions, reservationsQueryKey, myReservationsQueryOptions } from 'pages/queryOptions';
import { EQUIPMENT_LABELS } from 'pages/constants';
import { MESSAGES } from 'pages/messages';
import { useToast } from '../../ToastContext';

export function MyReservationsSection() {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const [{ data: rooms }, { data: myReservationList }] = useSuspenseQueries({
    queries: [roomsQueryOptions, myReservationsQueryOptions],
  });

  const getRoomName = (roomId: string) =>
    rooms.find(r => r.id === roomId)?.name ?? roomId;

  const cancelMutation = useMutation((id: string) => cancelReservation(id), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationsQueryKey });
      queryClient.invalidateQueries({ queryKey: myReservationsQueryOptions.queryKey });
    },
  });

  const handleCancel = async (id: string) => {
    try {
      await cancelMutation.mutateAsync(id);
      showToast({ type: 'success', text: MESSAGES.CANCEL_SUCCESS });
    } catch {
      showToast({ type: 'error', text: MESSAGES.CANCEL_FAILED });
    }
  };

  return (
    <div css={css`padding: 0 24px;`}>
      <div css={css`display: flex; align-items: baseline; gap: 6px;`}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          내 예약
        </Text>
        {myReservationList.length > 0 && (
          <Text typography="t7" fontWeight="medium" color={colors.grey500}>
            {myReservationList.length}건
          </Text>
        )}
      </div>
      <Spacing size={16} />

      {myReservationList.length === 0 ? (
        <div
          css={css`
            padding: 40px 0;
            text-align: center;
            background: ${colors.grey50};
            border-radius: 14px;
          `}
        >
          <Text typography="t6" color={colors.grey500}>
            예약 내역이 없습니다.
          </Text>
        </div>
      ) : (
        <div css={css`display: flex; flex-direction: column; gap: 10px;`}>
          {myReservationList.map(res => (
              <div
                key={res.id}
                css={css`
                  padding: 14px 16px;
                  border-radius: 14px;
                  background: ${colors.grey50};
                  border: 1px solid ${colors.grey200};
                `}
              >
                <ListRow
                  contents={
                    <ListRow.Text2Rows
                      top={getRoomName(res.roomId)}
                      topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                      bottom={`${res.date} ${res.start}~${res.end} · ${res.attendees}명 · ${
                        res.equipment.map(e => EQUIPMENT_LABELS[e]).join(', ') || '장비 없음'
                      }`}
                      bottomProps={{ typography: 't7', color: colors.grey600 }}
                    />
                  }
                  right={
                    <Button
                      type="danger"
                      style="weak"
                      size="small"
                      onClick={e => {
                        e.stopPropagation();
                        if (window.confirm('정말 취소하시겠습니까?')) {
                          handleCancel(res.id);
                        }
                      }}
                    >
                      취소
                    </Button>
                  }
                />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
