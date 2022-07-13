class Api {
  constructor(options) {
    this._options = options;
  }

  _makeRequest(url, options = {}) {
    return fetch(url, options)
    .then((res) => res.ok ? res.json() : Promise.reject(res.status))
  }

  getInitialCards() {
    return this._makeRequest(`${this._options.baseUrl}/cards`, {
      headers: this._options.headers
    })
  }

  getUserInfo() {
    return this._makeRequest(`${this._options.baseUrl}/users/me`, {
      headers: this._options.headers
    })       
  }

  editProfile(name, info) {
    return this._makeRequest(`${this._options.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._options.headers,
      body: JSON.stringify({
        name: name,
        about: info
      })
    })       
  }

  addCard(name, link) {
    return this._makeRequest(`${this._options.baseUrl}/cards`, {
      method: 'POST',
      headers: this._options.headers,
      body: JSON.stringify({
        name,
        link
      })
    })       
  }

  deleteCard(id) {
    return this._makeRequest(`${this._options.baseUrl}/cards/${id}`, {
      method: 'DELETE',
      headers: this._options.headers
    })       
  }

  deleteLike(id) {
    return this._makeRequest(`${this._options.baseUrl}/cards/${id}/likes`, {
      method: 'DELETE',
      headers: this._options.headers
    }) 
  }

  addLike(id) {
    return this._makeRequest(`${this._options.baseUrl}/cards/${id}/likes`, {
      method: 'PUT',
      headers: this._options.headers
    }) 
  }

  setLike(id, isLiked) {
    return isLiked ? this.deleteLike(id) : this.addLike(id)
  }

  changeAvatar(data) {
    return this._makeRequest(`${this._options.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._options.headers,
      body: JSON.stringify(data)
    })      
  }
}

export const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-39',
  headers: {
    authorization: 'cddcd137-fbb7-43b3-abeb-f608589b305e',
    'Content-Type': 'application/json'
  }
});