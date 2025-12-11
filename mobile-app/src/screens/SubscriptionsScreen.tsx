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
import type { Subscription, MembershipPlan } from '../types';

export default function SubscriptionsScreen() {
  const { t, i18n } = useTranslation();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subs, plansData] = await Promise.all([
        apiService.getSubscriptions(),
        apiService.getPlans(),
      ]);
      setSubscriptions(subs);
      setPlans(plansData);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const getPlan = (planId: number) => {
    return plans.find(p => p.id === planId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'expired': return '#ef4444';
      case 'cancelled': return '#64748b';
      default: return '#64748b';
    }
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
        {subscriptions.length === 0 ? (
          <Card>
            <Text style={[styles.emptyText, isRTL && styles.textRTL]}>
              {t('subscriptions.noSubscriptions')}
            </Text>
          </Card>
        ) : (
          subscriptions.map((sub) => {
            const plan = getPlan(sub.planId);
            return (
              <Card key={sub.id} style={styles.subscriptionCard}>
                <Text style={[styles.planName, isRTL && styles.textRTL]}>
                  {plan?.name || 'Unknown Plan'}
                </Text>
                <View style={styles.row}>
                  <Text style={[styles.label, isRTL && styles.textRTL]}>
                    {t('subscriptions.startDate')}:
                  </Text>
                  <Text style={[styles.value, isRTL && styles.textRTL]}>
                    {new Date(sub.startDate).toLocaleDateString(
                      isRTL ? 'ar-SA' : 'en-US'
                    )}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.label, isRTL && styles.textRTL]}>
                    {t('subscriptions.endDate')}:
                  </Text>
                  <Text style={[styles.value, isRTL && styles.textRTL]}>
                    {new Date(sub.endDate).toLocaleDateString(
                      isRTL ? 'ar-SA' : 'en-US'
                    )}
                  </Text>
                </View>
                <View style={styles.statusRow}>
                  <Text style={[styles.label, isRTL && styles.textRTL]}>
                    {t('subscriptions.status')}:
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(sub.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {t(`subscriptions.${sub.status}`)}
                    </Text>
                  </View>
                </View>
              </Card>
            );
          })
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
  subscriptionCard: {
    marginBottom: 16,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 8,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
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
