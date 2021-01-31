import React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import api from "../utils/api.js";
import authApi from "../utils/authApi.js";
import CurrentUserContext from "../contexts/CurrentUserContext.js";

// import components
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";

function App() {
  const history = useHistory();
  // popups controllers
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(undefined);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
  // for InfoToolTip
  const [isSignedUp, setIsSignedUp] = React.useState(false);

  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [userEmail, setUserEmail] = React.useState('');


  // state to store if user logged in
  const [isLogged, setIsLogged] = React.useState(false);

  // initial connections with servers through api and authApi

  // check if user has token in local storage, in case has log them in
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authorize(token);
    } else {
      console.log('token is empty');
    }
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    if (isLogged) {
      api
        .getCards()
        .then((data) => {
          setCards(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isLogged, history]);

  React.useEffect(() => {
    if (isLogged) {
      api
      .getUserProfile()
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }, [isLogged]);


  // methods
  function handleCardLike(card) {
    const isLiked = card.likes.some((like) => like === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        setCards(newCards);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        const newCards = cards.filter((c) => c._id !== card._id);
        setCards(newCards);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleAddPlaceSubmit({ name, link }) {
    api
      .postNewCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
      })
      .catch((error) => {
        console.log(error);
      });
    closeAllPopups();
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(undefined);
    setIsInfoToolTipOpen(false);
  }

  function handleUpdateUser({ name, about }) {
    api
      .patchUserProfile(name, about)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .patchUserAvatar(avatar)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function signOut() {
    setIsLogged(false);
    localStorage.removeItem('token');
    api.removeToken();
  }

  function authorize(token) {
    authApi
      .checkToken(token)
      .then((res) => {
        api.setToken(token);
        setUserEmail(res.data.email);
        setIsLogged(true);
        history.push("/");
      })
      .catch((error) => {
        switch(error.status) {
          case 400:
            console.error(error.status + ': Токен не передан или передан не в том формате.');
            break;
          case 401:
            console.error(error.status + ': Переданный токен некорректе.');
            break;
          default:
            console.error(error.status + ': произошла ошибка.');
        }
      });
  }

  const signIn = (email, password) => {
    authApi
      .signIn(email, password)
      .then((data) => {
        localStorage.setItem('token', data.token);
        api.setToken(data.token);
        setIsLogged(true);
        setUserEmail(email);
        history.push("/");
      })
      .catch((error) => {
        switch(error.status) {
          case 400:
            console.error(error.status + ': Не передано одно из полей.');
            break;
          case 401:
            console.error(error.status + ': Пользователь с email не найден.');
            break;
          default:
            console.error(error.status + ': произошла ошибка.');
        }
      });
  };

  const signUp = (email, password) => {
    authApi
      .signUp(email, password)
      .then(() => {
        setIsSignedUp(true);
        setIsInfoToolTipOpen(true);
      })
      .catch((error) => {
        setIsSignedUp(false);
        setIsInfoToolTipOpen(true);

        switch (error.status) {
          case 400:
            console.error('Некорректно заполнено одно из полей');
            break;
          default:
            console.error(error.status + ': Произошла ошибка.');
        }
      });
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
          <Header onSignOut={signOut} userEmail={userEmail} />

          <Switch>
            <Route exact path="/sign-in">
              <Login signIn={signIn} />
            </Route>

            <Route exact path="/sign-up">
              <Register signUp={signUp} />
            </Route>

            <ProtectedRoute
              path="/"
              redirectTo="/sign-in"
              hasPermission={isLogged}
              component={Main}
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />

            {isLogged && <Footer />}
          </Switch>

          {/* popus below are visible only if opened */}

          <InfoTooltip
            isOpen={isInfoToolTipOpen}
            isSuccessful={isSignedUp}
            onClose={closeAllPopups}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlaceSubmit={handleAddPlaceSubmit}
          />

          <PopupWithForm
            title="Вы уверены?"
            name="confirm-delete"
            buttonText="Да"
          />

          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
