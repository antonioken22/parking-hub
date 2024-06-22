## Services Used

- User Authentication: [Firebase](https://firebase.google.com/docs/auth/)
- Database Management: [Firestore](https://firebase.google.com/docs/firestore/)
- User Interface Components: [shadcn-ui](https://ui.shadcn.com/)

## .env.local

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=hashafamvaskdfhasklaskfasfmghafoothills

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_ID=
GITHUB_SECRET=

GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
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

- [Rifik's Coding Tutorials Playlist](https://youtube.com/playlist?list=PLncPs6Oyr6mZ7r3qw1b4ukIgJTemJAu_X&si=v3OyYd4ly6qXcB9G): https://youtu.be/zrjybW3UKr8?si=rcHQHqJ7P5dxAMiV
