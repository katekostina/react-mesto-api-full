import React from "react";

function Login({ signIn }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleSignIn(e) {
    e.preventDefault();
    signIn(email, password);
  }

  return (
    <article className="authentication">
      <form className="authentication__form">
        <div className="authentication__content">
          <h2 className="authentication__header">Вход</h2>
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
        <button className="authentication__submit-button" onClick={handleSignIn}>Войти</button>
      </form>
    </article>
  );
}

export default Login;
