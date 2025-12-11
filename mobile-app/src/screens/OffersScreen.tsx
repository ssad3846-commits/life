import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import apiService from '../services/api';
import Card from '../components/Card';
import Loading from '../components/Loading';
import type { Offer } from '../types';

const { width } = Dimensions.get('window');

export default function OffersScreen() {
  const { t, i18n } = useTranslation();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await apiService.getOffers();
      setOffers(data);
    } catch (error) {
      console.error('Error loading offers:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(
      isRTL ? 'ar-SA' : 'en-US',
      { year: 'numeric', month: 'short', day: 'numeric' }
    );
  };

  const isOfferActive = (offer: Offer) => {
    const now = new Date();
    const start = new Date(offer.startDate);
    const end = new Date(offer.endDate);
    return now >= start && now <= end;
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
        {offers.length === 0 ? (
          <Card>
            <Text style={[styles.emptyText, isRTL && styles.textRTL]}>
              {t('offers.noOffers')}
            </Text>
          </Card>
        ) : (
          offers.map((offer) => {
            const active = isOfferActive(offer);
            return (
              <Card key={offer.id} style={styles.offerCard}>
                {offer.imageUrl && (
                  <Image
                    source={{ uri: offer.imageUrl }}
                    style={styles.offerImage}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.offerContent}>
                  <View style={styles.headerRow}>
                    <Text style={[styles.offerTitle, isRTL && styles.textRTL]}>
                      {offer.title}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: active ? '#10b981' : '#64748b' },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {active ? t('offers.active') : t('offers.expired')}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.offerDescription, isRTL && styles.textRTL]}>
                    {offer.description}
                  </Text>

                  {offer.discountPercentage && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>
                        {offer.discountPercentage}% {t('offers.discount')}
                      </Text>
                    </View>
                  )}

                  <View style={styles.dateRow}>
                    <Text style={[styles.dateLabel, isRTL && styles.textRTL]}>
                      {t('offers.validFrom')}: {formatDate(offer.startDate)}
                    </Text>
                    <Text style={[styles.dateLabel, isRTL && styles.textRTL]}>
                      {t('offers.validUntil')}: {formatDate(offer.endDate)}
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
  offerCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  offerImage: {
    width: '100%',
    height: 150,
  },
  offerContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  offerDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  discountBadge: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  discountText: {
    color: '#d97706',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dateRow: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
  },
  dateLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
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
