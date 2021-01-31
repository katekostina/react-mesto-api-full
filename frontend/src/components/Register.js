import React from "react";
import { Link } from "react-router-dom";

function Register ({ signUp }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleSignUp(e) {
    e.preventDefault();
    signUp(email, password);
  }

  return (
    <article className="authentication">
      <form className="authentication__form" onSubmit={handleSignUp}>
        <div className="authentication__content">
          <h2 className="authentication__header">Регистрация</h2>
          <input
            className="authentication__input"
            type="email"
            value={email}
            placeholder="Email"
            minLength="1"
            maxLength="30"
            required
            onChange={handleEmailChange}
          />
          <input
            className="authentication__input"
            type="password"
            value={password}
            placeholder="Пароль"
            minLength="1"
            maxLength="30"
            required
            onChange={handlePasswordChange}
          />
        </div>
        <button className="authentication__submit-button" type="submit">Зарегистрироваться</button>
        <p className="authentication__option">Уже зарегистрированы? <Link className="authentication__link" to="/sing-ip">Войти</Link></p>
      </form>
    </article>
  );
}

export default Register;
