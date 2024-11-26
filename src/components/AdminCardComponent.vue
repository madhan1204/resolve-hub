<template>
  <ion-card>
    <!-- Main Issue Information -->
    <div class="header-container">
      <ion-img class="main-issue-image" :src="issue.imageUrl" alt="Main Issue Image" />
      <div class="header-details">
        <ion-card-title class="title">{{ issue.title }}</ion-card-title>
        <ion-card-subtitle class="status">Status: {{ issue.status }}</ion-card-subtitle>
        <ion-card-subtitle class="reporter">
          Reported by: {{ issue.username || 'Unknown User' }} <br />
          ({{ issue.city || 'Unknown City' }})
        </ion-card-subtitle>
      </div>
    </div>

    <ion-card-content>
      <p class="description">{{ issue.description }}</p>

      <!-- Proof Images Section -->
<!-- Proof Images Section -->
<div v-if="localProofImages.length" class="proof-images">
      <h4>Proof Images:</h4>
      <div class="proof-image-container">
        <div
          v-for="(image, index) in localProofImages"
          :key="index"
          class="proof-image-wrapper"
        >
          <ion-img
            :src="image"
            :alt="'Proof image ' + (index + 1)"
            class="proof-image"
          />
          <!-- Remove Button -->
          <ion-button
            size="small"
            fill="clear"
            color="danger"
            @click="removeProofImage(image)"
          >
            Remove
          </ion-button>
        </div>
      </div>
    </div>

      <!-- Admin Controls -->
      <div class="admin-controls">
        <h3 class="admin-heading">Admin Controls</h3>

        <!-- Update Status -->
        <ion-item class="control-item">
          <ion-label>Status</ion-label>
          <ion-select
            v-model="updatedStatus"
            placeholder="Select Status"
            @ionChange="updateStatus"
          >
            <ion-select-option value="Pending">Pending</ion-select-option>
            <ion-select-option value="In Progress">In Progress</ion-select-option>
            <ion-select-option value="Resolved">Resolved</ion-select-option>
          </ion-select>
        </ion-item>

        <!-- Add Proof Images -->
        <div class="file-upload">
          <ion-label>Add Proof</ion-label>
          <input
            type="file"
            @change="handleProofUpload"
            class="file-input"
          />
          <ion-button
            expand="block"
            color="secondary"
            @click="uploadProof"
            :disabled="isUploading"
          >
            <ion-spinner v-if="isUploading" /> Upload Proof
          </ion-button>
        </div>

        <!-- Delete Issue -->
        <ion-button
          expand="block"
          color="danger"
          @click="deleteIssue"
          class="delete-button"
        >
          Delete Issue
        </ion-button>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { db, storage } from '../firebase';
import {
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// Define the Issue interface
interface Issue {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  proofImages?: string[];
  status: string;
  username: string;
  city: string;
  userId?: string;
}

// Props
const props = defineProps<{
  issue: Issue;
  userId: string;
}>();

// Reactive data
const updatedStatus = ref(props.issue.status);
const proofFile = ref<File | null>(null);
const isUploading = ref(false);
const localProofImages = ref<string[]>([]);
const username = ref('');
const userCity = ref('');


// Fetch user information
const fetchUserInfo = async () => {
  try {
    if (!props.issue.userId) {
      console.warn('No userId found in issue data.');
      return;
    }

    const userDocRef = doc(db, 'users', props.issue.userId); // Ensure userId is present
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      username.value = userData.name || 'Unknown User';
      userCity.value = userData.city || 'Unknown City';
    } else {
      console.warn('User document does not exist.');
    }
  } catch (err) {
    console.error('Error fetching user info:', err);
  }
};

// Remove a proof image
const removeProofImage = async (imageUrl: string) => {
  try {
    const issueDoc = doc(db, 'issues', props.issue.id);

    // Remove the image URL from Firestore
    await updateDoc(issueDoc, {
      proofImages: arrayRemove(imageUrl),
    });

    // Update the local proofImages array
    localProofImages.value = localProofImages.value.filter((img) => img !== imageUrl);

    alert('Proof image removed successfully!');
  } catch (error) {
    console.error('Error removing proof image:', error);
    alert('Failed to remove proof image.');
  }
};

// Update the issue status
const updateStatus = async () => {
  try {
    const issueDoc = doc(db, 'issues', props.issue.id);
    await updateDoc(issueDoc, { status: updatedStatus.value });
    alert('Status updated successfully!');
  } catch (error) {
    console.error('Error updating status:', error);
    alert('Failed to update status.');
  }
};

// Handle file input change
const handleProofUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) proofFile.value = file;
};

// Upload a proof image
const uploadProof = async () => {
  if (!proofFile.value) {
    alert('Please select a proof image to upload.');
    return;
  }

  isUploading.value = true;

  try {
    const proofRef = storageRef(storage, `proof_images/${proofFile.value.name}`);
    const snapshot = await uploadBytes(proofRef, proofFile.value);
    const proofUrl = await getDownloadURL(snapshot.ref);

    // Update Firestore with the new image URL
    const issueDoc = doc(db, 'issues', props.issue.id);
    await updateDoc(issueDoc, {
      proofImages: arrayUnion(proofUrl),
    });

    // Update the local proofImages array to reflect the new image
    localProofImages.value.push(proofUrl);

    alert('Proof image uploaded successfully!');
  } catch (error) {
    console.error('Error uploading proof:', error);
    alert('Failed to upload proof image.');
  } finally {
    isUploading.value = false;
  }
};

// Delete the issue
const deleteIssue = async () => {
  try {
    const issueDoc = doc(db, 'issues', props.issue.id);
    await deleteDoc(issueDoc);
    alert('Issue deleted successfully!');
  } catch (error) {
    console.error('Error deleting issue:', error);
    alert('Failed to delete issue.');
  }
};

// Lifecycle hook
onMounted(() => {
  fetchUserInfo(); // Fetch user information
  localProofImages.value = [...(props.issue.proofImages || [])];
});
</script>



<style scoped>
.header-container {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
}

.header-details {
  flex: 1;
}

.main-issue-image {
  width: 150px;
  height: 150px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.title {
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
}

.status {
  color: #0066cc;
  margin-top: 4px;
}

.reporter {
  color: #555;
  margin-top: 4px;
}

.description {
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
  margin-bottom: 16px;
}

.proof-images {
  margin-top: 16px;
}

.proof-image-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.proof-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.admin-controls {
  margin-top: 24px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.admin-heading {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 12px;
}

.control-item {
  margin-bottom: 16px;
}

.file-upload {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-input {
  padding: 8px;
  border: 1px
}
</style>