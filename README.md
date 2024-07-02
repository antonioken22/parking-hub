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
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
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

## References

- [Rifik](https://www.youtube.com/@GetRifik) : [AUTHENTICATION made EASY with Usernames and Passwords using NextJS 13 and Firebase](https://www.youtube.com/watch?v=ogYhXbtrCJM&t=77s)
