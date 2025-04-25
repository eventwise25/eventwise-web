export const uploadPDFToCloudinary = async (fileBlob: Blob, fileName: string): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", fileBlob, fileName);
    formData.append("upload_preset", "your_unsigned_preset");
    formData.append("folder", "certificates");
  
    const cloudName = "your_cloud_name";
  
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      return data.secure_url || null;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return null;
    }
  };
  