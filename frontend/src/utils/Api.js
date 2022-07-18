const BASE_URL = `${window.location.protocol}${process.env.REACT_APP_API_URL || 'http://localhost:3001'}`;

class Api {
  constructor(options) {
    this._options = options;
  }

  _makeRequest(url, options = {}) {
    return fetch(url, options)
    .then((res) => res.ok ? res.json() : Promise.reject(res.status))
  }

  getInitialCards() {
    this._options.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    return this._makeRequest(`${this._options.baseUrl}/cards`, {
      headers: this._options.headers,
      credentials: 'include',
    })
  }

  getUserInfo() {
    this._options.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    return this._makeRequest(`${this._options.baseUrl}/users/me`, {
      headers: this._options.headers,
      credentials: 'include',
    })       
  }

  editProfile(name, info) {
    this._options.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    return this._makeRequest(`${this._options.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._options.headers,
      credentials: 'include',
      body: JSON.stringify({
        name: name,
        about: info
      })
    })       
  }

  addCard(name, link) {
    this._options.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    return this._makeRequest(`${this._options.baseUrl}/cards`, {
      method: 'POST',
      headers: this._options.headers,
      credentials: 'include',
      body: JSON.stringify({
        name,
        link
      })
    })       
  }

  deleteCard(id) {
    this._options.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    return this._makeRequest(`${this._options.baseUrl}/cards/${id}`, {
      method: 'DELETE',
      headers: this._options.headers,
      credentials: 'include',
    })       
  }

  deleteLike(id) {
    this._options.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    return this._makeRequest(`${this._options.baseUrl}/cards/${id}/likes`, {
      method: 'DELETE',
      headers: this._options.headers,
      credentials: 'include',
    }) 
  }

  addLike(id) {
    this._options.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    return this._makeRequest(`${this._options.baseUrl}/cards/${id}/likes`, {
      method: 'PUT',
      headers: this._options.headers,
      credentials: 'include',
    }) 
  }

  setLike(id, isLiked) {
    return isLiked ? this.deleteLike(id) : this.addLike(id)
  }

  changeAvatar(data) {
    this._options.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    return this._makeRequest(`${this._options.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._options.headers,
      body: JSON.stringify(data),
      credentials: 'include',
    })      
  }
}

export const api = new Api({
  baseUrl: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});