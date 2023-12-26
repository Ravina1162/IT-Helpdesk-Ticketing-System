// AdminNav.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose, AiOutlinePlus, AiOutlineQuestionCircle, AiOutlineSetting, AiOutlineUser, AiOutlineHome, AiOutlineBell } from 'react-icons/ai';
import { LightOceanTheme } from './themes';

const AdminNav = () => {
  const [nav, setNav] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const theme = LightOceanTheme;
  const navigate = useNavigate();

  useEffect(() => {
    // Mock notifications data for testing
    const mockNotifications = [
      { _id: '1', message: 'New email received', read: false },
      { _id: '2', message: 'Meeting at 2 PM', read: true },
      { _id: '3', message: 'Reminder: Complete tasks', read: false },
      // Add more mock notifications as needed
    ];

    setNotifications(mockNotifications);
  }, []); // Empty dependency array to set mock notifications only once when the component mounts

  // Update the status of a notification to 'read' when the checkbox is checked
  const handleCheckboxChange = async (notificationId) => {
    // Update the state locally
    const updatedNotifications = notifications.map(notification => {
      if (notification._id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    });
    setNotifications(updatedNotifications);

    // For testing purposes, log the notification ID and update the state on the server
    console.log('Marking notification as read:', notificationId);
  };

  // Filter unread notifications
  const unreadNotifications = notifications.filter(notification => !notification.read);

  return (
    <div className={`bg-${theme.colors.background} text-${theme.colors.text}`}>
      <div className="max-w-[1640px] mx-auto flex justify-between items-center p-4">
        {/* Left side */}
        <div className="flex items-center">
          <div onClick={() => setNav(!nav)} className="cursor-pointer">
            <AiOutlineMenu size={30} />
          </div>
          {/* Logo on the top left */}
          <div className="flex items-center h-12">
            <img
              src="https://www.freepnglogos.com/uploads/company-logo-png/company-logo-transparent-png-19.png"
              alt="Help Desk Logo"
              className="h-full w-auto"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl px-2">
          Admin <span className="font-bold">Dashboard</span>
        </h1>

        {/* Right side */}
        <div className="flex items-center">
          {/* Notification Button */}
          <div className="relative ml-4">
            <AiOutlineBell
              size={30}
              onClick={() => setShowNotifications(!showNotifications)}
              className="cursor-pointer"
            />
            {unreadNotifications.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1">
                {unreadNotifications.length}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side drawer menu */}
      <div
        className={
          nav
            ? "fixed top-0 left-0 w-[300px] h-screen bg-white z-10 duration-300 shadow-lg"
            : "fixed top-0 left-[-100%] w-[300px] h-screen bg-white z-10 duration-300 shadow-lg"
        }
      >
        <AiOutlineClose
          onClick={() => setNav(!nav)}
          size={30}
          className="absolute right-4 top-4 cursor-pointer"
        />
        <h2 className="text-2xl p-4">Admin Menu</h2>
        <nav>
          <ul className="flex flex-col p-4 text-gray-800">
            <li
              className="text-xl py-4 flex items-center transition ease-in-out duration-300 hover:bg-blue-50 hover:shadow-md cursor-pointer"
              onClick={() => navigate("/AdminHome")}
            >
              <AiOutlineHome size={25} className="mr-4" /> Home
            </li>
            <li
              className="text-xl py-4 flex items-center transition ease-in-out duration-300 hover:bg-blue-50 hover:shadow-md cursor-pointer"
              onClick={() => navigate("/AssignRole")}
            >
              <AiOutlinePlus size={25} className="mr-4" /> Assign Role
            </li>
            <li
              className="text-xl py-4 flex items-center transition ease-in-out duration-300 hover:bg-blue-50 hover:shadow-md cursor-pointer"
              onClick={() => navigate("/Profile")}
            >
              <AiOutlinePlus size={25} className="mr-4" /> Profile
            </li>
            <li
              className="text-xl py-4 flex items-center transition ease-in-out duration-300 hover:bg-blue-50 hover:shadow-md cursor-pointer"
              onClick={() => navigate("/Settings")}
            >
              <AiOutlinePlus size={25} className="mr-4" /> Settings
            </li>
          </ul>
        </nav>
      </div>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="absolute top-16 right-0 mt-2 bg-white w-64 border rounded-lg shadow-md">
          <div className="p-2 border-b">Notifications</div>
          <div className="p-2">
            {unreadNotifications.map(notification => (
              <div key={notification._id} className="flex items-center justify-between py-1">
                <div
                  className={`flex-1 ${notification.read ? 'text-gray-500' : 'text-black'}`}
                >
                  {notification.message}
                </div>
                <input
                  type="checkbox"
                  checked={false} // Set this to the appropriate value based on the notification's read status
                  onChange={() => handleCheckboxChange(notification._id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNav;
