import { Link } from 'react-router-dom';

const RoleSelectionForRegistration = () => {
  return (
    <div className="flex justify-center">
      <div className="flex gap-20 p-6 my-50">
        <Link to={'/signup/college'} className="w-60 text-3xl font-bold leading-10 text-center cursor-pointer hover:bg-gray-200 hover:scale-110 duration-300 py-4 rounded">
          Register New College
        </Link>
        <Link to={'/signup/organizer'} className="w-60 text-3xl font-bold text-center cursor-pointer hover:bg-gray-200 hover:scale-110 duration-300 py-4 rounded">
          Register New Organizer
        </Link>
        <Link to={'/signup/admin'} className="w-60 text-3xl font-bold text-center cursor-pointer hover:bg-gray-200 hover:scale-110 duration-300 py-4 rounded">
          Register New Admin
        </Link>
      </div>
    </div>
  );
};

export default RoleSelectionForRegistration;
