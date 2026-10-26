// components/ArtistCard.js
// Kort i listen på forsiden. Nyt i GK2: viser gennemsnitlig rating og antal
// anmeldelser (hentet fra Firebase i HomeScreen og sendt med som props).
import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import StarRating from './StarRating';
import styles from '../styles/globalStyles';

const ArtistCard = ({ artist, onPress, avgRating = 0, reviewCount = 0 }) => {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={artist.image} style={styles.cardImage} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{artist.name}</Text>
        <Text style={styles.mutedText}>
          {artist.type} · {artist.location}
        </Text>
        <Text>Fra {artist.priceFrom} kr.</Text>

        {/* Socialt bevis: rating direkte i listen */}
        {reviewCount > 0 ? (
          <View style={styles.ratingRow}>
            <StarRating rating={avgRating} size={14} />
            <Text style={styles.mutedText}>
              {' '}
              {avgRating.toFixed(1)} ({reviewCount})
            </Text>
          </View>
        ) : (
          <Text style={styles.mutedText}>Ingen anmeldelser endnu</Text>
        )}
      </View>
    </Pressable>
  );
};

export default ArtistCard;
