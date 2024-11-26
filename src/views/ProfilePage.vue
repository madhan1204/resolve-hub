<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>User Profile</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <!-- Pass email, userId, and isEditing as props to ProfileCard component -->
      <ProfileCard 
        :email="email" 
        :userId="userId" 
        :isEditing="isEditing" 
        @update:isEditing="isEditing = $event" 
        v-if="userId" 
      />

      <!-- Floating Edit Button -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="toggleEdit">
          <ion-icon name="create-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ProfileCard from '../components/ProfileCard.vue';

const email = ref('');
const userId = ref('');
const isEditing = ref(false);

// Toggle edit mode
const toggleEdit = () => {
  isEditing.value = !isEditing.value; // Toggle the editing state
};

// Fetch user data on component mount
onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      email.value = user.email || '';
      userId.value = user.uid || '';
    } else {
      console.error("User is not authenticated");
    }
  });
});
</script>

<style scoped>
/* Style the floating button if needed */
</style>
