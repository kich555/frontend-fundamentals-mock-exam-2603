import type { ErrorInfo } from 'react';

// TODO: 실제 로깅 연결 (Sentry 등)
export function logSectionError(sectionName: string, error: unknown, info: ErrorInfo) {
  console.error(`[${sectionName}] 에러 발생:`, error, info.componentStack);
}
