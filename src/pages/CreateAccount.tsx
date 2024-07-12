import {useCallback, useContext, useMemo, useState} from 'react';
import validator from 'validator';
import Screens from '../components/Screens';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from '../modules/Colors';
import AuthContext from '../libs/AuthContext';

export default () => {
  const {createAccount, processingCreateAccount} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const onPressShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onPressShowPasswordConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  const emailErrorText = useMemo(() => {
    if (email.length === 0) {
      return '이메일을 입력해주세요.';
    }
    if (!validator.isEmail(email)) {
      return '올바른 이메일 형식이 아닙니다.';
    }
    return null;
  }, [email]);
  const passwordErrorText = useMemo(() => {
    if (password.length === 0) {
      return '비밀번호를 입력해주세요.';
    }
    if (password.length < 6) {
      return '비밀번호는 6자리 이상이어야합니다.';
    }
    if (password !== passwordConfirm) {
      return '비밀번호를 확인해주세요.';
    }
    return null;
  }, [password, passwordConfirm]);

  const confirmErrorText = useMemo(() => {
    if (passwordConfirm.length === 0) {
      return '비밀번호 확인을 입력해주세요.';
    }
    if (passwordConfirm.length < 6) {
      return '비밀번호를 확인해주세요.';
    }
    if (password !== passwordConfirm) {
      return '비밀번호와 다릅니다.';
    }
  }, [password, passwordConfirm]);

  const nameErrorText = useMemo(() => {
    if (name.length === 0) {
      return '이름을 입력해주세요.';
    }
  }, [name]);

  const onChageEmailText = useCallback((text: string) => {
    setEmail(text);
  }, []);
  const onChagePasswordText = useCallback((text: string) => {
    setPassword(text);
  }, []);
  const onChagePasswordConfirmText = useCallback((text: string) => {
    setPasswordConfirm(text);
  }, []);
  const onChageNameText = useCallback((text: string) => {
    setName(text);
  }, []);

  const onPressCreateAccountButton = useCallback(async () => {
    try {
      await createAccount(email, password, name);
    } catch (error: any) {
      Alert.alert(error.message);
    }
  }, [createAccount, email, password, name]);
  const onPressLoginButton = useCallback(() => {}, []);

  // 에러가 있을 시 버튼 클릭 막는 스타일
  const createAccountButtonEnabled = useMemo(() => {
    return (
      emailErrorText == null &&
      passwordErrorText == null &&
      confirmErrorText == null &&
      nameErrorText == null
    );
  }, [emailErrorText, passwordErrorText, confirmErrorText, nameErrorText]);
  const createAccountButtonStyle = useMemo(() => {
    if (createAccountButtonEnabled) {
      return styles.createAccountButton;
    }
    return [styles.createAccountButton, styles.disabledCreateAccountButton];
  }, []);

  return (
    <Screens title="회원가입">
      {processingCreateAccount ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView style={styles.container}>
          <View style={styles.section}>
            <Text style={styles.title}>이메일</Text>
            <TextInput
              value={email}
              style={styles.input}
              onChangeText={onChageEmailText}
              autoCapitalize={'none'}
            />
            {emailErrorText && (
              <Text style={styles.errorText}>{emailErrorText}</Text>
            )}
          </View>
          <View style={styles.section}>
            <Text style={styles.title}>비밀번호</Text>
            <View>
              <TextInput
                value={password}
                style={styles.input}
                onChangeText={onChagePasswordText}
                autoCapitalize={'none'}
                secureTextEntry={showPassword ? true : false}
              />
              <TouchableOpacity
                style={styles.showPasswordBtn}
                onPress={onPressShowPassword}>
                <Text>보기</Text>
              </TouchableOpacity>
            </View>
            {passwordErrorText && (
              <Text style={styles.errorText}>{passwordErrorText}</Text>
            )}
          </View>
          <View style={styles.section}>
            <Text style={styles.title}>비밀번호 확인</Text>
            <View>
              <TextInput
                value={passwordConfirm}
                style={styles.input}
                onChangeText={onChagePasswordConfirmText}
                autoCapitalize={'none'}
                secureTextEntry={showPasswordConfirm ? true : false}
              />
              <TouchableOpacity
                style={styles.showPasswordBtn}
                onPress={onPressShowPasswordConfirm}>
                <Text>보기</Text>
              </TouchableOpacity>
            </View>
            {confirmErrorText && (
              <Text style={styles.errorText}>{confirmErrorText}</Text>
            )}
          </View>
          <View style={styles.section}>
            <Text style={styles.title}>이름</Text>
            <TextInput
              value={name}
              style={styles.input}
              onChangeText={onChageNameText}
              autoCapitalize={'none'}
            />

            {nameErrorText && (
              <Text style={styles.errorText}>{nameErrorText}</Text>
            )}
          </View>
          <View>
            <TouchableOpacity
              onPress={onPressCreateAccountButton}
              style={createAccountButtonStyle}>
              <Text style={styles.createAccountText}>회원가입</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>이미 계정이 있으신가요?</Text>
              <TouchableOpacity onPress={onPressLoginButton}>
                <Text style={styles.loginBtnText}>로그인하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </Screens>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    marginTop: 20,
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    borderColor: Colors.GRAY,
    fontSize: 16,
    position: 'relative',
  },
  errorText: {
    fontSize: 14,
    color: Colors.RED,
    marginTop: 4,
  },
  showPasswordBtn: {
    position: 'absolute',
    right: 12,
    top: 35,
  },
  createAccountButton: {
    backgroundColor: Colors.MAIN_LIGHT,
    borderRadius: 12,
    alignItems: 'center',
    padding: 20,
  },
  createAccountText: {
    color: Colors.WHITE,
    fontSize: 20,
    fontWeight: 'bold',
  },
  disabledCreateAccountButton: {
    backgroundColor: Colors.MAIN,
  },
  loginContainer: {
    marginTop: 6,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    flexDirection: 'row',
  },
  loginText: {
    fontSize: 16,
  },
  loginBtnText: {
    fontSize: 14,
    color: Colors.BLUE,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
