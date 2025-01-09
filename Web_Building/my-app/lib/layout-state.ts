import { create } from 'zustand'
import { createContext, useContext, useState } from 'react'

interface LayoutState {
  isSidebarOpen: boolean
  isRightSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  setRightSidebarOpen: (open: boolean) => void
}

export const useLayoutState = create<LayoutState>()((set) => ({
  isSidebarOpen: true,
  isRightSidebarOpen: true,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setRightSidebarOpen: (open) => set({ isRightSidebarOpen: open })
}))