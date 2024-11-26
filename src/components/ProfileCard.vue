<template>
    <ion-card>
      <ion-card-header>
        <ion-card-title>Profile</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <!-- Email Field (Read-only) -->
        <ion-item>
          <ion-label position="stacked">Email</ion-label>
          <ion-input :value="email" readonly></ion-input>
        </ion-item>
  
        <!-- Name Field -->
        <ion-item>
          <ion-label position="stacked">Name</ion-label>
          <ion-input v-model="name" :readonly="!isEditing" placeholder="Enter your name"></ion-input>
        </ion-item>
  
        <!-- City Field -->
        <ion-item>
          <ion-label position="stacked">City</ion-label>
          <ion-input v-model="city" :readonly="!isEditing" placeholder="Enter your city"></ion-input>
        </ion-item>
  
        <!-- Save Button (only visible when editing) -->
        <ion-button v-if="isEditing" expand="block" @click="saveProfile">
          Save Profile
        </ion-button>
      </ion-card-content>
    </ion-card>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, watch, defineEmits } from 'vue';
  import { doc, setDoc, getDoc } from 'firebase/firestore';
  import { db } from '../firebase';
  
  // Define props and emits
  const props = defineProps({
    email: String,
    userId: String,
    isEditing: Boolean // Prop from ProfilePage to control edit mode
  });
  
  const emit = defineEmits(['update:isEditing']); // Emit event to update editing state
  
  const name = ref('');
  const city = ref('');
  
  // Fetch existing profile data
  const fetchProfileData = async () => {
    if (!props.userId) {
      console.error('User ID is undefined');
      return;
    }
  
    try {
      const profileRef = doc(db, 'users', props.userId as string); // Casting userId as string
      const profileSnapshot = await getDoc(profileRef);
      if (profileSnapshot.exists()) {
        const profileData = profileSnapshot.data();
        name.value = profileData.name || '';
        city.value = profileData.city || '';
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };
  
  // Save profile data to Firestore
  const saveProfile = async () => {
    if (!props.userId) {
      console.error('User ID is undefined');
      return;
    }
  
    try {
      const profileRef = doc(db, 'users', props.userId as string); // Casting userId as string
      // Save email, name, and city to Firestore
      await setDoc(profileRef, { 
        email: props.email, // Include the email
        name: name.value, 
        city: city.value 
      }, { merge: true });
      
      alert('Profile updated successfully!');
      // Emit event to change editing state in the parent component
      emit('update:isEditing', false);
    } catch (error) {
      alert(`Error updating profile: ${error.message}`);
    }
  };
  
  // Update edit state when prop changes
  watch(
    () => props.isEditing,
    (newVal) => {
      if (!newVal) {
        fetchProfileData();
      }
    }
  );
  
  // Fetch profile data on component mount
  fetchProfileData();
  </script>
  
  <style scoped>
  /* Add styles for ion-card, ion-item as necessary */
  </style>
  