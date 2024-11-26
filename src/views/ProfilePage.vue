<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>User Profile</ion-title>
        <ion-buttons slot="end">
          <!-- Logout Button -->
          <ion-button @click="logout" color="danger">
            Logout
          </ion-button>
        </ion-buttons>
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
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import ProfileCard from '../components/ProfileCard.vue';

const email = ref('');
const userId = ref('');
const isEditing = ref(false);
const router = useRouter(); // Router instance for navigation

// Toggle edit mode
const toggleEdit = () => {
  isEditing.value = !isEditing.value; // Toggle the editing state
};

// Logout functionality
const logout = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
    alert('Logged out successfully!');
    router.push('/'); // Redirect to login or home page
  } catch (error) {
    console.error('Error logging out:', error);
    alert('Failed to log out. Please try again.');
  }
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
