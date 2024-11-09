import React, {ReactNode} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface DialogProps {
    title: string;
    description?: string;
    children: ReactNode;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    preventOutsideInteraction?: boolean;
}

const DialogCustom: React.FC<DialogProps> = ({title, description, children, isOpen, onOpenChange, preventOutsideInteraction = false}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[425px]"
                onInteractOutside={(e) => preventOutsideInteraction ? e.preventDefault() : true}
            >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
};

export default DialogCustom;
