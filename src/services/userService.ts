import { updateDoc, arrayUnion, query, where, getDocs, collection } from "firebase/firestore";
import { db } from "../utils/firebase/firebase";
import { UserData } from "../interface/User";
// import { Participation } from "../interface/Participation";

export const addUserParticipation = async (
  user_id: string,
  participation: {
    event_id: string;
    certificate: string;
    is_winner: boolean;
    position?: number;
  }
) => {
  try {
    const usersRef = collection(db, "Users");
    const q = query(usersRef, where("user_id", "==", user_id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("User not found with user_id:", user_id);
      return;
    }

    // Assuming user_id is unique, so we update the first matched doc
    const userDoc = querySnapshot.docs[0].ref;

    await updateDoc(userDoc, {
      participation: arrayUnion(participation),
    });

    console.log("Participation added successfully!");
  } catch (error) {
    console.error("Error adding participation:", error);
  }
};

export const updateUserCertificate = async (
  user_id: string,
  event_id: string,
  certificateUrl: string
) => {
  const usersRef = collection(db, "Users");
  const q = query(usersRef, where("user_id", "==", user_id));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("User not found");
  }

  const userDocSnap = querySnapshot.docs[0];
  const userRef = userDocSnap.ref;
  const userData = userDocSnap.data() as UserData;

  const updatedParticipations = userData.participations.map((participation) =>
    participation.event_id === event_id
      ? { ...participation, certificate: certificateUrl }
      : participation
  );

  await updateDoc(userRef, { participations: updatedParticipations });
};

// export const updateUserCertificate = async (
//   user_id: string,
//   event_id: string,
//   certificateUrl: string
// ) => {
//   const usersRef = collection(db, "Users");
//   const q = query(usersRef, where("user_id", "==", user_id));
//   const querySnapshot = await getDocs(q);

//   if (querySnapshot.empty) {
//     throw new Error("User not found");
//   }

//   const userDocSnap = querySnapshot.docs[0];
//   const userRef = userDocSnap.ref;
//   const userData = userDocSnap.data() as UserData;

//   const participations: Participation[] = userData.participations || [];

//   let updated = false;

//   const updatedParticipations = participations.map((p) => {
//     if (p.event_id === event_id) {
//       updated = true;
//       return {
//         ...p,
//         certificate: certificateUrl
//       };
//     }
//     return p;
//   });

//   if (!updated) {
//     updatedParticipations.push({
//       event_id,
//       certificate: certificateUrl,
//     });
//   }

//   await updateDoc(userRef, {
//     participations: updatedParticipations,
//   });
// };