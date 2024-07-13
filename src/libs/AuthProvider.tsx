import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {Collections, User} from './types';
import AuthContext from './AuthContext';
import React from 'react';

export default ({children}: {children: React.ReactNode}) => {
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [processingCreateAccount, setProcessingCreateAccount] = useState(false);
  const [processingLogin, setProcessingLogin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onUserChanged(async fbUser => {
      if (fbUser != null) {
        // login
        setUser({
          userId: fbUser.uid ?? '',
          email: fbUser.email ?? '',
          name: fbUser.displayName ?? '',
        });
      } else {
        //logout
        setUser(null);
      }
      setInitialized(true);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const createAccount = useCallback(
    async (email: string, password: string, name: string) => {
      try {
        setProcessingCreateAccount(true);
        const {user: currentUser} = await auth().createUserWithEmailAndPassword(
          email,
          password,
        );
        await currentUser.updateProfile({displayName: name});
        await firestore()
          .collection(Collections.USERS)
          .doc(currentUser.uid)
          .set({
            userId: currentUser.uid,
            email,
            name,
          });
      } finally {
        setProcessingCreateAccount(false);
      }
    },
    [],
  );

  const login = useCallback(async (email: string, password: string) => {
    try {
      setProcessingLogin(true);
      await auth().signInWithEmailAndPassword(email, password);
    } finally {
      setProcessingLogin(false);
    }
  }, []);
  const value = useMemo(() => {
    return {
      initialized,
      user,
      createAccount,
      processingCreateAccount,
      login,
      processingLogin,
    };
  }, [
    initialized,
    user,
    createAccount,
    processingCreateAccount,
    login,
    processingLogin,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
