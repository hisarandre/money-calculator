import React, { ReactNode } from 'react';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

  interface DialogProps {
    title: string;
    description?: string;
    children: ReactNode;
    buttonText: string;
  }


const DialogCustom: React.FC<DialogProps> = ({ buttonText, title, description, children }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">{buttonText}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>
                    {description}
                </DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
        )
}

export default DialogCustom
