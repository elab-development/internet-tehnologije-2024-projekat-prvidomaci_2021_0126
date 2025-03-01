import React from 'react';
import Card from '../components/Card';
import '../style/Cards.css';

function Cards({cards}) {

    return (
        <div className='cards-grid'>
        {
          cards.map ( (card) =>
            <Card key = {card.id} card ={card}/>)  
        }  
        </div>
      )
}

export default Cards
