import React from "react";
import CurrentUserContext from "../contexts/CurrentUserContext.js";

function Card({card, onCardClick, onCardLike, onCardDelete}) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = card.owner === currentUser._id;
  const isLiked = card.likes.some(like => like === currentUser._id);
  const heartButtonClassName = `card__heart ${isLiked ? 'card__heart_state_liked' : 'card__heart_state_not_liked' }`;

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <figure className="card">
      {isOwn && (
        <button className="card__delete" type="button" onClick={handleDeleteClick} />
      )}
      <img
        src={card.link}
        alt={card.name}
        className="card__image"
        onClick={handleClick}
      />
      <figcaption className="card__caption">
        <p className="card__name">{card.name}</p>
        <div className="card__like-container">
          <button className={heartButtonClassName} type="button" onClick={handleLikeClick} />
          <p className="card__likes">{card.likes.length}</p>
        </div>
      </figcaption>
    </figure>
  );
}

export default Card;
