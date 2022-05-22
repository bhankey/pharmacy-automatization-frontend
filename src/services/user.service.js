import api from "./api"
const BASE = '/user/';

class UserService {
    register(user) {
        return api.post(BASE + 'register', {
            "name": user.name,
            "surname": user.surname,
            "email": user.email,
            "password": user.password,
            "default_pharmacy_id": user.default_pharmacy_id,
            "role": user.role,
        })
    }

    requestToChangePassword(email) {
        return api.post(BASE + 'request_to_change_password', {
            "email": email,
        });
    }

    getAllUser() {
        return api.get(BASE + 'all');
    }

    updateUser(user) {
        return api.post(BASE + 'update', {
            "id": user.id,
            "name": user.name,
            "surname": user.surname,
            "email": user.email,
            "password": user.password,
            "default_pharmacy_id": user.default_pharmacy_id,
            "role": user.role,
        })
    }

    getLocalRefreshToken() {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.refreshToken;
    }

    getLocalAccessToken() {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.accessToken;
    }

    updateLocalAccessToken(accessToken, refreshToken) {
        let user = JSON.parse(localStorage.getItem("user"));

        console.log("LOCAL UPDATE BEFORE", user)

        user.accessToken = accessToken;
        user.refreshToken = refreshToken;

        console.log("LOCAL UPDATE AFTER", user)
        localStorage.setItem("user", JSON.stringify(user));
    }

    getLocalUser() {
        return JSON.parse(localStorage.getItem("user"));
    }

    setLocalUser(user) {
        console.log(JSON.stringify(user));
        localStorage.setItem("user", JSON.stringify(user));
    }
    removeLocalUser() {
        localStorage.removeItem("user");
    }
}
export default new UserService();