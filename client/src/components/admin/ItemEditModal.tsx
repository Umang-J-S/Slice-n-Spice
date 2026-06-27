import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ItemForm from './ItemForm';

interface ItemEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  onSuccess: () => void;
}

export default function ItemEditModal({ isOpen, onClose, item, onSuccess }: ItemEditModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-950/95 backdrop-blur-2xl border-white/10 text-white sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-extrabold text-amber-400">Edit Menu Item</DialogTitle>
        </DialogHeader>
        
        {/* We reuse the ItemForm! */}
        <ItemForm 
          initialData={item} 
          isEditMode={true} 
          onSuccess={() => {
            onSuccess();
            onClose();
          }} 
        />
      </DialogContent>
    </Dialog>
  );
}
