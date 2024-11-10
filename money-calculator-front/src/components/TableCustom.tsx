import React from "react";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Trash, Edit, MoreHorizontal} from "lucide-react";

interface TableCustomProps {
    columns: string[];
    data: Record<string, any>[];
    total?: number;
    showFooter?: boolean;
    canDelete?: boolean;
    canEdit?: boolean;
    onDelete?: any;
    onEdit?: any;
}

const TableCustom: React.FC<TableCustomProps> = ({
    columns,
    data,
    total,
    showFooter = false,
    canDelete = false,
    canEdit = false,
    onDelete,
    onEdit,
}) => {
    const lastColIndex = columns.length - 1;
    const totalPrice = `${total} €`;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((col, colIndex) => (
                        <TableHead key={`${col}-${colIndex}`} className={colIndex === lastColIndex ? "text-right" : ""}>
                            {col.charAt(0).toUpperCase() + col.slice(1)}
                        </TableHead>
                    ))}
                    {(canEdit || canDelete) && <TableHead></TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((row, rowIndex) => (
                    <TableRow key={row.id || `row-${rowIndex}`}>
                        {columns.map((col, colIndex) => (
                            <TableCell key={`${col}-${rowIndex}-${colIndex}`}
                                       className={colIndex === lastColIndex ? "text-right" : ""}>
                                {row[col]}
                            </TableCell>
                        ))}
                        {(canEdit || canDelete) && (
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        {canEdit && (
                                            <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit(row)}>
                                                <Edit className="h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                        )}
                                        {canDelete && (
                                            <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground" onClick={() => onDelete(row.id)}>
                                                <Trash className="h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
            {showFooter && (
                <TableFooter>
                    <TableRow>
                        <TableCell
                            colSpan={canEdit || canDelete ? columns.length : columns.length - 1}>Total</TableCell>
                        <TableCell className="text-right">{totalPrice}</TableCell>
                    </TableRow>
                </TableFooter>
            )}
        </Table>
    );
};

export default TableCustom;
