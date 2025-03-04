import React from 'react';
import '../style/Footer.css'; // Import the CSS file

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="footer">
            <p>{currentYear}®   <a href=''>some-link</a></p>
        </footer>
    );
};

export default Footer;