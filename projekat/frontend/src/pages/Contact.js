import React, { useState, useEffect } from 'react';
import '../style/Contact.css';

const Contact = () => {
    const [publicHolidays, setPublicHolidays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('https://date.nager.at/api/v3/PublicHolidays/2025/RS')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch public holidays');
                }
                return response.json();
            })
            .then(data => {
                setPublicHolidays(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching public holidays:', error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    return (
        <div className="contact-container">
            <h1>Contact Us</h1>
            <p>Welcome to Shomica e-banking. If you have any questions or need assistance, please feel free to reach out to our customer support.</p>
            <p>Customer Support Number: +381 60-100-200</p>

            <h2>Non-working days for Year 2025:</h2>
            {loading ? (
                <p>Loading public holidays...</p>
            ) : error ? (
                <p className="error-message">Error: {error}</p>
            ) : (
                <div className="content-wrapper">
                    <table className="holidays-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Local Name</th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {publicHolidays.map((holiday, index) => (
                                <tr key={index}>
                                    <td>{holiday.date}</td>
                                    <td>{holiday.localName}</td>
                                    <td>{holiday.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="map-container">
                        <h2>Visit Us:</h2>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d22649.555583406003!2d20.468842003420452!3d44.79722572081927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sRaiffeisen%20Bank!5e0!3m2!1sen!2srs!4v1741048803094!5m2!1sen!2srs"
                            width="600"
                            height="450"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contact;