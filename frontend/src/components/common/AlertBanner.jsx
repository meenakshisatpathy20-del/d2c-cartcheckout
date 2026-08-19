import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function AlertBanner({ message }) {
  if (!message) return null;
  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center space-x-3 text-sm">
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}