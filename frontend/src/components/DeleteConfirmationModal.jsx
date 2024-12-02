import React from 'react';

export const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Confirm Deletion</h2>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete this invoice?<b> This action can't be undone.</b>
        </p>
        <div className="flex flex-wrap justify-center gap-4 flex-col items-center sm:flex-row">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 w-full max-w-[120px]"
            onClick={onConfirm}
          >
            Delete
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-400 w-full max-w-[120px]"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
