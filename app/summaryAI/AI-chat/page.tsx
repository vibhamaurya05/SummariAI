
import ChatBox from "@/app/components/custome/chat-box";

interface Message {
  role: "user" | "bot";
  text: string;
}

export default function AIChat() {

  return (
    <div className="min-h-screen flex flex-col items-center px-4">
      {/* Heading */}
      <div className="max-w-3xl w-full mt-4 sm:mt-12 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
          Chat with AI Without Giving any Data for Training
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 sm:my-4 ">
          <span className="font-bold">NOTE:</span> Without providing data, it may give inaccurate results.
        </p>
      </div>

      {/* ChatBox UI */}
     
        <ChatBox  />

        
      
    </div>
  );
}
