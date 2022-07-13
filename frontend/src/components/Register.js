import React from 'react';
import { useState } from 'react';
import Header from "./Header";
import { Link } from 'react-router-dom';

function Register({ onSubmit, redirectToLogin, handleRegister }) {

  const [formParams, setFormParams] = useState({
    email: '',
    password: '',
  });

  function handleChange(e) {
    const {name, value} = e.target;
    setFormParams((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function handleSubmit(e){
    e.preventDefault()
    let { password, email } = formParams;
    handleRegister(password, email)
    onSubmit()
  }

  return (
    <div className="page">

      <Header
        title={'Войти'}
        onClick={redirectToLogin}
      />

      <section className="register">

        <h2 className="register__title">Регистрация</h2>
        <form className="register__form" onSubmit={handleSubmit} noValidate >
          <input id="email" type="email" name="email" value={formParams.email} onChange={handleChange} placeholder="Email"
                 className="register__input"/>
          <input id="password" type="password" value={formParams.password} onChange={handleChange} name="password" placeholder="Пароль"
                 className="register__input"/>
          <button type="submit" className="register__submit-button">Зарегистрироваться</button>
        </form>
        <div className="register__sign-in">
          <p className="register__text">Уже зарегистрированы?</p>
          <Link to="/sign-in" className="register__login-link">Войти</Link>
        </div>

      </section>

    </div>

  )
}

export default Register;