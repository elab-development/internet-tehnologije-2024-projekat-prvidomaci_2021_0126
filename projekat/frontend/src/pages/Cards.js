import React, { useState } from 'react';
import Card from '../components/Card';
import '../style/Cards.css';
import axios from 'axios';

function Cards({cards, setCards, fetchCards}) {
    const [isManaging, setIsManaging] = useState(false);

    const handleDeleteCard = async (cardId) => {
      try {
          const authToken = window.sessionStorage.getItem("auth_token");
          const response = await axios.post('/api/delete-card', { id: cardId }, {
              headers: {
                  'Authorization': `Bearer ${authToken}`,
              },
          });

          if (response.status === 200) {
              console.log(JSON.stringify(response.data))
              setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
          }
      } catch (error) {
          console.error('Error deleting card:', error);
      }
  };


  return (
    <div className="cards-page">
        <h1>Your Cards</h1>
        <button
            className="manage-cards-button"
            onClick={() => setIsManaging(!isManaging)} 
        >
            {isManaging ? 'Stop Managing' : 'Manage Cards'}
        </button>

        <div className="cards-grid">
            {cards?.map((card) => (
                <div key={card.id} className="card-container">
                    <Card card={card} />
                    {isManaging && ( 
                        <button
                            className="delete-card-button"
                            onClick={() => handleDeleteCard(card.id)} 
                        >
                            Delete
                        </button>
                    )}
                </div>
            ))}
        </div>
    </div>
);
}

export default Cards
