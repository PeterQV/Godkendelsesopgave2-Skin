// screens/BookingScreen.js  (NY SCREEN i GK2)
// Book en ledig tid hos et studie.
// Baggrund: Brugerne i GK1 efterspurgte ledige tider og booking, og
// tatoveringsstudierne i GK2 fremhævede kalenderen som en del af "matchet".
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert } from 'react-native';
import { ref, onValue, runTransaction } from 'firebase/database';
import { rtdb } from '../database/firebase';
import PrimaryButton from '../components/PrimaryButton';
import Chip from '../components/Chip';
import styles from '../styles/globalStyles';

// Lav en liste med de næste 7 dage, hvor studiet har åbent (søndag springes over)
const getNextDays = () => {
  const days = [];
  const date = new Date();
  while (days.length < 7) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0) days.push(new Date(date));
  }
  return days;
};

// Dato som tekst, fx "2026-10-27" (bruges i nøglen i Firebase).
// Bygges ud fra lokal tid, så datoen ikke rykker sig omkring midnat (UTC vs. dansk tid)
const toDateKey = (d) => {
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

export default function BookingScreen({ route, navigation }) {
  const { artist } = route.params;
  const days = useMemo(getNextDays, []);

  const [selectedDay, setSelectedDay] = useState(toDateKey(days[0]));
  const [selectedTime, setSelectedTime] = useState(null);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [bookedSlots, setBookedSlots] = useState({}); // { slotId: booking }

  // Lyt på bookinger for dette studie, så optagede tider opdateres live
  useEffect(() => {
    const bookingsRef = ref(rtdb, `bookings/${artist.id}`);
    const unsubscribe = onValue(bookingsRef, (snapshot) => {
      setBookedSlots(snapshot.val() || {});
    });
    return unsubscribe;
  }, [artist.id]);

  // Nøgle for en tid, fx "2026-10-27_1000" (Firebase tillader ikke "." i nøgler)
  const slotId = (day, time) => `${day}_${time.replace(':', '')}`;

  const handleBook = async () => {
    if (!selectedTime || !name.trim()) {
      Alert.alert('Vælg en tid og skriv dit navn.');
      return;
    }

    const id = slotId(selectedDay, selectedTime);
    const booking = {
      artistId: artist.id,
      artistName: artist.name,
      date: selectedDay,
      time: selectedTime,
      name: name.trim(),
      note: note.trim(),
      createdAt: Date.now(),
    };

    try {
      // runTransaction sikrer at to brugere ikke kan booke samme tid samtidig:
      // hvis tiden allerede findes, afbrydes gemningen (return undefined)
      const result = await runTransaction(ref(rtdb, `bookings/${artist.id}/${id}`), (current) => {
        if (current) return undefined;
        return booking;
      });

      if (!result.committed) {
        Alert.alert('Tiden er desværre lige blevet booket. Vælg en anden.');
        return;
      }

      Alert.alert('Booking bekræftet', `${artist.name}\n${selectedDay} kl. ${selectedTime}`);
      setSelectedTime(null);
      setNote('');
      // Gå til fanen "Mine bookinger", så brugeren kan se sin booking
      navigation.getParent()?.navigate('MyBookings');
    } catch (e) {
      Alert.alert(e?.message || 'Kunne ikke gemme bookingen.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Book tid hos {artist.name}</Text>
      <Text style={styles.mutedText}>Grå tider er allerede booket.</Text>

      {/* 1) Vælg dag */}
      <Text style={styles.sectionTitle}>Vælg dag</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {days.map((d) => {
          const key = toDateKey(d);
          const label = d.toLocaleDateString('da-DK', { weekday: 'short', day: 'numeric', month: 'short' });
          return (
            <Chip
              key={key}
              label={label}
              selected={selectedDay === key}
              onPress={() => {
                setSelectedDay(key);
                setSelectedTime(null); // nulstil tid når man skifter dag
              }}
            />
          );
        })}
      </ScrollView>

      {/* 2) Vælg tid - optagede tider er deaktiveret */}
      <Text style={styles.sectionTitle}>Vælg tid</Text>
      <View style={styles.chipWrap}>
        {artist.openHours.map((time) => {
          const isBooked = Boolean(bookedSlots[slotId(selectedDay, time)]);
          return (
            <Chip
              key={time}
              label={time}
              selected={selectedTime === time}
              disabled={isBooked}
              onPress={() => setSelectedTime(time)}
            />
          );
        })}
      </View>

      {/* 3) Oplysninger */}
      <TextInput style={styles.input} placeholder="Dit navn" value={name} onChangeText={setName} />
      <TextInput
        style={[styles.input, styles.inputMultiline]}
        placeholder="Kort beskrivelse (fx motiv, størrelse eller klip)"
        value={note}
        onChangeText={setNote}
        multiline
      />

      <PrimaryButton
        title={selectedTime ? `Book ${selectedTime}` : 'Vælg en tid'}
        onPress={handleBook}
        disabled={!selectedTime}
      />
    </ScrollView>
  );
}
