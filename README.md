# [<img src="/public/logo-dark.svg" alt="Logo Dark Mode" width="32" height="32"> Parking Hub](https://parking-hub.vercel.app)

By Team Wild Tech

## Services Used

- User Authentication: [Firebase](https://firebase.google.com/docs/auth/)
- Database Management: [Firestore](https://firebase.google.com/docs/firestore/)
- User Interface Components: [shadcn-ui](https://ui.shadcn.com/), [sonner](https://sonner.emilkowal.ski/), & [react-datetime-picker](https://www.npmjs.com/package/react-datetime-picker)
- User Interface Theme: [next-themes](https://www.npmjs.com/package/next-themes)
- Icon Pack: [lucide-react](https://www.npmjs.com/package/lucide-react)

## .env.local

```env
# LOCALHOST CONFIGS
#----------------------------------------------#
# FIREBASE APP (AUTH, DATABASE)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# FIREBASE CLOUD MESSAGING (FOR PUSH NOTIFS)
NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY=
#----------------------------------------------#

# PRODUCTION CONFIGS
#----------------------------------------------#
# FIREBASE APP (AUTH, DATABASE)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# FIREBASE CLOUD MESSAGING (FOR PUSH NOTIFS)
NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY=
#----------------------------------------------#

# FIREBASE SERVICE KEYS 
#----------------------------------------------#
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

## Admin Keyboard Controls
### Parking Slot Component

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Function</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><img src="https://cdn-icons-png.flaticon.com/128/11824/11824933.png" alt="Arrow Up" width="24"/> , <img src="https://cdn-icons-png.flaticon.com/128/9542/9542407.png" alt="W key" width="24"/></td>
      <td>Move Up</td>
    </tr>
    <tr>
      <td><img src="https://cdn-icons-png.flaticon.com/128/11824/11824822.png" alt="Arrow Left" width="24"/> , <img src="https://cdn-icons-png.flaticon.com/128/9542/9542279.png" alt="A key" width="24"/></td>
      <td>Move Left</td>
    </tr>
    <tr>
    <tr>
      <td><img src="https://cdn-icons-png.flaticon.com/128/11824/11824824.png" alt="Arrow Down" width="24"/> , <img src="https://cdn-icons-png.flaticon.com/128/9542/9542382.png" alt="S key" width="24"/></td>
      <td>Move Down</td>
    </tr>
      <td><img src="https://cdn-icons-png.flaticon.com/128/11824/11824805.png" alt="Arrow Right" width="24"/> , <img src="https://cdn-icons-png.flaticon.com/128/9542/9542297.png" alt="D key" width="24"/></td>
      <td>Move Right</td>
    </tr>
    <tr>
      <td><img src="https://cdn-icons-png.flaticon.com/128/9542/9542370.png" alt="Q key" width="24"/></td>
      <td>Rotate Counterclockwise</td>
    </tr>
    <tr>
      <td><img src="https://cdn-icons-png.flaticon.com/128/9542/9542302.png" alt="E key" width="24"/></td>
      <td>Rotate Clockwise</td>
    </tr>
    <tr>
      <td><img src="https://cdn-icons-png.flaticon.com/128/11863/11863923.png" alt="1 key" width="24"/></td>
      <td>Decrease Width</td>
    </tr>
    <tr>
      <td><img src="https://cdn-icons-png.flaticon.com/128/10231/10231834.png" alt="2 key" width="24"/></td>
      <td>Increase Width</td>
    </tr>
    <tr>
      <td><img src="https://cdn-icons-png.flaticon.com/128/9542/9542375.png" alt="R key" width="24"/></td>
      <td>Decrease Height</td>
    </tr>
    <tr>
      <td><img src="https://cdn-icons-png.flaticon.com/128/9542/9542307.png" alt="F key" width="24"/></td>
      <td>Increase Height</td>
    </tr>
  </tbody>
</table>

## References

- [Rifik](https://www.youtube.com/@GetRifik) : [AUTHENTICATION made EASY with Usernames and Passwords using NextJS 13 and Firebase](https://www.youtube.com/watch?v=ogYhXbtrCJM&t=77s)
