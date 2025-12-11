import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Loading from '../components/Loading';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const { member, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isRTL = i18n.language === 'ar';

  const handleLogout = () => {
    Alert.alert(
      t('profile.title'),
      t('profile.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.logout'),
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            await logout();
          },
        },
      ]
    );
  };

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    await i18n.changeLanguage(newLang);
  };

  if (!member) {
    return <Loading />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.profileCard}>
          <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
            {t('profile.personalInfo')}
          </Text>

          <View style={styles.infoRow}>
            <Text style={[styles.label, isRTL && styles.textRTL]}>
              {t('profile.firstName')}:
            </Text>
            <Text style={[styles.value, isRTL && styles.textRTL]}>
              {member.firstName}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, isRTL && styles.textRTL]}>
              {t('profile.lastName')}:
            </Text>
            <Text style={[styles.value, isRTL && styles.textRTL]}>
              {member.lastName}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, isRTL && styles.textRTL]}>
              {t('profile.phone')}:
            </Text>
            <Text style={[styles.value, isRTL && styles.textRTL]}>
              {member.phone}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, isRTL && styles.textRTL]}>
              {t('profile.email')}:
            </Text>
            <Text style={[styles.value, isRTL && styles.textRTL]}>
              {member.email}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, isRTL && styles.textRTL]}>
              {t('profile.idNumber')}:
            </Text>
            <Text style={[styles.value, isRTL && styles.textRTL]}>
              {member.idNumber}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, isRTL && styles.textRTL]}>
              {t('profile.dateOfBirth')}:
            </Text>
            <Text style={[styles.value, isRTL && styles.textRTL]}>
              {new Date(member.dateOfBirth).toLocaleDateString(
                isRTL ? 'ar-SA' : 'en-US'
              )}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, isRTL && styles.textRTL]}>
              {t('profile.gender')}:
            </Text>
            <Text style={[styles.value, isRTL && styles.textRTL]}>
              {t(`profile.${member.gender}`)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, isRTL && styles.textRTL]}>
              {t('profile.joinDate')}:
            </Text>
            <Text style={[styles.value, isRTL && styles.textRTL]}>
              {new Date(member.joinDate).toLocaleDateString(
                isRTL ? 'ar-SA' : 'en-US'
              )}
            </Text>
          </View>
        </Card>

        <TouchableOpacity style={styles.langButton} onPress={toggleLanguage}>
          <Text style={styles.langButtonText}>
            {i18n.language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          <Text style={styles.logoutButtonText}>
            {isLoggingOut ? t('common.loading') : t('common.logout')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
  },
  profileCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  langButton: {
    backgroundColor: '#64748b',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  langButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  textRTL: {
    textAlign: 'right',
  },
});
