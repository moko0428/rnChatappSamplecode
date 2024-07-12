import {createContext} from 'react';
import {User} from './types';

export interface AuthContextProp {
  initialized: boolean;
  user: User | null;
  createAccount: (
    email: string,
    password: string,
    name: string,
  ) => Promise<void>;
  processingCreateAccount: boolean;
}

// context 초기값 설정
const AuthContext = createContext<AuthContextProp>({
  initialized: false,
  user: null,
  createAccount: async () => {},
  processingCreateAccount: false,
});

export default AuthContext;
