import React, { ReactNode } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

interface CardProps {
    title: string;
    description?: string;
    children: ReactNode;
    footer?: string;
  }

const CardCustom: React.FC<CardProps> = ({ title, description, children, footer }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            { footer && (
                <CardFooter>
                    {footer}
                </CardFooter>
            )
            }
            </Card>
        );
}

export default CardCustom
