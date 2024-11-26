<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Admin Dashboard</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <!-- Loading Indicator -->
        <div v-if="loading" class="loading">
          <ion-spinner name="dots"></ion-spinner>
          <p>Loading issues...</p>
        </div>
  
        <!-- No Issues Available -->
        <div v-else-if="issues.length === 0" class="no-issues">
          <p>No issues available to manage!</p>
        </div>
  
        <!-- List of Issue Cards -->
        <div v-else class="issues-list">
          <AdminCardComponent
            v-for="issue in issues"
            :key="issue.id"
            :issue="issue"
            :userId="userId"
          />
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import AdminCardComponent from '../components/AdminCardComponent.vue';
  import { db } from '../firebase';
  import { 
    collection, 
    query, 
    onSnapshot ,
    doc,
    getDoc,

  } from 'firebase/firestore';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import type { User } from 'firebase/auth';
  // Define the Issue type
  interface Issue {
    id: string;
    title: string;
    description: string;
    status: string;
    imageUrl: string;
    username:string;
    city:string;
    userId: string;
  }
  
  // Reactive Data
  const issues = ref<Issue[]>([]);
  const loading = ref(true); // Loading state
  const userId = ref<string>('');
  const userCity = ref('');
  const userName = ref('');
  
  // Fetch Issues from Firebase
  const fetchIssues = () => {
    const issuesCollection = collection(db, 'issues');
    const q = query(issuesCollection);
  
    onSnapshot(q, (snapshot) => {
      issues.value = snapshot.docs.map((doc) => {
        const data = doc.data(); // Extract document data
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          username: data.username || 'Anonymous',
          city: data.city || 'Unknown City',
          status: data.status,
          imageUrl: data.imageUrl || '', // Fallback for missing fields
          userId: data.userId || '', // Fallback for missing fields
        } as Issue;
      });
      loading.value = false; // Stop loading once data is fetched
    });
  };
  
  // Fetch issues on component load
  onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      userId.value = user.uid;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        userName.value = data.name || 'Anonymous';
        userCity.value = data.city || 'Unknown City';
      }
      await fetchIssues();
    } else {
      userId.value = '';
      console.error('User is not authenticated');
    }
  });
});
  </script>
  
  <style scoped>
  .loading {
    text-align: center;
    margin-top: 50px;
    color: gray;
  }
  
  .no-issues {
    text-align: center;
    margin-top: 20px;
    color: gray;
  }
  
  .issues-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 16px;
  }
  </style>
  