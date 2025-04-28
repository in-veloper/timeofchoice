import { create } from 'zustand'

interface OptionStoreState {
    options: string[]
    setOptions: (options: string[]) => void
    resetOptions: () => void
}

export const useOptionStore = create<OptionStoreState>((set) => ({
    options: [],
    setOptions: (options) => set({ options }),
    resetOptions: () => set({ options: [] })
}))
