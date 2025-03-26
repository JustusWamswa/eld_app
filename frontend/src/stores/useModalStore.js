import { create } from 'zustand'

export const useModalStore = create((set) => ({
    newTripOpen: false,
    setNewTripOpen: (newValue) => set({newTripOpen: newValue}),
}))