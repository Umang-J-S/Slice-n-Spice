import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import SpecialForm from './SpecialForm';

interface SpecialEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  special: any;
  onSuccess: () => void;
}

export default function SpecialEditModal({ isOpen, onClose, special, onSuccess }: SpecialEditModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-950/95 backdrop-blur-2xl border-white/10 text-white sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-extrabold text-amber-400">Edit Special Settings</DialogTitle>
        </DialogHeader>
        
        {/* We reuse the SpecialForm for editing */}
        <SpecialForm 
          initialData={special} 
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
