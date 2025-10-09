import React from "react";
import DataTable from "../../components/ui/DataTable";
import Button from "../../components/ui/Button";
import { Eye, Edit, Trash } from "lucide-react";
import { Product } from "./types";

interface Props {
  products: Product[];
  onView: (p: Product) => void;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}

const ProductTable: React.FC<Props> = ({ products, onView, onEdit, onDelete }) => {
  const columns = [
    { header: "ID", accessor: "legacyId" as keyof Product, sortable: true },
    { header: "Product Name", accessor: "name" as keyof Product, sortable: true },
    { header: "Category", accessor: "category" as keyof Product, sortable: true },
    {
      header: "Price",
      accessor: "price" as keyof Product,
      cell: (p: Product) => `$${p.price.toFixed(2)}`,
      sortable: true,
    },
    { header: "Stock", accessor: "stock" as keyof Product, sortable: true },
    {
      header: "Status",
      accessor: "status" as keyof Product,
      cell: (p: Product) => {
        const statusColors: Record<string, string> = {
          Active: "bg-green-100 text-green-800",
          Inactive: "bg-gray-100 text-gray-800",
          "Out of Stock": "bg-red-100 text-red-800",
        };
        return (
          <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${statusColors[p.status]}`}>
            {p.status}
          </span>
        );
      },
      sortable: true,
    },
    {
      header: "Actions",
      accessor: (p: Product) => (
        <div className="flex space-x-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onView(p)}
                >
                <Eye size={16} />
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(p)}
                >
                <Edit size={16} />
            </Button>

            <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(p)}
                >
                <Trash size={16} />
            </Button>

        </div>
      ),
      sortable: false,
    },
  ];

  return <DataTable columns={columns} data={products} keyField="id" />;
};

export default ProductTable;
