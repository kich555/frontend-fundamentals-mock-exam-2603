import { css, keyframes } from '@emotion/react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { useToastState } from './ToastContext';

const slideIn = keyframes`
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export function ToastBanner() {
  const toast = useToastState();

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      css={css`
        position: fixed;
        top: 16px;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 48px);
        max-width: 432px;
        z-index: 1000;
        animation: ${slideIn} 0.25s ease-out;
      `}
    >
      <div
        css={css`
          padding: 12px 16px;
          border-radius: 12px;
          background: ${toast.type === 'success' ? colors.blue50 : colors.red50};
          border: 1px solid ${toast.type === 'success' ? colors.blue200 : colors.red200};
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        `}
      >
        <Text
          typography="t7"
          fontWeight="medium"
          color={toast.type === 'success' ? colors.blue600 : colors.red500}
        >
          {toast.text}
        </Text>
      </div>
    </div>
  );
}
