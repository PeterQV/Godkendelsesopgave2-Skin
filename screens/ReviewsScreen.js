// screens/ReviewsScreen.js  (NY SCREEN i GK2)
// Læs og skriv anmeldelser af et studie.
// Anmeldelserne gemmes i Firebase under reviews/<artistId>, så de huskes
// og kan ses af alle brugere.
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Alert } from 'react-native';
import { ref, onValue, push } from 'firebase/database';
import { rtdb } from '../database/firebase';
import PrimaryButton from '../components/PrimaryButton';
import StarRating from '../components/StarRating';
import styles from '../styles/globalStyles';

export default function ReviewsScreen({ route }) {
  const { artist } = route.params;
  const [reviews, setReviews] = useState(null); // null = indlæser
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');

  // Hent anmeldelser for dette studie (realtime)
  useEffect(() => {
    const reviewsRef = ref(rtdb, `reviews/${artist.id}`);
    const unsubscribe = onValue(reviewsRef, (snapshot) => {
      const data = snapshot.val() || {};
      // Lav objektet om til en liste og sortér nyeste først
      const list = Object.entries(data)
        .map(([id, review]) => ({ id, ...review }))
        .sort((a, b) => b.createdAt - a.createdAt);
      setReviews(list);
    });
    return unsubscribe;
  }, [artist.id]);

  const submitReview = async () => {
    // Validering: der skal vælges stjerner, og navn + tekst skal udfyldes
    if (rating === 0 || !name.trim() || !text.trim()) {
      Alert.alert('Vælg antal stjerner og udfyld navn og tekst.');
      return;
    }

    try {
      await push(ref(rtdb, `reviews/${artist.id}`), {
        name: name.trim(),
        rating,
        text: text.trim(),
        createdAt: Date.now(),
      });
      // Nulstil formularen efter den er gemt
      setName('');
      setRating(0);
      setText('');
    } catch (e) {
      Alert.alert(e?.message || 'Kunne ikke gemme anmeldelsen.');
    }
  };

  // Formularen vises øverst i listen (ListHeaderComponent), så hele skærmen kan scrolle
  const form = (
    <View style={styles.formBox}>
      <Text style={styles.title}>Anmeld {artist.name}</Text>
      <StarRating rating={rating} onChange={setRating} size={30} />
      <TextInput style={styles.input} placeholder="Dit navn" value={name} onChangeText={setName} />
      <TextInput
        style={[styles.input, styles.inputMultiline]}
        placeholder="Hvordan var din oplevelse?"
        value={text}
        onChangeText={setText}
        multiline
      />
      <PrimaryButton title="Gem anmeldelse" onPress={submitReview} />
      <Text style={styles.sectionTitle}>
        Anmeldelser {reviews ? `(${reviews.length})` : ''}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reviews || []}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={form}
        ListEmptyComponent={
          <Text style={styles.mutedText}>
            {reviews === null ? 'Indlæser…' : 'Ingen anmeldelser endnu. Bliv den første!'}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <StarRating rating={item.rating} size={14} />
            </View>
            <Text style={styles.bodyText}>{item.text}</Text>
            <Text style={styles.mutedText}>
              {new Date(item.createdAt).toLocaleDateString('da-DK')}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
