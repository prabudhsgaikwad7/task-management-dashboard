import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';
import type { Task } from '../../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToDelete?: Task | null;
  bulkCount?: number;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  taskToDelete,
  bulkCount,
  onConfirm,
  isLoading = false,
}) => {
  const isBulk = Boolean(bulkCount && bulkCount > 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isBulk ? `Delete ${bulkCount} Tasks?` : 'Delete Task'}
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-rose-50 rounded-xl border border-rose-200">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-900 leading-relaxed">
            {isBulk ? (
              <span>
                Are you sure you want to permanently delete <strong>{bulkCount} tasks</strong>? This action cannot be undone.
              </span>
            ) : (
              <span>
                Are you sure you want to delete <strong>"{taskToDelete?.title}"</strong> ({taskToDelete?.id})? This operation will remove the record.
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Yes, Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
