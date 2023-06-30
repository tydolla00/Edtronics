import { useRef, useState, createContext, useEffect } from "react";
import "./App.css";
import Typed from "typed.js";
import Bae from "./assets/Bae🖤.jpg";
import { ChatProps } from "./utils/types";
import Notification from "./components/notifications";
import Command, { Chat } from "./components/chatbox";

export const ChatContext: any = createContext(null);

/*
TODO Implement ElevenLabs Voice API. Mess around with speed of typer.
TODO Add more context to Edbot prompt. MidJourney generate AI Ed.
TODO Add sound to sending message? Disable input and send button while bot is typing.
TODO Style better, Build better UI. Tell bot to ask for name, better opening script.
TODO Scroll over message show sent time? Like iPhone. Clean up server folder.
TODO Add notifications to top of screen, show up when keyword is in bot message?
  ? Ex: Scotty -> Ari send a text saying I miss you...
? https://github.com/leonvanzyl/Elevenlabs-TTS-API ElevenLabs implementation.
*/

function App() {
  let botMessage = "";
  const [messages, setMessages] = useState([
    <Chat
      key={"bot"}
      isAi={true}
      message="What's goooood a boss! Ask me anything and I'll give you a woah nice answer."
    />,
  ]);
  const [loading, setLoading] = useState(false);
  const bot = useRef(null);

  useEffect(() => {
    const chatbotDiv = document.getElementById("chatbot");
    const typed = new Typed(bot.current, {
      strings: [botMessage],
      typeSpeed: 20,
      showCursor: true,
      onStart() {
        while (true)
          if (chatbotDiv) chatbotDiv.scrollTop = chatbotDiv.scrollHeight;
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
        <div id="chatbot" className="max-h-[85vh] overflow-auto">
          <div>Logo</div>
          <div className="flex justify-center">
            <img
              className="h-40 w-40 rounded-full object-cover"
              src={Bae}
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
          {loading && (
            <div className="w-16 rounded-full bg-gray-600 text-3xl text-white">
              <div className="loading inline-block">•••</div>
            </div>
          )}
          <div
            className={`${
              loading
                ? "hidden"
                : "w-60 rounded-xl bg-tron-green p-2 font-bold text-tron-gold md:w-[350px]"
            }`}
          >
            <span ref={bot} />
          </div>
        </div>
        <Notification message={botMessage} />
        <Command loading={setLoading} />
      </ChatContext.Provider>
    </>
  );
}

export default App;
