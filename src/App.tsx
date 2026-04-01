import normalize from 'emotion-normalize';
import { css, Global } from '@emotion/react';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClient, QueryClientConfig, QueryClientProvider } from '@tanstack/react-query';
import { GlobalPortal } from './GlobalPortal';
import { ToastProvider } from './ToastContext';
import { ToastBanner } from './ToastBanner';

import '_tosslib/sass/app.scss';
import { PageLayout } from 'pages/PageLayout';
import { Routes } from 'pages/Routes';
import { logSectionError } from 'utils/errorLogging';

const clientOptions: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
};

export default function App() {
  const [queryClient] = useState(() => new QueryClient(clientOptions));

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalPortal.Provider>
        <Global
          styles={css`
            ${normalize}
            h1, h2, h3, h4, h5, h6 {
              font-size: 1em;
              font-weight: normal;
              margin: 0; /* or '0 0 1em' if you're so inclined */
            }
          `}
        />
        <ToastProvider>
          <PageLayout>
            <ErrorBoundary fallbackRender={() => null} onError={(error, info) => logSectionError('앱', error, info)}>
              <Routes />
            </ErrorBoundary>
            <ToastBanner />
          </PageLayout>
        </ToastProvider>
      </GlobalPortal.Provider>
    </QueryClientProvider>
  );
}
