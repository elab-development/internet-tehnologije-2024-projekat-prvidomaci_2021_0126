import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import '../style/Cards.css'; 
import axios from 'axios';

function ViewCards() {
    const { accountId } = useParams(); 
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isManaging, setIsManaging] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const authToken = window.sessionStorage.getItem('auth_token');
                const response = await axios.get(`/api/accounts/${accountId}/cards`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                console.log(JSON.stringify (response.data)); 

                if (response.data && Array.isArray(response.data.data)) {
                    setCards(response.data.data);
                } else {
                    setCards([]); 
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching cards:', error.response ? error.response.data : error.message); 

                if (error.response && error.response.status !== 404) {
                    setError('Failed to fetch cards.');
                }

                setLoading(false);
            }
        };

        fetchCards();
    }, [accountId]);

    const handleDeleteCard = async (cardId) => {
        try {
            const authToken = window.sessionStorage.getItem("auth_token");
            const response = await axios.post('/api/delete-card', { id: cardId }, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (response.status === 200) {
                setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
            }
        } catch (error) {
            console.error('Error deleting card:', error);
        }
    };

    const handleCreateNewCard = () => {
        navigate(`/accounts/${accountId}/cards/new-card`);
    };

    if (loading) {
        return <p>Loading cards...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="cards-page">
            <h1>Linked Cards:</h1>

            {cards.length === 0 && (<>
                <button
                    className="create-card-button manage-cards-button"
                    onClick={handleCreateNewCard} 
                >
                    Create New Card
                </button>
                <h2>No cards linked to this account!</h2>
                </>
            )}

            {cards.length > 0 && (
                <>
                    <button
                        className="manage-cards-button"
                        onClick={() => setIsManaging(!isManaging)} 
                    >
                        {isManaging ? 'Stop Managing' : 'Manage Cards'}
                    </button>

                    <button
                        className="create-card-button manage-cards-button"
                        onClick={handleCreateNewCard} 
                    >
                        Create New Card
                    </button>

                    <div className="cards-grid">
                        {cards.map((card) => (
                            <div key={card.id} className="card-container">
                                <Card card={card} />               
                                {isManaging && (
                                    <button className="delete-card-button" onClick={() => handleDeleteCard(card.id)}>Delete</button>                              
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default ViewCards;