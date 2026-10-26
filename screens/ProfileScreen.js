// screens/ProfileScreen.js
// Profil for ét studie/salon.
// Nyt i GK2:
//  - Bio og portefølje-galleri, så studiet kan vise sit arbejde frem
//  - Gennemsnitlig rating fra Firebase
//  - To nye knapper: "Book tid" og "Se anmeldelser" (fører til de nye screens)
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { rtdb } from '../database/firebase';
import PrimaryButton from '../components/PrimaryButton';
import StarRating from '../components/StarRating';
import styles from '../styles/globalStyles';

export default function ProfileScreen({ route, navigation }) {
  const { artist } = route.params;
  const [ratingInfo, setRatingInfo] = useState({ avg: 0, count: 0 });

  // Sæt studiets navn som titel i headeren
  useEffect(() => {
    navigation.setOptions({ title: artist.name });
  }, [artist.name]);

  // Hent kun anmeldelser for dette studie og beregn gennemsnittet
  useEffect(() => {
    const reviewsRef = ref(rtdb, `reviews/${artist.id}`);
    const unsubscribe = onValue(reviewsRef, (snapshot) => {
      const list = Object.values(snapshot.val() || {});
      const sum = list.reduce((total, r) => total + Number(r.rating || 0), 0);
      setRatingInfo({ avg: list.length ? sum / list.length : 0, count: list.length });
    });
    return unsubscribe;
  }, [artist.id]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Image source={artist.image} style={styles.profileImage} />
      <Text style={styles.title}>{artist.name}</Text>
      <Text style={styles.mutedText}>
        {artist.type} · {artist.location} · Fra {artist.priceFrom} kr.
      </Text>

      <View style={styles.ratingRow}>
        <StarRating rating={ratingInfo.avg} />
        <Text style={styles.mutedText}>
          {' '}
          {ratingInfo.count > 0
            ? `${ratingInfo.avg.toFixed(1)} (${ratingInfo.count} anmeldelser)`
            : 'Ingen anmeldelser endnu'}
        </Text>
      </View>

      <Text style={styles.bodyText}>{artist.bio}</Text>

      <Text style={styles.sectionTitle}>Stilarter</Text>
      <Text>{artist.styles.join(' · ')}</Text>

      {/* Portefølje: vandret galleri med tidligere arbejde */}
      <Text style={styles.sectionTitle}>Portefølje</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {artist.portfolio.map((img, index) => (
          <Image key={index} source={img} style={styles.portfolioImage} />
        ))}
      </ScrollView>

      {/* Nye knapper i v2 */}
      <PrimaryButton
        title="Book tid"
        onPress={() => navigation.navigate('Booking', { artist })}
      />
      <PrimaryButton
        title="Se anmeldelser"
        variant="secondary"
        onPress={() => navigation.navigate('Reviews', { artist })}
      />
      <PrimaryButton
        title="Send forespørgsel"
        variant="secondary"
        onPress={() => navigation.navigate('Request', { artist })}
      />
    </ScrollView>
  );
}
