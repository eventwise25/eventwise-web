import React, { useEffect, useState } from "react";
import { createEvent } from "../../../services/eventService";
import { useDispatch, useSelector } from "react-redux";
import {
  authenticateYouTube,
  // authenticateYouTube,
  uploadToYouTube,
} from "../../../services/youtubeService";
import { checkUserSession } from "../../../services/authService";
import { RootState } from "../../../redux/store";
// import { checkPermissionStatus } from "../../../services/permissionsService";
// import { getAllResources } from "../../../services/resourceService";
import { EventFormData } from "../../../interface/Events";
// import { Resource } from '../../../interface/Resources';
// import { getDepartments } from "../../../services/collegeService";
import { addEventDraft } from "../../../redux/slices/eventSlice";

const EventForm = () => {
  const [formData, setFormData] = useState<EventFormData>({
    id: "",
    name: "",
    description: "",
    type: "Hackathon",
    mode: "Offline",
    department: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    registration_deadline: "",
    max_participants: 1,
    is_team_event: false,
    min_team_size: 1,
    max_team_size: 1,
    status: "draft",
    venue: "",
    event_categories: [],
    images: [],
    videos: [],
    prizes: {} as Record<string, number>,
    goodies: [] as string[],
    created_at: "",
  });

  const accessToken = localStorage.getItem("youtube_access_token");
  const expiryTimeStamp = localStorage.getItem("youtube_access_token_expiry");

  const [isYouTubeAuth, setIsYouTubeAuth] = useState(false);

  const dispatch = useDispatch();

  // set image previews
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isImageUploading, setIsImageUploading] = useState(false);

  // set youtube title and description
  const [youtubeTitle, setYoutubeTitle] = useState<string>();
  const [youtubeDescription, setYoutubeDescription] = useState<string>();

  // setting video file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // const [permissionStatus, setPermissionStatus] = useState<
  //   "approved" | "pending_admin_approval" | "rejected" | "none"
  // >("none");

  // const [departments, setDepartments] = useState<string[]>([]);

  const { user, isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  const eventCategories = [
    // ✅ Technical (16)
    "Hackathon",
    "Bootcamp",
    "Coding",
    "Robotics",
    "Tech Talk",
    "Workshop",
    "Quiz",
    "Startup Pitch",
    "Case Study",
    "Design Challenge",
    "AI Challenge",
    "Cybersecurity CTF",
    "Web Development",
    "App Development",
    "UI/UX Challenge",
    "Data Science Expo",
  
    // 🎭 Cultural (6)
    "Dance",
    "Singing",
    "Drama",
    "Open Mic",
    "Photography",
    "Art & Craft",
  
    // 🎮 Non-Technical / Gaming (4)
    "Treasure Hunt",
    "Esports",
    "LAN Gaming",
    "Board Games",
  
    // 🏅 Sports (4)
    "Athletics",
    "Cricket",
    "Football",
    "Basketball"
  ];
  
  

  // // storing the resources
  // const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    checkUserSession(dispatch);
    if (accessToken) {
      setIsYouTubeAuth(true);
    }
  }, [dispatch]);

  // useEffect(() => {
  //   // Fetch all resources on component mount
  //   if (user) {
  //     const fetchDepartmentsAndResources = async () => {
  //       let collegeId: string;

  //       if ("college_id" in user) {
  //         // user is Admin or Organizer
  //         collegeId = user.college_id;
  //       } else {
  //         // user is College itself
  //         collegeId = user.id;
  //       }

  //       // const res = await getAllResources(collegeId);
  //       const dep = await getDepartments(collegeId);
  //       // console.log(res);
  //       // setResources(res);
  //       setDepartments(dep)
  //     };

  //     fetchDepartmentsAndResources();
  //   }
  // }, [user]);

  // useEffect(() => {
  //   if (formData.venue) {
  //     checkPermission(formData.venue);
  //   }
  // }, [formData.venue]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <div>Please Login!</div>;
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleVideoUpload = async () => {
    if (!selectedFile) {
      alert("Please select a video first.");
      return;
    }

    const userId = user.id;
    if (!userId) {
      alert("You must be logged in to upload a video.");
      return;
    }

    if (!accessToken) {
      alert("Please authenticate with YouTube first.");
      return;
    }

    setIsUploading(true); // Show loading state

    const videoUrl = await uploadToYouTube(
      youtubeTitle as string,
      youtubeDescription as string,
      selectedFile,
      accessToken,
      expiryTimeStamp as string
    );

    setIsUploading(false); // Hide loading state

    if (videoUrl) {
      setFormData((prev) => ({
        ...prev,
        videos: [...prev.videos as [], videoUrl],
      }));
      alert("Video uploaded successfully!");

      setYoutubeTitle("");
      setYoutubeDescription("");
      setSelectedFile(null);
    } else {
      alert("Failed to upload video.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handlePrizeChange = (position: string, amount: string) => {
    setFormData((prev) => ({
      ...prev,
      prizes: { ...prev.prizes, [position]: Number(amount) },
    }));
  };

  const handleGoodiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      goodies: prev.goodies ? (
        checked ? [...prev.goodies, value] : prev.goodies.filter((g) => g !== value)
      ) : checked ? [value] : [] // Ensure goodies is always an array
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validate required fields
    if (
      !formData.name ||
      !formData.description ||
      !formData.type ||
      !formData.start_date ||
      !formData.end_date ||
      !formData.start_time ||
      !formData.end_time
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if(!user || user.role !== 'organizer') return;
  
    try {
      setIsImageUploading(true);
  
      // Upload images first if not uploaded yet
      // let uploadedUrls: string[] = [];
  
      // if (selectedFiles.length > 0) {
      //   // Rename the inner FormData variable to avoid shadowing `formData` state
      //   const uploadPromises = selectedFiles.map(async (file) => {
      //     const uploadData = new FormData();
      //     uploadData.append("file", file);
      //     uploadData.append("upload_preset", "event_images");
      //     uploadData.append("cloud_name", "dnibch4eh");
  
      //     try {
      //       const response = await fetch(
      //         "https://api.cloudinary.com/v1_1/dnibch4eh/image/upload",
      //         {
      //           method: "POST",
      //           body: uploadData,
      //         }
      //       );
      //       const data = await response.json();
      //       return data.secure_url;
      //     } catch (error) {
      //       console.error("Upload error:", error);
      //       return null;
      //     }
      //   });
  
      //   uploadedUrls = (await Promise.all(uploadPromises)).filter(
      //     (url) => url !== null
      //   ) as string[];
      // }
  
      // setIsImageUploading(false);
  
      // console.log("Uploaded URLs: ", uploadedUrls);
  
      // Ensure the latest images are included when sending data.
      // Note that the images property is explicitly overwritten.
      const eventData = {
        ...formData, // Outer formData holds your event form state.
        images: uploadedImages, // Directly assign uploaded image URLs.
        max_participants: Number(formData.max_participants),
        department : user.department,
        min_team_size: formData.is_team_event
          ? Number(formData.min_team_size)
          : 0,
        max_team_size: formData.is_team_event
          ? Number(formData.max_team_size)
          : 0,
        prizes: formData.prizes
          ? Object.keys(formData.prizes).reduce((acc, key) => {
              acc[key] = Number(formData.prizes![key]);
              return acc;
            }, {} as Record<string, number>)
          : {},
        status: "draft" as EventFormData["status"],
        created_at: new Date().toISOString(),
      };
  
      const response = await createEvent(eventData, user.id);
  
      if (response.success) {
        alert("Event created successfully!");
  
        // Store draft in Redux
        dispatch(addEventDraft(eventData));
  
        // Reset form and image states
        setFormData({
          id: "",
          name: "",
          description: "",
          type: "Technical",
          mode: "Offline",
          department: "",
          start_date: "",
          end_date: "",
          start_time: "",
          end_time: "",
          registration_deadline: "",
          max_participants: 0,
          is_team_event: false,
          min_team_size: 1,
          max_team_size: 1,
          status: "draft",
          venue: "",
          event_categories: [],
          images: [],
          videos: [],
          prizes: {},
          goodies: [],
          created_at: "",
        });
        setImagePreviews([]);
        setUploadedImages([]);
        setSelectedFiles([]);
      } else {
        alert("Failed to create event. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting event:", error);
      alert("An error occurred while creating the event.");
    }
  };
  

  // Check the venue permission
  // const checkPermission = async (venue: string) => {
  //   if (!user || user.role !== 'organizer') return;

  //   const status = await checkPermissionStatus(user.id, venue, {
  //     start_date: formData.start_date,
  //     end_date: formData.end_date,
  //     start_time: formData.start_time,
  //     end_time: formData.end_time
  //   });

  //   setPermissionStatus(status);
  // };

  // Select images
  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(files);

      // Generate image previews
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  // Upload selected images to Cloudinary
  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select images first.");
      return;
    }

    setIsImageUploading(true);

    const uploadPromises = selectedFiles.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "event_images"); // Use your Cloudinary upload preset
      formData.append("cloud_name", "dnibch4eh"); // Your Cloudinary cloud name

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dnibch4eh/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (data.secure_url) {
          setUploadedImages((prev) => [...prev, data.secure_url]);
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    });

    await Promise.all(uploadPromises);
    setIsImageUploading(false);
    alert("Images uploaded successfully!");

    // Clear selections after upload
    setImagePreviews([]);
    setSelectedFiles([]);
  };

  return (
    <div className="max-w-4xl mx-auto font-[sans-serif] p-6">
      <h2 className="text-center text-xl font-semibold mb-6">
        Create New Event
      </h2>

      <form onSubmit={handleSubmit} className="grid gap-6">
        {/* Event Name */}
        <div>
          <label className="text-gray-600 text-md mb-2 block">Event Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            className="bg-gray-100 w-full text-gray-800 text-md px-4 py-3 rounded"
            placeholder="Enter event name"
          />
        </div>

        {/* Event Description */}
        <div>
          <label className="text-gray-600 text-md mb-2 block">
            Event Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="bg-gray-100 w-full text-gray-800 text-md px-4 py-3 rounded"
            placeholder="Enter event description"
          />
        </div>

        {/* Department */}
        {/* <div>
          <label className="text-gray-600 text-md mb-2 block">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div> */}

        {/* Event Type */}
        <div>
          <label className="text-gray-600 text-md mb-2 block">Event Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="bg-gray-100 w-full text-gray-800 text-md px-4 py-3 rounded"
          >
            <option value="">Select Type</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Technical">Technical</option>
            <option value="Non-Technical">Non-Technical</option>
            <option value="Cultural">Cultural</option>
            <option value="Sports">Sports</option>
          </select>
        </div>

        {/* Event Mode */}
        <div>
          <label className="text-gray-600 text-md mb-2 block">Event Mode</label>
          <div className="flex gap-4">
            {["Offline", "Online"].map((mode) => (
              <label key={mode} className="flex items-center">
                <input
                  type="radio"
                  name="mode"
                  value={mode}
                  checked={formData.mode === mode}
                  onChange={handleChange}
                  className="mr-2"
                />
                {mode}
              </label>
            ))}
          </div>
        </div>

        {/* Event Categories */}
        <div>
          <label className="text-gray-600 text-md mb-2 block">Event Categories (Max 5)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto bg-gray-100 p-3 rounded">
            {eventCategories.map((category) => (
              <label key={category} className="flex items-center gap-2 text-sm text-gray-800">
                <input
                  type="checkbox"
                  value={category}
                  checked={formData.event_categories.includes(category)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const value = e.target.value;
                    if (checked) {
                      if (formData.event_categories.length < 5) {
                        setFormData((prev) => ({
                          ...prev,
                          event_categories: [...prev.event_categories, value],
                        }));
                      } else {
                        alert("You can select up to 5 categories only.");
                      }
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        event_categories: prev.event_categories.filter((c) => c !== value),
                      }));
                    }
                  }}
                />
                {category}
              </label>
            ))}
          </div>
        </div>


        {/* Date & Time */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-600 text-md mb-2 block">
              Start Date
            </label>
            <input
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              className="bg-gray-100 w-full px-4 py-3 rounded"
            />
          </div>
          <div>
            <label className="text-gray-600 text-md mb-2 block">End Date</label>
            <input
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
              className="bg-gray-100 w-full px-4 py-3 rounded"
            />
          </div>
          <div>
            <label className="text-gray-600 text-md mb-2 block">
              Start Time
            </label>
            <input
              name="start_time"
              type="time"
              value={formData.start_time}
              onChange={handleChange}
              className="bg-gray-100 w-full px-4 py-3 rounded"
            />
          </div>
          <div>
            <label className="text-gray-600 text-md mb-2 block">End Time</label>
            <input
              name="end_time"
              type="time"
              value={formData.end_time}
              onChange={handleChange}
              className="bg-gray-100 w-full px-4 py-3 rounded"
            />
          </div>
        </div>

        {/*
        {
          permissionStatus === 'none' ? (
            <div>
              <label className="text-gray-600 text-md mb-2 block">Venue</label>
              <select
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className="bg-gray-100 w-full px-4 py-3 rounded mb-4"
              >
                <option value="">Select Venue</option>
                {resources.map((resource) => (
                  <option key={resource.id} value={resource.id}>
                    {resource.name}
                  </option>
                ))}
              </select>

              <Link to={'/organizer/permissions/request'}
                className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
              >
                Request Permission
              </Link>
            </div>
          ) : (
            <div>
              {permissionStatus === "approved" && (
                <p className="text-green-500 mt-2">✅ Permission Approved</p>
              )}
              {permissionStatus === "pending_admin_approval" && (
                <p className="text-yellow-500 mt-2">
                  ⏳ Waiting for Admin Approval...
                </p>
              )}
              {permissionStatus === "rejected" && (
                <p className="text-red-500 mt-2">❌ Permission Rejected</p>
              )}
            </div>
          )
        }
        */}



        {/* Uploaded Images (Firebase URLs) */}
        <div className="mt-4">
          <div className="text-gray-700">Upload Images</div>
          {/* Selected Images Previews */}
          <div className="my-2 flex gap-2 items-center">
            <label className="w-28 h-24 border flex justify-center items-center gap-1 px-5 bg-gray-300 text-gray-700 rounded-lg cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
              <p>Select Images</p>
              <input
                type="file"
                className="hidden"
                multiple
                onChange={handleImageSelection}
              />
            </label>

            {/* Show Selected Image Previews */}
            <div className="image-previews flex flex-wrap gap-2">
              {imagePreviews.length > 0 ? (
                imagePreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`preview ${index + 1}`}
                    className="w-28 h-24 object-contain rounded-lg mt-2 border-2"
                  />
                ))
              ) : (
                <p>No photos selected</p>
              )}
            </div>
          </div>

          {/* Upload Button */}
          {selectedFiles.length > 0 && (
            <button
              onClick={handleImageUpload}
              disabled={isImageUploading}
              className={`mt-2 px-4 py-2 rounded-lg text-white ${isImageUploading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {isImageUploading ? "Uploading..." : "Upload Images"}
            </button>
          )}

          {/* Uploaded Images */}
          {uploadedImages.length > 0 && (
            <div className="mt-4">
              <p className="text-gray-700">Uploaded Images:</p>
              <div className="flex flex-wrap gap-2">
                {uploadedImages.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Uploaded ${index + 1}`}
                    className="w-28 h-24 object-cover rounded-lg border-2"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Videos */}
        {isYouTubeAuth ? (
          <div>
            <label className="text-gray-600 text-md mb-2 block">
              Upload Video (YouTube)
            </label>
            <div>
              <label className="text-gray-600 text-md mb-2 block">
                YouTube Video Title
              </label>
              <input
                name="youtube_title"
                value={youtubeTitle}
                onChange={(e) => setYoutubeTitle(e.target.value)}
                type="text"
                className="bg-gray-100 w-full text-gray-800 text-md px-4 py-3 rounded"
                placeholder="Enter event name"
              />

              <label className="text-gray-600 text-md mb-2 block">
                YouTube Video Description
              </label>
              <textarea
                name="youtube_description"
                value={youtubeDescription}
                onChange={(e) => setYoutubeDescription(e.target.value)}
                className="bg-gray-100 w-full text-gray-800 text-md px-4 py-3 rounded"
              />
            </div>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="bg-gray-100 w-full px-4 py-3 rounded"
            />

            {selectedFile && (
              <div className="mt-4">
                <button
                  onClick={handleVideoUpload}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload Video"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <button
              onClick={() => {
                authenticateYouTube();
                setIsYouTubeAuth(true);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
            >
              Authenticate YouTube
            </button>
          </div>
        )}

        <label className="text-gray-600 text-md mb-2 block">
          Max Participants
        </label>
        <input
          type="number"
          name="max_participants"
          placeholder="Max Participants"
          className="input-field p-2"
          onChange={handleChange}
          required
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="is_team_event"
            checked={formData.is_team_event}
            onChange={handleChange}
          />
          <span>Is Team Event?</span>
        </label>

        {formData.is_team_event && (
          <>
            <input
              type="number"
              name="min_team_size"
              placeholder="Min Team Size"
              className="input-field p-2"
              onChange={handleChange}
            />
            <input
              type="number"
              name="max_team_size"
              placeholder="Max Team Size"
              className="input-field p-2"
              onChange={handleChange}
            />
          </>
        )}

        <div>
          <label className="text-gray-600 text-md mb-2 block">
            Registration Deadline Date
          </label>
          <input
            name="registration_deadline"
            type="date"
            value={formData.registration_deadline}
            onChange={handleChange}
            className="bg-gray-100 w-full px-4 py-3 rounded"
          />
        </div>

        {/* Prizes */}
        <div>
          <label className="text-gray-600 text-md mb-2 block">Prizes</label>
          {[1, 2, 3].map((position) => (
            <div key={position} className="flex gap-4 mb-2">
              <span className="bg-gray-200 px-3 py-2 rounded">{position}</span>
              <input
                type="number"
                placeholder="Cash Prize Amount"
                className="bg-gray-100 w-full px-4 py-3 rounded"
                onChange={(e) =>
                  handlePrizeChange(position.toString(), e.target.value)
                }
              />
            </div>
          ))}
        </div>

        {/* Goodies */}
        <div>
          <label className="text-gray-600 text-md mb-2 block">Goodies</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {

              ["T-shirt", "Bag", "Badge", "Pen"].map((item) => (
                <label key={item} className="flex items-center">
                  <input
                    type="checkbox"
                    value={item}
                    checked={formData.goodies?.includes(item)}
                    onChange={handleGoodiesChange}
                    className="mr-2"
                  />
                  {item}
                </label>
              ))}
          </div>
        </div>

        {/* Submit Button */}

        <div className="mt-8">
          <button
            type="submit"
            className="mx-auto block py-3 px-6 text-md rounded text-white bg-blue-600 hover:bg-blue-700"
          >
            Create Event Draft
          </button>
        </div>

      </form>
    </div>
  );
};

export default EventForm;
