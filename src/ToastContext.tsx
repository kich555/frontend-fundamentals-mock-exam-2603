import { createContext, PropsWithChildren, useCallback, useContext, useReducer, type ReactNode } from 'react';

export interface Toast {
  type: 'success' | 'error';
  text: string;
}

interface ToastOptions {
  duration?: number;
}

type ShowToast = (toast: Toast, options?: ToastOptions) => void;
type ToastState = Toast | null;
type Action = { kind: 'SHOW'; toast: Toast } | { kind: 'DISMISS' };

function reducer(_state: ToastState, action: Action): ToastState {
  switch (action.kind) {
    case 'SHOW':
      return action.toast;
    case 'DISMISS':
      return null;
  }
}

//NOTE: 전역상태 관리 라이브러리 도입하지 않음
const ToastStateContext = createContext<ToastState>(null);
// NOTE: duration 옵션으로 토스트 자동 dismiss 시간을 조절할 수 있음 (e.g. showToast({ ..., duration: 5000 }))
const ToastDispatchContext = createContext<ShowToast>(() => {});

export function ToastProvider({ children }: PropsWithChildren<unknown>) {
  const [toast, dispatch] = useReducer(reducer, null);

  const showToast = useCallback<ShowToast>((t, options) => {
    dispatch({ kind: 'SHOW', toast: t });

    const duration = options?.duration;
    if (duration !== undefined) {
      setTimeout(() => dispatch({ kind: 'DISMISS' }), duration);
    }
  }, []);

  return (
    <ToastStateContext.Provider value={toast}>
      <ToastDispatchContext.Provider value={showToast}>{children}</ToastDispatchContext.Provider>
    </ToastStateContext.Provider>
  );
}

//NOTE: toast 표시 함수. dispatch만 사용하므로 이 hook을 쓰는 컴포넌트는 toast 상태 변경 시 re-render되지 않는다.
export function useToast() {
  return useContext(ToastDispatchContext);
}

//NOTE: 현재 toast 상태를 구독한다. Toast UI 컴포넌트에서만 사용한다.
export function useToastState() {
  return useContext(ToastStateContext);
}
