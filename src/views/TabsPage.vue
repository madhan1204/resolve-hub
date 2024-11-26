<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon :icon="homeIcon" />
          <ion-label>Home</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="citizens" href="/tabs/citizens">
          <ion-icon :icon="peopleIcon" />
          <ion-label>Citizens</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="profile" href="/tabs/profile">
          <ion-icon :icon="personIcon" />
          <ion-label>Profile</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { home as homeIcon, people as peopleIcon, person as personIcon } from 'ionicons/icons';
</script>
