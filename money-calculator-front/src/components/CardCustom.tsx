import React, {ReactNode} from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button.tsx";
import {Plus} from "lucide-react";

interface CardProps {
    title: string;
    description?: string;
    addAction?: () => void;
    children: ReactNode;
    footer?: string;
    className?: string;
}

const CardCustom: React.FC<CardProps> = ({title, description, addAction, children, footer, className}) => {
    return (
        <Card className={className}>
            <CardHeader>
                <div className="space-y-1.5">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>

                {addAction && (
                    <Button variant="outline" size="icon" onClick={() => addAction && addAction()}>
                        <Plus className="h-4 w-4"/>
                        <span className="sr-only">Add</span>
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {footer && (
                <CardFooter>
                    {footer}
                </CardFooter>
            )
            }
        </Card>
    );
}

export default CardCustom
