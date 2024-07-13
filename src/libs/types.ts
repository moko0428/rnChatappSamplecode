// 스크린 타입
export type RootStackParamList = {
  CreateAccount: undefined;
  Login: undefined;
  Home: undefined;
  Loading: undefined;
  Chat: {
    userIds: string[];
    other: User;
  };
};

export interface User {
  userId: string;
  email: string;
  name: string;
}

// 파이어베이스 firestore 콜렉션
export enum Collections {
  USERS = 'users',
  CHATS = 'chats',
  MESSAGES = 'messages',
}

export interface Chat {
  id: string;
  userIds: string[];
  users: User[];
}

export interface Message {
  id: string;
  user: User;
  text: string;
  createdAt: Date;
}

export interface FirestoreMessageData {
  text: string;
  user: User;
  createdAt: Date;
}
