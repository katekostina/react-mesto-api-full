import React from "react";

function PopupWithForm({name, title, isOpen, onClose, onSubmit, children, buttonText}) {
  return (
    <article
      className={`popup popup_type_${name} ${isOpen ? "popup_shown" : ""}`}
    >
      <div className="popup__overlay" />
      <form className="popup__form" action="#" method="post" name={name} onSubmit={onSubmit}>
        <button
          className="popup__close-button"
          type="button"
          onClick={onClose}
        />
        <h2 className="popup__heading">{title}</h2>
        {children}
        <button className="popup__submit-button" type="submit">{buttonText}</button>
      </form>
    </article>
  );
}

export default PopupWithForm;
