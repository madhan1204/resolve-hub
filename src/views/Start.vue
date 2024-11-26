<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <img src="../assets/NS5wbmc.svg" alt="Header Image" class="header-image" />
      <ion-card class="custom-card animated-card">
        <ion-card-header>
          <ion-card-title class="custom-title">Welcome</ion-card-title>
          <ion-card-subtitle class="custom-subtitle">
            Feel free to report and contribute to a better environment
          </ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <router-link to="/about">
            <ion-button expand="block" class="custom-button">
              <ion-icon slot="start" name="information-circle-outline"></ion-icon>
              ABOUT
            </ion-button>
          </router-link>
          <router-link to="/register">
          <ion-button expand="block" class="custom-button">
            <ion-icon slot="start" name="person-add-outline"></ion-icon>
            REGISTER
          </ion-button>
        </router-link>
        <router-link to="/login">
          <ion-button expand="block" class="custom-button">
            <ion-icon slot="start" name="log-in-outline"></ion-icon>
            LOGIN
          </ion-button>
        </router-link>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon } from '@ionic/vue';
</script>

<style scoped>
.header-image {
  width: 100%; /* Make the image take the full width of the container */
  height: auto; /* Maintain the aspect ratio */
  max-height: 300px; /* Set a max height to ensure visibility */
  object-fit: contain; /* Ensure the entire image fits in the area */
  margin-bottom: 16px; /* Space below the image */
  display: block; /* Center the image in the container */
  margin-left: auto; /* Center alignment */
  margin-right: auto; /* Center alignment */
}

.custom-card {
  background-color: #f5f5f5;
  border-radius: 12px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.custom-card:hover {
  transform: scale(1.02);
}

.custom-title {
  font-size: 1.5rem;
  color: #333;
  font-weight: bold;
}

.custom-subtitle {
  font-size: 1rem;
  color: #555;
  margin-bottom: 12px;
}

.custom-button {
  --background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  --background-activated: linear-gradient(135deg, #5c0db6 0%, #1c5cc0 100%);
  --border-radius: 8px;
  --padding-start: 12px;
  --padding-end: 12px;
  margin-bottom: 12px;
  transition: background-color 0.2s;
}

.custom-button:hover {
  --background: linear-gradient(135deg, #8a11cb 0%, #4078fc 100%);
}

.ion-padding {
  --background: #e0f7fa;
  padding: 16px;
}

.animated-card {
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
