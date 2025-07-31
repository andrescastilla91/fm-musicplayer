export interface AlertDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export interface NotificationData {
  type: 'success' | 'error' | 'info';
  message: string;
}