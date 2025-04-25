import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import {
    RegistrationWithUsers,
} from "../../../../redux/slices/registrationSlice";
import { UserData } from "../../../../interface/User";
import { EventFormData } from "../../../../interface/Events";
import { generatePDF } from "../../../../services/certificateService";
import { updateUserCertificate } from "../../../../services/userService";
import Certificate from "../../../../utils/Certificate";
import { uploadPDFToCloudinary } from "../../../../utils/uploadToFirebase";

interface RegistrationProps {
    event?: EventFormData;
}

const Registrations: React.FC<RegistrationProps> = ({ event }) => {
    const { registrations } = useSelector(
        (state: RootState) => state.registrations
    );
    const [showModal, setShowModal] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState<UserData[]>([]);

    const generateCertificate = async (
        registration: RegistrationWithUsers,
        type: "winner" | "participant"
    ) => {
        const membersToAward = registration.member_details;

        for (const member of membersToAward) {
            try {
                // const pdfBlob = await generateCertificatePDFBlob("certificate-preview"); // you can rename this id if needed
                const pdfBlob = await generatePDF();
                const fileName = `${registration.id}_${member.user_id}_${type}_certificate.pdf`;

                const pdfUrl = await uploadPDFToCloudinary(pdfBlob as Blob, fileName);
                // const pdfUrl = await uploadToFirebase(pdfBlob as Blob, fileName);

                console.log(pdfUrl);

                await updateUserCertificate(
                    member.user_id,
                    event?.id as string,
                    pdfUrl as string
                );

                console.log(`Uploaded & saved certificate for ${member.user_name}`);
            } catch (err) {
                console.error(`Failed for ${member.user_name}:`, err);
            }
        }

        alert("Uploade & save certificates complete");
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
                Registrations for {event?.name}
            </h2>
    
            <div className="grid gap-4">
                {registrations.map((reg, idx) => {
                    const isWinner = reg.position && reg.position <= 3;
                    const awardType = isWinner ? "Winner" : "Participant";
    
                    return (
                        <div
                            key={idx}
                            className="border p-4 rounded shadow flex justify-between items-center hover:bg-gray-100 transition cursor-pointer"
                            onClick={() => {
                                if (event?.is_team_event) {
                                    setSelectedMembers(reg.member_details);
                                    setShowModal(true);
                                }
                            }}
                        >
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {event?.is_team_event ? reg.team_name : reg.member_details[0]?.user_name}
                                </h3>
                                <p>
                                    {event?.is_team_event
                                        ? `Team Leader ID: ${reg.user_id}`
                                        : `Participant ID: ${reg.member_details[0]?.user_id}`}
                                </p>
                            </div>
    
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent modal opening
                                    generateCertificate(reg, isWinner ? "winner" : "participant");
                                }}
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Generate {awardType} Certificate
                            </button>
                        </div>
                    );
                })}
            </div>
    
            {showModal && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Team Members</h2>
                        <ul className="list-disc list-inside space-y-2">
                            {selectedMembers.map((mem, index) => (
                                <li key={index}>
                                    {mem.user_name} {mem.user_last_name} ({mem.user_id})
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
    
            {/* Hidden Preview Certificate Render Area */}
            <div
                id="certificate-preview"
                className="hidden fixed"
            >
                <Certificate
                    name="Sample Name"
                    teamNameLine="as part of team Sample Team"
                    eventName={event?.name || ""}
                    awardType="a certificate of participation"
                    eventDate={event?.start_date || ""}
                />
            </div>
        </div>
    );
    
};

export default Registrations;
