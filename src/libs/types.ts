// 스크린 타입
export type RootStackParamList = {
  CreateAccount: undefined;
  Login: undefined;
};

export interface User {
  userId: string;
  email: string;
  name: string;
}

// 파이어베이스 firestore 콜렉션
export enum Collections {
  USERS = 'users',
}
