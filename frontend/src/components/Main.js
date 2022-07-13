import React from 'react';
import addButtonPath from '../images/addButton.svg';
import { useContext} from 'react';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

 
function Main({onEditProfile, onAddPlace, onEditAvatar, onCardClick, onDeleteCard, cards, onCardLike, onCardDelete}) {

  const user = useContext(CurrentUserContext);

  const cardList = cards.map((card) => 
    <Card 
      card={card} 
      key={card._id}
      onCardClick={onCardClick}
      onDeleteCard={onDeleteCard}

      onCardLike={onCardLike}
      onCardDelete={onCardDelete}
    />
  )

  return (
    <main className="content">

      <section className="profile">
        <div className="profile__avatar">
          <img src={user?.avatar} className="profile__avatar profile__avatar_type_photo" />
          <button className="profile__avatar profile__avatar_type_button" onClick={onEditAvatar} >
          </button>
        </div>
        <div className="profile__info">
          <h1 className="profile__name" name="name">{user?.name}</h1>
          <button type='button' className="profile__edit-button" onClick={onEditProfile}></button>
          <p className="profile__about-me" name="aboutMe">{user?.about}</p>
        </div>
        <button type='button' className="profile__add-button" onClick={onAddPlace}>
          <img src={addButtonPath} className="profile__ab-image" alt="крестик" />
        </button>
      </section>

      <section className="elements">
        <div className="element-list">
          {cardList}
        </div>
      </section>
      
    </main>

  )
}

export default Main;