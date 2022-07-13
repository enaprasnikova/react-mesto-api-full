import React from 'react';
import { useState, useEffect, useContext } from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup ({ isOpen, onClose, onUpdateUser }) {

  const user = useContext(CurrentUserContext);

  const [name, setName] = useState('');
  const [description , setDescription ] = useState('');

  const handleChangeName = (e) => {
    setName(e.target.value)
  }

  const handleChangeDescription = (e) => {
    setDescription(e.target.value)
  }

  useEffect(() => {
    setName(user?.name);
    setDescription(user?.about);
  }, [user, isOpen])

  function handleSubmit(e) {
    e.preventDefault();
  
    onUpdateUser({
      name,
      about: description,
    });
  } 

  return (
    <PopupWithForm 
    onSubmit = {handleSubmit}
    onClose = {onClose}
    isOpen = {isOpen} 
    name = {'profile'}
    title = {'Редактировать профиль'}
    buttonName = {'Сохранить'}
    children = {
      <>
      <div className="input-box">
        <input id="name" type="text" value={name || ''} onChange={handleChangeName} name="name" className="popup__input-text popup__input-text_new_name" minLength="2"
          maxLength="40" required placeholder="Имя" />
        <span className="name-error input-box__error"></span>
      </div>
      <div className="input-box">
        <input id="info" type="text" value={description || ''} onChange={handleChangeDescription} name="info" className="popup__input-text popup__input-text_new_info" minLength="2"
          maxLength="200" required placeholder="О себе" />
        <span className="info-error input-box__error"></span>
      </div>
      </>
    }/>
    
  )
}

export default EditProfilePopup;