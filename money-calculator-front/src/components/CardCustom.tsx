import {ReactNode} from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button.tsx";
import {ChevronLeft, ChevronRight, Pencil, Plus} from "lucide-react";

interface CardProps {
    title: string;
    description?: string;
    addAction?: () => void;
    editAction?: () => void;
    previousWeekAction?: () => void;
    nextWeekAction?: () => void;
    isPreviousAvailable?: boolean;
    isNextAvailable?: boolean;
    children: ReactNode;
    footer?: string;
    className?: string;
}

const CardCustom: React.FC<CardProps> = ({
    title,
    description,
    addAction,
    editAction,
    previousWeekAction,
    nextWeekAction,
    isPreviousAvailable,
    isNextAvailable,
    children,
    footer,
    className
}) => {
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

                {editAction && (
                    <Button variant="outline" size="icon" onClick={() => editAction && editAction()}>
                        <Pencil className="h-4 w-4"/>
                        <span className="sr-only">Edit</span>
                    </Button>
                )}

                {isPreviousAvailable && previousWeekAction && (
                    <Button variant="outline" size="icon" onClick={() => previousWeekAction && previousWeekAction()}>
                        <ChevronLeft className="h-4 w-4"/>
                        <span className="sr-only">Previous week</span>
                    </Button>
                )}

                {isNextAvailable && nextWeekAction && (
                    <Button variant="outline" size="icon" onClick={() => nextWeekAction && nextWeekAction()}>
                        <ChevronRight className="h-4 w-4"/>
                        <span className="sr-only">Next week</span>
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
