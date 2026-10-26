// components/PrimaryButton.js
// Genbrugelig knap fra GK1. Nyt i GK2: "variant" (sekundær/hvid knap) og "disabled",
// så samme komponent kan bruges til alle knapper i appen.
import React from 'react';
import { Pressable, Text } from 'react-native';
import styles from '../styles/globalStyles';

const PrimaryButton = ({ title, onPress, variant = 'primary', disabled = false }) => {
  const isSecondary = variant === 'secondary';

  return (
    <Pressable
      style={[
        styles.button,
        isSecondary && styles.buttonSecondary,
        disabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, isSecondary && styles.buttonTextSecondary]}>
        {title}
      </Text>
    </Pressable>
  );
};

export default PrimaryButton;
