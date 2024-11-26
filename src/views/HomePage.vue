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
            <ion-label position="stacked">Location</ion-label>
            <ion-input :value="location" readonly placeholder="Fetch location..."></ion-input>
            <ion-button expand="block" @click="fetchLocation">Get Location</ion-button>
          </ion-item>

          <ion-button expand="block" color="primary" @click="postIssue">Post Issue</ion-button>
          <ion-button expand="block" color="light" @click="closeModal">Cancel</ion-button>
        </div>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Geolocation } from '@capacitor/geolocation';
import { db, storage } from '../firebase'; // Update paths as needed
import { collection, addDoc, limit } from 'firebase/firestore';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';

const isModalOpen = ref(false);
const issueTitle = ref('');
const imageFile = ref<File | null>(null);
const location = ref<string | null>(null);  // Updated location type

// Open Modal
const openModal = () => {
  isModalOpen.value = true;
};

// Close Modal
const closeModal = () => {
  isModalOpen.value = false;
  issueTitle.value = '';
  imageFile.value = null;
  location.value = '';  // Reset location
};

// Handle Image Upload
const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    imageFile.value = file;
  }
};

// Fetch Address from OpenWeather API
async function getAddress(lat: number, lon: number): Promise<string | null> {
  const apiKey = '03e90ca91897b72f1bd77311ea50959b';
  const limit = 5;  // You can adjust this limit based on the number of results needed
  const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${limit}&appid=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data && data.length > 0) {
    return data[0].name || `${data[0].lat}, ${data[0].lon}`;
  } else {
    console.error('No address found');
    return null;
  }
}


// Fetch Location Coordinates and Address
const fetchLocation = async () => {
  try {
    const position = await Geolocation.getCurrentPosition();
    console.log(position);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude);
    console.log(longitude);
    location.value = await getAddress(latitude, longitude);  // Await address
  } catch (error) {
    console.error("Error fetching location:", error);
    alert("Unable to fetch location");
  }
};

// Post Issue to Firebase
const postIssue = async () => {
  if (!issueTitle.value || !imageFile.value) {
    alert("Please enter a title and upload an image.");
    return;
  }

  try {
    // Upload image to Firebase Storage
    const imageRef = storageRef(storage, `issue_images/${imageFile.value.name}`);
    const snapshot = await uploadBytes(imageRef, imageFile.value);
    const imageUrl = await getDownloadURL(snapshot.ref);

    // Add issue data to Firestore
    const issuesCollection = collection(db, 'issues');
    await addDoc(issuesCollection, {
      title: issueTitle.value,
      imageUrl: imageUrl,
      location: location.value,
      timestamp: new Date(),
    });

    alert("Issue posted successfully!");
    closeModal();
  } catch (error) {
    console.error("Error posting issue:", error);
    alert("Failed to post issue. Please try again.");
  }
};
</script>

<style scoped>
.modal-content {
  padding: 16px;
}

ion-fab-button {
  --background: var(--ion-color-primary);
}
</style>

















<!-- <template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <IssueCard 
        username="John Doe"
        dateTime="2024-10-28 10:00 AM"
        issueTitle="Water Leak in Building"
        issueDescription="There's a persistent water leak that needs urgent fixing."
        issueImage="path/to/image.jpg"
        progress="In Progress"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import IssueCard from '../components/IssueCard.vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
</script> -->
