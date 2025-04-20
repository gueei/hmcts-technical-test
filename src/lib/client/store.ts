import { configureStore } from '@reduxjs/toolkit'
import { taskApi } from './services'
import { apiErrorMiddleware } from './apiErrorMiddleware';

export const store = configureStore({
    reducer: {
        [taskApi.reducerPath] : taskApi.reducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(taskApi.middleware, apiErrorMiddleware),  
  });