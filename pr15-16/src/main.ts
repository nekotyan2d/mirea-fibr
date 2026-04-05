import { createApp } from "vue";
import App from "./App.vue";

import { createPinia } from "pinia";

const pinia = createPinia();

createApp(App).use(pinia).mount("#app");

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch((error) => {
            console.error("Service worker registration failed", error);
        });
    });
}
