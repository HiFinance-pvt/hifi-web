"use client";
import TextPressure from "@/ui/components/TextPressure";
import TextType from "@/ui/components/TextType";

export default function Home() {
  return (
    <div className="flex flex-col gap-5 items-center justify-center w-full min-h-screen">
      {/* <div className="">
        <CircularText
          text="Welcome To HiFi!"
          onHover="speedUp"
          spinDuration={20}
          className="custom-class"
        />
      </div> */}
      <div className="w-3/4 h-fit scale-50 relative">
        <TextPressure
          text="HiFi"
          flex={true}
          alpha={false}
          stroke={false}
          width={true}
          weight={true}
          italic={false}
          textColor="#398f45"
          minFontSize={40}
          className="h-full w-full"
        />
      </div>
      <div className="">
        <TextType
          text={[
            "Welcome To HiFi!",
            "Your Financial Assistant",
            "Feel Free To Invest",
          ]}
          typingSpeed={75}
          textColors={["#c7fcce "]}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="_"
          className="text-[64px] text-center"
        />
      </div>
    </div>
  );
}
