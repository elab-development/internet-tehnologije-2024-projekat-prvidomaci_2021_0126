import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/NewTransaction.css'; 

function NewCardForm() {
    const { accountId } = useParams(); 
    const navigate = useNavigate(); 
    const [cardType, setCardType] = useState('debit'); 
    const [paymentType, setPaymentType] = useState('visa'); 
    const [error, setError] = useState(null); 

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const authToken = window.sessionStorage.getItem('auth_token');
            const response = await axios.post(
                `/api/accounts/${accountId}/cards`,
                {
                    card_type: cardType,
                    payment_type: paymentType,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            if (response.status === 201) {
                console.log(JSON.stringify(response.data))
                navigate(`/accounts/${accountId}/cards`); 
            }
        } catch (error) {
            console.error('Error creating card:', error.response ? error.response.data : error.message);
            setError('Failed to create card.');
        }
    };

    return (
        <div className="new-transaction-container"> 
            <h2>Create New Card</h2> 

            {error && <p className="error-message">{error}</p>}

            <form className="new-transaction-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Card Type:</label>
                    <select value={cardType} onChange={(e) => setCardType(e.target.value)}>
                        <option value="debit">Debit Card</option>
                        <option value="credit">Credit Card</option>
                        <option value="prepaid">Prepaid Card</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Payment Type:</label>
                    <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                        <option value="visa">Visa</option>
                        <option value="mastercard">Mastercard</option>
                    </select>
                </div>

                <button type="submit" className="submit-button">
                    Create Card
                </button>
            </form>
        </div>
    );
}

export default NewCardForm;