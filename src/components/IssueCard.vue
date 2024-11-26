<template>
    <ion-card @click="toggleExpand">
      <ion-card-header>
        <ion-card-title>{{ username }}</ion-card-title>
        <ion-card-subtitle>{{ dateTime }}</ion-card-subtitle>
  
        <!-- Toggle Arrow Icon -->
        <ion-icon :icon="expanded ? 'chevron-down-outline' : 'chevron-forward-outline'" class="toggle-icon" />
      </ion-card-header>
  
      <!-- Show Content Conditionally -->
      <ion-card-content v-if="expanded">
        <h3>{{ issueTitle }}</h3>
        <p>{{ issueDescription }}</p>
        <img :src="issueImage" alt="Issue Image" v-if="issueImage" />
  
        <div v-if="progress">
          <h4>Progress:</h4>
          <p>{{ progress }}</p>
        </div>
  
        <ion-button v-if="progress === 'Resolved'" color="success" expand="block">
          View Proof
        </ion-button>
  
        <ion-footer>
          <ion-icon icon="chatbubble-outline" /> Comment
          <ion-icon icon="share-outline" /> Share
          
        </ion-footer>
        <ion-icon icon="location-outline" /> {{ city }}
      </ion-card-content>
    </ion-card>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonFooter, IonIcon } from '@ionic/vue';
  
  const expanded = ref(false);
  const toggleExpand = () => (expanded.value = !expanded.value);
  
  const props = defineProps({
    username: String,
    dateTime: String,
    issueTitle: String,
    issueDescription: String,
    issueImage: String,
    progress: String,
    city: String
  });
  </script>
  
  <style scoped>
  .toggle-icon {
    position: absolute;
    right: 16px;
    top: 16px;
    font-size: 24px;
    cursor: pointer;
  }
  </style>
  