import React from 'react';
import closeIconPath from '../images/closeIcon.svg';

function PopupWithForm(props) {

  return (
    
      <section className={`popup popup_type_${props.name} ${props.isOpen ?'popup_opened' : ''}`}>
        <div className="popup__container container">
          <button type='button' className="popup__close-button popup__close-button_profile" onClick={props.onClose} >
            <img src={closeIconPath} className="popup__close-image" alt="крестик" />
          </button>
          <h2 className="popup__name">{props.title}</h2>
          <form name={props.name} onSubmit={props.onSubmit} className="popup__input popup__input_profile" noValidate>
              {props.children}
            <button type="submit" className="popup__submit-button">{props.buttonName}</button>
          </form>
        </div>
      </section>

  )
}

export default PopupWithForm;