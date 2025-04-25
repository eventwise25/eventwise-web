import { Permission } from "../interface/Permissions";
import { getResourceById, getResourcesByIds } from "../services/resourceService";
import { fetchNearestPermissionsOfGivenDate } from "./permissionsService";
import { differenceInMilliseconds, addMinutes, format, parse, isBefore, isAfter, startOfDay, addDays } from "date-fns";

interface TimeSlot {
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
}

interface Resource {
  id: string;
  name: string;
  booked_slots: TimeSlot[];
  alternative_resources: string[];
}

export const findNearestAvailableSlot = async (
  requestedStart: string,
  requestedEnd: string,
  resourceId: string,
  requestedStartDate: string,
  requestedEndDate: string,
  college_id: string
): Promise<{ suggested_slots?: TimeSlot[]; alternative_resources?: any[]; message?: string }> => {
  const resource = await getResourceById(college_id, resourceId);
  if (!resource) return { message: "Resource not found" };

  const permissions: Permission[] = await fetchNearestPermissionsOfGivenDate(college_id, resource.id, requestedStartDate, requestedEndDate);

  // Extract approved booked slots from permissions
  const bookedSlots: TimeSlot[] = permissions
    .map(p => p.requested_slot);

    console.log(permissions);
  
  // Pre-calculate dates once
  // const startDateObj = new Date(requestedStartDate);
  // const endDateObj = new Date(requestedEndDate);
  
  // Memoize the time difference calculation
  const requestedDuration = calculateTimeDifference(requestedStart, requestedEnd);
  // const adjustedDuration = requestedDuration;

  if(requestedStartDate === requestedEndDate && requestedDuration === 0) {
    alert("Invalid requested slot!");
    return {};
  }

  // if(requestedDuration === 0){
  //   alert("Don't keep the start and end times same if dates are different!");
  //   return {message : "Start and end time is same when the dates are different"};
  // }

  // Early return for empty slots
  if (bookedSlots.length === 0) {
    return {
      suggested_slots: generateSameDurationSlots(requestedStartDate, requestedEndDate, requestedStart, requestedEnd, requestedDuration)
    };
  }

  // Process all slots in a single pass
  const availableSlots = findAvailableSlots(
    {
      start_date: requestedStartDate,
      end_date: requestedEndDate,
      start_time: requestedStart,
      end_time : requestedEnd
    },
    bookedSlots,
    // startDateObj,
    // endDateObj,
    // adjustedDuration,
    // requestedStartDate,
    // requestedEndDate,
    // requestedStart
  );

  if (availableSlots.length > 0) {
    return { suggested_slots: availableSlots };
  }

  // Only search for alternatives if not already in alternative search
  if (resource.alternative_resources?.length > 0) {
    const alternativeResources = await findAlternativeResourcesOptimized(
      resource,
      requestedStartDate,
      requestedEndDate,
      // adjustedDuration
      college_id
    );
    return alternativeResources.length > 0 
      ? { alternative_resources: alternativeResources } 
      : { message: "No slots available" };
  }

  return { message: "No slots available" };
};


// New helper function to process slots in a single pass
export const findAvailableSlots = (
  requestedSlot: TimeSlot,
  bookedSlots: TimeSlot[],
  maxSuggestions = 12
): TimeSlot[] => {
  const suggestions: TimeSlot[] = [];

  const requestedStart = parse(
    `${requestedSlot.start_date} ${requestedSlot.start_time}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );
  const requestedEnd = parse(
    `${requestedSlot.end_date} ${requestedSlot.end_time}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );
  const durationMs = differenceInMilliseconds(requestedEnd, requestedStart);

  const bookedRanges = bookedSlots.map((slot) => ({
    start: parse(`${slot.start_date} ${slot.start_time}`, "yyyy-MM-dd HH:mm", new Date()),
    end: parse(`${slot.end_date} ${slot.end_time}`, "yyyy-MM-dd HH:mm", new Date()),
  }));

  // Check if requested slot is available
  const isRequestedSlotAvailable = !bookedRanges.some(({ start, end }) => {
    return !(isBefore(requestedEnd, start) || isAfter(requestedStart, end));
  });

  if (isRequestedSlotAvailable) {
    suggestions.push({ ...requestedSlot });
  }

  const baseDay = startOfDay(requestedStart);
  let offset = 0;

  const generateSuggestionsForDay = (dayOffset: number) => {
    const baseStart = addDays(baseDay, dayOffset);

    // Start from 8:00 AM (8 * 60 = 480 mins) to 8:00 PM (20 * 60 = 1200 mins)
    for (let mins = 480; mins <= 1200; mins += 30) {
      const trialStart = addMinutes(baseStart, mins);
      const trialEnd = new Date(trialStart.getTime() + durationMs);

      // Both start and end must be between 8:00 AM and 8:00 PM
      const startHour = trialStart.getHours();
      const endHour = trialEnd.getHours();
      const endMins = trialEnd.getMinutes();

      if (
        startHour < 8 || startHour >= 20 ||
        endHour < 8 || (endHour === 20 && endMins > 0) || endHour > 20
      ) {
        continue;
      }

      if (!isAfter(trialEnd, trialStart)) continue;

      const overlaps = bookedRanges.some(({ start, end }) => {
        return !(isBefore(trialEnd, start) || isAfter(trialStart, end));
      });

      const isSameAsRequested =
        format(trialStart, "yyyy-MM-dd HH:mm") === format(requestedStart, "yyyy-MM-dd HH:mm");

      if (!overlaps && !isSameAsRequested) {
        suggestions.push({
          start_date: format(trialStart, "yyyy-MM-dd"),
          end_date: format(trialEnd, "yyyy-MM-dd"),
          start_time: format(trialStart, "HH:mm"),
          end_time: format(trialEnd, "HH:mm"),
        });
      }

      if (suggestions.length >= maxSuggestions) return;
    }
  };

  while (suggestions.length < maxSuggestions && offset <= 7) {
    if (offset === 0) {
      generateSuggestionsForDay(0);
    } else {
      generateSuggestionsForDay(offset);  // +day
      generateSuggestionsForDay(-offset); // -day
    }
    offset++;
  }

  return suggestions.slice(0, maxSuggestions);
};
// const findAvailableSlots = (
//   bookedSlots: TimeSlot[],
//   startDateObj: Date,
//   endDateObj: Date,
//   duration: number,
//   requestedStartDate: string,
//   requestedEndDate: string,
//   requestedStartTime: string
// ): TimeSlot[] => {
//   const dayStart = "08:00";
//   const dayEnd = "22:00";
//   const step = 30;
//   const maxSuggestions = 10;

//   const slots: TimeSlot[] = [];

//   const requestedDateRange: Date[] = [];
//   let date = new Date(startDateObj);
//   while (date <= endDateObj) {
//     requestedDateRange.push(new Date(date));
//     date.setDate(date.getDate() + 1);
//   }

//   for (const day of requestedDateRange) {
//     const formattedDate = day.toISOString().split("T")[0];

//     let currentTime = dayStart;

//     while (calculateTimeDifference(currentTime, dayEnd) >= duration) {
//       const endTime = addTime(currentTime, duration);

//       // Check for overlaps
//       const isOverlapping = bookedSlots.some(slot => {
//         const slotStart = new Date(`${slot.start_date}T${slot.start_time}`);
//         const slotEnd = new Date(`${slot.end_date}T${slot.end_time}`);

//         const thisSlotStart = new Date(`${formattedDate}T${currentTime}`);
//         const thisSlotEnd = new Date(`${formattedDate}T${endTime}`);

//         return thisSlotStart < slotEnd && thisSlotEnd > slotStart;
//       });

//       if (!isOverlapping) {
//         slots.push({
//           start_date: formattedDate,
//           end_date: formattedDate,
//           start_time: currentTime,
//           end_time: endTime,
//         });
//       }

//       currentTime = addTime(currentTime, step);
//     }
//   }

//   // Sort slots based on how close their start_time is to the requested time
//   slots.sort((a, b) => {
//     const timeDiffA = Math.abs(
//       calculateTimeDifference(requestedStartTime, a.start_time)
//     );
//     const timeDiffB = Math.abs(
//       calculateTimeDifference(requestedStartTime, b.start_time)
//     );
//     const dateDiffA = Math.abs(
//       new Date(a.start_date).getTime() - new Date(requestedStartDate).getTime()
//     );
//     const dateDiffB = Math.abs(
//       new Date(b.start_date).getTime() - new Date(requestedStartDate).getTime()
//     );

//     // Sort by total time difference (date + time)
//     return (dateDiffA + timeDiffA * 60 * 1000) - (dateDiffB + timeDiffB * 60 * 1000);
//   });

//   return slots.slice(0, maxSuggestions);
// };


// const findAvailableSlots = (
//   bookedSlots: TimeSlot[],
//   startDateObj: Date,
//   endDateObj: Date,
//   duration: number,
//   // requestedStartDate: string,
//   requestedEndDate: string
// ): TimeSlot[] => {
//   const availableSlots: TimeSlot[] = [];
//   let prevEndTime = "08:00";

//   // Sort slots once
//   const sortedSlots = [...bookedSlots].sort((a, b) =>
//     new Date(`${a.start_date}T${a.start_time}`).getTime() - 
//     new Date(`${b.start_date}T${b.start_time}`).getTime()
//   );

//   for (const slot of sortedSlots) {
//     if (isSlotInRange(slot, startDateObj, endDateObj)) {
//       const gapDuration = calculateTimeDifference(prevEndTime, slot.start_time);
      
//       if (gapDuration >= duration) {
//         const adjustedEndTime = addTime(prevEndTime, duration);
//         if (adjustedEndTime <= slot.start_time) {
//           availableSlots.push({
//             start_date: slot.start_date,
//             end_date: slot.end_date,
//             start_time: prevEndTime,
//             end_time: adjustedEndTime
//           });
//         }
//       }
//       prevEndTime = slot.end_time;
//     }
//   }

//   // Add final slot if time available
//   if (prevEndTime < "22:00") {
//     availableSlots.push({
//       start_date: requestedEndDate,
//       end_date: requestedEndDate,
//       start_time: prevEndTime,
//       end_time: "22:00"
//     });
//   }

//   return availableSlots;
// };

// const findAvailableSlots = (
//   bookedSlots: TimeSlot[],
//   startDateObj: Date,
//   endDateObj: Date,
//   duration: number,
//   requestedEndDate: string
// ): TimeSlot[] => {
//   const availableSlots: TimeSlot[] = [];
//   const step = 60; // Slide window every 60 minutes
//   const dayStart = "08:00";
//   const dayEnd = "22:00";

//   let currentTime = dayStart;

//   while (calculateTimeDifference(currentTime, dayEnd) >= duration) {
//     const endTime = addTime(currentTime, duration);

//     // Check overlap
//     const isOverlapping = bookedSlots.some((slot) => {
//       const slotStart = new Date(`${slot.start_date}T${slot.start_time}`);
//       const slotEnd = new Date(`${slot.end_date}T${slot.end_time}`);

//       const proposedStart = new Date(`${requestedEndDate}T${currentTime}`);
//       const proposedEnd = new Date(`${requestedEndDate}T${endTime}`);

//       return proposedStart < slotEnd && proposedEnd > slotStart;
//     });

//     if (!isOverlapping) {
//       availableSlots.push({
//         start_date: requestedEndDate,
//         end_date: requestedEndDate,
//         start_time: currentTime,
//         end_time: endTime,
//       });
//     }

//     currentTime = addTime(currentTime, step); // Slide window
//   }

//   return availableSlots;
// };


// Optimized alternative resource finder


const findAlternativeResourcesOptimized = async (
  resource: Resource,
  startDate: string,
  endDate: string,
  // duration: number
  college_id : string
): Promise<{ resource_id: string; name: string; available_slot: TimeSlot }[]> => {
  if (!resource.alternative_resources?.length) return [];

  // Fetch all alternative resources in one batch
  const alternativeResources = await getResourcesByIds(college_id, resource.alternative_resources);
  const alternatives: { resource_id: string; name: string; available_slot: TimeSlot }[] = [];

  // Process each alternative without recursive alternative search
  for (const alternative of alternativeResources) {
    if (!alternative) continue;

    const availableSlots = await findNearestAvailableSlot(
      "08:00",
      "22:00",
      alternative.id,
      startDate,
      endDate,
      // true // Skip searching for alternatives to prevent recursion
      college_id
    );

    if (availableSlots?.suggested_slots?.[0]) {
      alternatives.push({
        resource_id: alternative.id,
        name: alternative.name,
        available_slot: availableSlots.suggested_slots[0]
      });
    }
  }

  return alternatives;
};

// Helper function to check if a slot is within the requested date range
// const isSlotInRange = (
//   slot: TimeSlot,
//   startDateObj: Date,
//   endDateObj: Date
// ): boolean => {
//   const slotStartDate = new Date(slot.start_date);
//   const slotEndDate = new Date(slot.end_date);
//   return (
//     (slotStartDate >= startDateObj && slotStartDate <= endDateObj) ||
//     (slotEndDate >= startDateObj && slotEndDate <= endDateObj)
//   );
// };

const generateSameDurationSlots = (
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string,
  duration: number
): TimeSlot[] => {
  let slots: TimeSlot[] = [];
  let currentTime = "08:00";

  while (calculateTimeDifference(currentTime, "22:00") >= duration) {
    const slotEndTime = addTime(currentTime, duration);
    slots.push({ start_date: startDate, end_date: endDate, start_time: currentTime, end_time: slotEndTime });
    currentTime = slotEndTime;
  }

  slots.push({
    start_date: startDate,
    end_date: endDate,
    start_time: startTime,
    end_time: endTime,
  });

  return slots;
};

// const generateSameDurationSlots = (
//   startDate: string,
//   endDate: string,
//   startTime: string,
//   endTime: string,
//   duration: number
// ): TimeSlot[] => {
//   const slots: TimeSlot[] = [];
//   const step = 60;
//   const dayStart = "08:00";
//   const dayEnd = "22:00";

//   let currentTime = dayStart;

//   while (calculateTimeDifference(currentTime, dayEnd) >= duration) {
//     const slotEnd = addTime(currentTime, duration);
//     slots.push({
//       start_date: startDate,
//       end_date: endDate,
//       start_time: currentTime,
//       end_time: slotEnd,
//     });

//     currentTime = addTime(currentTime, step);
//   }

//   return slots;
// };


// const calculateTimeDifference = (start: string, end: string): number => {
//   const [startHour, startMinute] = start.split(":").map(Number);
//   const [endHour, endMinute] = end.split(":").map(Number);
//   return (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
// };

// const addTime = (start: string, minutesToAdd: number): string => {
//   const [hour, minute] = start.split(":").map(Number);
//   const newMinutes = hour * 60 + minute + minutesToAdd;
//   const newHour = Math.floor(newMinutes / 60);
//   const newMinute = newMinutes % 60;
//   return `${String(newHour).padStart(2, "0")}:${String(newMinute).padStart(2, "0")}`;
// };


const calculateTimeDifference = (start: string, end: string): number => {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  return (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
};

const addTime = (start: string, minutesToAdd: number): string => {
  const [hour, minute] = start.split(":").map(Number);
  const totalMinutes = hour * 60 + minute + minutesToAdd;
  const newHour = Math.floor(totalMinutes / 60);
  const newMinute = totalMinutes % 60;
  return `${String(newHour).padStart(2, "0")}:${String(newMinute).padStart(2, "0")}`;
};


// const formatDate = (date: Date): string => {
//   return date.toISOString().split("T")[0];
// };

// export const findPreviousAvailableDays = async (
//   resourceId: string,
//   startDate: string,
//   endDate: string,
//   duration: number
// ): Promise<TimeSlot[]> => {
//   let availableSlots: TimeSlot[] = [];
//   let date = new Date(startDate);

//   for (let i = 1; i <= 3; i++) { // Check up to 3 days before
//     date.setDate(date.getDate() - 1);
//     const resource = await getResourceById(resourceId);
//     if (!resource) continue;

//     const bookedSlots = resource.booked_slots.filter((slot: TimeSlot) =>
//       slot.start_date === formatDate(date) || slot.end_date === formatDate(date)
//     );

//     let prevEndTime = "08:00";
//     for (const slot of bookedSlots) {
//       const gapDuration = calculateTimeDifference(prevEndTime, slot.start_time);
//       if (gapDuration >= duration) {
//         const adjustedEndTime = addTime(prevEndTime, duration);
//         availableSlots.push({ start_date: formatDate(date), end_date: formatDate(date), start_time: prevEndTime, end_time: adjustedEndTime });
//       }
//       prevEndTime = slot.end_time;
//     }
//   }
//   return availableSlots;
// };

// export const findNextAvailableDays = async (
//   resourceId: string,
//   startDate: string,
//   endDate: string,
//   duration: number
// ): Promise<TimeSlot[]> => {
//   let availableSlots: TimeSlot[] = [];
//   let date = new Date(endDate);

//   for (let i = 1; i <= 3; i++) { // Check up to 3 days ahead
//     date.setDate(date.getDate() + 1);
//     const resource = await getResourceById(resourceId);
//     if (!resource) continue;

//     const bookedSlots = resource.booked_slots.filter((slot: TimeSlot) =>
//       slot.start_date === formatDate(date) || slot.end_date === formatDate(date)
//     );

//     let prevEndTime = "08:00";
//     for (const slot of bookedSlots) {
//       const gapDuration = calculateTimeDifference(prevEndTime, slot.start_time);
//       if (gapDuration >= duration) {
//         const adjustedEndTime = addTime(prevEndTime, duration);
//         availableSlots.push({ start_date: formatDate(date), end_date: formatDate(date), start_time: prevEndTime, end_time: adjustedEndTime });
//       }
//       prevEndTime = slot.end_time;
//     }
//   }
//   return availableSlots;
// };

// export const findAlternativeResources = async (
//   resource: Resource,
//   startDate: string,
//   endDate: string,
//   duration: number
// ): Promise<{ resource_id: string; name: string; available_slot: TimeSlot }[]> => {
//   let alternatives: { resource_id: string; name: string; available_slot: TimeSlot }[] = [];

//   // Fetch all alternative resources in a single batch
//   const alternativeResources = await getResourcesByIds(resource.alternative_resources);

//   // Process each alternative resource iteratively
//   for (const alternative of alternativeResources) {
//     if (!alternative) continue;

//     // Find available slots for the alternative resource
//     const availableSlots = await findNearestAvailableSlot("08:00", "22:00", alternative.id, startDate, endDate);

//     if (availableSlots?.suggested_slots && availableSlots.suggested_slots.length > 0) {
//       alternatives.push({
//         resource_id: alternative.id,
//         name: alternative.name,
//         available_slot: availableSlots.suggested_slots[0]
//       });
//     }
//   }
//   return alternatives;
// };