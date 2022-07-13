import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import PopupWithForm from './PopupWithForm';
import {useState, useEffect} from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import ImagePopup from './ImagePopup';
import {CurrentUserContext} from './../contexts/CurrentUserContext';
import {api} from '../utils/Api.js';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import {getContent, authorize, register} from "../utils/Auth";

function App() {
  const [cards, setCards] = useState([]);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);
  const [isSuccessRegister, setIsSuccessRegister] = useState(false);
  const [isSuccessLogin, setIsSuccessLogin] = useState(false)
  const [email, setEmail] = useState('');

  const history = useHistory()

  useEffect(() => {

    if(loggedIn) {
      api.getInitialCards()
        .then(cardList => {
          setCards(cardList)
        })
        .catch(error => console.log(error))

      api.getUserInfo()
        .then(res => {
          setCurrentUser(res)
        })
        .catch(error => console.log(error))
    }

  }, [loggedIn])

  useEffect(() => {
    tokenCheck()
  }, [])

  useEffect(() => {
    if (loggedIn) {
      history.push("/");
    }
  }, [loggedIn]);

  const handleCardClick = (card) => {
    setSelectedCard(card)
  }

  const handleDeleteCardClick = () => {
    setIsDeletePopupOpen(true)
  }

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true)
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true)
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true)
  }

  const handleInfoPopupClick = () => {
    setIsInfoPopupOpen(true)
  }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setIsDeletePopupOpen(false)
    setSelectedCard(null)
    setIsInfoPopupOpen(false)
  }

  const redirectToLogin = () => {
    history.push('/sign-in')
  }

  const closeInfoPopupIfSuccess = () => {
    closeAllPopups()
    redirectToLogin()
  }

  function handleUpdateUser({name, about}) {
    api.editProfile(name, about)
      .then(res => {
        setCurrentUser(res)
        closeAllPopups()
      })
      .catch(error => console.log(error))
  }

  function handleUpdateAvatar(avatar) {
    api.changeAvatar(avatar)
      .then(res => {
        setCurrentUser(res)
        closeAllPopups()
      })
      .catch(error => console.log(error))
  }

  function handleAddPlaceSubmit({name, link}) {
    api.addCard(name, link)
      .then(res => {
        setCards([res, ...cards]);
        closeAllPopups()
      })
      .catch(error => console.log(error))
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api.setLike(card._id, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(error => console.log(error))
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(res => {
        setCards((state) => state.filter((item) => item._id !== card._id))
      })
      .catch(error => console.log(error))
  }

  function handleAuthorize(formParams, setFormParams) {
    authorize(formParams.email, formParams.password)
      .then((data) => {
        if (data.token){
          setFormParams({email: '', password: ''})
          tokenCheck()
        } else {
          handleInfoPopupClick()
          setIsSuccessLogin(false)
        }
      })
      .catch(err => {
        console.log(err)
      }); // запускается, если пользователь не найден
  }

  function handleRegister(password, email) {
    register(password, email)
      .then((data) => {
        setIsSuccessRegister(data ? true : false)
      })
      .catch((err) => console.log(err));
  }

  function tokenCheck() {
    const jwt = localStorage.getItem('token');

    if (jwt) {
      getContent(jwt).then((res) => {

        if (res) {
          setLoggedIn(true)
          setEmail(res.data.email)
          history.push("/");
        }
      });
    }

  }

  const signOut = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    history.push('/sign-in');
  }

  return (
    <Switch>
      <ProtectedRoute exact path="/" loggedIn={loggedIn}>
        <CurrentUserContext.Provider value={currentUser}>
          <div className="App">
            <div className="page">
              <Header
                title={'Выход'}
                onClick={signOut}
                email={email}
              />

              <Main
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onDeleteCard={handleDeleteCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />

              <Footer/>

            </div>

            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
            />

            <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              onClose={closeAllPopups}
              onAddPlace={handleAddPlaceSubmit}
            />

            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
            />

            <PopupWithForm
              onClose={closeAllPopups}
              isOpen={isDeletePopupOpen}
              name={'delete'}
              title={'Вы уверены?'}
              children={''}
              buttonName={'Да'}
            />

            <ImagePopup
              card={selectedCard}
              onClose={closeAllPopups}
            />

          </div>
        </CurrentUserContext.Provider>

      </ProtectedRoute>
      <Route path="/sign-up">
        <Register
          handleRegister={handleRegister}
          onSubmit={handleInfoPopupClick}
          history={history}
          redirectToLogin={redirectToLogin}
        />
        <InfoTooltip
          isOpen={isInfoPopupOpen}
          isSuccess={isSuccessRegister}
          onClose={closeAllPopups}
          closeInfoPopupIfSuccess={closeInfoPopupIfSuccess}
        />
      </Route>

      <Route path="/sign-in">
        <Login
          history={history}
          handleAuthorize={handleAuthorize}
        />
        <InfoTooltip
          isOpen={isInfoPopupOpen}
          isSuccess={isSuccessLogin}
          onClose={closeAllPopups}
          closeInfoPopupIfSuccess={closeAllPopups}
        />
      </Route>
      <Route>
        {loggedIn ? <Redirect to="/"/> : <Redirect to="/sign-in"/>}
      </Route>
    </Switch>

  );
}

export default App;