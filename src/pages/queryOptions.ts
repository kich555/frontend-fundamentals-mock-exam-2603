import { queryOptions } from '@tanstack/react-query';
import * as remotes from 'pages/remotes';

export const roomsQueryOptions = queryOptions({
  queryKey: ['rooms'] as const,
  queryFn: () => remotes.getRooms(),
});

export const reservationsQueryKey = ['reservations'] as const;

export const reservationsQueryOptions = (date: string) =>
  queryOptions({
    queryKey: [...reservationsQueryKey, date] as const,
    queryFn: () => remotes.getReservations(date),
    enabled: !!date,
  });

export const myReservationsQueryOptions = queryOptions({
  queryKey: ['myReservations'] as const,
  queryFn: () => remotes.getMyReservations(),
});
