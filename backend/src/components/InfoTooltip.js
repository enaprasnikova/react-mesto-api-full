import React from 'react';
import closeIconPath from '../images/closeIcon.svg';
import successIconPath from '../images/success-icon.svg';
import notSuccessIconPath from '../images/NotSuccess-icon.svg'

function InfoTooltip ({isOpen, isSuccess, onClose, closeInfoPopupIfSuccess}) {

  return (

    <section className={`popup ${isOpen &&'popup_opened'}`}>
      <div className="popup__container container">
        <button type='button' className="popup__close-button" onClick={isSuccess ? closeInfoPopupIfSuccess : onClose}>
          <img src={closeIconPath} className="popup__close-image" alt="крестик" />
        </button>

        <img src={isSuccess ? successIconPath : notSuccessIconPath} className="popup__info-img" />
        <h1 className="popup__info-text">{isSuccess ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так!\n' +
          'Попробуйте ещё раз.'}</h1>
      </div>
    </section>
  )
}

export default InfoTooltip;