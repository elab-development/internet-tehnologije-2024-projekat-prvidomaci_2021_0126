import React from 'react';
import '../style/Profile.css';

const Profile = ({ user }) => {
  return (
    <div className="profile-container">
      <h2 className="profile-header">Profile</h2>

      <div className="profile-section">
        <h3>Personal Data</h3>
        <p><strong>Name:</strong> {user.name}</p>
        {/* <p><strong>Age:</strong> {user.age}</p> */}
        <p><strong>Date of Birth:</strong> {user.date_of_birth}</p>
        <p><strong>Gender:</strong> {user.gender}</p>
        
        <p><strong>Work Status:</strong> {user.work_status}</p>
      </div>

      <div className="profile-section">
        <h3>Address</h3>
        <p><strong>Street:</strong> {user.street}</p>
        <p><strong>City:</strong> {user.city}</p>
        <p><strong>Country:</strong> {user.country}</p>
        <p><strong>Postal Code:</strong> {user.postal_code}</p>
      </div>

      <div className="profile-section profile-contact">
        <h3>Contact</h3>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone_number}</p>
      </div>
    </div>
  );
};

export default Profile;
