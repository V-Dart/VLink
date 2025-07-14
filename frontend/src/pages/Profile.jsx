import React, { useState } from "react";
// import { useAuth } from '../context/AuthContext'; // Uncomment and adjust path if you have AuthContext
// import toast from 'react-hot-toast'; // Uncomment if you use react-hot-toast
// import ChangePassword from './ChangePassword'; // Uncomment if you have ChangePassword component

// Dummy user data for demonstration. Replace with your context or props.
const dummyUser = {
  first_name: "rithik",
  last_name: "sanjjay",
  phone: "9345602647",
  email: "rithiksanjjay@gmail.com",
  designation: "Software Engineer",
  department: "Engineering",
  employee_id: "EMP12345",
  date_joined_company: "2022-01-15",
  role: "user",
  is_active: true,
};


// Sidebar/SlideMenu logic (copied from Settings.jsx for consistency)
import Sidebar from "./Sidebar";
import SlideMenu from "./SlideMenu";

const Profile = () => {
  // Replace with: const { user, updateProfile } = useAuth();
  const user = dummyUser;
  // const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
  });

  // Sidebar/SlideMenu state and handlers
  const [isMenuOpen, setMenuOpen] = useState(true); // Sidebar open by default for Profile
  const [isPermanent, setPermanent] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);

  const handleHamburgerHover = () => {
    if (!isPermanent) setMenuOpen(true);
  };
  const handleHamburgerLeave = () => {
    if (!isPermanent && !isHoveringMenu) setMenuOpen(false);
  };
  const handleHamburgerClick = () => {
    setPermanent((prev) => !prev);
    setMenuOpen((prev) => (!isPermanent ? true : false));
  };
  const handleMenuHover = () => {
    setIsHoveringMenu(true);
    if (!isPermanent) setMenuOpen(true);
  };
  const handleMenuLeave = () => {
    setIsHoveringMenu(false);
    if (!isPermanent) setMenuOpen(false);
  };

  // Replace with your updateProfile logic
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    // const result = await updateProfile(profileData);
    // if (result.success) {
    //   toast.success('Profile updated successfully!');
    //   setIsEditing(false);
    // } else {
    //   toast.error('Failed to update profile');
    // }
    setIsEditing(false); // Remove this when using real update logic
    alert('Profile updated (demo only)');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative font-sans">
      <Sidebar
        toggleSlideMenu={handleHamburgerClick}
        onHamburgerHover={handleHamburgerHover}
        onHamburgerLeave={handleHamburgerLeave}
        isPermanent={isPermanent}
      />
      {isMenuOpen && <div className="fixed top-0 left-16 h-full z-10"></div>}
      <SlideMenu
        isOpen={isMenuOpen}
        onClose={() => {
          if (!isPermanent) setMenuOpen(false);
        }}
        onMenuHover={handleMenuHover}
        onMenuLeave={handleMenuLeave}
      />
      <main
        className={`flex-1 flex flex-col items-center py-10 transition-all duration-300 ${isMenuOpen ? "ml-64" : "ml-20"} transition-all duration-300 ease-in-out`}
      >
        <div className="bg-[#273549] rounded-xl shadow-lg p-8 w-full max-w-4xl border border-[#334155]">
          <div className="border-b border-[#334155] pb-6 mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Employee Profile</h1>
            <p className="text-white/60 text-base">Manage your personal and professional information</p>
          </div>
          <div className="flex gap-10 items-start">
            {/* Profile Picture */}
            <div className="text-center min-w-[200px]">
              <div className="w-36 h-36 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-5 text-6xl text-white font-bold shadow-lg">
                {user?.first_name?.[0] || user?.username?.[0] || 'U'}
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-0">
                  {user?.first_name} {user?.last_name}
                </h3>
                <p className="text-sm text-white/60 my-1">{user?.designation || 'Employee'}</p>
                <p className="text-xs text-white/40">{user?.department || 'Department'}</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Update Photo</button>
            </div>
            {/* Profile Information */}
            <div className="flex-1">
              <div className="bg-[#1e293b] p-6 rounded-lg mb-6">
                <h4 className="text-base font-semibold text-white mb-4">Personal Information</h4>
                {isEditing ? (
                  <form onSubmit={handleUpdateProfile}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-white/80 text-sm font-medium">First Name</label>
                        <input
                          type="text"
                          className="form-input bg-[#273549] text-white border border-[#334155] focus:ring-blue-500 focus:border-blue-500 rounded-lg w-full"
                          value={profileData.first_name}
                          onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-white/80 text-sm font-medium">Last Name</label>
                        <input
                          type="text"
                          className="form-input bg-[#273549] text-white border border-[#334155] focus:ring-blue-500 focus:border-blue-500 rounded-lg w-full"
                          value={profileData.last_name}
                          onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block mb-2 text-white/80 text-sm font-medium">Phone Number</label>
                      <input
                        type="text"
                        className="form-input bg-[#273549] text-white border border-[#334155] focus:ring-blue-500 focus:border-blue-500 rounded-lg w-1/2"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">Save Changes</button>
                      <button 
                        type="button" 
                        onClick={() => setIsEditing(false)}
                        className="bg-[#334155] text-white px-4 py-2 rounded-lg font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="text-xs text-white/40 uppercase tracking-wide">Full Name</label>
                        <p className="text-lg font-medium text-white mt-1">{user?.first_name} {user?.last_name}</p>
                      </div>
                      <div>
                        <label className="text-xs text-white/40 uppercase tracking-wide">Email Address</label>
                        <p className="text-lg font-medium text-white mt-1">{user?.email}</p>
                      </div>
                      <div>
                        <label className="text-xs text-white/40 uppercase tracking-wide">Phone Number</label>
                        <p className="text-lg font-medium text-white mt-1">{user?.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                      >
                        Edit Information
                      </button>
                      <button 
                        onClick={() => setShowChangePassword(true)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* Professional Details */}
              <div className="bg-[#1e293b] p-6 rounded-lg">
                <h4 className="text-base font-semibold text-white mb-4">Organization Information</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wide">Employee ID</label>
                    <p className="text-lg font-semibold text-white mt-1 font-mono">{user?.employee_id || 'Not Assigned'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wide">Department</label>
                    <p className="text-lg font-medium text-white mt-1">{user?.department || 'Not Assigned'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wide">Job Title</label>
                    <p className="text-lg font-medium text-white mt-1">{user?.designation || 'Not Assigned'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wide">Date Joined</label>
                    <p className="text-lg font-medium text-white mt-1">{user?.date_joined_company || 'Not Available'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wide">Role</label>
                    <p className="text-lg font-medium text-white mt-1 capitalize">{user?.role}</p>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wide">Account Status</label>
                    <div className="mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${user?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user?.is_active ? 'Active Employee' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Uncomment below if you have ChangePassword component */}
        {/* {showChangePassword && (
          <ChangePassword onClose={() => setShowChangePassword(false)} />
        )} */}
      </main>
    </div>
  );
};

export default Profile;

