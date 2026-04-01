import { css, keyframes } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const skeletonBar = css`
  background: ${colors.grey100};
  background-image: linear-gradient(90deg, ${colors.grey100} 0px, ${colors.grey50} 40px, ${colors.grey100} 80px);
  background-size: 200px 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
  border-radius: 6px;
`;

export function TimelineSkeleton() {
  return (
    <div css={css`padding: 0 24px;`}>
      <div css={css`${skeletonBar}; width: 80px; height: 20px; margin-bottom: 16px;`} />
      <div css={css`background: ${colors.grey50}; border-radius: 14px; padding: 16px;`}>
        {[0, 1, 2].map(i => (
          <div key={i} css={css`display: flex; align-items: center; height: 32px; ${i > 0 ? 'margin-top: 4px;' : ''}`}>
            <div css={css`${skeletonBar}; width: 64px; height: 14px; margin-right: 8px; flex-shrink: 0;`} />
            <div css={css`${skeletonBar}; flex: 1; height: 24px;`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MyReservationsSkeleton() {
  return (
    <div css={css`padding: 0 24px;`}>
      <div css={css`${skeletonBar}; width: 60px; height: 20px; margin-bottom: 16px;`} />
      {[0, 1].map(i => (
        <div
          key={i}
          css={css`
            padding: 14px 16px;
            border-radius: 14px;
            background: ${colors.grey50};
            border: 1px solid ${colors.grey200};
            ${i > 0 ? 'margin-top: 10px;' : ''}
          `}
        >
          <div css={css`${skeletonBar}; width: 120px; height: 16px; margin-bottom: 8px;`} />
          <div css={css`${skeletonBar}; width: 200px; height: 14px;`} />
        </div>
      ))}
    </div>
  );
}
