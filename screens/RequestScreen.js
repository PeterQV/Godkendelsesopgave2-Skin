// screens/RequestScreen.js
// Send en forespørgsel med billede og besked til et studie.
// Ændringer i GK2 (feedback fra GK1):
//  - ImagePicker.MediaTypeOptions.Images er udfaset -> erstattet af mediaTypes: ['images']
//  - Forespørgslen gemmes nu i Firebase i stedet for kun at blive vist lokalt
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, push } from 'firebase/database';
import { rtdb } from '../database/firebase';
import PrimaryButton from '../components/PrimaryButton';
import styles from '../styles/globalStyles';

export default function RequestScreen({ route }) {
  const { artist } = route.params;
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [sent, setSent] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // ny syntaks i stedet for MediaTypeOptions.Images
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Gemmer billedets URI i state
    }
  };

  // NYT i GK2: tag et billede direkte med telefonens kamera
  // (fx af en skitse eller et eksisterende tattoo, der skal bygges videre på)
  const takePhoto = async () => {
    // Kameraet kræver brugerens tilladelse
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Appen skal have adgang til kameraet for at tage et billede.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSend = async () => {
    // Simpel validering: navn og besked skal udfyldes
    if (!name.trim() || !message.trim()) {
      Alert.alert('Udfyld venligst navn og besked.');
      return;
    }

    try {
      // push() opretter et nyt element med unikt id under requests/<artistId>
      await push(ref(rtdb, `requests/${artist.id}`), {
        name: name.trim(),
        message: message.trim(),
        imageUri: image || null,
        createdAt: Date.now(),
      });
      setSent(true);
      setName('');
      setMessage('');
      setImage(null);
    } catch (e) {
      Alert.alert(e?.message || 'Noget gik galt. Prøv igen.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Send forespørgsel til {artist.name}</Text>
      <Text style={styles.mutedText}>Vedhæft et billede af den stil eller det motiv, du ønsker.</Text>

      {image && <Image source={{ uri: image }} style={styles.previewImage} />}
      <PrimaryButton title="Vælg billede" variant="secondary" onPress={pickImage} />
      <PrimaryButton title="Tag billede med kamera" variant="secondary" onPress={takePhoto} />

      <TextInput
        style={styles.input}
        placeholder="Dit navn"
        value={name}
        onChangeText={(t) => {
          setName(t);
          setSent(false);
        }}
      />
      <TextInput
        style={[styles.input, styles.inputMultiline]}
        placeholder="Skriv din besked..."
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <PrimaryButton title="Send" onPress={handleSend} />
      {sent && <Text style={styles.successText}>Forespørgsel sendt og gemt! ✅</Text>}
    </ScrollView>
  );
}
