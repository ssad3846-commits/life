import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import apiService from '../services/api';
import Card from '../components/Card';
import Loading from '../components/Loading';
import type { Payment } from '../types';

export default function PaymentsScreen() {
  const { t, i18n } = useTranslation();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const paymentsData = await apiService.getPayments();
      setPayments(paymentsData);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleDownloadInvoice = async (payment: Payment) => {
    if (!payment.invoiceId) return;

    try {
      const blob = await apiService.downloadInvoice(payment.invoiceId);
      const fileUri = `${FileSystem.documentDirectory}invoice_${payment.invoiceId}.pdf`;
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result?.toString().split(',')[1];
        if (base64data) {
          await FileSystem.writeAsStringAsync(fileUri, base64data, {
            encoding: FileSystem.EncodingType.Base64,
          });
          await Sharing.shareAsync(fileUri);
        }
      };
    } catch (error) {
      console.error('Error downloading invoice:', error);
      Alert.alert(t('common.error'), 'Failed to download invoice');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      case 'refunded': return '#64748b';
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
        {payments.length === 0 ? (
          <Card>
            <Text style={[styles.emptyText, isRTL && styles.textRTL]}>
              {t('payments.noPayments')}
            </Text>
          </Card>
        ) : (
          payments.map((payment) => (
            <Card key={payment.id} style={styles.paymentCard}>
              <View style={styles.header}>
                <Text style={[styles.amount, isRTL && styles.textRTL]}>
                  {parseFloat(payment.amount).toFixed(2)} {t('common.sar')}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(payment.status) },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {t(`payments.${payment.status}`)}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={[styles.label, isRTL && styles.textRTL]}>
                  {t('payments.date')}:
                </Text>
                <Text style={[styles.value, isRTL && styles.textRTL]}>
                  {new Date(payment.paymentDate).toLocaleDateString(
                    isRTL ? 'ar-SA' : 'en-US'
                  )}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={[styles.label, isRTL && styles.textRTL]}>
                  {t('payments.method')}:
                </Text>
                <Text style={[styles.value, isRTL && styles.textRTL]}>
                  {payment.paymentMethod}
                </Text>
              </View>

              {payment.invoiceId && (
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => handleDownloadInvoice(payment)}
                >
                  <Text style={styles.downloadText}>
                    {t('payments.downloadInvoice')}
                  </Text>
                </TouchableOpacity>
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
  paymentCard: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  downloadButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    alignItems: 'center',
  },
  downloadText: {
    color: '#fff',
    fontSize: 14,
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
