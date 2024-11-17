const SuccessModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Success!</h2>
          <p className="text-gray-600 mb-6">
            Your CV has been generated successfully and the PDF has been downloaded.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Profile
          </button>
        </div>
      </div>
    );
  };

export default SuccessModal;
