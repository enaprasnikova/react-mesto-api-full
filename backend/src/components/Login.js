import React from 'react';
import { useState } from 'react';
import Header from "./Header";


function Login({ history, handleAuthorize }) {

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
    if (!formParams.email || !formParams.password){
      return;
    }
    handleAuthorize(formParams, setFormParams)
  }

  function redirectToRegister() {
    history.push('/sign-up')
  }

  return (

    <div className="page">
      <Header
        title={'Регистрация'}
        onClick={redirectToRegister}
      />
      <section className="login">
        <h2 className="login__title">Вход</h2>
        <form className="login__form" onSubmit={handleSubmit} noValidate>
          <input id="email" type="email" name="email" value={formParams.email} onChange={handleChange} placeholder="Email"
                 className="login__input"/>
          <input id="password" type="password" name="password" value={formParams.password} onChange={handleChange} placeholder="Пароль"
                 className="login__input"/>
          <button type="submit" className="login__submit-button">Войти</button>
        </form>
      </section>
    </div>

  )
}

export default Login;