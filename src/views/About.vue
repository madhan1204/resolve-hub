<template>
    <ion-page>
        <ion-header>
        <ion-toolbar class="simple-toolbar">
            <ion-title class="simple-title">About Us</ion-title>
        </ion-toolbar>
        </ion-header>
  
      <ion-content class="ion-content-center">
        <!-- Image Cards Component -->
        <div class="card-container">
          <ImageCard :items="imageData" />
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { IonPage, IonHeader, IonTitle, IonContent, IonToolbar } from '@ionic/vue';
  import ImageCard from '../components/ImageCard.vue';
  
  // Image imports
  import groupImage from '../assets/group.png';
  import reportImage from '../assets/report.png';
  import shareImage from '../assets/share.png';
  import monitorImage from '../assets/monitor.png';
  
  // Data for images and descriptions
  const imageData = ref([
    { image: groupImage, description: 'Join citizens on a unified platform.' },
    { image: reportImage, description: 'Report issues directly to the government.' },
    { image: shareImage, description: 'Stay updated with fellow citizens\' issues.' },
    { image: monitorImage, description: 'Monitor the government\'s response to your reports.' }
  ]);
  </script>
  
  <style scoped>
  /* Flexbox container for image cards */
  .card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    margin-top: 80px;
  }
  
  /* Styling for IonContent to center content vertically and horizontally */
  .ion-content-center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* Takes full viewport height */
    padding: 16px;
    --background: #e0f7fa;
  }

  .simple-toolbar {
  background-color: #4a90e2; /* Light blue background */
  padding: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Soft shadow */
  border-bottom: 2px solid #357ABD; /* Adds a darker blue border at the bottom */
}

.simple-title {
  font-size: 1.5rem;
  color: black; /* White text for contrast */
  font-weight: 500;
  text-align: center; /* Center the title */
  letter-spacing: 0.5px; /* Slight letter spacing */
}


  </style>
  