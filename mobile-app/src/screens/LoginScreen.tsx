import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  I18nManager,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

export default function LoginScreen() {
  const { t, i18n } = useTranslation();
  const { login } = useAuth();
  const [idNumber, setIdNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isRTL = i18n.language === 'ar';

  const handleLogin = async () => {
    if (!idNumber || !phone) {
      Alert.alert(t('common.error'), 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login({ idNumber, phone });
    } catch (error: any) {
      Alert.alert(
        t('common.error'),
        error.message || t('auth.loginError')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.title, isRTL && styles.textRTL]}>
            {t('auth.welcome')}
          </Text>
          <Text style={[styles.subtitle, isRTL && styles.textRTL]}>
            {t('auth.enterCredentials')}
          </Text>
        </View>

        <Card style={styles.card}>
          <Input
            label={t('auth.idNumber')}
            value={idNumber}
            onChangeText={setIdNumber}
            placeholder="1234567890"
            keyboardType="numeric"
            isRTL={isRTL}
          />

          <Input
            label={t('auth.phone')}
            value={phone}
            onChangeText={setPhone}
            placeholder="05XXXXXXXX"
            keyboardType="phone-pad"
            isRTL={isRTL}
          />

          <Button
            title={t('auth.loginButton')}
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  textRTL: {
    textAlign: 'right',
  },
  card: {
    padding: 24,
  },
  loginButton: {
    marginTop: 8,
  },
});
