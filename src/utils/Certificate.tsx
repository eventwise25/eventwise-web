import React from "react";

interface CertificateProps {
  name: string;
  teamNameLine?: string;
  eventName: string;
  awardType: string;
  eventDate: string;
}

const Certificate: React.FC<CertificateProps> = ({
  name,
  teamNameLine,
  eventName,
  awardType,
  eventDate,
}) => {

  return (
    <div
      className="w-[1000px] h-[760px] p-12 relative rounded-xl"
      style={{
        backgroundImage: `url(/certificate-1.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#ffffff", // pure white
      }}
    >
      <div className="mt-70 text-center" style={{ color: "#1f2937" /* ~gray-800 */ }}>
        <h2 className="mt-2 text-3xl font-cursive italic font-semibold tracking-wide">
          {name}
        </h2>
      </div>

      <div
        className="mt-10 text-center mx-auto text-lg italic leading-8 w-3/4"
        style={{ color: "#374151" /* ~gray-700 */ }}
      >
        <p>
          {teamNameLine && (
            <span className="font-semibold">{teamNameLine} </span>
          )}
          for their outstanding performance in{" "}
          <span className="font-semibold">{eventName}</span> and has been
          awarded <span className="font-semibold">{awardType}</span> held on{" "}
          <span className="font-semibold">{eventDate}</span>.
        </p>
      </div>
    </div>
  );
};

export default Certificate;
