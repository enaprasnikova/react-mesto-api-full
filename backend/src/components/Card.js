import React from 'react';
import deleteButtonTopPath from '../images/delete-button_top.svg';
import deleteButtonBottomPath from '../images/delete-button_bottom.svg';
import { useContext} from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';


function Card({card, onCardClick, onDeleteCard, onCardLike, onCardDelete}) {

  const user = useContext(CurrentUserContext);

  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = card.owner._id === user._id;

// Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = (
  `element__delete-button ${isOwn ? '' : 'element__delete-button_hidden'}`
  );

  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = card.likes.some(i => i._id === user._id);

// Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = (
    `element__like-button ${isLiked ? 'element__like-button_active' : ''}`
    );

  const handleClick = () => {
    onCardClick(card);
  }

  const handleLikeClick = () => {
    onCardLike(card);
  }
  
  const handleDeleteClick = () => {
    onCardDelete(card);
  } 

  return (
    <div className="element">
      <button type="button" className={cardDeleteButtonClassName} onClick={handleDeleteClick}>
        <img src={deleteButtonTopPath} />
        <img src={deleteButtonBottomPath} />
      </button>
      <img src={card.link} className="element__photo" onClick={handleClick} alt={card.name}/>
      <div className="element__line-like">
        <h2 className="element__photo-name">{card.name}</h2>
        <div className="element__container-like">
          <button type='button' className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
          <span className="element__like-count">{card.likes.length}</span>
        </div>
      </div>
    </div>
  )
}

export default Card;