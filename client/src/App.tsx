import { useRef, useState, createContext, useEffect } from "react";
import Typed from "typed.js";
import edbot from "./assets/edbot.jpeg";
import { ChatProps } from "./utils/types";
import Notification from "./components/notifications";
import Command, { Chat } from "./components/chatbox";
import ReactAudioPlayer from "react-audio-player";
import "../src/styles/App.css";
//@ts-ignore
import useSound from "use-sound";

export const ChatContext: any = createContext(null);

/*
TODO Ensure Responsiveness
TODO Play audio only when it is fully loaded.
TODO MidJourney generate AI Ed. Add sound to sending message? Limit tokens ChatGPT. Whisper API
TODO Style better, Build better UI. Clean up server folder.
*/

// * Play Audio when fully loaded. #Not working.
const handleAudioLoaded = () => {
  console.log("Got here for the x'th time");
  const audioElement = document.getElementById(
    "audioplayer"
  ) as HTMLAudioElement;
  if (audioElement) audioElement.play();
};

function App() {
  let botMessage = "";
  const [messages, setMessages] = useState([
    <Chat
      key={"bot"}
      isAi={true}
      message="What's goooood a boss! Ask me anything and I'll give you a woah nice answer. What's your name?"
    />,
  ]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setisTyping] = useState(false);
  const [audio, setAudio] = useState<any>(); // File name

  const bot = useRef(null);

  useEffect(() => {
    const chatbotDiv = document.getElementById("chatbot");
    const typed = new Typed(bot.current, {
      strings: [botMessage],
      typeSpeed: 20,
      showCursor: true,
      onDestroy() {
        setisTyping(false);
      },
      onComplete() {
        if (chatbotDiv) chatbotDiv.scrollTop = chatbotDiv.scrollHeight;
      },
    });
    return () => {
      typed.destroy();
    };
  }, [messages]);

  return (
    <>
      <ChatContext.Provider value={{ messages, setMessages }}>
        <div id="chatbot" className="max-h-[83vh] overflow-auto">
          <div>Logo</div>
          <div className="flex justify-center">
            <img
              className="h-40 w-40 rounded-full object-cover"
              src={edbot}
              alt="Bot icon"
            />
          </div>
          {messages.map((message, index) => {
            const msg: ChatProps = messages[index].props;

            if (index === messages.length - 1 && msg.isAi && !loading) {
              botMessage = msg.message;
              return;
            } else return message;
          })}

          {!loading && audio && (
            <ReactAudioPlayer
              id="audioplayer"
              // src={`https://edbot.onrender.com/audio/${audio}`}
              src={`http://localhost:8000/audio/${audio}`}
              onCanPlayThrough={handleAudioLoaded}
              // onLoadedMetadata={handleAudioLoaded}
              preload="auto"
              controls
            />
          )}

          {loading && (
            <div className="w-16 rounded-full bg-gray-600 text-3xl text-white">
              <div className="loading inline-block">•••</div>
            </div>
          )}
          <div
            className={`${
              loading
                ? "hidden"
                : "mb-2 w-60 rounded-xl bg-tron-green p-2 font-bold text-tron-gold md:w-[350px]"
            }`}
          >
            <span ref={bot} />
          </div>
        </div>
        <Notification message={botMessage} />
        <Command
          isTyping={isTyping}
          loading={loading}
          setLoading={setLoading}
          setAudio={setAudio}
        />
      </ChatContext.Provider>
    </>
  );
}

export default App;
