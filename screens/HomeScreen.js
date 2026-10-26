// screens/HomeScreen.js
// Forside med liste over studier/saloner.
// Nyt i GK2:
//  - Søgefelt: søg på navn, område, type eller stil (fx "fine line" eller "Nørrebro")
//  - Stil-filter (chips), så kunden hurtigt kan se hvem der matcher den ønskede stil
//    (efterspurgt af tatoveringsstudierne i anden runde brugerinddragelse)
//  - Gennemsnitlig rating hentes live fra Firebase og vises på hvert kort
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, ScrollView, TextInput } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { rtdb } from '../database/firebase';
import artists from '../data/artists';
import ArtistCard from '../components/ArtistCard';
import Chip from '../components/Chip';
import styles from '../styles/globalStyles';

export default function HomeScreen({ navigation }) {
  const [selectedStyle, setSelectedStyle] = useState('Alle');
  const [search, setSearch] = useState('');
  const [reviews, setReviews] = useState({}); // { artistId: { reviewId: review } }

  // Lyt på alle anmeldelser i Firebase. onValue opdaterer automatisk,
  // når nogen skriver en ny anmeldelse (realtime).
  useEffect(() => {
    const reviewsRef = ref(rtdb, 'reviews');
    const unsubscribe = onValue(reviewsRef, (snapshot) => {
      setReviews(snapshot.val() || {});
    });
    return unsubscribe; // fjern lytteren, når skærmen lukkes
  }, []);

  // Liste over alle stilarter (uden dubletter) til filter-knapperne
  const allStyles = useMemo(() => {
    const unique = new Set(artists.flatMap((a) => a.styles));
    return ['Alle', ...unique];
  }, []);

  // Filtrér listen ud fra både søgeteksten og den valgte stil
  const query = search.trim().toLowerCase();
  const filteredArtists = artists.filter((a) => {
    // 1) Stil-filter
    const matchesStyle = selectedStyle === 'Alle' || a.styles.includes(selectedStyle);
    // 2) Søgning: samler studiets tekst-felter i én streng og tjekker om søgeordet indgår
    const searchableText = [a.name, a.location, a.type, ...a.styles].join(' ').toLowerCase();
    const matchesSearch = query === '' || searchableText.includes(query);
    return matchesStyle && matchesSearch;
  });

  // Beregn gennemsnit og antal anmeldelser for ét studie
  const getRatingInfo = (artistId) => {
    const list = Object.values(reviews[artistId] || {});
    if (list.length === 0) return { avg: 0, count: 0 };
    const sum = list.reduce((total, r) => total + Number(r.rating || 0), 0);
    return { avg: sum / list.length, count: list.length };
  };

  return (
    <View style={styles.container}>
      {/* Søgefelt */}
      <TextInput
        style={styles.input}
        placeholder="Søg på navn, område eller stil…"
        value={search}
        onChangeText={setSearch}
        clearButtonMode="while-editing"
      />

      <Text style={styles.sectionTitle}>Find din stil</Text>

      {/* Vandret række med stil-filtre */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {allStyles.map((s) => (
            <Chip
              key={s}
              label={s}
              selected={selectedStyle === s}
              onPress={() => setSelectedStyle(s)}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredArtists}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.mutedText}>Ingen studier matcher din søgning.</Text>}
        renderItem={({ item }) => {
          const { avg, count } = getRatingInfo(item.id);
          return (
            <ArtistCard
              artist={item}
              avgRating={avg}
              reviewCount={count}
              onPress={() => navigation.navigate('Profile', { artist: item })}
            />
          );
        }}
      />
    </View>
  );
}
