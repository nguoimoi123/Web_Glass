import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { Product } from "./types";

interface Props {
  isOpen: boolean;
  product: Product | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteProductModal: React.FC<Props> = ({ isOpen, product, onConfirm, onCancel }) => (
  <Modal
    isOpen={isOpen}
    onClose={onCancel}
    title="Delete Product"
    size="sm"
    footer={
      <>
        <Button variant="danger" onClick={onConfirm}>Delete</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </>
    }
  >
    <p className="text-sm text-gray-500">
      Are you sure you want to delete "{product?.name}"? This action cannot be undone.
    </p>
  </Modal>
);

export default DeleteProductModal;
