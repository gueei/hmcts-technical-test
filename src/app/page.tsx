"use client";
import React from "react";
import { TaskList } from "@/components/taskList";
import {store} from '@/lib/client/store';
import {Provider}from 'react-redux';
import {AddNewTaskDialog} from "@/components/addNewTaskDialog";
import { Toaster } from "@/components/ui/sonner"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {

  return (
    <Provider store={store}>
      <h1 className="text-3xl font-bold p-4">Task Management</h1>
    <div className="m-4">
      <main className="flex flex-col gap-[16px] items-center sm:items-start">
        <AddNewTaskDialog/>
        <TaskList/>
      </main>
      <Toaster/>
    </div>
    </Provider> 
  );
}
