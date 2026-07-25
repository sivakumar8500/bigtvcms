export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

export interface ToastDetail {
  message: string;
  severity?: ToastSeverity;
  title?: string;
}

export function showToast(
  message: string,
  severity: ToastSeverity = 'info',
  title?: string
): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<ToastDetail>('app-toast', {
        detail: { message, severity, title },
      })
    );
  }
}
