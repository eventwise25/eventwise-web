import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { logoutUser } from "../redux/auth/authSlice";
import { checkUserSession, logout } from "../services/authService";
import { useEffect } from "react";

const Navbar = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {user} = useSelector((state : RootState) => state.auth);

  useEffect(() => {
      checkUserSession(dispatch);
    }, [dispatch]);


  const handleLogout = async () => {
    await logout();
    dispatch(logoutUser());
    navigate("/login");
  };
 

  return (
    <header className="flex shadow-md py-4 px-4 sm:px-10 bg-white min-h-[70px] tracking-wide relative z-50">
      <div className="flex flex-wrap items-center justify-between gap-5 w-full">
        <Link to="/" className="max-sm:hidden">
          <div className="text-xl w-36">EventWise</div>
        </Link>

        {
          user?.role === 'organizer' ? 
          (
            <div
              id="collapseMenu"
              className="max-lg:hidden lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50"
            >
              <ul className="lg:flex gap-x-5 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
                <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
                  <Link to={'/'} className="hover:text-[#007bff] text-gray-500 block font-semibold text-md">
                    Home
                  </Link>
                </li>
                <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
                  <Link to={'/organizer/dashboard'} className="hover:text-[#007bff] text-gray-500 block font-semibold text-md">
                    Dashboard
                  </Link>
                </li>
                <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
                  <Link to={'/organizer/events'} className="hover:text-[#007bff] text-gray-500 block font-semibold text-md">
                    Events
                  </Link>
                </li>
                {/* <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
                  <Link to={'/organizer/permissions'} className="hover:text-[#007bff] text-gray-500 block font-semibold text-md">
                    Permissions
                  </Link>
                </li> */}
                <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
                  <Link to={'/organizer/about'} className="hover:text-[#007bff] text-gray-500 block font-semibold text-md">
                    About
                  </Link>
                </li>
                <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
                  <Link to={'/organizer/contact'} className="hover:text-[#007bff] text-gray-500 block font-semibold text-md">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          )
          :
          (
            <div
              id="collapseMenu"
              className="max-lg:hidden lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50"
            >
              <ul className="lg:flex gap-x-5 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
                <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
                  <Link to={'/'} className="hover:text-[#007bff] text-gray-500 block font-semibold text-md">
                    Home
                  </Link>
                </li>
                <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
                  <Link to={'/admin/dashboard'} className="hover:text-[#007bff] text-gray-500 block font-semibold text-md">
                    Dashboard
                  </Link>
                </li>
                <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
                  <Link to={'/organizer/about'} className="hover:text-[#007bff] text-gray-500 block font-semibold text-md">
                    About
                  </Link>
                </li>
                <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
                  <Link to={'/organizer/contact'} className="hover:text-[#007bff] text-gray-500 block font-semibold text-md">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          )
        }


        <div className="flex max-lg:ml-auto space-x-4">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-md rounded-full font-bold text-gray-500 border-2 bg-transparent hover:bg-gray-50 transition-all ease-in-out duration-300 cursor-pointer"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-md rounded-full font-bold text-white border-2 border-[#007bff] bg-[#007bff] transition-all ease-in-out duration-300 hover:bg-transparent hover:text-[#007bff] cursor-pointer"
              >
                Sign up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-md rounded-full font-bold text-white border-2 bg-gray-600 transition-all ease-in-out duration-300 hover:bg-gray-700 cursor-pointer"
            >
              Logout
            </button>
          )}

          <button id="toggleOpen" className="lg:hidden">
            <svg className="w-7 h-7" fill="#000" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
