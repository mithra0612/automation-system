function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "danger" // "danger" for red, "warning" for yellow, "info" for blue
}) {
  if (!isOpen) return null;

  const getButtonStyles = () => {
    switch (type) {
      case "danger":
        return "bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 focus:ring-red-500/50 shadow-lg hover:shadow-red-500/25";
      case "warning":
        return "bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 focus:ring-yellow-500/50 shadow-lg hover:shadow-yellow-500/25";
      case "info":
        return "bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500/50 shadow-lg hover:shadow-blue-500/25";
      default:
        return "bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 focus:ring-red-500/50 shadow-lg hover:shadow-red-500/25";
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-gray-950/90 backdrop-blur-sm rounded-xl border border-gray-800/70 p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center space-x-3 mb-4">
          {type === "danger" && (
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )}
          {type === "warning" && (
            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )}
          {type === "info" && (
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        
        <p className="text-surface-300 mb-6">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-white rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 ${getButtonStyles()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
