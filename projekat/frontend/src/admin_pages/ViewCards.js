import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/Card';
import '../style/Cards.css'; // Reuse the same CSS as Cards
import axios from 'axios';

function ViewCards() {
  const { accountId } = useParams(); // Get the account ID from the URL
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cards for the selected account
  useEffect(() => {
    const fetchCards = async () => {
        try {
            const authToken = window.sessionStorage.getItem('auth_token');
            const response = await axios.get(`/api/accounts/${accountId}/cards`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            console.log('API Response:', response.data); // Log the response

            // Access the `data` key in the response
            setCards(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cards:', error.response ? error.response.data : error.message); // Log the full error
            setError('Failed to fetch cards.');
            setLoading(false);
        }
    };

    fetchCards();
}, [accountId]);

  if (loading) {
    return <p>Loading cards...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="cards-page">
      <h1>Linked Cards:</h1>
      <div className="cards-grid">
        {cards.map((card) => (
          <div key={card.id} className="card-container">
            <Card card={card} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewCards;