import create from 'zustand'
import { createTodoSlice, TodoSlice } from './slices/createTodoSlice'

type StoreState = TodoSlice

export const useAppStore = create<StoreState>()((...a) => ({
  ...createTodoSlice(...a),
}))
