import { StateCreator } from 'zustand'
import { ITodo } from '@/app/types'
import axios from 'axios'

export interface TodoSlice {
  todos: ITodo[]
  setTodos: (todos: ITodo[]) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

export const createTodoSlice: StateCreator<TodoSlice> = (set) => ({
  todos: [],
  setTodos: (todos) => {
    set({ todos: todos })
  },
  loading: false,
  setLoading: (loading) => {
    set({ loading: loading })
  },
})
