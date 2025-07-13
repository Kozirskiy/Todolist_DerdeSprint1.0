import {createAction, createReducer, nanoid} from '@reduxjs/toolkit'
import type {Task, TasksState} from '../app/App.tsx'
import {createTodolistAC, CreateTodolistAction, deleteTodolistAC, DeleteTodolistAction} from './todolists-reducer'

const initialState: TasksState = {}

// export const tasksReducer = (state: TasksState = initialState, action: Actions): TasksState => {
//     switch (action.type) {
//         case 'delete_task': {
//             return {
//                 ...state,
//                 [action.payload.todolistId]: state[action.payload.todolistId].filter(task => task.id !== action.payload.taskId)
//             }
//         }
//         case 'create_task': {
//             const newTask: Task = {title: action.payload.title, isDone: false, id: nanoid()}
//             return {...state, [action.payload.todolistId]: [newTask, ...state[action.payload.todolistId]]}
//         }
//         case "change_task_status": {
//             return {
//                 ...state,
//                 [action.payload.todolistId]: state[action.payload.todolistId].map(task => task.id === action.payload.taskId ? {
//                     ...task,
//                     isDone: action.payload.isDone
//                 } : task)
//             }
//         }
//         case "change_task_title": {
//             return {
//                 ...state,
//                 [action.payload.todolistId]: state[action.payload.todolistId].map(task => task.id === action.payload.taskId ? {
//                     ...task,
//                     title: action.payload.title
//                 } : task)
//             }
//         }
//         case "create_todolist": {
//             return {...state, [action.payload.id]: []}
//         }
//         case "delete_todolist": {
//             const newState = {...state}
//             delete newState[action.payload.id]
//             return newState
//         }
//         default:
//             return state
//     }
// }

export const createTaskAC = createAction<{todolistId: string, title: string}>('tasks/createTask')
export const deleteTaskAC = createAction<{ todolistId: string, taskId: string }>('tasks/deleteTasks')
export const changeTaskStatusAC = createAction<{todolistId: string, taskId: string, isDone: boolean}>('tasks/changeTaskStatus')
export const changeTaskTitleAC = createAction<{todolistId: string, taskId: string, title: string}>('tasks/changeTaskTitle')

export const tasksReducer = createReducer(initialState, builder => {
    builder
        .addCase(createTodolistAC, (state, action) => {
            state[action.payload.id] = []
        })
        .addCase(deleteTodolistAC, (state, action) => {
            delete state[action.payload.id]
        })

        .addCase(createTaskAC, (state, action) => {
            const newTask: Task = {id: nanoid(), title: action.payload.title, isDone: false}
            state[action.payload.todolistId].unshift(newTask)
        })

        // .addCase(deleteTaskAC, (state, action) => {
        //     const tasks = state[action.payload.todolistId]
        //     state[action.payload.todolistId] = tasks.filter(task => task.id !== action.payload.taskId)
        // })
        // .addCase(deleteTaskAC, (state, action) => {
        //     const tasks = state[action.payload.todolistId]
        //     state[action.payload.todolistId] = tasks.filter(task => task.id !== action.payload.taskId)
        // })
        .addCase(deleteTaskAC, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(task => task.id === action.payload.taskId)
            if (index !== -1) {
                tasks.splice(index, 1)
            }
        })

        .addCase(changeTaskStatusAC, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const task = tasks.find(t => t.id === action.payload.taskId)
            if(task) task.isDone = action.payload.isDone
        })
        .addCase(changeTaskTitleAC, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const task = tasks.find(t => t.id === action.payload.taskId)
            if(task) task.title = action.payload.title
        })

})


// export const changeTaskStatusAC = (payload: { todolistId: string, taskId: string, isDone: boolean }) => {
//     return {type: 'change_task_status', payload} as const
// }
//
// export const changeTaskTitleAC = (payload: { todolistId: string, taskId: string, title: string }) => {
//     return {type: 'change_task_title', payload} as const
// }

export type DeleteTaskAction = ReturnType<typeof deleteTaskAC>
export type CreateTaskAction = ReturnType<typeof createTaskAC>
export type ChangeTaskStatusAction = ReturnType<typeof changeTaskStatusAC>
export type ChangeTaskTitleAction = ReturnType<typeof changeTaskTitleAC>

export type Actions =
    | DeleteTaskAction
    | CreateTaskAction
    | ChangeTaskStatusAction
    | ChangeTaskTitleAction
    | CreateTodolistAction
    | DeleteTodolistAction
