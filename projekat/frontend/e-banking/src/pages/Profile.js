import React from 'react';
import '../style/Profile.css';

const Profile = ({ user }) => {
  return (
    <div className="profile-container">
      <h2 className="profile-header">Profile</h2>

      <div className="profile-section">
        <h3>Personal Data</h3>
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Age:</strong> {user.age}</p>
        <p><strong>Date of Birth:</strong> {user.dateOfBirth}</p>
        <p><strong>Gender:</strong> {user.gender}</p>
        
        <p><strong>University:</strong> {user.university}</p>
        <p><strong>Work Status:</strong> {user.workStatus}</p>
      </div>

      <div className="profile-section">
        <h3>Address</h3>
        <p><strong>Street:</strong> {user.address[0].street}</p>
        <p><strong>City:</strong> {user.address[0].city}</p>
        <p><strong>Country:</strong> {user.address[0].country}</p>
        <p><strong>Postal Code:</strong> {user.address[0].postalCode}</p>
      </div>

      <div className="profile-section profile-contact">
        <h3>Contact</h3>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
      </div>
    </div>
  );
};

export default Profile;
