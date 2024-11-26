import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { IonicVue } from '@ionic/vue';
import { 
  IonButton, IonIcon, IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, 
  IonCardSubtitle, IonCardContent, IonTabBar, IonTabButton, IonTabs, IonLabel, 
  IonTitle, IonToolbar, IonFab, IonHeader, IonFabButton, IonItem, IonInput, IonSelect, IonSelectOption,
  IonSearchbar, IonInfiniteScrollContent, IonInfiniteScroll, IonModal,
  IonRouterOutlet, alertController ,IonSpinner, IonImg ,IonButtons
} from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Dark mode (optional) */
import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

/* Registering Ionicons */
import { addIcons } from 'ionicons';
import { 
  personAddOutline, logInOutline, informationCircleOutline,
  chevronForwardOutline, chevronBackOutline, chevronDownOutline,  chatbubbleOutline, shareOutline, 
  locationOutline, pencilOutline, createOutline, add,
  home as homeIcon, people as peopleIcon, person as personIcon
} from 'ionicons/icons';

addIcons({
  'person-add-outline': personAddOutline,
  'log-in-outline': logInOutline,
  'information-circle-outline': informationCircleOutline,
  'chevron-forward-outline': chevronForwardOutline,
  'chevron-back-outline': chevronBackOutline,
  'chevron-down-outline': chevronDownOutline,
  'chatbubble-outline': chatbubbleOutline,
  'share-outline': shareOutline,
  'location-outline': locationOutline,
  'pencil-outline' : pencilOutline,
  'create-outline' : createOutline,
  'home': homeIcon,
  'people': peopleIcon,
  'person': personIcon,
  'add': add
});

const app = createApp(App)
  .use(IonicVue)
  .use(router);

// Globally register components
app.component('IonButtons', IonButtons);
app.component('IonImg', IonImg);
app.component('IonSpinner', IonSpinner);
app.component('IonModal', IonModal);
app.component('IonSearchbar', IonSearchbar);
app.component('IonInfiniteScrollContent', IonInfiniteScrollContent);
app.component('IonInfiniteScroll', IonInfiniteScroll);
app.component('IonItem', IonItem);
app.component('IonSelect', IonSelect);
app.component('IonSelectOption', IonSelectOption);
app.component('IonInput', IonInput);
app.component('IonTitle', IonTitle);
app.component('IonToolbar', IonToolbar);
app.component('IonFab', IonFab);
app.component('IonHeader', IonHeader);
app.component('IonFabButton', IonFabButton);
app.component('IonButton', IonButton);
app.component('IonIcon', IonIcon);
app.component('IonPage', IonPage);
app.component('IonContent', IonContent);
app.component('IonCard', IonCard);
app.component('IonCardHeader', IonCardHeader);
app.component('IonCardTitle', IonCardTitle);
app.component('IonCardSubtitle', IonCardSubtitle);
app.component('IonCardContent', IonCardContent);
app.component('IonTabBar', IonTabBar);
app.component('IonTabButton', IonTabButton);
app.component('IonTabs', IonTabs);
app.component('IonLabel', IonLabel);
app.component('IonRouterOutlet', IonRouterOutlet);
app.config.globalProperties.$alertController = alertController;

router.isReady().then(() => {
  app.mount('#app');
});
