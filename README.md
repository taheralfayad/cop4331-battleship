# cop4331-battleship

## How to Run:

1. Go to both the backend and frontend directories and run `npm install` to install the necessary packages for both.

2. Copy the `backend/.env.template` file as `backend/.env` and fill in your MongoDB connection string for database connection.

3. `cd` into the backend directory and run `node server.js` to run the backend and `cd` into the frontend directory and run `npx expo start` to run the native application.

4. Within the terminal session with expo running, you can press `w` to view in web version or scane the QR code to run the application on mobile through the ExpoGo app. To run on mobile you must mirror localhost:3000 over ngrok to connect your device to the backend (instructions below).

### Running over ngrok

1. If you don't already have ngrok installed, you can find the instructions [here](https://ngrok.com/download)

2. In a new terminal session run `ngrok http 3000` to mirror localhost:3000. Copy your custom ngrok link.

3. Replace the BASEURL in `frontend/config.js` with your ngrok link.

4. When you start the frontend, run expo with the --tunnel flag `npx expo start --tunnel`.