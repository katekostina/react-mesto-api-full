import React, { Component } from "react";
import { withRouter, NavLink } from "react-router-dom";

class Header extends Component {
  constructor(props) {
    super(props);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  handleSignOut () {
    this.props.history.push('/sign-in');
    this.props.onSignOut();
  }
  render () {
    const path = this.props.location.pathname;
    let navigation;
    switch (path) {
        case '/sign-up':
          navigation = <NavLink className="header__link" to="/sing-in">Войти</NavLink>
        break;
        case '/sign-in':
          navigation = <NavLink className="header__link" to="/sign-up">Регистрация</NavLink>
        break;
        case '/':
          navigation = <>
            <p className="header__email">{this.props.userEmail}</p>
            <button className="header__logout" onClick={this.handleSignOut}>Выйти</button>
          </>
        break;
        default:
        break;
    }
    return (
      <header className="header">
        <div className="header__content">
          <div className="header__logo"></div>
          <div className="header__navigation">{navigation}</div>
        </div>
        <hr className="header__line" />
      </header>
    );
  }
}

export default withRouter(Header);
