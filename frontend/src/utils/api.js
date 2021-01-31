const handleOriginalResponse = (res) => {
  if (res.ok) {
    return res.json().then((result) => result.data);
  }

  res
    .json()
    .then((result) => console.log('Api error:', result))
    .catch((err) => console.log('Api error:', err));

  return Promise.reject(`Error: ${res.status}`);
};

const basicHeaders = {
  "Content-Type": "application/json",
};

class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
    this._headers = basicHeaders;
  }

  setToken(token) {
    this._headers = {
      ...basicHeaders,
      "Authorization" : `Bearer ${token}`,
    };
  }

  removeToken() {
    this._headers = basicHeaders;
  }

  getUserProfile() {
    return fetch(`${this._baseUrl}/users/me`, { headers: this._headers }).then(
      handleOriginalResponse
    );
  }

  getCards() {
    return fetch(`${this._baseUrl}/cards`, { headers: this._headers }).then(
      handleOriginalResponse
    );
  }

  patchUserProfile(name, about) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    }).then(handleOriginalResponse);
  }

  patchUserAvatar(avatar) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: avatar,
      }),
    }).then(handleOriginalResponse);
  }

  postNewCard(name, link) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then(handleOriginalResponse);
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    }).then(handleOriginalResponse);
  }

  changeLikeCardStatus(cardId, isLiked) {
    if (isLiked) {
      return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
        method: "PUT",
        headers: this._headers,
      }).then(handleOriginalResponse);
    } else {
      return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
        method: "DELETE",
        headers: this._headers,
      }).then(handleOriginalResponse);
    }
  }
}

// Create object with my token and base server url
const api = new Api({
  baseUrl: "https://api.katekostina.students.nomoreparties.xyz",
});

export default api;
