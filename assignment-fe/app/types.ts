export interface ITodo {
  id: number
  type: TaskType.TODO
  attributes: {
    title: string
    status: TaskStatus
    createdAt: string
  }
  relationships: {
    subtasks: {
      data: []
    }
  }
}

export interface ISubtask {
  id: number
  type: TaskType.SUBTASK
  attributes: {
    title: string
    status: TaskStatus
    createdAt: string
  }
}

export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export enum TaskType {
  TODO = 'todo',
  SUBTASK = 'subtask',
}
