import { create } from 'zustand';

// Определяем тип состояния
interface CounterState {
  count: boolean;
  increment: () => void;
}

// Создаем хранилище
const useCounterStore = create<CounterState>((set) => ({
  count: false,
  increment: () => set((state) => ({
    count: !state.count
   })),
}));

export default useCounterStore;