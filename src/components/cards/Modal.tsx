const Modal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md border-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 text-2xl font-bold">×</button>
        </div>
        {children}
      </div>
    </div>
  );
  
  export default Modal;
  