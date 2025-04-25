import { auth, db, onAuthStateChanged } from "../utils/firebase/firebase";
import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    UserCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { logoutUser, setLoading, setUser } from "../redux/auth/authSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { OrganizerData } from "../interface/Organizer";
import { AdminData } from "../interface/Admin";
import { CollegeData } from "../interface/College";

// Sign Up Organizer
export const signUpOrganizerWithEmail = async (
  organizerData: Omit<OrganizerData, "id">,
  password: string
) => {
  const organizerCredential: UserCredential = await createUserWithEmailAndPassword(
    auth,
    organizerData.email,
    password
  );

  const id = organizerCredential.user.uid;
  const organizerDoc = { ...organizerData, id };

  await setDoc(doc(db, "Organizers", id), organizerDoc);
  return organizerDoc;
};

// Sign Up Admin (inside College's subcollection)
export const signUpAdminWithEmail = async (
  adminData: Omit<AdminData & { collegeId: string }, "id">,
  password: string
) => {
  const adminCredential: UserCredential = await createUserWithEmailAndPassword(
    auth,
    adminData.email,
    password
  );

  const id = adminCredential.user.uid;
  const { collegeId, ...adminFields } = adminData;
  const adminDoc = { ...adminFields, id };

  const adminRef = doc(db, "Colleges", collegeId, "Admins", id);
  await setDoc(adminRef, adminDoc);
  return adminDoc;
};

// Sign Up College
export const signUpCollegeWithEmail = async (
  collegeData: Omit<CollegeData, "id">,
  password: string
) => {
  const collegeCredential: UserCredential = await createUserWithEmailAndPassword(
    auth,
    collegeData.email,
    password
  );

  const id = collegeCredential.user.uid;
  const collegeDoc = { ...collegeData, id };

  await setDoc(doc(db, "Colleges", id), collegeDoc);
  return collegeDoc;
};


// Login with Email & Password
export const loginWithEmail = async (email: string, password: string) => {
    console.log(email, password);
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    const id = userCredential.user.uid;
    console.log(id);
    return getUserData(id);
};

// Get User Data from Firestore
export const getUserData = async (id: string) => {
    // 1. Check if user is a College
    const collegeDoc = await getDoc(doc(db, "Colleges", id));
    if (collegeDoc.exists()) {
      const collegeData = collegeDoc.data() as CollegeData;
      const userData = { ...collegeData };
      return userData;
    }

    // 2. Check if user is an Organizer
    const organizerDoc = await getDoc(doc(db, "Organizers", id));
    if (organizerDoc.exists()) {
      const organizerData = organizerDoc.data() as OrganizerData;
      const userData = { ...organizerData };
      return userData;
    }

    // 3. Check if user is an Admin in any College
    const collegesSnapshot = await getDocs(collection(db, "Colleges"));
    for (const college of collegesSnapshot.docs) {
      const adminsRef = collection(db, `Colleges/${college.id}/Admins`);
      const adminDoc = await getDoc(doc(adminsRef, id));
      if (adminDoc.exists()) {
        const adminData = adminDoc.data() as AdminData;
        const userData = { ...adminData };
        return userData;
      }
    }
};

// Logout function
export const logout = async () => {
    await signOut(auth);
};

// Reset Password
export const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
};


export const checkUserSession = (dispatch: Dispatch) => {
  dispatch(setLoading(true));

  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      dispatch(logoutUser());
      dispatch(setLoading(false));
      return;
    }

    try {
      const id = user.uid;

      // 1. Check if user is a College
      const collegeDoc = await getDoc(doc(db, "Colleges", id));
      if (collegeDoc.exists()) {
        const collegeData = collegeDoc.data() as CollegeData;
        const userData = { ...collegeData };
        dispatch(setUser(userData));
        return;
      }

      // 2. Check if user is an Organizer
      const organizerDoc = await getDoc(doc(db, "Organizers", id));
      if (organizerDoc.exists()) {
        const organizerData = organizerDoc.data() as OrganizerData;
        const userData = { ...organizerData };
        dispatch(setUser(userData));
        return;
      }

      // 3. Check if user is an Admin in any College
      const collegesSnapshot = await getDocs(collection(db, "Colleges"));
      for (const college of collegesSnapshot.docs) {
        const adminsRef = collection(db, `Colleges/${college.id}/Admins`);
        const adminDoc = await getDoc(doc(adminsRef, id));
        if (adminDoc.exists()) {
          const adminData = adminDoc.data() as AdminData;
          const userData = { ...adminData };
          dispatch(setUser(userData));
          return;
        }
      }

      dispatch(logoutUser());
    } catch (error) {
      console.error("Session check error:", error);
      dispatch(logoutUser());
    } finally {
      dispatch(setLoading(false));
    }
  });

  return unsubscribe;
};


// Refresh Token
export const refreshToken = async () => {
    const user = auth.currentUser;
    if(user){
        const idToken = await user.getIdToken();
        localStorage.setItem('idToken', idToken);
        return idToken;
    }
    return null;
}