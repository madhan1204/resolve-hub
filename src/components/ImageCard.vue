<template>
    <ion-card class="custom-card animated-card">
      <div class="image-container">
        <img
          :src="currentImage"
          alt="Image"
          @error="onImageError"
          class="fade-image"
        />
      </div>
      <ion-card-content>
        <p>{{ currentDescription }}</p>
      </ion-card-content>
      <div class="navigation-buttons">
        <ion-button
          shape="round"
          @click="prevItem"
          :disabled="isFirst"
          aria-label="Previous Image"
          class="custom-button"
        >
          <ion-icon name="chevron-back-outline"></ion-icon>
        </ion-button>
        <ion-button
          shape="round"
          @click="nextItem"
          :disabled="isLast"
          aria-label="Next Image"
          class="custom-button"
        >
          <ion-icon name="chevron-forward-outline"></ion-icon>
        </ion-button>
      </div>
    </ion-card>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, defineProps } from 'vue';
  
  interface Item {
    image: string;
    description: string;
  }
  
  // Define props using TypeScript
  const props = defineProps<{
    items: Item[];
  }>();
  
  const currentIndex = ref(0);
  const fallbackImage = ref('path/to/placeholder.png'); // Placeholder image
  
  // Computed properties for the current image and description
  const currentImage = computed(() => props.items[currentIndex.value].image || fallbackImage.value);
  const currentDescription = computed(() => props.items[currentIndex.value].description);
  
  // Computed properties for disabling buttons
  const isFirst = computed(() => currentIndex.value === 0);
  const isLast = computed(() => currentIndex.value === props.items.length - 1);
  
  // Preload the next image for smoother transitions
  const preloadNextImage = () => {
    if (!isLast.value) {
      const nextImage = new Image();
      nextImage.src = props.items[currentIndex.value + 1].image;
    }
  };
  
  // Methods for navigating the images
  const nextItem = () => {
    if (currentIndex.value < props.items.length - 1) {
      currentIndex.value++;
      preloadNextImage();
    }
  };
  
  const prevItem = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    }
  };
  
  // Handle image error and use fallback
  const onImageError = (event: Event) => {
    (event.target as HTMLImageElement).src = fallbackImage.value;
  };
  </script>
  
  <style scoped>
  .image-container {
    width: 380px; /* Set a fixed width */
    height: 320px; /* Set a fixed height */
    overflow: hidden; /* Hide overflow for images that exceed the container */
    position: relative; /* Allow absolute positioning for the img */
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Cover the entire container while preserving aspect ratio */
    transition: opacity 0.3s ease-in-out; /* Smooth image transitions */
  }
  
  .fade-image {
    opacity: 1;
    transition: opacity 0.5s ease-in-out;
  }
  
  .navigation-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
  
  ion-button[disabled] {
    opacity: 0.5; /* Dim disabled buttons for better UX */
    pointer-events: none;
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

.animated-card {
  animation: fadeIn 0.6s ease-in-out;
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
  