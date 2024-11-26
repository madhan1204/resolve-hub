<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Create Account</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <img src="../assets/people_register.png" alt="Header Image" class="header-image" />

      <ion-card class="custom-card animated-card">
        <ion-card-header>
          <ion-card-title class="custom-title">Register</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-item class="custom-input">
            <ion-label position="floating">Email</ion-label>
            <ion-input v-model="email" type="email" required></ion-input>
          </ion-item>

          <ion-item class="custom-input">
            <ion-label position="floating">Password</ion-label>
            <ion-input v-model="password" type="password" required></ion-input>
          </ion-item>

          <ion-button expand="block" @click="registerUser" class="custom-button">
            <ion-icon slot="start" name="person-add-outline"></ion-icon>
            Register
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, alertController } from '@ionic/vue';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const email = ref('');
const password = ref('');
const router = useRouter();

const registerUser = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    // Display success message
    const alert = await alertController.create({
      header: 'Success',
      message: 'Registration successful!',
      buttons: ['OK']
    });
    await alert.present();

    // Navigate to About page after the alert is dismissed
    await alert.onDidDismiss();
    router.push('/');
  } catch (error) {
    // Display error message if registration fails
    const alert = await alertController.create({
      header: 'Registration Failed',
      message: error.message,
      buttons: ['OK']
    });
    await alert.present();
  }
};
</script>


<style scoped>
.header-image {
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: contain;
  margin-bottom: 16px;
  display: block;
  margin-left: auto;
  margin-right: auto;
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

.custom-input {
  margin-bottom: 12px;
}

.custom-button {
  --background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  --background-activated: linear-gradient(135deg, #5c0db6 0%, #1c5cc0 100%);
  --border-radius: 8px;
  --padding-start: 12px;
  --padding-end: 12px;
  margin-top: 20px;
}
</style>
