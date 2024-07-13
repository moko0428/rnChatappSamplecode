import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback} from 'react';
import {Colors} from '../modules/Colors';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ScreenProps {
  title?: string;
  children?: React.ReactNode;
}
export default ({title, children}: ScreenProps) => {
  const {goBack, canGoBack} = useNavigation();
  const onPressBackButton = useCallback(() => {
    goBack();
  }, [goBack]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.left}>
          {canGoBack() && (
            <TouchableOpacity onPress={onPressBackButton}>
              <Icon name="arrow-back" style={styles.backButtonIcon} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.center}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <View style={styles.right} />
      </View>
      <View style={styles.body}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 40,
    flexDirection: 'row',
  },
  left: {
    flex: 1,
    justifyContent: 'center',
  },
  center: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.BLACK,
  },
  body: {
    flex: 1,
  },

  backButtonIcon: {
    fontSize: 20,
    color: Colors.BLACK,
    marginLeft: 20,
  },
});
