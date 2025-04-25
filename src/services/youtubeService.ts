import { getDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebase/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
const SCOPE = "https://www.googleapis.com/auth/youtube.upload";

export const authenticateYouTube = async (): Promise<string | null> => {
  const provider = new GoogleAuthProvider();
  provider.addScope(SCOPE);

  try {
    console.log("Inside authenticateYouTube");

    // Step 1: Sign in with Google
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;

    if (!accessToken) throw new Error("Failed to get access token.");

    // Step 2: Estimate token expiry (Google tokens usually expire in 1 hour)
    const expiresIn = 3600 * 1000; // 1 hour in milliseconds
    const expiryTimestamp = Date.now() + expiresIn; // Set future expiry time

    // Step 4: Store locally for immediate use
    localStorage.setItem("youtube_access_token", accessToken);
    localStorage.setItem("youtube_access_token_expiry", expiryTimestamp.toString());

    alert("YouTube authentication successful!");
    return accessToken;
  } catch (error) {
    console.error("YouTube Authentication Error:", error);
    return null;
  }
};


export const uploadToYouTube = async (
  youtubeTitle: string,
  youtubeDescription: string,
  file: File,
  accessToken: string | null,
  expiryTimestamp : string,
): Promise<string | null> => {
  try {
    // Get YouTube access token from Firestore
    // const userRef = doc(db, "users", userId);
    // const userDoc = await getDoc(userRef);
    // let accessToken = userDoc.data()?.youtube_access_token;


    // if (!accessToken) {
    //   accessToken = await refreshAccessToken(userId);
    //   if (!accessToken) throw new Error("No valid access token available.");
    // }

    // // Validate Token by checking expiry (if available)
    // console.log(accessToken);
    // if (!isValidToken(accessToken)) {
    //   console.warn("Access token expired, refreshing...");
    //   accessToken = await refreshAccessToken(userId);
    //   if (!accessToken) throw new Error("No valid access token available.");
    // }

    // Check if token is expired
    const currentTime = Date.now(); // Current time in milliseconds
    const expiryTime = parseInt(expiryTimestamp);

    if (!accessToken || !expiryTimestamp || currentTime >= expiryTime) {
      console.warn("Access token expired or missing. Re-authenticating...");
      accessToken = await authenticateYouTube();
      if (!accessToken) throw new Error("Failed to re-authenticate YouTube.");
    }

    // Create metadata
    const metadata = {
      snippet: {
        title: youtubeTitle,
        description: youtubeDescription,
        categoryId: "28",
      },
      status: {
        privacyStatus: "public",
      },
    };

    // Prepare FormData
    const formData = new FormData();
    formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    formData.append("file", file, file.name);

    // Upload via Cloudflare Worker
    const CLOUD_FLARE_WORKER_URL = "https://lively-brook-bf96.eventwise25.workers.dev/";

    const response = await fetch(CLOUD_FLARE_WORKER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorResponse = await response.text();
      throw new Error(`Failed to upload video: ${errorResponse}`);
    }

    const data = await response.json();
    const videoId = data.id;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    console.log("Uploaded Video to YouTube:", videoUrl);
    return videoUrl;
  } catch (error) {
    console.error("YouTube Upload Error:", error);
    return null;
  }
};

export const refreshAccessToken = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    const refreshToken = userDoc.data()?.youtube_refresh_token;

    if (!refreshToken) {
      console.error("No refresh token found.");
      return null;
    }

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: import.meta.env.VITE_YOUTUBE_CLIENT_ID,
        client_secret: import.meta.env.VITE_YOUTUBE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const data = await response.json();
    if (!data.access_token) throw new Error("Failed to refresh access token.");

    // Store new access token in Firestore
    await updateDoc(userRef, { youtube_access_token: data.access_token });

    return data.access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};

