import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import Card from '../components/Card';
import Loading from '../components/Loading';
import type { Subscription, MembershipPlan } from '../types';

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const { member } = useAuth();
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [activePlan, setActivePlan] = useState<MembershipPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subscription, plans] = await Promise.all([
        apiService.getActiveSubscription(),
        apiService.getPlans(),
      ]);
      setActiveSubscription(subscription);
      if (subscription) {
        const plan = plans.find(p => p.id === subscription.planId);
        setActivePlan(plan || null);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (isLoading) {
    return <Loading message={t('common.loading')} />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'new': return '#3b82f6';
      case 'former': return '#64748b';
      default: return '#64748b';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        <Card style={styles.memberCard}>
          <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
            {t('home.memberInfo')}
          </Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, isRTL && styles.textRTL]}>
              {member?.firstName} {member?.lastName}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoValue, isRTL && styles.textRTL]}>
              {t('home.memberNumber')}: {member?.memberNumber}
            </Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={[styles.infoLabel, isRTL && styles.textRTL]}>
              {t('home.status')}:
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(member?.status || 'new') },
              ]}
            >
              <Text style={styles.statusText}>
                {t(`home.${member?.status || 'new'}`)}
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.subscriptionCard}>
          <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
            {t('home.activeSubscription')}
          </Text>
          {activeSubscription && activePlan ? (
            <>
              <Text style={[styles.planName, isRTL && styles.textRTL]}>
                {activePlan.name}
              </Text>
              <View style={styles.dateRow}>
                <Text style={[styles.dateLabel, isRTL && styles.textRTL]}>
                  {t('home.validUntil')}:
                </Text>
                <Text style={[styles.dateValue, isRTL && styles.textRTL]}>
                  {new Date(activeSubscription.endDate).toLocaleDateString(
                    isRTL ? 'ar-SA' : 'en-US'
                  )}
                </Text>
              </View>
            </>
          ) : (
            <Text style={[styles.noSubscription, isRTL && styles.textRTL]}>
              {t('home.noSubscription')}
            </Text>
          )}
        </Card>
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
  memberCard: {
    marginBottom: 16,
  },
  subscriptionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  infoValue: {
    fontSize: 14,
    color: '#64748b',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 8,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  noSubscription: {
    fontSize: 14,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  textRTL: {
    textAlign: 'right',
  },
});
