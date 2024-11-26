<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Citizens of {{ userCity }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-searchbar
          v-model="searchQuery"
          debounce="500"
          placeholder="Search citizens..."
          @ionInput="searchCitizens"
        />
  
        <div v-if="filteredCitizens.length">
          <CitizenCard
            v-for="citizen in filteredCitizens"
            :key="citizen.id"
            :name="citizen.name"
            :email="citizen.email"
            :city="citizen.city"
            :isAdmin="true"
            @delete="deleteCitizen(citizen.id)"
            @edit="editCitizen(citizen)"
          />
        </div>
        <p v-else>No citizens found in your city.</p>
  
        <ion-infinite-scroll
          threshold="100px"
          @ionInfinite="loadMoreCitizens"
        >
          <ion-infinite-scroll-content
            loading-spinner="bubbles"
            loading-text="Loading more citizens..."
          ></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { db } from '../firebase';
  import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    deleteDoc,
    QueryDocumentSnapshot,
    DocumentData,
  } from 'firebase/firestore';
  import CitizenCard from '../components/CitizenCard.vue';
  
  interface Citizen {
    id: string;
    name: string;
    email: string;
    city: string;
  }
  
  // Reactive State
  const userCity = ref('');
  const citizens = ref<Citizen[]>([]);
  const searchQuery = ref('');
  const auth = getAuth();
  const lastVisible = ref<QueryDocumentSnapshot<DocumentData> | null>(null);
  
  // Computed Property for Filtering Citizens
  const filteredCitizens = computed(() => {
    return citizens.value.filter((citizen) =>
      citizen.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
  
  // Fetch Citizens from Firestore
  const fetchCitizens = async () => {
    if (!userCity.value) return;
  
    try {
      const citizensRef = collection(db, 'users');
      const q = query(citizensRef, where('city', '==', userCity.value));
      const querySnapshot = await getDocs(q);
  
      citizens.value = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Citizen;
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          city: data.city,
        };
      });
  
      // Track the last visible document for pagination
      lastVisible.value =
        querySnapshot.docs[querySnapshot.docs.length - 1] || null;
    } catch (error) {
      console.error('Error fetching citizens:', error);
    }
  };
  
  // Load More Citizens for Infinite Scrolling
  const loadMoreCitizens = async (event: CustomEvent) => {
    if (!lastVisible.value) {
      (event.target as HTMLIonInfiniteScrollElement).disabled = true;
      return;
    }
  
    try {
      const citizensRef = collection(db, 'users');
      const q = query(
        citizensRef,
        where('city', '==', userCity.value)
      ); // Add pagination logic if needed
      const querySnapshot = await getDocs(q);
  
      citizens.value.push(
        ...querySnapshot.docs.map((doc) => {
          const data = doc.data() as Citizen;
          return {
            id: doc.id,
            name: data.name,
            email: data.email,
            city: data.city,
          };
        })
      );
  
      // Update last visible document for the next pagination
      lastVisible.value =
        querySnapshot.docs[querySnapshot.docs.length - 1] || null;
  
      (event.target as HTMLIonInfiniteScrollElement).complete();
    } catch (error) {
      console.error('Error loading more citizens:', error);
      (event.target as HTMLIonInfiniteScrollElement).disabled = true;
    }
  };
  
  // Delete a Citizen
  const deleteCitizen = async (citizenId: string) => {
    try {
      await deleteDoc(doc(db, 'users', citizenId));
      citizens.value = citizens.value.filter((citizen) => citizen.id !== citizenId);
      alert('Citizen deleted successfully!');
    } catch (error) {
      console.error('Error deleting citizen:', error);
      alert('Failed to delete citizen.');
    }
  };
  
  // Edit Citizen (Placeholder for editing functionality)
  const editCitizen = (citizen: Citizen) => {
    alert(`Editing citizen: ${citizen.name}`);
  };
  
  // Search Citizens (Handled by Computed Property)
  const searchCitizens = () => {
    // No logic required; filtering is handled by computed property `filteredCitizens`
  };
  
  // Fetch Initial User and Citizens on Component Mount
  onMounted(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
  
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            userCity.value = docSnap.data()?.city;
            await fetchCitizens();
          }
        } catch (error) {
          console.error('Error fetching user city:', error);
        }
      } else {
        console.error('User is not authenticated');
      }
    });
  });
  </script>
  
  <style scoped>
  /* Add any necessary styles */
  </style>
  