import React from 'react';
import PopupWithForm from './PopupWithForm';
import { useState } from 'react';

function AddPlacePopup ( { isOpen, onClose, onAddPlace} ) {

  const [name, setName] = useState('');
  const [link , setLink ] = useState('');

  const handleChangeName = (e) => {
    setName(e.target.value)
  }

  const handleChangeLink = (e) => {
    setLink(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace ({
      name,
      link
    })

  } 
  
  return (
    <PopupWithForm
          onSubmit = {handleSubmit}
          onClose = {onClose} 
          isOpen={isOpen}
          name = {'card'}
          title = {'Новое место'}
          buttonName = {'Сохранить'}
          children = {
            <>
               <div className="input-box">
              <input id="title" type="text" onChange={handleChangeName} name="name" placeholder="Название"
                className="popup__input-text popup__input-text_new_title" minLength="2" maxLength="20" required />
              <span className="title-error input-box__error"></span>
            </div>
            <div className="input-box">
              <input id="link" type="url" onChange={handleChangeLink} name="link" placeholder="Ссылка на картинку"
                className="popup__input-text popup__input-text_new_link" required />
              <span className="link-error input-box__error"></span>
            </div>
            </>
          }
        />
  )
}

export default AddPlacePopup;