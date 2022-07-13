import React from 'react';
import closeIconPath from '../images/closeIcon.svg';

function ImagePopup ({card, onClose}) {

  return (
    
    <section className={`popup popup_type_image ${card ?'popup_opened' : ''}`}>
    <div className="popup__container-img container">
      <button type='button' className="popup__close-button popup__close-button_image" onClick={onClose}>
        <img src={closeIconPath} className="popup__close-image" alt="крестик" />
      </button>
      <img src={card?.link} className="popup__card popup__card_img" alt={card?.name}/>
      <h2 className="popup__card popup__card_name">{card?.name}</h2>
    </div>
  </section>
  )
}

export default ImagePopup;