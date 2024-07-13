import {RouteProp, useRoute} from '@react-navigation/native';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useCallback, useContext, useMemo, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Message from './Message';
import {RootStackParamList} from '../../libs/types';
import AuthContext from '../../libs/AuthContext';
import useChat from '../../hooks/useChat';
import {Colors} from '../../modules/Colors';
import Screens from '../../components/Screens';

export default function ChatScreen() {
  const {params} = useRoute<RouteProp<RootStackParamList, 'Chat'>>();
  const {other, userIds} = params;
  const {loadingChat, chat, sendMessage, messages, loadingMessages} =
    useChat(userIds);
  const [text, setText] = useState('');
  const {user: me} = useContext(AuthContext);
  const loading = loadingChat || loadingMessages;

  const onChangeText = useCallback((newText: string) => {
    setText(newText);
  }, []);

  const onPressSendButton = useCallback(() => {
    // send text
    if (me != null) {
      sendMessage(text, me);
      setText('');
    }
  }, [me, sendMessage, text]);

  const disabledSendButtonStyle = [
    styles.sendButton,
    {backgroundColor: Colors.GRAY},
  ];

  const sendDisabled = useMemo(() => text.length === 0, [text]);
  const renderChat = useCallback(() => {
    if (chat == null) {
      return null;
    }
    return (
      <View style={styles.chatContainer}>
        <View style={styles.memdersSection}>
          <Text style={styles.membersTitleText}>대화상대</Text>
          <FlatList
            data={chat.users}
            renderItem={({item: user}) => (
              <View style={styles.userProfile}>
                <Text style={styles.userProfileText}>{user.name[0]}</Text>
              </View>
            )}
            horizontal
          />
        </View>
        <FlatList
          style={styles.messageList}
          data={messages}
          renderItem={({item: message}) => {
            return (
              <Message
                name={message.user.name}
                text={message.text}
                createdAt={message.createdAt}
                isOtherMessage={message.user.userId !== me?.userId}
              />
            );
          }}
          inverted
          ItemSeparatorComponent={() => (
            <View style={styles.messageSeparator} />
          )}
        />
        <View style={styles.inputContainer}>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={text}
              onChangeText={onChangeText}
            />
          </View>
          <TouchableOpacity
            style={sendDisabled ? disabledSendButtonStyle : styles.sendButton}
            disabled={sendDisabled}
            onPress={onPressSendButton}>
            <Icon name="send" style={styles.sendIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [
    chat,
    onChangeText,
    text,
    sendDisabled,
    onPressSendButton,
    messages,
    me?.userId,
  ]);
  return (
    <Screens title={other.name}>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          renderChat()
        )}
      </View>
    </Screens>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    flex: 1,
    padding: 20,
  },
  memdersSection: {},
  membersTitleText: {
    fontSize: 16,
    color: Colors.BLACK,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userProfile: {
    width: 34,
    height: 34,
    borderRadius: 34 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.LIGHTGRAY,
    backgroundColor: Colors.BLACK,
  },
  userProfileText: {
    color: Colors.WHITE,
  },
  messageList: {
    flex: 1,
    marginVertical: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputContainer: {
    flex: 1,
    marginRight: 10,
    borderRadius: 24,
    borderColor: Colors.BLACK,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 10,
    minHeight: 50,
    justifyContent: 'center',
  },
  textInput: {
    paddingVertical: 0,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BLACK,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  sendText: {
    color: Colors.WHITE,
  },
  sendIcon: {
    color: Colors.WHITE,
    fontSize: 18,
  },
  messageSeparator: {
    height: 8,
  },
});
