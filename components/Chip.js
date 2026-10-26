// components/Chip.js
// Lille genbrugelig "pille"-knap. Bruges til stil-filteret på forsiden
// og til at vælge dag og tidspunkt i BookingScreen.
import React from 'react';
import { Pressable, Text } from 'react-native';
import styles from '../styles/globalStyles';

const Chip = ({ label, selected = false, onPress, disabled = false }) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.chip, selected && styles.chipSelected, disabled && styles.chipDisabled]}
    >
      <Text
        style={[
          styles.chipText,
          selected && styles.chipTextSelected,
          disabled && styles.chipTextDisabled,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export default Chip;
