// data/artists.js
// Grunddata om de studier/saloner, der er med i prototypen.
// Det er kun "profil-oplysningerne", der ligger her. Alt det brugerne skaber
// (anmeldelser, bookinger og forespørgsler) gemmes og hentes i Firebase.
//
// Nyt i GK2 (fra interviews med tatoveringsstudierne):
//  - bio: kort præsentation, så kunden hurtigt kan se om de er et "match"
//  - styles: de stilarter studiet arbejder med (bruges til stil-filteret på forsiden)
//  - portfolio: billeder af tidligere arbejde, som studiet kan vise frem
//  - openHours: hvilke tider studiet har åbent for booking (bruges i BookingScreen)

const artists = [
  {
    id: '1',
    name: 'Studie Nord',
    type: 'Tattoo',
    location: 'København N',
    priceFrom: 800,
    image: require('../assets/artist1.jpg'),
    bio: 'Klassisk traditional og realism. Vi elsker farver og store projekter.',
    styles: ['Traditional', 'Realism'],
    portfolio: [require('../assets/artist1.jpg'), require('../assets/artist2.jpg')],
    openHours: ['10:00', '13:00', '16:00'],
  },
  {
    id: '2',
    name: 'Studie Syd',
    type: 'Tattoo',
    location: 'København S',
    priceFrom: 800,
    image: require('../assets/artist2.jpg'),
    bio: 'Fine line og blackwork. Små og mellemstore motiver med fokus på detaljer.',
    styles: ['Fine line', 'Blackwork'],
    portfolio: [require('../assets/artist2.jpg'), require('../assets/artist1.jpg')],
    openHours: ['11:00', '14:00', '17:00'],
  },
  {
    id: '3',
    name: 'Studie Nordvest',
    type: 'Barber',
    location: 'København NV',
    priceFrom: 350,
    image: require('../assets/artist3.jpg'),
    bio: 'Skarpe fades og klassiske klip. Drop-in og booking.',
    styles: ['Fade', 'Taper'],
    portfolio: [require('../assets/artist3.jpg'), require('../assets/artist4.jpg')],
    openHours: ['09:00', '10:00', '11:00', '13:00', '14:00'],
  },
  {
    id: '4',
    name: 'Studie Øst',
    type: 'Barber',
    location: 'København Ø',
    priceFrom: 350,
    image: require('../assets/artist4.jpg'),
    bio: 'Barber med fokus på skæg, taper og hurtige tider.',
    styles: ['Fade', 'Taper'],
    portfolio: [require('../assets/artist4.jpg'), require('../assets/artist3.jpg')],
    openHours: ['10:00', '12:00', '15:00'],
  },
];

// Hjælpefunktion: find et studie ud fra id (bruges fx i "Mine bookinger")
export const findArtist = (id) => artists.find((a) => a.id === id);

export default artists;
