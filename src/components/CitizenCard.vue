<template>
    <ion-card>
      <ion-card-header>
        <ion-card-title>{{ name }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <p>Email: {{ email }}</p>
      </ion-card-content>
    </ion-card>
  </template>
  
  <script setup>
  defineProps({
    name: String,
    email: String
  });
  </script>
  
  <style scoped>
  /* Style as needed */
  </style>
  