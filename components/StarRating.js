// components/StarRating.js
// Genbrugelig stjerne-komponent. Bruges to måder:
//  1) Kun visning (fx gennemsnit på ArtistCard og ProfileScreen)
//  2) Valg af stjerner, når man skriver en anmeldelse (onChange gives med som prop)
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import styles from '../styles/globalStyles';

const StarRating = ({ rating = 0, onChange, size = 18 }) => {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((n) => {
        // Fyldt stjerne hvis n er mindre end eller lig med (afrundet) rating
        const filled = n <= Math.round(rating);
        const star = (
          <Text style={[styles.star, { fontSize: size }]}>{filled ? '★' : '☆'}</Text>
        );

        // Hvis der ikke er en onChange, er komponenten kun til visning
        if (!onChange) return <View key={n}>{star}</View>;

        return (
          <Pressable key={n} onPress={() => onChange(n)} hitSlop={6}>
            {star}
          </Pressable>
        );
      })}
    </View>
  );
};

export default StarRating;
