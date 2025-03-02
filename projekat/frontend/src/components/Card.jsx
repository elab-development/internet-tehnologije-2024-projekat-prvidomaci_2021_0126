import React from 'react'
import mastercard from '../images/mastercard.png'; 
import visa from '../images/visa.webp'; 
import '../style/Card.css';

function Card({card}) {

  function getPaymentType(){
    if(card.payment_type === "visa") return visa;
    if(card.payment_type === "mastercard") return mastercard;
    return null;
  }
  function getCardType(){
    if(card.card_type === "credit") return "Credit Card";
    if(card.card_type === "debit") return "Debit Card";
    if(card.card_type === "prepaid") return "Prepaid Card";
    return null;
  }

  return (
    <div className='card-container'>
      <img className='card-image' src={getPaymentType()} alt="Error" style={{height:'180px', width:'320px', objectFit:'contain'}} />
      
      <div className='card-details'>
        <p>{getCardType()}</p>
        <p>Number: {card.card_number}</p>
        <p>Expiry Date: {card.expiry_date}</p>
        <p>CVV: {card.cvv}</p>
        <p>Linked account: {card.account_id}</p>
      </div>
    </div>
  )
}

export default Card
