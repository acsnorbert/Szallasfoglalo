export interface Message {
    severity: 'info' | 'warning' | 'danger' | 'success';
    title: string;
    message: string;
    icon?: string;
  }
  