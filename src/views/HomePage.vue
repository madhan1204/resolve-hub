<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <!-- Floating Action Button -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="openModal">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <!-- Modal for Issue Form -->
      <ion-modal :is-open="isModalOpen" @ionModalDidDismiss="closeModal">
        <div class="modal-content">
          <h2>Add New Issue</h2>
          <ion-item>
            <ion-label position="stacked">Issue Title</ion-label>
            <ion-input v-model="issueTitle" placeholder="Enter issue title"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Upload Image</ion-label>
            <input type="file" @change="handleImageUpload" />
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Issue Description</ion-label>
            <ion-input v-model="issueDescription" placeholder="Enter issue description"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Location</ion-label>
            <ion-input v-model="location" placeholder="Enter location"></ion-input>
          </ion-item>

          <ion-button expand="block" color="primary" @click="postIssue">Post Issue</ion-button>
          <ion-button expand="block" color="light" @click="closeModal">Cancel</ion-button>
        </div>
      </ion-modal>

      <!-- List of Issue Cards -->
      <div v-if="issues.length === 0" class="no-issues">
        <p>No issues available. Create one using the button below!</p>
      </div>

      <div v-else class="issues-list">
        <CardComponent
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
import CardComponent from '../components/CardComponent.vue';
import { db, storage } from '../firebase';
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  where,
  doc,
  getDoc,
} from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';

interface Issue {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  username: string;
  city: string;
  status: string;
  proofImages: string[];
  timestamp: Date;
  userId: string; // Ensure userId is included in the Issue type
}

const isModalOpen = ref(false);
const issueTitle = ref('');
const issueDescription = ref('');
const location = ref('');
const imageFile = ref<File | null>(null);
const issues = ref<Issue[]>([]);
const userId = ref<string>('');
const userCity = ref('');
const userName = ref('');

// Open Modal
const openModal = () => { isModalOpen.value = true; };
const closeModal = () => {
  isModalOpen.value = false;
  issueTitle.value = '';
  issueDescription.value = '';
  location.value = '';
  imageFile.value = null;
};

// Handle Image Upload
const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    imageFile.value = file;
  }
};

// Post Issue
const postIssue = async () => {
  if (!issueTitle.value || !imageFile.value) {
    alert('Please enter a title and upload an image.');
    return;
  }

  try {
    const imageRef = storageRef(storage, `issue_images/${imageFile.value.name}`);
    const snapshot = await uploadBytes(imageRef, imageFile.value);
    const imageUrl = await getDownloadURL(snapshot.ref);

    await addDoc(collection(db, 'issues'), {
      title: issueTitle.value,
      description: issueDescription.value,
      imageUrl,
      proofImages: [],
      status: 'Pending',
      username: userName.value,
      userId: userId.value,
      city: userCity.value,
      timestamp: new Date(),
    });

    alert('Issue posted successfully!');
    closeModal();
  } catch (error) {
    console.error('Error posting issue:', error);
    alert('Failed to post issue. Please try again.');
  }
};

// Fetch Issues
const fetchIssues = async () => {
  try {
    const issuesCollection = collection(db, 'issues');
    const q = query(issuesCollection, where('city', '==', userCity.value));
    onSnapshot(q, (snapshot) => {
      issues.value = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || '',
          description: data.description || '',
          imageUrl: data.imageUrl || '',
          username: data.username || 'Anonymous',
          city: data.city || 'Unknown City',
          status: data.status || 'Pending',
          proofImages: data.proofImages || [],
          timestamp: data.timestamp?.toDate() || new Date(),
          userId: data.userId || '',
        };
      }) as Issue[];
    });
  } catch (error) {
    console.error('Error fetching issues:', error);
    alert('Failed to fetch issues. Please try again.');
  }
};

// On Mounted
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
.modal-content {
  padding: 16px;
}

ion-fab-button {
  --background: var(--ion-color-primary);
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
