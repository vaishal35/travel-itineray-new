// services/dataService.js
import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    deleteDoc, 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc,
    orderBy,
    serverTimestamp 
  } from 'firebase/firestore';
  import { db } from '../firebase';
  
  class DataService {
    // User data operations
    async saveUserTripData(userId, tripData) {
      try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
          tripData,
          updatedAt: serverTimestamp()
        }, { merge: true });
        return true;
      } catch (error) {
        console.error('Error saving trip data:', error);
        throw error;
      }
    }
  
    async getUserTripData(userId) {
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          return userSnap.data().tripData || null;
        }
        return null;
      } catch (error) {
        console.error('Error getting trip data:', error);
        throw error;
      }
    }
  
    // Itinerary operations
    async saveItinerary(userId, itinerary) {
      try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          itinerary,
          updatedAt: serverTimestamp()
        });
        return true;
      } catch (error) {
        console.error('Error saving itinerary:', error);
        throw error;
      }
    }
  
    async getItinerary(userId) {
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          return userSnap.data().itinerary || [];
        }
        return [];
      } catch (error) {
        console.error('Error getting itinerary:', error);
        throw error;
      }
    }
  
    // Favorites operations
    async saveFavorites(userId, favorites) {
      try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          favorites,
          updatedAt: serverTimestamp()
        });
        return true;
      } catch (error) {
        console.error('Error saving favorites:', error);
        throw error;
      }
    }
  
    async getFavorites(userId) {
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          return userSnap.data().favorites || [];
        }
        return [];
      } catch (error) {
        console.error('Error getting favorites:', error);
        throw error;
      }
    }
  
    // Packing list operations
    async savePackingList(userId, packingList) {
      try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          packingList,
          updatedAt: serverTimestamp()
        });
        return true;
      } catch (error) {
        console.error('Error saving packing list:', error);
        throw error;
      }
    }
  
    async getPackingList(userId) {
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          return userSnap.data().packingList || [];
        }
        return [];
      } catch (error) {
        console.error('Error getting packing list:', error);
        throw error;
      }
    }
  
    // Expenses operations
    async saveExpenses(userId, expenses) {
      try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          expenses,
          updatedAt: serverTimestamp()
        });
        return true;
      } catch (error) {
        console.error('Error saving expenses:', error);
        throw error;
      }
    }
  
    async getExpenses(userId) {
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          return userSnap.data().expenses || [];
        }
        return [];
      } catch (error) {
        console.error('Error getting expenses:', error);
        throw error;
      }
    }
  
    // Trip history operations
    async saveTrip(userId, tripData, itinerary) {
      try {
        const tripsRef = collection(db, 'trips');
        const tripDoc = await addDoc(tripsRef, {
          userId,
          tripData,
          itinerary,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        return tripDoc.id;
      } catch (error) {
        console.error('Error saving trip:', error);
        throw error;
      }
    }
  
    async getUserTrips(userId) {
      try {
        const tripsRef = collection(db, 'trips');
        const q = query(
          tripsRef, 
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        
        const trips = [];
        querySnapshot.forEach((doc) => {
          trips.push({ id: doc.id, ...doc.data() });
        });
        
        return trips;
      } catch (error) {
        console.error('Error getting user trips:', error);
        throw error;
      }
    }
  
    async deleteTrip(tripId) {
      try {
        const tripRef = doc(db, 'trips', tripId);
        await deleteDoc(tripRef);
        return true;
      } catch (error) {
        console.error('Error deleting trip:', error);
        throw error;
      }
    }
  
    // Complete user data operations
    async saveAllUserData(userId, data) {
      try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
          ...data,
          updatedAt: serverTimestamp()
        }, { merge: true });
        return true;
      } catch (error) {
        console.error('Error saving user data:', error);
        throw error;
      }
    }
  
    async getAllUserData(userId) {
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          return userSnap.data();
        }
        return null;
      } catch (error) {
        console.error('Error getting user data:', error);
        throw error;
      }
    }
  }
  
  export default new DataService();
