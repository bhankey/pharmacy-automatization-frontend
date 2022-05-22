import axios from 'axios';
import api from "./api";
const BASE = '/auth/'; // TODO move to config
class AuthService {
    login(user) {
        return api
            .post(BASE + 'login', {
                email: user.email,
                password: user.password
            }).then(response => {
                if (response.data.access_token) {
                    user = getFullClient(response.data);

                    localStorage.setItem("user", JSON.stringify(user));
                }

                return user ?? null;
            });
    }

    refresh(refreshToken) {
        return axios
            .post(BASE + 'refresh', {
                token: refreshToken,
            }).then(response => {
                if (response.data.access_token) {
                    let user = getFullClient(response.data);

                    localStorage.setItem("user", JSON.stringify(user));
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user')
    }
}

function getFullClient(loginResp) {
    let user = parseJwt(loginResp.access_token);

    user.id = user.user_id;
    user.refreshToken = loginResp.refresh_token;
    user.accessToken = loginResp.access_token;

    return user;
}

function parseJwt (token) {
    if (!token) {
        return null;
    }
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export default new AuthService();