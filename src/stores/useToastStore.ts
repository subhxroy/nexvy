import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface ToastStore {
  visible: boolean;
  message: string;
  type: ToastType;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  visible: false,
  message: '',
  type: 'info',
  showToast: (message, type = 'info') => {
    // Hide first if already showing to refresh the UI
    set({ visible: false });
    setTimeout(() => {
      set({ visible: true, message, type });
    }, 50);
  },
  hideToast: () => set({ visible: false }),
}));
