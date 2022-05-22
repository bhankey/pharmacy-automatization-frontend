import axiosInstance from "./api";
import TokenService from "./user.service";
const setup = (store) => {
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = TokenService.getLocalAccessToken();
            if (token) {
                config.headers["Authorization"] = token;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    axiosInstance.interceptors.response.use(
        (res) => {
            return res;
        },
        async (err) => {
            const originalConfig = err.config;

            console.log(originalConfig)
            if (err.response) {
                // Access Token was expired
                if (err.response.status === 401 && !originalConfig._retry) {
                    originalConfig._retry = true;
                    try {
                        const response = await axiosInstance.post("/auth/refresh", {
                            token: TokenService.getLocalRefreshToken(),
                        });

                        console.log("RESP", response);

                        store.dispatch('auth/refreshToken', response.data.access_token, response.data.refresh_token);
                        TokenService.updateLocalAccessToken(response.data.access_token, response.data.refresh_token);
                        return axiosInstance(originalConfig);
                    } catch (_error) {
                        return Promise.reject(_error);
                    }
                }
            }
            return Promise.reject(err);
        }
    );
};
export default setup;