import {useCallback, useEffect, useState} from 'react';

import firestore from '@react-native-firebase/firestore';
import {
  Chat,
  Collections,
  FirestoreMessageData,
  Message,
  User,
} from '../libs/types';
import _ from 'lodash';

const getChatKey = (userIds: string[]) => {
  return _.orderBy(userIds, userId => userId, 'asc');
};

const useChat = (userIds: string[]) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [loadingChat, setLoadingChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const addNewMessage = useCallback((newMessage: Message[]) => {
    setMessages(prevMessage => {
      return _.uniqBy(newMessage.concat(prevMessage), m => m.id);
    });
  }, []);
  const loadChat = useCallback(async () => {
    try {
      setLoadingChat(true);

      const chatSnapshot = firestore()
        .collection(Collections.CHATS)
        .where('userIds', '==', getChatKey(userIds))
        .get();

      if ((await chatSnapshot).docs.length > 0) {
        const doc = (await chatSnapshot).docs[0];
        setChat({
          id: doc.id,
          userIds: doc.data().userIds as string[],
          users: doc.data().users as User[],
        });
        return;
      }
      const usersSnapshot = firestore()
        .collection(Collections.USERS)
        .where('userId', 'in', userIds)
        .get();
      const users = (await usersSnapshot).docs.map(doc => doc.data() as User);
      const data = {
        userIds: getChatKey(userIds),
        users,
      };
      const doc = await firestore().collection(Collections.CHATS).add(data);
      setChat({
        id: doc.id,
        ...data,
      });
    } finally {
      setLoadingChat(false);
    }
  }, [userIds]);

  useEffect(() => {
    loadChat();
  }, [loadChat]);

  const sendMessage = useCallback(
    async (text: string, user: User) => {
      if (chat?.id == null) {
        throw new Error('Chat is not loaded');
      }
      try {
        setSending(true);
        const data: FirestoreMessageData = {
          text,
          user,
          createdAt: new Date(),
        };
        const doc = await firestore()
          .collection(Collections.CHATS)
          .doc(chat.id)
          .collection(Collections.MESSAGES)
          .add(data);

        addNewMessage([
          {
            id: doc.id,
            ...data,
          },
        ]);
      } finally {
        setSending(false);
      }
    },
    [chat?.id, addNewMessage],
  );

  useEffect(() => {
    if (chat?.id == null) {
      return;
    }
    setLoadingMessages(true);

    const unsubscribe = firestore()
      .collection(Collections.CHATS)
      .doc(chat?.id)
      .collection(Collections.MESSAGES)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const newMessage = snapshot
          .docChanges()
          .filter(({type}) => type === 'added')
          .map(docChange => {
            const {doc} = docChange;
            const docData = doc.data();
            const newMessage: Message = {
              id: doc.id,
              text: docData.text,
              user: docData.user,
              createdAt: docData.createdAt.toDate(),
            };
            return newMessage;
          });

        addNewMessage(newMessage);
        setLoadingMessages(false);
      });
    return () => {
      unsubscribe();
    };
  }, [addNewMessage, chat?.id]);
  return {
    chat,
    loadingChat,
    sendMessage,
    messages,
    sending,
    loadingMessages,
  };
};

export default useChat;
