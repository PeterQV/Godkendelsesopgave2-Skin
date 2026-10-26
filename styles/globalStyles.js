// styles/globalStyles.js
// Al styling samlet i én separat fil, så komponenterne holdes rene.
// Fælles farver (colors) + styles til chips, stjerner, anmeldelser og portefølje.
import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#222222',
  background: '#ffffff',
  card: '#f2f2f2',
  border: '#cccccc',
  muted: '#777777',
  star: '#f5a623',
  success: '#2e7d32',
};

const styles = StyleSheet.create({
  // Layout
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 40 },

  // Tekst
  title: { fontWeight: 'bold', fontSize: 20, marginBottom: 4 },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, marginTop: 16, marginBottom: 8 },
  bodyText: { marginVertical: 6, lineHeight: 20 },
  mutedText: { color: colors.muted },
  successText: { color: colors.success, marginTop: 10, fontWeight: 'bold' },

  // Kort i listen (fra GK1)
  card: { flexDirection: 'row', marginBottom: 12, borderRadius: 8, backgroundColor: colors.card, overflow: 'hidden' },
  cardImage: { width: 90, height: 100 },
  cardInfo: { flex: 1, padding: 10, justifyContent: 'center' },
  cardTitle: { fontWeight: 'bold', fontSize: 16 },

  // Billeder
  profileImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 12 },
  previewImage: { width: 150, height: 150, marginVertical: 10, borderRadius: 8 },
  portfolioImage: { width: 140, height: 140, borderRadius: 8, marginRight: 10, marginBottom: 12 },

  // Input
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 6, padding: 10, marginVertical: 8 },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top' },

  // Knapper (PrimaryButton)
  button: { backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center', marginVertical: 6 },
  buttonSecondary: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.primary },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  buttonTextSecondary: { color: colors.primary },

  // Chips (stil-filter og tider)
  chipRow: { flexGrow: 0, marginBottom: 12 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  chip: { borderWidth: 1, borderColor: colors.primary, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14, marginRight: 8, marginBottom: 8 },
  chipSelected: { backgroundColor: colors.primary },
  chipDisabled: { borderColor: colors.border, backgroundColor: colors.card },
  chipText: { color: colors.primary },
  chipTextSelected: { color: 'white', fontWeight: 'bold' },
  chipTextDisabled: { color: colors.border, textDecorationLine: 'line-through' },

  // Stjerner og rating
  starRow: { flexDirection: 'row' },
  star: { color: colors.star, marginRight: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },

  // Anmeldelser og bookinger
  formBox: { marginBottom: 8 },
  reviewCard: { backgroundColor: colors.card, borderRadius: 8, padding: 12, marginBottom: 10 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});

export default styles;
