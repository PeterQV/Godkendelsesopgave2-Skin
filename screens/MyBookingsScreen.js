// screens/MyBookingsScreen.js  (NY SCREEN i GK2 - egen fane i tab navigation)
// Oversigt over bookinger hentet fra Firebase, med mulighed for at aflyse.
// ser sine egne bookinger.)
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Alert, Platform } from 'react-native';
import { ref, onValue, remove } from 'firebase/database';
import { rtdb } from '../database/firebase';
import PrimaryButton from '../components/PrimaryButton';
import styles from '../styles/globalStyles';

export default function MyBookingsScreen() {
  const [bookings, setBookings] = useState(null); // null = indlæser
  const [nameFilter, setNameFilter] = useState('');

  // Hent alle bookinger. Data ligger som bookings/<artistId>/<slotId>,
  // så vi "flader" det ud til én liste.
  useEffect(() => {
    const bookingsRef = ref(rtdb, 'bookings');
    const unsubscribe = onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = [];
      Object.entries(data).forEach(([artistId, slots]) => {
        Object.entries(slots).forEach(([slotId, booking]) => {
          list.push({ ...booking, artistId, slotId });
        });
      });
      // Sortér efter dato og tid (tidligste først)
      list.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
      setBookings(list);
    });
    return unsubscribe;
  }, []);

  // Slet bookingen i Firebase, så tiden bliver ledig igen
  const cancelBooking = async (booking) => {
    try {
      await remove(ref(rtdb, `bookings/${booking.artistId}/${booking.slotId}`));
    } catch (e) {
      Alert.alert(e?.message || 'Kunne ikke aflyse.');
    }
  };

  // Bekræftelse før aflysning (window.confirm på web, som i øvelse 05)
  const confirmCancel = (booking) => {
    const text = `Aflys ${booking.artistName} ${booking.date} kl. ${booking.time}?`;
    if (Platform.OS === 'web') {
      if (window.confirm(text)) cancelBooking(booking);
    } else {
      Alert.alert('Aflys booking', text, [
        { text: 'Nej', style: 'cancel' },
        { text: 'Aflys', style: 'destructive', onPress: () => cancelBooking(booking) },
      ]);
    }
  };

  // Vis kun bookinger, der matcher det indtastede navn
  const visible = (bookings || []).filter((b) =>
    b.name?.toLowerCase().includes(nameFilter.trim().toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Søg på dit navn"
        value={nameFilter}
        onChangeText={setNameFilter}
      />

      <FlatList
        data={visible}
        keyExtractor={(item) => `${item.artistId}_${item.slotId}`}
        ListEmptyComponent={
          <Text style={styles.mutedText}>
            {bookings === null ? 'Indlæser…' : 'Ingen bookinger endnu.'}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <Text style={styles.cardTitle}>{item.artistName}</Text>
            <Text>
              {item.date} kl. {item.time}
            </Text>
            <Text style={styles.mutedText}>Booket af {item.name}</Text>
            {item.note ? <Text style={styles.bodyText}>{item.note}</Text> : null}
            <PrimaryButton title="Aflys" variant="secondary" onPress={() => confirmCancel(item)} />
          </View>
        )}
      />
    </View>
  );
}
