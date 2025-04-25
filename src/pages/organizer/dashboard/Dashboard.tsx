import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { checkUserSession } from '../../../services/authService';
import { RootState } from '../../../redux/store';

const Dashboard = () => {

  const dispatch = useDispatch();

  useEffect(() => {
      checkUserSession(dispatch);
    }, [dispatch]);

    const {user, isAuthenticated, loading} = useSelector((state : RootState) => state.auth);
    
    if(loading){
      return <div>Loading...</div>
    }


  if(!isAuthenticated || !user){
    return <div>
      Please Login!
    </div>
  }

  return (
    <div>

      {
        isAuthenticated && (
          <div className="relative bg-[#f7f6f9] h-full min-h-screen font-[sans-serif]">
    <div className="flex items-start">
      <nav id="sidebar" className="lg:min-w-[250px] w-max max-lg:min-w-8">
        <div id="sidebar-collapse-menu"
          className="bg-white shadow-lg h-screen fixed top-0 left-0 overflow-auto z-[99] lg:min-w-[250px] lg:w-max max-lg:w-0 max-lg:invisible transition-all duration-500">
          <div className="flex items-center gap-2 pt-6 pb-2 px-4 sticky top-0 bg-white min-h-[64px] z-[100]">
            <div className='text-xl'>
              EventWise
            </div>
            <button id="close-sidebar" className='lg:hidden ml-auto'>
              <svg className="w-7 h-7" fill="#000" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>

          <div className="py-4 px-4">
            <ul className="space-y-2">
              <li>
                <a href="javascript:void(0)"
                  className="text-gray-800 text-sm flex items-center cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2.5 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-[18px] h-[18px] mr-3"
                    viewBox="0 0 24 24">
                    <path
                      d="M19.56 23.253H4.44a4.051 4.051 0 0 1-4.05-4.05v-9.115c0-1.317.648-2.56 1.728-3.315l7.56-5.292a4.062 4.062 0 0 1 4.644 0l7.56 5.292a4.056 4.056 0 0 1 1.728 3.315v9.115a4.051 4.051 0 0 1-4.05 4.05zM12 2.366a2.45 2.45 0 0 0-1.393.443l-7.56 5.292a2.433 2.433 0 0 0-1.037 1.987v9.115c0 1.34 1.09 2.43 2.43 2.43h15.12c1.34 0 2.43-1.09 2.43-2.43v-9.115c0-.788-.389-1.533-1.037-1.987l-7.56-5.292A2.438 2.438 0 0 0 12 2.377z"
                      data-original="#000000" />
                    <path
                      d="M16.32 23.253H7.68a.816.816 0 0 1-.81-.81v-5.4c0-2.83 2.3-5.13 5.13-5.13s5.13 2.3 5.13 5.13v5.4c0 .443-.367.81-.81.81zm-7.83-1.62h7.02v-4.59c0-1.933-1.577-3.51-3.51-3.51s-3.51 1.577-3.51 3.51z"
                      data-original="#000000" />
                  </svg>
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">Dashboard</span>
                  <svg xmlns="http://www.w3.org/2000/svg"
                    className="arrowIcon w-3 fill-current -rotate-90 ml-auto transition-all duration-500"
                    viewBox="0 0 451.847 451.847">
                    <path
                      d="M225.923 354.706c-8.098 0-16.195-3.092-22.369-9.263L9.27 151.157c-12.359-12.359-12.359-32.397 0-44.751 12.354-12.354 32.388-12.354 44.748 0l171.905 171.915 171.906-171.909c12.359-12.354 32.391-12.354 44.744 0 12.365 12.354 12.365 32.392 0 44.751L248.292 345.449c-6.177 6.172-14.274 9.257-22.369 9.257z"
                      data-original="#000000" />
                  </svg>
                </a>
                <ul className="sub menu max-h-0 overflow-hidden transition-[max-height] duration-500 ease-in-out ml-8">
                  <li>
                    <a href="javascript:void(0)"
                      className="text-gray-800 text-sm block cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2 transition-all duration-300">
                      <span>Analytics</span>
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0)"
                      className="text-gray-800 text-sm block cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2 transition-all duration-300">
                      <span>Logistics</span>
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0)"
                      className="text-gray-800 text-sm block cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2 transition-all duration-300">
                      <span>Academy</span>
                    </a>
                  </li>
                </ul>
              </li>

              <li>
                <a href="javascript:void(0)"
                  className="text-gray-800 text-sm flex items-center cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2.5 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-[18px] h-[18px] mr-3"
                    viewBox="0 0 24 24">
                    <path
                      d="M18 2c2.206 0 4 1.794 4 4v12c0 2.206-1.794 4-4 4H6c-2.206 0-4-1.794-4-4V6c0-2.206 1.794-4 4-4zm0-2H6a6 6 0 0 0-6 6v12a6 6 0 0 0 6 6h12a6 6 0 0 0 6-6V6a6 6 0 0 0-6-6z"
                      data-original="#000000" />
                    <path d="M12 18a1 1 0 0 1-1-1V7a1 1 0 0 1 2 0v10a1 1 0 0 1-1 1z" data-original="#000000" />
                    <path d="M6 12a1 1 0 0 1 1-1h10a1 1 0 0 1 0 2H7a1 1 0 0 1-1-1z" data-original="#000000" />
                  </svg>
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">Posts</span>
                  <svg xmlns="http://www.w3.org/2000/svg"
                    className="arrowIcon w-3 fill-current -rotate-90 ml-auto transition-all duration-500"
                    viewBox="0 0 451.847 451.847">
                    <path
                      d="M225.923 354.706c-8.098 0-16.195-3.092-22.369-9.263L9.27 151.157c-12.359-12.359-12.359-32.397 0-44.751 12.354-12.354 32.388-12.354 44.748 0l171.905 171.915 171.906-171.909c12.359-12.354 32.391-12.354 44.744 0 12.365 12.354 12.365 32.392 0 44.751L248.292 345.449c-6.177 6.172-14.274 9.257-22.369 9.257z"
                      data-original="#000000" />
                  </svg>
                </a>
                <ul className="sub menu max-h-0 overflow-hidden transition-[max-height] duration-500 ease-in-out ml-8">
                  <li>
                    <a href="javascript:void(0)"
                      className="text-gray-800 text-sm block cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2 transition-all duration-300">
                      <span>Help center</span>
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0)"
                      className="text-gray-800 text-sm block cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2 transition-all duration-300">
                      <span>Article</span>
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0)"
                      className="text-gray-800 text-sm block cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2 transition-all duration-300">
                      <span>Education</span>
                    </a>
                  </li>
                </ul>
              </li>

              <li>
                <a href="javascript:void(0)"
                  className="text-gray-800 text-sm flex items-center cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2.5 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-[18px] h-[18px] mr-3"
                    viewBox="0 0 510 510">
                    <g fill-opacity=".9">
                      <path
                        d="M255 0C114.75 0 0 114.75 0 255s114.75 255 255 255 255-114.75 255-255S395.25 0 255 0zm0 459c-112.2 0-204-91.8-204-204S142.8 51 255 51s204 91.8 204 204-91.8 204-204 204z"
                        data-original="#000000" />
                      <path d="M267.75 127.5H229.5v153l132.6 81.6 20.4-33.15-114.75-68.85z" data-original="#000000" />
                    </g>
                  </svg>
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">Schedules</span>
                  <svg xmlns="http://www.w3.org/2000/svg"
                    className="arrowIcon w-3 fill-current -rotate-90 ml-auto transition-all duration-500"
                    viewBox="0 0 451.847 451.847">
                    <path
                      d="M225.923 354.706c-8.098 0-16.195-3.092-22.369-9.263L9.27 151.157c-12.359-12.359-12.359-32.397 0-44.751 12.354-12.354 32.388-12.354 44.748 0l171.905 171.915 171.906-171.909c12.359-12.354 32.391-12.354 44.744 0 12.365 12.354 12.365 32.392 0 44.751L248.292 345.449c-6.177 6.172-14.274 9.257-22.369 9.257z"
                      data-original="#000000" />
                  </svg>
                </a>
                <ul className="sub menu max-h-0 overflow-hidden transition-[max-height] duration-500 ease-in-out ml-8">
                  <li>
                    <a href="javascript:void(0)"
                      className="text-gray-800 text-sm block cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2 transition-all duration-300">
                      <span>Date</span>
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0)"
                      className="text-gray-800 text-sm block cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2 transition-all duration-300">
                      <span>Time</span>
                    </a>
                  </li>
                </ul>
              </li>

              <li>
                <a href="javascript:void(0)"
                  className="text-gray-800 text-sm flex items-center cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2.5 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-[18px] h-[18px] mr-3"
                    viewBox="0 0 512 512">
                    <path
                      d="M437.02 74.98C388.668 26.63 324.379 0 256 0S123.332 26.629 74.98 74.98C26.63 123.332 0 187.621 0 256s26.629 132.668 74.98 181.02C123.332 485.37 187.621 512 256 512s132.668-26.629 181.02-74.98C485.37 388.668 512 324.379 512 256s-26.629-132.668-74.98-181.02zM111.105 429.297c8.454-72.735 70.989-128.89 144.895-128.89 38.96 0 75.598 15.179 103.156 42.734 23.281 23.285 37.965 53.687 41.742 86.152C361.641 462.172 311.094 482 256 482s-105.637-19.824-144.895-52.703zM256 269.507c-42.871 0-77.754-34.882-77.754-77.753C178.246 148.879 213.13 114 256 114s77.754 34.879 77.754 77.754c0 42.871-34.883 77.754-77.754 77.754zm170.719 134.427a175.9 175.9 0 0 0-46.352-82.004c-18.437-18.438-40.25-32.27-64.039-40.938 28.598-19.394 47.426-52.16 47.426-89.238C363.754 132.34 315.414 84 256 84s-107.754 48.34-107.754 107.754c0 37.098 18.844 69.875 47.465 89.266-21.887 7.976-42.14 20.308-59.566 36.542-25.235 23.5-42.758 53.465-50.883 86.348C50.852 364.242 30 312.512 30 256 30 131.383 131.383 30 256 30s226 101.383 226 226c0 56.523-20.86 108.266-55.281 147.934zm0 0"
                      data-original="#000000" />
                  </svg>
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">Audience</span>
                  <svg xmlns="http://www.w3.org/2000/svg"
                    className="arrowIcon w-3 fill-current -rotate-90 ml-auto transition-all duration-500"
                    viewBox="0 0 451.847 451.847">
                    <path
                      d="M225.923 354.706c-8.098 0-16.195-3.092-22.369-9.263L9.27 151.157c-12.359-12.359-12.359-32.397 0-44.751 12.354-12.354 32.388-12.354 44.748 0l171.905 171.915 171.906-171.909c12.359-12.354 32.391-12.354 44.744 0 12.365 12.354 12.365 32.392 0 44.751L248.292 345.449c-6.177 6.172-14.274 9.257-22.369 9.257z"
                      data-original="#000000" />
                  </svg>
                </a>
                <ul className="sub menu max-h-0 overflow-hidden transition-[max-height] duration-500 ease-in-out ml-8">
                  <li>
                    <a href="javascript:void(0)"
                      className="text-gray-800 text-sm block cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2 transition-all duration-300">
                      <span>Users</span>
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0)"
                      className="text-gray-800 text-sm block cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2 transition-all duration-300">
                      <span>Leads</span>
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0)"
                      className="text-gray-800 text-sm block cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2 transition-all duration-300">
                      <span>Visitors</span>
                    </a>
                  </li>
                </ul>
              </li>

              <li>
                <a href="javascript:void(0)"
                  className="text-gray-800 text-sm flex items-center cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2.5 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-[18px] h-[18px] mr-3"
                    viewBox="0 0 25 25">
                    <g data-name="Action Expand">
                      <path
                        d="M21.5 1.25h-18A2.25 2.25 0 0 0 1.25 3.5v18a2.25 2.25 0 0 0 2.25 2.25h18a2.25 2.25 0 0 0 2.25-2.25v-18a2.25 2.25 0 0 0-2.25-2.25zm.75 20.25a.75.75 0 0 1-.75.75h-18a.75.75 0 0 1-.75-.75v-18a.75.75 0 0 1 .75-.75h18a.75.75 0 0 1 .75.75z"
                        data-original="#000000" />
                      <path d="M11.75 7.25h1.5v10.5h-1.5z" data-original="#000000" />
                      <path d="M7.25 11.75h10.5v1.5H7.25z" data-original="#000000" />
                    </g>
                  </svg>
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">Actions</span>
                  <svg xmlns="http://www.w3.org/2000/svg"
                    className="arrowIcon w-3 fill-current -rotate-90 ml-auto transition-all duration-500"
                    viewBox="0 0 451.847 451.847">
                    <path
                      d="M225.923 354.706c-8.098 0-16.195-3.092-22.369-9.263L9.27 151.157c-12.359-12.359-12.359-32.397 0-44.751 12.354-12.354 32.388-12.354 44.748 0l171.905 171.915 171.906-171.909c12.359-12.354 32.391-12.354 44.744 0 12.365 12.354 12.365 32.392 0 44.751L248.292 345.449c-6.177 6.172-14.274 9.257-22.369 9.257z"
                      data-original="#000000" />
                  </svg>
                </a>
                <ul className="sub menu max-h-0 overflow-hidden transition-[max-height] duration-500 ease-in-out ml-8">
                  <li>
                    <a href="javascript:void(0)"
                      className="text-gray-800 text-sm block cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2 transition-all duration-300">
                      <span>Profile</span>
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0)"
                      className="text-gray-800 text-sm block cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2 transition-all duration-300">
                      <span>Logout</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>

            <div className="mt-6">
              <h6 className="text-blue-600 text-sm font-bold px-3">General Settings</h6>
              <ul className="mt-3 space-y-2">
                <li>
                  <a href="javascript:void(0)"
                    className="text-gray-800 text-sm flex items-center cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2.5 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-[18px] h-[18px] mr-3"
                      viewBox="0 0 214.27 214.27">
                      <path
                        d="M196.926 55.171c-.11-5.785-.215-11.25-.215-16.537a7.5 7.5 0 0 0-7.5-7.5c-32.075 0-56.496-9.218-76.852-29.01a7.498 7.498 0 0 0-10.457 0c-20.354 19.792-44.771 29.01-76.844 29.01a7.5 7.5 0 0 0-7.5 7.5c0 5.288-.104 10.755-.215 16.541-1.028 53.836-2.436 127.567 87.331 158.682a7.495 7.495 0 0 0 4.912 0c89.774-31.116 88.368-104.849 87.34-158.686zm-89.795 143.641c-76.987-27.967-75.823-89.232-74.79-143.351.062-3.248.122-6.396.164-9.482 30.04-1.268 54.062-10.371 74.626-28.285 20.566 17.914 44.592 27.018 74.634 28.285.042 3.085.102 6.231.164 9.477 1.032 54.121 2.195 115.388-74.798 143.356z"
                        data-original="#000000" />
                      <path
                        d="m132.958 81.082-36.199 36.197-15.447-15.447a7.501 7.501 0 0 0-10.606 10.607l20.75 20.75a7.477 7.477 0 0 0 5.303 2.196 7.477 7.477 0 0 0 5.303-2.196l41.501-41.5a7.498 7.498 0 0 0 .001-10.606 7.5 7.5 0 0 0-10.606-.001z"
                        data-original="#000000" />
                    </svg>
                    <span>Security</span>
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0)"
                    className="text-gray-800 text-sm flex items-center cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2.5 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-[18px] h-[18px] mr-3"
                      viewBox="0 0 64 64">
                      <path
                        d="M61.4 29.9h-6.542a9.377 9.377 0 0 0-18.28 0H2.6a2.1 2.1 0 0 0 0 4.2h33.978a9.377 9.377 0 0 0 18.28 0H61.4a2.1 2.1 0 0 0 0-4.2Zm-15.687 7.287A5.187 5.187 0 1 1 50.9 32a5.187 5.187 0 0 1-5.187 5.187ZM2.6 13.1h5.691a9.377 9.377 0 0 0 18.28 0H61.4a2.1 2.1 0 0 0 0-4.2H26.571a9.377 9.377 0 0 0-18.28 0H2.6a2.1 2.1 0 0 0 0 4.2Zm14.837-7.287A5.187 5.187 0 0 1 22.613 11a5.187 5.187 0 0 1-10.364 0 5.187 5.187 0 0 1 5.187-5.187ZM61.4 50.9H35.895a9.377 9.377 0 0 0-18.28 0H2.6a2.1 2.1 0 0 0 0 4.2h15.015a9.377 9.377 0 0 0 18.28 0H61.4a2.1 2.1 0 0 0 0-4.2Zm-34.65 7.287A5.187 5.187 0 1 1 31.937 53a5.187 5.187 0 0 1-5.187 5.187Z"
                        data-name="Layer 47" data-original="#000000" />
                    </svg>
                    <span>Preferences</span>
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0)"
                    className="text-gray-800 text-sm flex items-center cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2.5 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-[18px] h-[18px] mr-3"
                      viewBox="0 0 64 64">
                      <path
                        d="M32.667 5.11A25.116 25.116 0 0 0 32 5.045V2.88a2.08 2.08 0 1 0-4.16 0v2.165C15.027 6.102 4.96 16.837 4.96 29.92v18.5L3.47 52.8h-.59a2.08 2.08 0 1 0 0 4.16h54.08a2.08 2.08 0 1 0 0-4.16h-.59l-1.49-4.38v-9.568a18.585 18.585 0 0 1-4.16 1.209v8.703a2.08 2.08 0 0 0 .11.67l1.145 3.366H7.865l1.144-3.366a2.08 2.08 0 0 0 .111-.67V29.92c0-11.488 9.312-20.8 20.8-20.8.142 0 .285.001.426.004a18.7 18.7 0 0 1 2.32-4.014zM23.68 61.12a2.08 2.08 0 0 1 2.08-2.08h8.32a2.08 2.08 0 1 1 0 4.16h-8.32a2.08 2.08 0 0 1-2.08-2.08z"
                        data-original="#000000" />
                      <g fill-rule="evenodd" clip-rule="evenodd">
                        <path
                          d="M46.56 12.909c-4.221 0-7.627 3.434-7.627 7.651s3.406 7.651 7.627 7.651c4.22 0 7.626-3.434 7.626-7.651s-3.406-7.651-7.626-7.651zm-3.467 7.651c0-1.936 1.56-3.491 3.467-3.491 1.906 0 3.466 1.555 3.466 3.491s-1.56 3.491-3.466 3.491c-1.906 0-3.467-1.555-3.467-3.491z"
                          data-original="#000000" />
                        <path
                          d="M44.342 2.88a2.08 2.08 0 0 0-2.005 1.526l-.75 2.711a14.256 14.256 0 0 0-4.138 2.402l-2.709-.703a2.08 2.08 0 0 0-2.325.978l-2.218 3.86a2.08 2.08 0 0 0 .316 2.49l1.964 2.01a14.478 14.478 0 0 0 0 4.813l-1.965 2.009a2.08 2.08 0 0 0-.315 2.49l2.218 3.86a2.08 2.08 0 0 0 2.325.978l2.709-.702a14.256 14.256 0 0 0 4.139 2.402l.749 2.71a2.08 2.08 0 0 0 2.005 1.526h4.436a2.08 2.08 0 0 0 2.005-1.526l.75-2.71a14.257 14.257 0 0 0 4.14-2.402l2.706.702a2.08 2.08 0 0 0 2.326-.978l2.218-3.86a2.08 2.08 0 0 0-.316-2.49l-1.964-2.01a14.477 14.477 0 0 0 0-4.813l1.965-2.009a2.08 2.08 0 0 0 .315-2.49l-2.219-3.86a2.08 2.08 0 0 0-2.324-.978l-2.709.702a14.256 14.256 0 0 0-4.138-2.402l-.749-2.71a2.08 2.08 0 0 0-2.007-1.526zm.956 6.421.626-2.261h1.271l.627 2.261a2.08 2.08 0 0 0 1.446 1.45 10.098 10.098 0 0 1 4.38 2.544 2.08 2.08 0 0 0 1.983.532l2.257-.585.644 1.12-1.64 1.678a2.08 2.08 0 0 0-.528 1.971c.208.812.32 1.666.32 2.549s-.112 1.737-.32 2.549a2.08 2.08 0 0 0 .527 1.97l1.641 1.68-.644 1.12-2.257-.586a2.08 2.08 0 0 0-1.982.532 10.096 10.096 0 0 1-4.38 2.544 2.08 2.08 0 0 0-1.447 1.45l-.628 2.261h-1.272l-.624-2.261a2.08 2.08 0 0 0-1.447-1.45 10.097 10.097 0 0 1-4.38-2.544 2.08 2.08 0 0 0-1.983-.532l-2.257.585-.645-1.12 1.642-1.678a2.08 2.08 0 0 0 .527-1.971c-.208-.812-.32-1.666-.32-2.549s.112-1.737.32-2.548a2.08 2.08 0 0 0-.527-1.972l-1.642-1.678.645-1.12 2.257.585a2.08 2.08 0 0 0 1.982-.532 10.097 10.097 0 0 1 4.38-2.544 2.08 2.08 0 0 0 1.447-1.45z"
                          data-original="#000000" />
                      </g>
                    </svg>
                    <span>Notification Settings</span>
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0)"
                    className="text-gray-800 text-sm flex items-center cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2.5 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-[18px] h-[18px] mr-3"
                      viewBox="0 0 32 32">
                      <path fill-rule="evenodd"
                        d="M20.063 7.94a3.96 3.96 0 0 1-5.342 3.713l2.362 2.815a6.601 6.601 0 1 0-7.24-8.627l2.364 2.818a3.96 3.96 0 1 1 7.856-.718zm-7.885 9.415L3.718 7.35A1.32 1.32 0 1 1 5.73 5.645l20.055 23.712a1.32 1.32 0 1 1-2.015 1.705l-2.03-2.401a8.886 8.886 0 0 1-2.645.4H13.11a8.886 8.886 0 0 1-8.886-8.886c0-.518.272-.993.747-1.198 1.095-.47 3.427-1.27 7.208-1.622zm7.634 9.025c-.235.026-.474.04-.716.04H13.11a6.248 6.248 0 0 1-6.184-5.362c1.35-.454 3.751-1.047 7.37-1.2zm-.347-9.072 2.476 2.95a21.397 21.397 0 0 1 3.34.8 6.204 6.204 0 0 1-.78 2.25l1.77 2.111a8.845 8.845 0 0 0 1.712-5.244c0-.518-.272-.993-.747-1.198-1.149-.493-3.657-1.349-7.771-1.67z"
                        clip-rule="evenodd" data-original="#000000" />
                    </svg>
                    <span>Account Deactivation</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <button id="open-sidebar" className='lg:hidden ml-4 mt-4 fixed top-0 left-0 bg-white z-[50]'>
        <svg className="w-7 h-7" fill="#000" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clip-rule="evenodd"></path>
        </svg>
      </button>

      <section className="main-content w-full">
        <header className='z-50 bg-[#f7f6f9] sticky top-0 pt-4 px-6'>
        <div className='my-5 w-full px-6'>
              <h3 className="text-lg font-semibold">Welcome back, {user.name}</h3>
              <p className="text-md">Streamlined dashboard layout featuring a welcoming header for user
                personalization.</p>
            </div>
          <div
            className='flex flex-wrap items-center px-6 py-2 bg-white shadow-md min-h-[56px] rounded-md w-full relative tracking-wide'>
            <div className='flex items-center flex-wrap gap-x-8 gap-y-4 z-50 w-full px-4'>
              <div className='flex items-center gap-4 py-1 outline-none border-none'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904"
                  className="w-5 cursor-pointer fill-current">
                  <path
                    d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                  </path>
                </svg>
                <input type='text' placeholder='Search something...'
                  className='w-full text-sm bg-transparent rounded outline-none' />
              </div>
              <div className="flex items-center gap-8 ml-auto">
                <div className='flex items-center space-x-6'>
                  <svg xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 cursor-pointer fill-[#333] hover:fill-[#077bff]" viewBox="0 0 511 511.999">
                    <path
                      d="M498.7 222.695c-.016-.011-.028-.027-.04-.039L289.805 13.81C280.902 4.902 269.066 0 256.477 0c-12.59 0-24.426 4.902-33.332 13.809L14.398 222.55c-.07.07-.144.144-.21.215-18.282 18.386-18.25 48.218.09 66.558 8.378 8.383 19.44 13.235 31.273 13.746.484.047.969.07 1.457.07h8.32v153.696c0 30.418 24.75 55.164 55.168 55.164h81.711c8.285 0 15-6.719 15-15V376.5c0-13.879 11.293-25.168 25.172-25.168h48.195c13.88 0 25.168 11.29 25.168 25.168V497c0 8.281 6.715 15 15 15h81.711c30.422 0 55.168-24.746 55.168-55.164V303.14h7.719c12.586 0 24.422-4.903 33.332-13.813 18.36-18.367 18.367-48.254.027-66.633zm-21.243 45.422a17.03 17.03 0 0 1-12.117 5.024h-22.72c-8.285 0-15 6.714-15 15v168.695c0 13.875-11.289 25.164-25.168 25.164h-66.71V376.5c0-30.418-24.747-55.168-55.169-55.168H232.38c-30.422 0-55.172 24.75-55.172 55.168V482h-66.71c-13.876 0-25.169-11.29-25.169-25.164V288.14c0-8.286-6.715-15-15-15H48a13.9 13.9 0 0 0-.703-.032c-4.469-.078-8.66-1.851-11.8-4.996-6.68-6.68-6.68-17.55 0-24.234.003 0 .003-.004.007-.008l.012-.012L244.363 35.02A17.003 17.003 0 0 1 256.477 30c4.574 0 8.875 1.781 12.113 5.02l208.8 208.796.098.094c6.645 6.692 6.633 17.54-.031 24.207zm0 0"
                      data-original="#000000" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 cursor-pointer fill-[#333] hover:fill-[#077bff]" viewBox="0 0 371.263 371.263">
                    <path
                      d="M305.402 234.794v-70.54c0-52.396-33.533-98.085-79.702-115.151.539-2.695.838-5.449.838-8.204C226.539 18.324 208.215 0 185.64 0s-40.899 18.324-40.899 40.899c0 2.695.299 5.389.778 7.964-15.868 5.629-30.539 14.551-43.054 26.647-23.593 22.755-36.587 53.354-36.587 86.169v73.115c0 2.575-2.096 4.731-4.731 4.731-22.096 0-40.959 16.647-42.995 37.845-1.138 11.797 2.755 23.533 10.719 32.276 7.904 8.683 19.222 13.713 31.018 13.713h72.217c2.994 26.887 25.869 47.905 53.534 47.905s50.54-21.018 53.534-47.905h72.217c11.797 0 23.114-5.03 31.018-13.713 7.904-8.743 11.797-20.479 10.719-32.276-2.036-21.198-20.958-37.845-42.995-37.845a4.704 4.704 0 0 1-4.731-4.731zM185.64 23.952c9.341 0 16.946 7.605 16.946 16.946 0 .778-.12 1.497-.24 2.275-4.072-.599-8.204-1.018-12.336-1.138-7.126-.24-14.132.24-21.078 1.198-.12-.778-.24-1.497-.24-2.275.002-9.401 7.607-17.006 16.948-17.006zm0 323.358c-14.431 0-26.527-10.3-29.342-23.952h58.683c-2.813 13.653-14.909 23.952-29.341 23.952zm143.655-67.665c.479 5.15-1.138 10.12-4.551 13.892-3.533 3.773-8.204 5.868-13.353 5.868H59.89c-5.15 0-9.82-2.096-13.294-5.868-3.473-3.772-5.09-8.743-4.611-13.892.838-9.042 9.282-16.168 19.162-16.168 15.809 0 28.683-12.874 28.683-28.683v-73.115c0-26.228 10.419-50.719 29.282-68.923 18.024-17.425 41.498-26.887 66.528-26.887 1.198 0 2.335 0 3.533.06 50.839 1.796 92.277 45.929 92.277 98.325v70.54c0 15.809 12.874 28.683 28.683 28.683 9.88 0 18.264 7.126 19.162 16.168z"
                      data-original="#000000" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 cursor-pointer fill-[#333] hover:fill-[#077bff]" viewBox="0 0 24 24">
                    <path
                      d="M18 2c2.206 0 4 1.794 4 4v12c0 2.206-1.794 4-4 4H6c-2.206 0-4-1.794-4-4V6c0-2.206 1.794-4 4-4zm0-2H6a6 6 0 0 0-6 6v12a6 6 0 0 0 6 6h12a6 6 0 0 0 6-6V6a6 6 0 0 0-6-6z"
                      data-original="#000000" />
                    <path d="M12 18a1 1 0 0 1-1-1V7a1 1 0 0 1 2 0v10a1 1 0 0 1-1 1z" data-original="#000000" />
                    <path d="M6 12a1 1 0 0 1 1-1h10a1 1 0 0 1 0 2H7a1 1 0 0 1-1-1z" data-original="#000000" />
                  </svg>
                </div>

                {/* <div className="dropdown-menu relative flex shrink-0 group">
                  <img src="https://readymadeui.com/team-1.webp" alt="profile-pic"
                    className="w-9 h-9 rounded-full border-2 border-gray-300 cursor-pointer" />

                  <div
                    className="dropdown-content hidden group-hover:block shadow-md p-2 bg-white rounded-md absolute top-9 right-0 w-56">
                    <div className="w-full">
                      <a href="javascript:void(0)"
                        className="text-sm text-gray-800 cursor-pointer flex items-center p-2 rounded-md hover:bg-gray-100 dropdown-item transition duration-300 ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-3 fill-current" viewBox="0 0 512 512">
                          <path
                            d="M437.02 74.98C388.668 26.63 324.379 0 256 0S123.332 26.629 74.98 74.98C26.63 123.332 0 187.621 0 256s26.629 132.668 74.98 181.02C123.332 485.37 187.621 512 256 512s132.668-26.629 181.02-74.98C485.37 388.668 512 324.379 512 256s-26.629-132.668-74.98-181.02zM111.105 429.297c8.454-72.735 70.989-128.89 144.895-128.89 38.96 0 75.598 15.179 103.156 42.734 23.281 23.285 37.965 53.687 41.742 86.152C361.641 462.172 311.094 482 256 482s-105.637-19.824-144.895-52.703zM256 269.507c-42.871 0-77.754-34.882-77.754-77.753C178.246 148.879 213.13 114 256 114s77.754 34.879 77.754 77.754c0 42.871-34.883 77.754-77.754 77.754zm170.719 134.427a175.9 175.9 0 0 0-46.352-82.004c-18.437-18.438-40.25-32.27-64.039-40.938 28.598-19.394 47.426-52.16 47.426-89.238C363.754 132.34 315.414 84 256 84s-107.754 48.34-107.754 107.754c0 37.098 18.844 69.875 47.465 89.266-21.887 7.976-42.14 20.308-59.566 36.542-25.235 23.5-42.758 53.465-50.883 86.348C50.852 364.242 30 312.512 30 256 30 131.383 131.383 30 256 30s226 101.383 226 226c0 56.523-20.86 108.266-55.281 147.934zm0 0"
                            data-original="#000000"></path>
                        </svg>
                        Account</a>
                      <hr className="my-2 -mx-2" />

                      <a href="javascript:void(0)"
                        className="text-sm text-gray-800 cursor-pointer flex items-center p-2 rounded-md hover:bg-gray-100 dropdown-item transition duration-300 ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4 mr-3 fill-current"
                          viewBox="0 0 24 24">
                          <path
                            d="M19.56 23.253H4.44a4.051 4.051 0 0 1-4.05-4.05v-9.115c0-1.317.648-2.56 1.728-3.315l7.56-5.292a4.062 4.062 0 0 1 4.644 0l7.56 5.292a4.056 4.056 0 0 1 1.728 3.315v9.115a4.051 4.051 0 0 1-4.05 4.05zM12 2.366a2.45 2.45 0 0 0-1.393.443l-7.56 5.292a2.433 2.433 0 0 0-1.037 1.987v9.115c0 1.34 1.09 2.43 2.43 2.43h15.12c1.34 0 2.43-1.09 2.43-2.43v-9.115c0-.788-.389-1.533-1.037-1.987l-7.56-5.292A2.438 2.438 0 0 0 12 2.377z"
                            data-original="#000000"></path>
                          <path
                            d="M16.32 23.253H7.68a.816.816 0 0 1-.81-.81v-5.4c0-2.83 2.3-5.13 5.13-5.13s5.13 2.3 5.13 5.13v5.4c0 .443-.367.81-.81.81zm-7.83-1.62h7.02v-4.59c0-1.933-1.577-3.51-3.51-3.51s-3.51 1.577-3.51 3.51z"
                            data-original="#000000"></path>
                        </svg>
                        Dashboard</a>
                      <a href="javascript:void(0)"
                        className="text-sm text-gray-800 cursor-pointer flex items-center p-2 rounded-md hover:bg-gray-100 dropdown-item transition duration-300 ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-3 fill-current" viewBox="0 0 24 24">
                          <path
                            d="M18 2c2.206 0 4 1.794 4 4v12c0 2.206-1.794 4-4 4H6c-2.206 0-4-1.794-4-4V6c0-2.206 1.794-4 4-4zm0-2H6a6 6 0 0 0-6 6v12a6 6 0 0 0 6 6h12a6 6 0 0 0 6-6V6a6 6 0 0 0-6-6z"
                            data-original="#000000" />
                          <path d="M12 18a1 1 0 0 1-1-1V7a1 1 0 0 1 2 0v10a1 1 0 0 1-1 1z" data-original="#000000" />
                          <path d="M6 12a1 1 0 0 1 1-1h10a1 1 0 0 1 0 2H7a1 1 0 0 1-1-1z" data-original="#000000" />
                        </svg>
                        Posts</a>
                      <a href="javascript:void(0)"
                        className="text-sm text-gray-800 cursor-pointer flex items-center p-2 rounded-md hover:bg-gray-100 dropdown-item transition duration-300 ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-3 fill-current" viewBox="0 0 510 510">
                          <g fill-opacity=".9">
                            <path
                              d="M255 0C114.75 0 0 114.75 0 255s114.75 255 255 255 255-114.75 255-255S395.25 0 255 0zm0 459c-112.2 0-204-91.8-204-204S142.8 51 255 51s204 91.8 204 204-91.8 204-204 204z"
                              data-original="#000000" />
                            <path d="M267.75 127.5H229.5v153l132.6 81.6 20.4-33.15-114.75-68.85z"
                              data-original="#000000" />
                          </g>
                        </svg>
                        Schedules</a>
                      <a href="javascript:void(0)"
                        className="text-sm text-gray-800 cursor-pointer flex items-center p-2 rounded-md hover:bg-gray-100 dropdown-item transition duration-300 ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-3 fill-current" viewBox="0 0 6 6">
                          <path
                            d="M3.172.53a.265.266 0 0 0-.262.268v2.127a.265.266 0 0 0 .53 0V.798A.265.266 0 0 0 3.172.53zm1.544.532a.265.266 0 0 0-.026 0 .265.266 0 0 0-.147.47c.459.391.749.973.749 1.626 0 1.18-.944 2.131-2.116 2.131A2.12 2.12 0 0 1 1.06 3.16c0-.65.286-1.228.74-1.62a.265.266 0 1 0-.344-.404A2.667 2.667 0 0 0 .53 3.158a2.66 2.66 0 0 0 2.647 2.663 2.657 2.657 0 0 0 2.645-2.663c0-.812-.363-1.542-.936-2.03a.265.266 0 0 0-.17-.066z"
                            data-original="#000000" />
                        </svg>
                        Logout</a>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </header>

        <div className="my-6 px-6">
          <div className="flex items-start gap-6 flex-wrap">
            <div
              className="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] p-6 w-full max-w-sm rounded-lg overflow-hidden">
              <div className="inline-block bg-[#edf2f7] rounded-lg py-2 px-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6" viewBox="0 0 511.999 511.999">
                  <path fill="#06d"
                    d="m38.563 418.862 22.51 39.042c4.677 8.219 11.41 14.682 19.319 19.388l80.744-57.248.147-82.19-80.577-36.303L0 337.565c-.016 9.09 2.313 18.185 6.991 26.404z"
                    data-original="#0066dd" />
                  <path fill="#00ad3c"
                    d="m256.293 173.808 4.212-107.064-84.604-32.663c-7.926 4.678-14.682 11.117-19.389 19.319L7.085 311.186C2.379 319.389.016 328.475 0 337.565l161.283.288z"
                    data-original="#00ad3c" />
                  <path fill="#00831e"
                    d="m256.293 173.808 77.503-41.694 3.387-97.745c-7.909-4.706-16.996-7.068-26.379-7.085l-108.499-.194c-9.384-.017-18.479 2.606-26.405 6.991z"
                    data-original="#00831e" />
                  <path fill="#0084ff"
                    d="m350.716 338.192-189.434-.338-80.89 139.438c7.909 4.706 16.996 7.068 26.379 7.085l297.933.532c9.384.017 18.479-2.606 26.405-6.991l.314-93.66z"
                    data-original="#0084ff" />
                  <path fill="#ff4131"
                    d="M431.109 477.919c7.926-4.678 14.682-11.117 19.388-19.319l9.413-16.111 45.005-77.629c4.706-8.202 7.069-17.288 7.085-26.379l-93.221-49.051-67.768 48.764z"
                    data-original="#ff4131" />
                  <path fill="#ffba00"
                    d="m430.756 182.917-74.253-129.16c-4.677-8.22-11.41-14.683-19.32-19.389l-80.891 139.439 94.423 164.385 160.99.288c.016-9.09-2.314-18.185-6.991-26.405z"
                    data-original="#ffba00" />
                </svg>
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-800">Heading</h3>
                <p className="mt-2 text-sm text-gray-800">Lorem ipsum dolor sit amet, consectetur.</p>
              </div>

              <div className="mt-6">
                <div className="flex mb-2">
                  <p className="text-sm text-gray-800 flex-1">25 GB</p>
                  <p className="text-sm text-gray-800">50 GB</p>
                </div>
                <div className="bg-gray-300 rounded-full w-full h-2.5">
                  <div className="w-1/2 h-full rounded-full bg-blue-600 flex items-center">
                  </div>
                </div>
              </div>
            </div>
            <div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
        )
      }
    </div>
  )
}

export default Dashboard