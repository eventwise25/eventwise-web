import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// function loadImage(src: string): Promise<void> {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.src = src;
//     img.onload = () => resolve();
//     img.onerror = () => reject(new Error("Failed to load image: " + src));
//   });
// }

export const generatePDF = async () => {
  const input = document.getElementById("certificate-preview"); // wrap your cert in a div with this ID
  if (!input) return;

  await new Promise((res) => setTimeout(res, 100));

  const canvas = await html2canvas(input, {
    useCORS: true,
    allowTaint: false,
    logging: true,
  });

  const imgData = canvas.toDataURL("image/jpeg");
  const pdf = new jsPDF("landscape", "px", [1000, 760]); // match your div size
  pdf.addImage(imgData, "JPEG", 0, 0, 1000, 760);
  const pdfBlob = pdf.output("blob");
  return pdfBlob;
};

// export const uploadToFirebase = async (pdfBlob: Blob, fileName: string) => {
//   const storage = getStorage();
//   const storageRef = ref(storage, `certificates/${fileName}.pdf`);
//   await uploadBytes(storageRef, pdfBlob);
//   const downloadURL = await getDownloadURL(storageRef);
//   return downloadURL;
// };

// export const generateCertificatePDFBlob = async (elementId: string): Promise<Blob> => {
//   // await loadImage('/Certificate.png');
//   const certificateElement = document.getElementById(elementId);
//   if (!certificateElement) throw new Error("Certificate element not found");

//   const canvas = await html2canvas(certificateElement);
//   const imgData = canvas.toDataURL("image/png");

//   const pdf = new jsPDF({
//     orientation: "landscape",
//     unit: "px",
//     format: [canvas.width, canvas.height],
//   });

//   pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

//   const pdfBlob = pdf.output("blob");
//   return pdfBlob;
// };


export const uploadToCloudinary = async (file: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_upload_preset"); // from Cloudinary settings
  
    const res = await fetch("https://api.cloudinary.com/v1_1/dnibch4eh/raw/upload", {
      method: "POST",
      body: formData,
    });
  
    const data = await res.json();
    return data.secure_url;
  };
  