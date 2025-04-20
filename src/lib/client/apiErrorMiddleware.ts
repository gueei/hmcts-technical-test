import { isRejectedWithValue } from '@reduxjs/toolkit'
import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit'
import { toast } from "sonner"

/**
 * Log a warning and show a toast!
 */
export const apiErrorMiddleware: Middleware =
  () => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      console.warn("API call failed: ", JSON.stringify(action.error));
      toast("Something went wrong", {
        description: action.error.message,
        action: {
            label: "OK",
            onClick: ()=>{}
        }
      });
    }

    return next(action)
  }