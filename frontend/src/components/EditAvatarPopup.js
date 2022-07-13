import React from 'react';
import PopupWithForm from './PopupWithForm';
import { useRef } from 'react';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar}) {

  const avatarRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  return (
    <PopupWithForm 
    onSubmit = {handleSubmit}
    onClose = {onClose}
    isOpen = {isOpen}
    name = {'avatar'}
    title = {'Обновить аватар'}
    buttonName = {'Сохранить'}
    children = {
      <div className="input-box">
      <input ref={avatarRef} id="avatar" type="url" name="avatar" placeholder="Ссылка на картинку"
        className="popup__input-text popup__input-text_new_link" required />
      <span className="avatar-error input-box__error"></span>
    </div>
    }
  />
  )
}

export default EditAvatarPopup;