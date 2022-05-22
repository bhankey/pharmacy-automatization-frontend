import AuthService from '../services/auth.service';

let user = JSON.parse(localStorage.getItem('user'));

const initialState = user
    ? { status: { loggedIn: true }, user }
    : { status: { loggedIn: false }, user: null };

export const auth = {
    namespaced: true,
    state: initialState,
    actions: {
        login({ commit }, user) {
            return AuthService.login(user).then(
                user => {
                    commit('loginSuccess', user);

                    return Promise.resolve();
                },
                error => {
                    commit('loginFailure');

                    return Promise.reject(error);
                }
            );
        },
        logout({ commit }) {
            AuthService.logout();

            commit('logout');
        },

        refreshToken({ commit }, accessToken, refreshToken) {
            commit('refreshToken', accessToken, refreshToken);
        }
    },
    mutations: {
        loginSuccess(state, user) {
            console.log(user)
            state.status.loggedIn = true;
            state.user = user;
        },
        loginFailure(state) {
            state.status.loggedIn = false;
            state.user = null;
        },
        logout(state) {
            state.status.loggedIn = false;
            state.user = null;
        },

        refreshToken(state, accessToken, refreshToken) {
            console.log("COMMIT UPDATE BEFORE", state.user)

            state.status.loggedIn = true;
            state.user = {
                ...state.user,
                accessToken: accessToken,
                refreshToken: refreshToken,
            };

            console.log("COMMIT UPDATE AFTER", state.user)
        }
    },
};
