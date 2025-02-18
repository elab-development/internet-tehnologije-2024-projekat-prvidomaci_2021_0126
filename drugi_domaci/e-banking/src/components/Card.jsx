import React from 'react'
import mastercard from '../images/mastercard.png'; 
import visa from '../images/visa.webp'; 
import '../style/Card.css';


function Card({card}) {

  function getPaymentType(){
    if(card.paymentType === "visa") return visa;
    if(card.paymentType === "mastercard") return mastercard;
    return null;
  }
  function getCardType(){
    if(card.cardType === "credit") return "Credit Card";
    if(card.cardType === "debit") return "Debit Card";
    if(card.cardType === "prepaid") return "Prepaid Card";
    return null;
  }

  return (
    <div className='card-container'>
      <img className='card-image' src={getPaymentType()} alt="Error" style={{height:'180px', width:'320px', objectFit:'contain'}} />
      
      <div className='card-details'>
        <p>{getCardType()}</p>
        <p>Number: {card.cardNumber}</p>
        <p>Expiry Date: {card.expiryDate}</p>
        <p>CVV: {card.cvv}</p>
        <p>Linked account: {card.account}</p>
      </div>
    </div>
  )
}

export default Card
