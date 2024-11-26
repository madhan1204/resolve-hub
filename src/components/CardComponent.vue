<template>
  <ion-card>
    <!-- Main Issue Information -->
    <ion-img class="main-issue-image" :src="issue.imageUrl" alt="Main Issue Image" />

    <ion-card-header>
      <ion-card-title>{{ issue.title }}</ion-card-title>
      <ion-card-subtitle>Status: {{ issue.status }}</ion-card-subtitle>
      <!-- Displaying username and city -->
      <ion-card-subtitle>
        Reported by: {{ issue.username || 'Unknown User' }}
      </ion-card-subtitle>
    </ion-card-header>

    <ion-card-content>
      <p>{{ issue.description }}</p>

      <!-- Proof Images -->
      <div v-if="issue.proofImages?.length" class="proof-images">
        <h4>Proof Images:</h4>
        <ion-img
          v-for="(image, index) in issue.proofImages"
          :key="index"
          :src="image"
          :alt="'Proof image ' + (index + 1)"
          class="proof-image"
        />
      </div>

      <!-- Comments Section -->
      <h4>Comments:</h4>
      <div v-for="comment in comments" :key="comment.id" class="comment">
        <p>
          <strong>{{ comment.username }}:</strong> {{ comment.text }}
          <span class="timestamp">({{ formatTimestamp(comment.timestamp) }})</span>
        </p>

        <!-- Delete Button -->
        <ion-button
          size="small"
          fill="clear"
          color="danger"
          v-if="comment.userId === props.userId"
          @click="deleteComment(comment.id)"
        >
          Delete
        </ion-button>
      </div>

      <!-- Add Comment Input -->
      <ion-item>
        <ion-input
          placeholder="Add a comment..."
          v-model="newComment"
        ></ion-input>
        <ion-button slot="end" @click="addComment">Post</ion-button>
      </ion-item>

      <!-- Share Button -->
      <ion-button expand="block" color="primary" @click="shareIssue">
        Share
      </ion-button>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

// TypeScript Interfaces
interface Issue {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  proofImages?: string[];
  status: string;
  username: string; // Added this property
  userId: string; // Added this property
}


interface Comment {
  id: string;
  text: string;
  userId: string;
  username: string;
  timestamp: any;
}

// Props
const props = defineProps<{
  issue: Issue;
  userId: string;
}>();

// Reactive Data
const comments = ref<Comment[]>([]);
const newComment = ref('');
const username = ref('');
const userCity = ref('');

// Fetch Comments
const fetchComments = () => {
  const commentsRef = collection(db, 'comments');
  const q = query(commentsRef, where('issueId', '==', props.issue.id));
  onSnapshot(q, (snapshot) => {
    comments.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Comment[];
  });
};

// Fetch Username and City
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


// Add Comment
const addComment = async () => {
  try {
    if (newComment.value.trim() === '') return;

    const userDoc = doc(db, 'users', props.userId);
    const userSnapshot = await getDoc(userDoc);
    const userData = userSnapshot.exists() ? userSnapshot.data() : {};
    const username = userData.name || 'Anonymous User';

    await addDoc(collection(db, 'comments'), {
      issueId: props.issue.id,
      text: newComment.value,
      userId: props.userId,
      username,
      timestamp: new Date(),
    });

    newComment.value = '';
  } catch (err) {
    console.error('Error adding comment:', err);
    alert('Failed to add comment. Please try again.');
  }
};

// Delete Comment
const deleteComment = async (commentId: string) => {
  try {
    await deleteDoc(doc(db, 'comments', commentId));
  } catch (err) {
    console.error('Error deleting comment:', err);
    alert('Failed to delete comment. Please try again.');
  }
};

// Share Issue
const shareIssue = () => {
  const shareData = {
    title: props.issue.title,
    text: props.issue.description,
    url: window.location.href,
  };

  if (navigator.share) {
    navigator.share(shareData).catch((err) => console.error(err));
  } else {
    alert('Sharing is not supported in this browser.');
  }
};

// Format Timestamp
const formatTimestamp = (timestamp: any) => {
  return new Date(timestamp.seconds * 1000).toLocaleString();
};

// Lifecycle Hook
onMounted(() => {
  fetchComments();
  fetchUserInfo(); // Fetch user info when the component is mounted
});
</script>

<style scoped>
.main-issue-image {
  width: 100%;
  max-width: 400px; /* Limit the width for larger screens */
  height: auto; /* Maintain original aspect ratio */
  border-radius: 8px;
  margin-bottom: 16px;
}

.proof-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.proof-image {
  width: 100%;
  max-width: 100px; /* Set a max width for small screens */
  height: auto; /* Maintain the aspect ratio */
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.comment {
  margin-bottom: 16px;
}

.timestamp {
  font-size: 0.9rem;
  color: gray;
}
</style>
