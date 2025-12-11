import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import apiService from '../services/api';
import Card from '../components/Card';
import Loading from '../components/Loading';
import type { CheckIn } from '../types';

export default function CheckInsScreen() {
  const { t, i18n } = useTranslation();
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await apiService.getCheckIns();
      setCheckIns(data);
    } catch (error) {
      console.error('Error loading check-ins:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const calculateDuration = (checkIn: CheckIn) => {
    if (!checkIn.checkOutTime) return null;
    
    const start = new Date(checkIn.checkInTime);
    const end = new Date(checkIn.checkOutTime);
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours} ${t('checkins.hours')} ${minutes} ${t('checkins.minutes')}`;
    }
    return `${minutes} ${t('checkins.minutes')}`;
  };

  if (isLoading) {
    return <Loading message={t('common.loading')} />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        {checkIns.length === 0 ? (
          <Card>
            <Text style={[styles.emptyText, isRTL && styles.textRTL]}>
              {t('checkins.noCheckins')}
            </Text>
          </Card>
        ) : (
          checkIns.map((checkIn) => (
            <Card key={checkIn.id} style={styles.checkInCard}>
              <View style={styles.row}>
                <Text style={[styles.label, isRTL && styles.textRTL]}>
                  {t('checkins.checkInTime')}:
                </Text>
                <Text style={[styles.value, isRTL && styles.textRTL]}>
                  {new Date(checkIn.checkInTime).toLocaleString(
                    isRTL ? 'ar-SA' : 'en-US'
                  )}
                </Text>
              </View>

              {checkIn.checkOutTime && (
                <>
                  <View style={styles.row}>
                    <Text style={[styles.label, isRTL && styles.textRTL]}>
                      {t('checkins.checkOutTime')}:
                    </Text>
                    <Text style={[styles.value, isRTL && styles.textRTL]}>
                      {new Date(checkIn.checkOutTime).toLocaleString(
                        isRTL ? 'ar-SA' : 'en-US'
                      )}
                    </Text>
                  </View>

                  <View style={styles.durationRow}>
                    <Text style={[styles.label, isRTL && styles.textRTL]}>
                      {t('checkins.duration')}:
                    </Text>
                    <Text style={[styles.durationValue, isRTL && styles.textRTL]}>
                      {calculateDuration(checkIn)}
                    </Text>
                  </View>
                </>
              )}
            </Card>
          ))
        )}
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
  checkInCard: {
    marginBottom: 16,
  },
  row: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  durationRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  durationValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  textRTL: {
    textAlign: 'right',
  },
});
