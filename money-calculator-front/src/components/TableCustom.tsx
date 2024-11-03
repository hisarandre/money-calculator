import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableCustomProps {
  columns: string[];
  data: Record<string, any>[];
  total?: number;
}


const TableCustom: React.FC<TableCustomProps> =  ({ columns, data, total }) => {

  const lastColIndex = columns.length - 1; 
  const totalPrice = total + "€";

  return (
    <Table>
            <TableHeader>
                <TableRow>
                {columns.map((col, colIndex) => (
                    <TableHead key={col} className={colIndex === lastColIndex ? 'text-right' : ''}>
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                    </TableHead>
                ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((row) => (
                <TableRow key={row._id}>
                    {columns.map((col, index) => (
                    <TableCell key={col} className={index === lastColIndex ? 'text-right' : ''}>
                        {row[col]}
                    </TableCell>
                    ))}
                </TableRow>
                ))}
            </TableBody>
            {total && (
                <TableFooter>
                    <TableRow>
                    <TableCell colSpan={columns.length - 1}>Total</TableCell>
                    <TableCell className="text-right">{totalPrice}</TableCell>
                    </TableRow>
                </TableFooter>
            )}
            </Table>
  )
}

export default TableCustom
