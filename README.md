# [<img src="/public/logo-dark.svg" alt="Logo Dark Mode" width="32" height="32"> Parking Hub](https://parking-hub.vercel.app)

By Team Wild Tech

## Services Used

### Backend

- User Authentication: [Firebase Authentication](https://firebase.google.com/docs/auth/)
- Database Management: [Firebase Firestore](https://firebase.google.com/docs/firestore/)
- Media Storage: [Firebase Storage](https://firebase.google.com/docs/storage/)
- Push Notification Service: [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/)

### Frontend

- User Interface Theme: [next-themes](https://www.npmjs.com/package/next-themes)
- User Interface Components: [shadcn-ui](https://ui.shadcn.com/), [sonner](https://sonner.emilkowal.ski/), & [react-datetime-picker](https://www.npmjs.com/package/react-datetime-picker)
- Icon Pack: [lucide-react](https://www.npmjs.com/package/lucide-react)
- Data Visualization: [chart.js](https://www.chartjs.org/)
- Animations: [framer-motion](https://www.framer.com/motion/)

## .env.local

```env
# LOCALHOST CONFIGS
#----------------------------------------------#
# FIREBASE APP (AUTH, DATABASE)
# Can be obtained at:
# 1. https://console.firebase.google.com
# 2. Click into your project or create new if you don't have one yet. Note: This configuration has Google Analytics turned on.
# 3. Project Overview > Project Settings > General
# 4. Your apps > SDK setup and configuration

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# FIREBASE CLOUD MESSAGING (FOR PUSH NOTIFS)
# Can be obtained at:
# Steps 1-2 above.
# 3. Project Overview > Project Settings > Cloud Messaging
# 4. Web configuration > Generate a key pair
# Note: Don't forget to edit the `@/public/firebase-messaging-sw.js` file with your actual setup and config keys from above.

NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY=
#----------------------------------------------#

# FIREBASE SERVICE KEYS
#----------------------------------------------#
# Can be obtained at:
# Steps 1-2 above.
# 3. Project Overview > Project Settings > Service Accounts
# 4. Generate new private key (It shall let you download a .json file) > Extract the contents with their respective fields below

FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
FIREBASE_AUTH_URI=
FIREBASE_TOKEN_URI=
FIREBASE_AUTH_PROVIDER_CERT_URL=
FIREBASE_CLIENT_CERT_URL=
FIREBASE_UNIVERSE_DOMAIN=
#----------------------------------------------#
```

## Running Locally

1. Clone this repository into your machine.

2. Run this code in your terminal to install all dependencies used in this project.

```shell
npm install
```

3. Fill in all the necessary variables in the `.env.local` outlined above. You can obtain these keys by watching the video from the playlist linked in the References below.

4. Build and run your web app at `http://localhost:3000` by running the code below in the terminal.

```shell
npm run dev
```

> ## Admin Only
>
> ### Keyboard Keys for Editing a Parking Slot Component
>
> <table>
>   <thead>
>     <tr>
>       <th>Key</th>
>       <th>Function</th>
>     </tr>
>   </thead>
>   <tbody>
>     <tr>
>       <td><img src="https://cdn-icons-png.flaticon.com/128/12221/12221835.png" alt="Arrow Up" width="32"/> , <img src="https://cdn-icons-png.flaticon.com/128/12222/12222203.png" alt="W key" width="32"/></td>
>     <td>Move Up</td>
>    </tr>
>    <tr>
>      <td><img src="https://cdn-icons-png.flaticon.com/128/12221/12221842.png" alt="Arrow Left" width="32"/> , <img src="https://cdn-icons-png.flaticon.com/128/12222/12222021.png" alt="A key" width="32"/></td>
>      <td>Move Left</td>
>    </tr>
>    <tr>
>      <td><img src="https://cdn-icons-png.flaticon.com/128/12221/12221829.png" alt="Arrow Down" width="32"/> , <img src="https://cdn-icons-png.flaticon.com/128/12222/12222164.png" alt="S key" width="32"/></td>
>      <td>Move Down</td>
>    </tr>
>    <tr>
>      <td><img src="https://cdn-icons-png.flaticon.com/128/12221/12221854.png" alt="Arrow Right" width="32"/> , <img src="https://cdn-icons-png.flaticon.com/128/12222/12222045.png" alt="D key" width="32"/></td>
>      <td>Move Right</td>
>    </tr>
>    <tr>
>      <td><img src="https://cdn-icons-png.flaticon.com/128/12222/12222147.png" alt="Q key" width="32"/></td>
>      <td>Rotate Counterclockwise</td>
>    </tr>
>    <tr>
>      <td><img src="https://cdn-icons-png.flaticon.com/128/12222/12222054.png" alt="E key" width="32"/></td>
>      <td>Rotate Clockwise</td>
>    </tr>
>    <tr>
>      <td><img src="https://cdn-icons-png.flaticon.com/128/12222/12222227.png" alt="Z key" width="32"/></td>
>      <td>Increase Width</td>
>    </tr>
>    <tr>
>      <td><img src="https://cdn-icons-png.flaticon.com/128/12222/12222211.png" alt="X key" width="32"/></td>
>      <td>Decrease Width</td>
>    </tr>
>    <tr>
>      <td><img src="https://cdn-icons-png.flaticon.com/128/12222/12222155.png" alt="R key" width="32"/></td>
>      <td>Increase Height</td>
>    </tr>
>    <tr>
>      <td><img src="https://cdn-icons-png.flaticon.com/128/12222/12222061.png" alt="F key" width="32"/></td>
>      <td>Decrease Height</td>
>    </tr>
>  </tbody>
> </table>

## References

- [Rifik](https://www.youtube.com/@GetRifik) : [AUTHENTICATION made EASY with Usernames and Passwords using NextJS 13 and Firebase](https://www.youtube.com/watch?v=ogYhXbtrCJM&t=77s)
