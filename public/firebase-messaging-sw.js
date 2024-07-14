importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

/* The supplied keys are the ones needed in order for the Firebase
Cloud Messaging to work with your web app, I still have no idea on
how I can store it privately. Nevertheless, it's not a security risk
here since Firebase needs to identify your app with the following
keys to grant your web app the service for push notifications.
Read more: https://stackoverflow.com/questions/37482366/is-it-safe-to-expose-firebase-apikey-to-the-public */
// Replace these with your own Firebase config keys...
const firebaseConfig = {
  apiKey: "AIzaSyDK__8f9aOe2IQY3fZvZQp1uE2tkatBQtA",
  authDomain: null,
  projectId: "parking-hub-79189",
  storageBucket: null,
  messagingSenderId: "954964268771",
  appId: "1:954964268771:web:f0f9b7ce897b029f2897d6",
  measurementId: null,
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

/* For debugging purposes
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // payload.fcmOptions?.link comes from our backend API route handle
  // payload.data.link comes from the Firebase Console where link is the 'key'
    const link = payload.fcmOptions?.link || payload.data?.link;
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: "./logo-dark.png",
      data: { url: link },
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});
*/

/* Event listener for the supported* browser's push notification that gets triggered to show on client side. If the browser is
in the background running, clicking the notification will redirect
that user to the link provided by the web app. And if the browser
is running on the foreground (in the web app), clicking the
notification will just focus on that tab and disregard link
redirection. */
self.addEventListener("notificationclick", function (event) {
  // console.log("[firebase-messaging-sw.js] Notification click received.");

  event.notification.close();

  // This checks if the client is already open and if it is, it focuses on the tab. If it is not open, it opens a new tab with the URL passed in the notification payload
  event.waitUntil(
    clients
      // https://developer.mozilla.org/en-US/docs/Web/API/Clients/matchAll
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        const url = event.notification.data.url;

        if (!url) return;

        // If relative URL is passed in firebase console or API route handler, it may open a new window as the client.url is the full URL i.e. https://example.com/ and the url is /about whereas if we passed in the full URL, it will focus on the existing tab i.e. https://example.com/about
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          // console.log("OPENWINDOW ON CLIENT");
          return clients.openWindow(url);
        }
      })
  );
});
