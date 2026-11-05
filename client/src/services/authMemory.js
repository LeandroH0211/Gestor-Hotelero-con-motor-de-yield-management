let accessTokenInMemory = null;

export default {
    getToken() {
        return accessTokenInMemory;
    },
    setToken(token) {
        accessTokenInMemory = token;
    },
    clearToken() {
        accessTokenInMemory = null;
    }
};