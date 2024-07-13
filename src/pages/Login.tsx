import {useCallback, useContext, useMemo, useState} from 'react';
import Screens from '../components/Screens';
import validator from 'validator';
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
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../libs/types';
import {useNavigation} from '@react-navigation/native';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const {login, processingLogin} = useContext(AuthContext);
  const {navigate} =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const onPressShowPassword = () => {
    setShowPassword(!showPassword);
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
    return null;
  }, [password]);

  const onChageEmailText = useCallback((text: string) => {
    setEmail(text);
  }, []);
  const onChagePasswordText = useCallback((text: string) => {
    setPassword(text);
  }, []);

  const onPressLoginButton = useCallback(async () => {
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert(error.message);
    }
  }, [login, email, password]);

  const onPressCreateAccountButton = useCallback(() => {
    navigate('CreateAccount');
  }, [navigate]);

  const loginButtonEnabled = useMemo(() => {
    return emailErrorText == null && passwordErrorText == null;
  }, [emailErrorText, passwordErrorText]);

  const loginButtonStyle = useMemo(() => {
    if (loginButtonEnabled) {
      return styles.loginButton;
    }
    return [styles.loginButton, styles.disabledLoginButton];
  }, []);

  return (
    <Screens title="로그인">
      <View style={styles.container}>
        {processingLogin ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          <>
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

            <View>
              <TouchableOpacity
                onPress={onPressLoginButton}
                style={loginButtonStyle}
                disabled={!loginButtonEnabled}>
                <Text style={styles.loginText}>로그인</Text>
              </TouchableOpacity>

              <View style={styles.createAccountContainer}>
                <Text style={styles.createAccountText}>계정이 없으신가요?</Text>
                <TouchableOpacity onPress={onPressCreateAccountButton}>
                  <Text style={styles.createAccountBtnText}>회원가입</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>
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
    color: Colors.BLACK, // 안드로이드와 iOS의 디폴트 색상이 다를 수도 있다.
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
  loginButton: {
    backgroundColor: Colors.MAIN_LIGHT,
    borderRadius: 12,
    alignItems: 'center',
    padding: 20,
  },
  loginText: {
    color: Colors.WHITE,
    fontSize: 20,
    fontWeight: 'bold',
  },
  disabledLoginButton: {
    backgroundColor: Colors.MAIN,
  },
  createAccountContainer: {
    marginTop: 6,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    flexDirection: 'row',
  },
  createAccountText: {
    fontSize: 16,
  },
  createAccountBtnText: {
    fontSize: 14,
    color: Colors.BLUE,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
