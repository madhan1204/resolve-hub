<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Citizens of {{ userCity }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-searchbar v-model="searchQuery" debounce="500" placeholder="Search citizens..." @ionInput="searchCitizens" />

      <div v-if="filteredCitizens.length">
        <CitizenCard
          v-for="citizen in filteredCitizens"
          :key="citizen.id"
          :name="citizen.name"
          :email="citizen.email"
        />
      </div>
      <p v-else>No citizens found in your city.</p>

      <ion-infinite-scroll threshold="100px" @ionInfinite="loadMoreCitizens">
        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more citizens..."></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import CitizenCard from '../components/CitizenCard.vue';

interface Citizen {
  id: string;
  name: string;
  email: string;
}

const userCity = ref('');
const citizens = ref<Citizen[]>([]);
const searchQuery = ref('');
const auth = getAuth();
const lastVisible = ref<QueryDocumentSnapshot<DocumentData> | null>(null);

const filteredCitizens = computed(() => {
  return citizens.value.filter(citizen => 
    citizen.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const fetchCitizens = async () => {
  if (!userCity.value) return;

  try {
    const citizensRef = collection(db, 'users');
    const q = query(citizensRef, where('city', '==', userCity.value));
    const querySnapshot = await getDocs(q);

    citizens.value = querySnapshot.docs.map(doc => {
      const data = doc.data() as Citizen;
      return {
        id: doc.id,
        name: data.name,
        email: data.email
      };
    });

    lastVisible.value = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
  } catch (error) {
    console.error('Error fetching citizens:', error);
  }
};

const loadMoreCitizens = async (event: CustomEvent) => {
  if (!lastVisible.value) {
    (event.target as HTMLIonInfiniteScrollElement).disabled = true;
    return;
  }

  try {
    await fetchCitizens();
    (event.target as HTMLIonInfiniteScrollElement).complete();
  } catch (error) {
    console.error('Error loading more citizens:', error);
    (event.target as HTMLIonInfiniteScrollElement).disabled = true;
  }
};

const searchCitizens = () => {
  // Triggered by ionInput on search bar; filteredCitizens updates automatically due to computed property
};

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
      console.error("User is not authenticated");
    }
  });
});
</script>

<style scoped>
/* Style as needed */
</style>
