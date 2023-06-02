import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// const cargoShipments = [
//   {
//     id: '1',
//     shipmentNum: 'ABC123',
//     originCity: 'Київ',
//     originCountry: 'Україна',
//     destinationCity: 'Лондон',
//     destinationCountry: 'Велика Британія',
//     originRoute: { lat: 50.4501, lng: 30.5234 },
//     destinationRoute: { lat: 51.5074, lng: -0.1276 },
//     weight: [1000, 30],
//     statusShip: 'В очікуванні',
//     originDate: '2023-05-01',
//     destinationDate: '2023-05-10',
//     isInternational: true,
//     distance: 2000,
//     cost: [5000, 1000],
//     client: ['John Doe', 'John Doe1'],
//   },
//   {
//     id: '2',
//     shipmentNum: 'DEF456',
//     originCity: 'Париж',
//     originCountry: 'Франція',
//     destinationCity: 'Мадрид',
//     destinationCountry: 'Іспанія',
//     originRoute: { lat: 48.8566, lng: 2.3522 },
//     destinationRoute: { lat: 40.4168, lng: -3.7038 },
//     weight: [1500],
//     statusShip: 'В очікуванні',
//     originDate: '2023-07-01',
//     destinationDate: '2023-07-10',
//     isInternational: true,
//     distance: 1500,
//     cost: [7000],
//     client: ['Jane Smith'],
//   },
//   {
//     id: '3',
//     shipmentNum: 'GHI789',
//     originCity: 'Токіо',
//     originCountry: 'Японія',
//     destinationCity: 'Сідней',
//     destinationCountry: 'Австралія',
//     originRoute: { lat: 35.6895, lng: 139.6917 },
//     destinationRoute: { lat: -33.8688, lng: 151.2093 },
//     weight: [2000],
//     statusShip: 'В процесі',
//     originDate: '2023-04-01',
//     destinationDate: '2023-04-10',
//     isInternational: true,
//     distance: 8000,
//     cost: [10000],
//     client: ['David Johnson'],
//   },
//   {
//     id: '4',
//     shipmentNum: 'JKL012',
//     originCity: 'Нью-Йорк',
//     originCountry: 'США',
//     destinationCity: 'Торонто',
//     destinationCountry: 'Канада',
//     originRoute: { lat: 40.7128, lng: -74.006 },
//     destinationRoute: { lat: 43.6532, lng: -79.3832 },
//     weight: [1200],
//     statusShip: 'Завершено',
//     originDate: '2023-09-01',
//     destinationDate: '2023-09-10',
//     isInternational: true,
//     distance: 500,
//     cost: [3000],
//     client: ['Emily Wilson'],
//   },
//   {
//     id: '5',
//     shipmentNum: 'MNO345',
//     originCity: 'Берлін',
//     originCountry: 'Німеччина',
//     destinationCity: 'Рим',
//     destinationCountry: 'Італія',
//     originRoute: { lat: 52.52, lng: 13.4049 },
//     destinationRoute: { lat: 41.9028, lng: 12.4964 },
//     weight: [800],
//     statusShip: 'В процесі',
//     originDate: '2022-11-21',
//     destinationDate: '2023-11-25',
//     isInternational: true,
//     distance: 1000,
//     cost: [4000],
//     client: ['Michael Brown'],
//   },
//   {
//     id: '6',
//     shipmentNum: 'PQR678',
//     originCity: 'Сіетл',
//     originCountry: 'США',
//     destinationCity: 'Ванкувер',
//     destinationCountry: 'Канада',
//     originRoute: { lat: 47.6062, lng: -122.3321 },
//     destinationRoute: { lat: 49.2827, lng: -123.1207 },
//     weight: [900],
//     statusShip: 'В процесі',
//     originDate: '2023-11-01',
//     destinationDate: '2023-11-10',
//     isInternational: true,
//     distance: 300,
//     cost: [2000],
//     client: ['Sophia Davis'],
//   },
//   {
//     id: '7',
//     shipmentNum: 'STU901',
//     originCity: 'Сідней',
//     originCountry: 'Австралія',
//     destinationCity: 'Акланд',
//     destinationCountry: 'Нова Зеландія',
//     originRoute: { lat: -33.8688, lng: 151.2093 },
//     destinationRoute: { lat: -36.8485, lng: 174.7633 },
//     weight: [1800],
//     statusShip: 'Завершено',
//     originDate: '2023-05-29',
//     destinationDate: '2023-06-05',
//     isInternational: true,
//     distance: 1200,
//     cost: [6000],
//     client: ['Olivia Wilson'],
//   },
//   {
//     id: '8',
//     shipmentNum: 'VWX234',
//     originCity: 'Мельбурн',
//     originCountry: 'Австралія',
//     destinationCity: 'Веллінгтон',
//     destinationCountry: 'Нова Зеландія',
//     originRoute: { lat: -37.8136, lng: 144.9631 },
//     destinationRoute: { lat: -41.2865, lng: 174.7762 },
//     weight: [1600],
//     statusShip: 'В процесі',
//     originDate: '2024-01-01',
//     destinationDate: '2024-01-10',
//     isInternational: true,
//     distance: 1300,
//     cost: [5500],
//     client: ['William Thompson'],
//   },
//   {
//     id: '9',
//     shipmentNum: 'YZA567',
//     originCity: 'Торонто',
//     originCountry: 'Канада',
//     destinationCity: 'Монреаль',
//     destinationCountry: 'Канада',
//     originRoute: { lat: 43.6532, lng: -79.3832 },
//     destinationRoute: { lat: 45.5017, lng: -73.5673 },
//     weight: [1100],
//     statusShip: 'Завершено',
//     originDate: '2023-05-31',
//     destinationDate: '2023-06-10',
//     isInternational: false,
//     distance: 350,
//     cost: [2500],
//     client: ['Sophia Johnson'],
//   },
//   {
//     id: '10',
//     shipmentNum: 'BCD789',
//     originCity: 'Лондон',
//     originCountry: 'Велика Британія',
//     destinationCity: 'Париж',
//     destinationCountry: 'Франція',
//     originRoute: { lat: 51.5074, lng: -0.1276 },
//     destinationRoute: { lat: 48.8566, lng: 2.3522 },
//     weight: [1400],
//     statusShip: 'В процесі',
//     originDate: '2024-03-01',
//     destinationDate: '2024-03-10',
//     isInternational: true,
//     distance: 400,
//     cost: [3500],
//     client: ['Daniel Anderson'],
//   },
// ];

const reviews = [
  {
    id: '1',
    author: 'Іван Петров',
    content:
      'Дуже задоволений послугами LOGICTRANS. Швидка доставка і висока якість обслуговування.',
  },
  {
    id: '2',
    author: 'Олена Сидоренко',
    content:
      'Завжди надійна компанія для наших логістичних потреб. Рекомендую LOGICTRANS усім!',
  },
];
const firebaseConfig = {
  apiKey: 'AIzaSyC98VQ3rNvIgsY4elcV2uKxYu9lB0jkxbs',
  authDomain: 'logistic-77f46.firebaseapp.com',
  projectId: 'logistic-77f46',
  storageBucket: 'logistic-77f46.appspot.com',
  messagingSenderId: '981152076117',
  appId: '1:981152076117:web:c646983c427797e4f51fdc',
  measurementId: 'G-LLJ96HRJ02',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const addOrders = async shipment => {
  await setDoc(doc(db, 'shipments', shipment.id), shipment);
};
export const addReviews = async review => {
  await setDoc(doc(db, 'reviews', review.id), review);
};
export function generateSumString(array, text = '') {
  let elements = '';
  const sum = array.reduce((acc, curr) => acc + Number(curr), 0);
  if (array.length !== 1) {
    elements = '(' + generateString(array, text) + text + ')';
  }
  return `${sum} ${text} ${elements} `;
}
export function generateString(array, text = '') {
  if (array.lengh !== 1) {
    return array.join(`${text}, `);
  } else {
    return array[0];
  }
}

export const updateStatusBasedOnDate = async shipments => {
  const currentDate = new Date();

  const updatedShipments = await Promise.all(
    shipments.map(async shipment => {
      const { id, originDate, destinationDate } = shipment;
      const shipmentRef = doc(db, 'shipments', id);

      let updatedStatus = 'В процесі';
      const originDateObj = new Date(originDate);
      const destinationDateObj = new Date(destinationDate);

      if (originDateObj > currentDate) {
        updatedStatus = 'В очікуванні';
      } else if (destinationDateObj < currentDate) {
        updatedStatus = 'Виконано';
      }

      await updateDoc(shipmentRef, {
        statusShip: updatedStatus,
      });

      return { ...shipment, statusShip: updatedStatus };
    })
  );

  return updatedShipments;
};
export const changeId = async arrId => {};
export const getReviews = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'reviews'));
    const reviews = querySnapshot.docs.map(doc => {
      return doc.data();
    });
    return reviews;
  } catch (error) {
    console.error('Помилка при отриманні даних з Firestore:', error);
    return [];
  }
};
export const getOrders = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'shipments'));
    const shipments = querySnapshot.docs.map(doc => {
      return doc.data();
    });
    return shipments;
  } catch (error) {
    console.error('Помилка при отриманні даних з Firestore:', error);
    return [];
  }
};

export const getOrderById = async id => {
  try {
    const docRef = doc(db, 'shipments', id);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.log('Документ не знайдено!');
      return null;
    }
  } catch (error) {
    console.error('Помилка при отриманні даних з Firestore:', error);
    return null;
  }
};
export const getInternational = (origin, destination) => {
  return origin !== destination;
};

export const handleSaveToFireStorage = () => {
  reviews.map(async review => {
    await addReviews(review);
  });
};

export const isInternational = shipment => {
  return shipment.origin.country !== shipment.destination.country;
};
export const getcentrMap = shipment => {
  const centerLat =
    (shipment.originRoute.lat + shipment.destinationRoute.lat) / 2;
  const centerLng =
    (shipment.originRoute.lng + shipment.destinationRoute.lng) / 2;
  return [centerLng, centerLat];
};

export function getDistance(originRoute, destinationRoute) {
  const earthRadius = 6371; // Радіус Землі в кілометрах

  const dLat = toRadians(destinationRoute.lat - originRoute.lat);
  const dLon = toRadians(destinationRoute.lng - originRoute.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(originRoute.lat)) *
      Math.cos(toRadians(destinationRoute.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return Math.round(distance);
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}
export function getZoom(distance) {
  if (distance > 1800) {
    return 1;
  }
  if (distance > 1400) {
    return 2;
  }
  if (distance > 1000) {
    return 3;
  }

  if (distance > 500) {
    return 4;
  }
  return 5;
}
export function getdestinationDate(distance, originDate) {
  const currentDate = new Date(originDate);

  if (distance > 2500) {
    const deliveryDate = new Date(currentDate);
    deliveryDate.setDate(currentDate.getDate() + 8);
    return formatDate(deliveryDate);
  }
  if (distance > 1800) {
    const deliveryDate = new Date(currentDate);
    deliveryDate.setDate(currentDate.getDate() + 6);
    return formatDate(deliveryDate);
  }
  if (distance > 1400) {
    const deliveryDate = new Date(currentDate);
    deliveryDate.setDate(currentDate.getDate() + 4);
    return formatDate(deliveryDate);
  }
  if (distance > 1000) {
    const deliveryDate = new Date(currentDate);
    deliveryDate.setDate(currentDate.getDate() + 3);
    return formatDate(deliveryDate);
  }
  if (distance > 500) {
    const deliveryDate = new Date(currentDate);
    deliveryDate.setDate(currentDate.getDate() + 2);
    return formatDate(deliveryDate);
  }

  const deliveryDate = new Date(currentDate);
  deliveryDate.setDate(currentDate.getDate() + 1);
  return formatDate(deliveryDate);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateShippingCost(
  distance,
  weight,
  pricePerKilometer,
  transportType
) {
  let baseCost = distance * pricePerKilometer;

  if (transportType) {
    baseCost *= 1.5;
  } else {
    baseCost *= 1;
  }

  if (weight > 1000) {
    const overweightCharge = (weight - 1000) * 0.5;
    baseCost += overweightCharge;
  }

  return Math.round(baseCost);
}
