import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {Status} from '@/models/taskModels'
import {ICreateTask, ITask} from "@/models/taskModels";

// Define a service using a base URL and expected endpoints
export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['tasks'],
  endpoints: (build) => ({
    getAllTasks: build.query<ITask[], void>({
      query: () => ``,
      providesTags: [{type: 'tasks', id: 'LIST'}],
    }),
    getTaskById: build.query<ITask, string>({
      query: (id: string) => `/${id}`,
      providesTags: (_result, _error, arg) => [{type: 'tasks', id: arg}],
    }),
    updateTask: build.mutation<ITask, ITask>({
      query: (task: ITask) => ({
        method: 'POST',
        url: `/${task.id}`,
        body: {
          ...task,
        }
      }),
      invalidatesTags: (_result, _error, arg: ITask) => [{type: 'tasks', id: arg.id}, {type: 'tasks', id: 'LIST'}]
    }),
    deleteTask: build.mutation<void, string>({
      query: (id: string) => ({
        method: 'DELETE',
        url: `/${id}`
      }),
      invalidatesTags: [{ type: 'tasks', id: 'LIST' }],
    }),
    newTask: build.mutation({
      query: (newTask: ICreateTask) => ({
        method: 'PUT',
        url: '',
        body: {
          ...newTask,
          status: Status.INCOMPLETE
        }
      }),
      invalidatesTags: [{ type: 'tasks', id: 'LIST' }],
    })
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllTasksQuery, useNewTaskMutation, useGetTaskByIdQuery, useUpdateTaskMutation, useDeleteTaskMutation } = taskApi