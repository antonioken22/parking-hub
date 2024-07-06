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
      <td><img src="https://cdn-icons-png.flaticon.com/128/9542/9542246.png" alt="Arrow Up" width="24"/> or <img src="https://cdn-icons-png.flaticon.com/128/9542/9542275.png" alt="W key" width="24"/></td>
      <td>Move Up</td>
    </tr>
    <tr>
      <td><img src="https://cdn-icons-png.flaticon.com/128/9542/9542250.png" alt="Arrow Down" width="24"/> or <img src="https://cdn-icons-png.flaticon.com/128/9542/9542269.png" alt="S key" width="24"/></td>
      <td>Move Down</td>
    </tr>
    <tr>
      <td><img src="https://cdn-icons-png.flaticon.com/128/9542/9542248.png" alt="Arrow Left" width="24"/> or <img src="https://cdn-icons-png.flaticon.com/128/9542/9542279.png" alt="A key" width="24"/></td>
      <td>Move Left</td>
    </tr>
    <tr>
      <td><img src="https://cdn-icons-png.flaticon.com/128/9542/9542252.png" alt="Arrow Right" width="24"/> or <img src="https://cdn-icons-png.flaticon.com/128/9542/9542272.png" alt="D key" width="24"/></td>
      <td>Move Right</td>
    </tr>
    <tr>
      <td><img src="https://cdn-icons-png.flaticon.com/128/9542/9542267.png" alt="Q key" width="24"/></td>
      <td>Rotate Counterclockwise</td>
    </tr>
    <tr>
      <td><img src="https://cdn-icons-png.flaticon.com/128/9542/9542261.png" alt="E key" width="24"/></td>
      <td>Rotate Clockwise</td>
    </tr>
    <tr>
      <td><img src="https://cdn-icons-png.flaticon.com/128/9542/9542257.png" alt="1 key" width="24"/></td>
      <td>Decrease Width</td>
    </tr>
    <tr>
      <td><img src="https://cdn-icons-png.flaticon.com/128/9542/9542258.png" alt="2 key" width="24"/></td>
      <td>Increase Width</td>
    </tr>
    <tr>
      <td><img src="https://cdn-icons-png.flaticon.com/128/9542/9542276.png" alt="R key" width="24"/></td>
      <td>Decrease Height</td>
    </tr>
    <tr>
      <td><img src="https://cdn-icons-png.flaticon.com/128/9542/9542259.png" alt="F key" width="24"/></td>
      <td>Increase Height</td>
    </tr>
  </tbody>
</table>

## References

- [Rifik](https://www.youtube.com/@GetRifik) : [AUTHENTICATION made EASY with Usernames and Passwords using NextJS 13 and Firebase](https://www.youtube.com/watch?v=ogYhXbtrCJM&t=77s)
