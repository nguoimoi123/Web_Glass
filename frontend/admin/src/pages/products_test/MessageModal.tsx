import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const MessageModal: React.FC<Props> = ({ isOpen, title, message, onClose }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    size="sm"
    footer={<Button variant="primary" onClick={onClose}>OK</Button>}
  >
    <p className="text-sm text-gray-500">{message}</p>
  </Modal>
);

export default MessageModal;
