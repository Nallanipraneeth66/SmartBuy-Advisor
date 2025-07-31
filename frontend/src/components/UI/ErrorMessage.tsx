import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose, className = '' }) => {
  return (
    <div className={`flex items-center p-4 mb-4 text-red-800 bg-red-50 rounded-lg border border-red-200 ${className}`}>
      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
      <span className="flex-grow text-sm font-medium">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-red-600 hover:text-red-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;