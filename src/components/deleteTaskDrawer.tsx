"use client"
import React from "react"
import { Button } from "./ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

export const DeleteTaskDrawer = ({disabled, onClick}: {disabled: boolean, onClick: ()=>{} }) => (
    < Drawer >
        <DrawerTrigger asChild>
            <Button className="col-span-1" type="button" variant="destructive" disabled={disabled}>Delete</Button>
        </DrawerTrigger>
        <DrawerContent className="items-center">
            <DrawerHeader >
                <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                <DrawerDescription>This action cannot be undone.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
                <Button className="w-48" variant="destructive" onClick={onClick}>YES</Button>
                <DrawerClose>
                    <Button variant="link">Not now</Button>
                </DrawerClose>
            </DrawerFooter>
        </DrawerContent>
    </Drawer >
);