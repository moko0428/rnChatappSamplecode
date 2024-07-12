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
      setProcessingCreateAccount(true);
      try {
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

  const value = useMemo(() => {
    return {
      initialized,
      user,
      createAccount,
      processingCreateAccount,
    };
  }, [initialized, user, createAccount, processingCreateAccount]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
