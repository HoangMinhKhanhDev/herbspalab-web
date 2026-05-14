import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface AdminEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}) => {
  return (
    <div className="p-20 bg-white rounded-[2.5rem] border border-black/5 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-500 shadow-sm">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-sage/10 mb-2">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-2xl font-bold text-sage tracking-tight">{title}</h3>
      <p className="text-sage/40 text-sm max-w-md mx-auto">{description}</p>
      {actionLabel && onAction && (
        <button 
          onClick={onAction} 
          className="mt-6 px-8 py-3 bg-sage text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-mint transition-all shadow-xl"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default AdminEmptyState;
