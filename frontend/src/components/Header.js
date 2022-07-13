import React from 'react';

function Header( {title, onClick, email} ) {
  return (
    <header className="header">
      <a href="#" className="header__logo"></a>
      <div className="header__container">
        <h1 className="header__email">{email}</h1>
        <button onClick={onClick} className="header__button">{title}</button>
      </div>
    </header>
  )
}

export default Header;