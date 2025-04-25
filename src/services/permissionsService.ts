import { EventFormData } from "../interface/Events";
import { Permission } from "../interface/Permissions";
import { Resource } from "../interface/Resources";
import { db } from "../utils/firebase/firebase";
import { collection, getDocs, query, where, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { updateEvent } from "./eventService";

// Fetch all permissions
export const fetchPermissions = async (college_id : string) => {
  const querySnapshot = await getDocs(collection(db, "Colleges", college_id, "Permissions"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const fetchPermissionsByAdmin = async (college_id : string, admin_id: string) => {
  try {
    // Step 1: Fetch and type permissions
    const permissionsSnapshot = await getDocs(collection(db, "Colleges", college_id, "Permissions"));
    const permissions: Permission[] = permissionsSnapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Permission, 'id'>),
      })
    );

    // console.log(permissions);

    // Step 2: Filter by admin_id
    const filtered = permissions.filter((perm) => perm.admin_id === admin_id);

    // Step 3: Populate resource and event for each permission
    const populatedPermissions: (Permission & {
      resource?: Resource;
      event?: EventFormData;
    })[] = [];

    console.log(filtered);

    for (const permission of filtered) {
      // Fetch resource
      let resource: Resource | undefined = undefined;
      if (permission.resource_id) {
        const resourceRef = doc(db, "Colleges", college_id, "Resources", permission.resource_id);
        const resourceSnap = await getDoc(resourceRef);
        if (resourceSnap.exists()) {
          resource = { id: resourceSnap.id, ...resourceSnap.data() } as Resource;
        }
      }

      // Fetch event
      let event: EventFormData | undefined = undefined;
      if (permission.event_id) {
        const eventRef = doc(db, "Organizers", permission.organizer_id, "Events", permission.event_id);
        const eventSnap = await getDoc(eventRef);
        if (eventSnap.exists()) {
          event = { id: eventSnap.id, ...eventSnap.data() } as EventFormData;
        }
      }


      populatedPermissions.push({ ...permission, resource, event });
    }

    return populatedPermissions;
  } catch (error) {
    console.error("Error fetching permissions by admin:", error);
    return [];
  }
};


// Fetch permissions by Organizer ID and Resource ID
export const fetchPermissionByOrganizerAndResource = async (
  college_id: string,
  organizer_id: string,
  resource_id: string
) => {
  const permissionsRef = collection(db, "Colleges", college_id, "Permissions");
  const q = query(
    permissionsRef,
    where("organizer_id", "==", organizer_id),
    where("resource", "==", resource_id)
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) return null;

  const docSnapshot = querySnapshot.docs[0];
  return { id: docSnapshot.id, ...docSnapshot.data() } as Permission;
};

export const checkPermission = async (
  college_id : string,
  event_id: string,
  organizer_id: string,
  timeSlot: { start_date: string, end_date: string, start_time: string, end_time: string }
): Promise<Permission | null> => {

  console.log(college_id);
  console.log(event_id);
  console.log(organizer_id);
  console.log(timeSlot)
  
  const q = query(
    collection(db, "Colleges", college_id, "Permissions"),
    where("event_id", "==", event_id),
    where("organizer_id", "==", organizer_id),
    where("requested_slot.start_date", "==", timeSlot.start_date),
    where("requested_slot.end_date", "==", timeSlot.end_date),
    where("requested_slot.start_time", "==", timeSlot.start_time),
    where("requested_slot.end_time", "==", timeSlot.end_time),
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const permission = snapshot.docs[0].data() as Permission;

  console.log(permission);

  return permission;
};

// Fetch a permission by its document ID
export const fetchPermissionById = async (college_id : string, permission_id: string) => {
  const permissionRef = doc(db, "Colleges", college_id, "Permissions", permission_id);
  const docSnap = await getDoc(permissionRef);

  if (!docSnap.exists()) return null;

  return { id: docSnap.id, ...docSnap.data() } as Permission;
};

// Update permission status
export const updatePermissionStatus = async (college_id : string,  permission_id: string, status: string) => {
  const permissionRef = doc(db, "Colleges", college_id, "Permissions", permission_id);
  await updateDoc(permissionRef, { status });

  // Fetch the updated document to return a complete Permission object
  const updatedDoc = await getDoc(permissionRef);
  return { ...updatedDoc.data() } as Permission;
};

// Fetch permissions by status (Approved)
export const fetchApprovedPermissions = async (college_id: string, organizer_id : string) => {
  const q = query(
    collection(db, "Colleges", college_id, "Permissions"),
    where("status", "==", "approved"),
    where("organizer_id", "==", organizer_id));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Permission[];
};

// Fetch permissions by status (Pending Admin Approval)
export const fetchPendingPermissions = async (college_id: string, organizer_id: string) => {
  const q = query(collection(db, "Colleges", college_id, "Permissions"),
    where("status", "==", "pending_admin_approval"),
    where("organizer_id", "==", organizer_id)
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Permission[];
};


// request permission from organizer for resouce
export const requestResourcePermission = async (
  college_id: string,
  organizer_id: string,
  event_id: string,
  permissionsData: any
) => {
  try {
    const permissionsRef = collection(db, "Colleges", college_id, "Permissions");

    // Step 1: Check for conflicting approved requests
    const q = query(
      permissionsRef,
      where("resource_id", "==", permissionsData.resource_id),
      where("status", "in", ["approved"])
    );

    const querySnapshot = await getDocs(q);
    const conflicts = querySnapshot.docs.some((doc) => {
      const existing = doc.data() as Permission;

      const existingStart = new Date(
        `${existing.requested_slot.start_date} ${existing.requested_slot.start_time}`
      );
      const existingEnd = new Date(
        `${existing.requested_slot.end_date} ${existing.requested_slot.end_time}`
      );
      const newStart = new Date(
        `${permissionsData.requested_slot.start_date} ${permissionsData.requested_slot.start_time}`
      );
      const newEnd = new Date(
        `${permissionsData.requested_slot.end_date} ${permissionsData.requested_slot.end_time}`
      );

      return newStart < existingEnd && newEnd > existingStart;
    });

    if (conflicts) {
      return {
        success: false,
        message: "Resource is already booked for the requested time slot.",
      };
    }

    // Step 2: Add permission request
    const newPermissionRef = doc(permissionsRef);
    await setDoc(newPermissionRef, {
      ...permissionsData,
      status: "pending_admin_approval",
      id: newPermissionRef.id,
    });

    // Step 3: Update event slot timings
    const slot = permissionsData.requested_slot;
    const updateEventRes = await updateEvent(organizer_id, event_id, {
      start_date: slot.start_date,
      end_date: slot.end_date,
      start_time: slot.start_time,
      end_time: slot.end_time,
    });

    if (!updateEventRes.success) {
      return {
        success: false,
        message: "Permission created but failed to update event.",
        permissionId: newPermissionRef.id,
        eventError: updateEventRes.error,
      };
    }

    return {
      success: true,
      permissionId: newPermissionRef.id,
    };
  } catch (error) {
    console.error("Error in permission + event update:", error);
    return {
      success: false,
      error,
    };
  }
};

export const fetchNearestPermissionsOfGivenDate = async (
  collegeId: string,
  resourceId: string,
  requestedStartDate: string, // "YYYY-MM-DD"
  requestedEndDate: string    // "YYYY-MM-DD"
) => {
  const permissionsRef = collection(db, "Colleges", collegeId, "Permissions");

  const q = query(
    permissionsRef,
    where("resource_id", "==", resourceId),
    where("status", "==", "approved")
  );

  const querySnapshot = await getDocs(q);

  const requestedStart = new Date(requestedStartDate);
  const requestedEnd = new Date(requestedEndDate);

  const filteredPermissions = querySnapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }) as Permission)
    .filter((permission) => {
      const permStart = new Date(permission.requested_slot.start_date);
      const permEnd = new Date(permission.requested_slot.end_date);

      // Check for date overlap
      return permStart <= requestedEnd && permEnd >= requestedStart;
    });

  return filteredPermissions as Permission[];
};



// // Fetch all permissions
// export const fetchPermissions = async (organizer_id : string, event_id : string) => {
//   const querySnapshot = await getDocs(collection(db, "Organizers", organizer_id, "Events", event_id));
//   return querySnapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
// };

// export const fetchPermissionsByAdmin = async (organizer_id : string, event_id : string, college_id: string, admin_id: string) => {
//   try {
//     // Step 1: Fetch and type permissions
//     const permissionsSnapshot = await getDocs(collection(db, "Organizers", organizer_id, "Events", event_id, "Permissions"));
//     const permissions: Permission[] = permissionsSnapshot.docs.map(
//       (doc) => ({
//         id: doc.id,
//         ...(doc.data() as Omit<Permission, 'id'>),
//       })
//     );

//     console.log(permissions);

//     // Step 2: Filter by admin_id
//     const filtered = permissions.filter((perm) => perm.admin_id === admin_id);

//     // Step 3: Populate resource and event for each permission
//     const populatedPermissions: (Permission & {
//       resource?: Resource;
//       event?: EventFormData;
//     })[] = [];

//     console.log(filtered);

//     for (const permission of filtered) {
//       // Fetch resource
//       let resource: Resource | undefined = undefined;
//       if (permission.resource_id) {
//         const resourceRef = doc(db, "Colleges", college_id, "Resources", permission.resource_id);
//         const resourceSnap = await getDoc(resourceRef);
//         if (resourceSnap.exists()) {
//           resource = { id: resourceSnap.id, ...resourceSnap.data() } as Resource;
//         }
//       }

//       // Fetch event
//       let event: EventFormData | undefined = undefined;
//       if (permission.event_id) {
//         const eventRef = doc(db, "Organizers", organizer_id, "Events", permission.event_id);
//         const eventSnap = await getDoc(eventRef);
//         if (eventSnap.exists()) {
//           event = { id: eventSnap.id, ...eventSnap.data() } as EventFormData;
//         }
//       }


//       populatedPermissions.push({ ...permission, resource, event });
//     }

//     return populatedPermissions;
//   } catch (error) {
//     console.error("Error fetching permissions by admin:", error);
//     return [];
//   }
// };


// // Fetch permissions by Organizer ID and Resource ID
// export const fetchPermissionByOrganizerAndResource = async (
//   organizer_id: string,
//   event_id: string,
//   resource_id: string
// ) => {
//   const permissionsRef = collection(db, "Organizers", organizer_id, "Events", event_id, "Permissions");
//   const q = query(
//     permissionsRef,
//     where("organizer_id", "==", organizer_id),
//     where("resource", "==", resource_id)
//   );
//   const querySnapshot = await getDocs(q);

//   if (querySnapshot.empty) return null;

//   const docSnapshot = querySnapshot.docs[0];
//   return { id: docSnapshot.id, ...docSnapshot.data() } as Permission;
// };

// export const checkPermission = async (
//   event_id: string,
//   organizer_id: string,
//   timeSlot: { start_date: string, end_date: string, start_time: string, end_time: string }
// ): Promise<Permission | null> => {

//   console.log(event_id);
//   console.log(organizer_id);
//   console.log(timeSlot);

//   collection(db, "Organizers", organizer_id, "Events", event_id, "Permissions")

//   const q = query(
//     collection(db, "Organizers", organizer_id, "Events", event_id, "Permissions"),
//     where("event_id", "==", event_id),
//     where("organizer_id", "==", organizer_id),
//     where("requested_slot.start_date", "==", timeSlot.start_date),
//     where("requested_slot.end_date", "==", timeSlot.end_date),
//     where("requested_slot.start_time", "==", timeSlot.start_time),
//     where("requested_slot.end_time", "==", timeSlot.end_time),
//   );

//   const snapshot = await getDocs(q);
//   if (snapshot.empty) return null;

//   const permission = snapshot.docs[0].data() as Permission;

//   console.log(permission);

//   return permission;
// };

// // Fetch a permission by its document ID
// export const fetchPermissionById = async (organizer_id : string, event_id : string, permission_id: string) => {
//   const permissionRef = doc(db, "Organizers", organizer_id, "Events", event_id, "Permissions", permission_id);
//   const docSnap = await getDoc(permissionRef);

//   if (!docSnap.exists()) return null;

//   return { id: docSnap.id, ...docSnap.data() } as Permission;
// };

// // Update permission status
// export const updatePermissionStatus = async (organizer_id : string, event_id : string, permission_id: string, status: string) => {
//   const permissionRef = doc(db, "Organizers", organizer_id, "Events", event_id, "Permissions", permission_id);
//   await updateDoc(permissionRef, { status });

//   // Fetch the updated document to return a complete Permission object
//   const updatedDoc = await getDoc(permissionRef);
//   return { ...updatedDoc.data() } as Permission;
// };

// // Fetch permissions by status (Approved)
// export const fetchApprovedPermissions = async (organizer_id: string, event_id : string) => {
//   const q = query(
//     collection(db, "Organizers", organizer_id, "Events", event_id, "Permissions"),
//     where("status", "==", "approved"),
//     where("organizer_id", "==", organizer_id));
//   const querySnapshot = await getDocs(q);

//   return querySnapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   })) as Permission[];
// };

// // Fetch permissions by status (Pending Admin Approval)
// export const fetchPendingPermissions = async (organizer_id: string, event_id: string) => {
//   const q = query(collection(db, "Organizers", organizer_id, "Events", event_id, "Permissions"),
//     where("status", "==", "pending_admin_approval"),
//     where("organizer_id", "==", organizer_id)
//   );
//   const querySnapshot = await getDocs(q);

//   return querySnapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   })) as Permission[];
// };


// // request permission from organizer for resouce
// export const requestResourcePermission = async (organizer_id: string, event_id: string, permissionsData: any) => {
//   try {
//     const permissionsRef = collection(db, "Organizers", organizer_id, "Events", event_id, "Permissions");

//     // Step 1: Check for conflicting requests (overlapping time slots)
//     const q = query(
//       permissionsRef,
//       where("resource_id", "==", permissionsData.resource_id),
//       where("status", "in", ["approved"]) // Avoid conflicts with rejected requests
//     );

//     const querySnapshot = await getDocs(q);
//     const conflicts = querySnapshot.docs.some((doc) => {
//       const existing = doc.data() as Permission;

//       // Convert Firestore timestamps to JS Date objects
//       const existingStart = new Date(existing.requested_slot.start_date + " " + existing.requested_slot.start_time);
//       const existingEnd = new Date(existing.requested_slot.end_date + " " + existing.requested_slot.end_time);
//       const newStart = new Date(permissionsData.requested_slot.start_date + " " + permissionsData.requested_slot.start_time);
//       const newEnd = new Date(permissionsData.requested_slot.end_date + " " + permissionsData.requested_slot.end_time);

//       // Check for overlap
//       return newStart < existingEnd && newEnd > existingStart;
//     });

//     if (conflicts) {
//       return {
//         success: false,
//         message: "Resource is already booked for the requested time slot.",
//       };
//     }

//     // Step 2: Add permission request to Firestore
//     const newPermissionRef = doc(permissionsRef);

//     await setDoc(newPermissionRef, {
//       ...permissionsData,
//       status: "pending_admin_approval",
//       created_at: Timestamp.now(),
//       id: newPermissionRef.id
//     })

//     return {
//       success: true,
//       id: newPermissionRef.id,
//     };
//   } catch (error) {
//     console.error("Error in creating request for permissions:", error);
//     return {
//       success: false,
//       error,
//     };
//   }
// };