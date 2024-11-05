import React from "react";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";

interface TableCustomProps {
  columns: string[];
  data: Record<string, any>[];
  total?: number;
  canDelete?: boolean;
  canEdit?: boolean;
  onDelete?: any;
  onEdit?: any;
}

const TableCustom: React.FC<TableCustomProps> = ({ columns, data, total, canDelete = false, canEdit = false, onDelete, onEdit }) => {
  const lastColIndex = columns.length - 1;
  const totalPrice = `${total}€`;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col, colIndex) => (
            <TableHead key={col} className={colIndex === lastColIndex ? "text-right" : ""}>
              {col.charAt(0).toUpperCase() + col.slice(1)}
            </TableHead>
          ))}
          {(canEdit || canDelete) && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row._id}>
            {columns.map((col, index) => (
              <TableCell key={col} className={index === lastColIndex ? "text-right" : ""}>
                {row[col]}
              </TableCell>
            ))}
            {(canEdit || canDelete) && (
              <TableCell>
                <div className="flex space-x-2">
                  {canEdit && (
                    <Button variant="ghost" size="icon" onClick={() => onEdit(row)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  )}
                  {canDelete && (
                    <Button variant="ghost" size="icon" onClick={() => onDelete(row._id)}>
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  )}
                </div>
              </TableCell>
            )}
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
  );
};

export default TableCustom;
