// frontend/src/context/AuthContext.js
import { createContext } from 'react';

const AuthContext = createContext({
    user: null,
    login: () => {},
    register: () => {},
    logout: () => {},
    isAuthenticated: false
});

export default AuthContext;
