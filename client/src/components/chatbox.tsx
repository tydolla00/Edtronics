import axios from "axios";
import { ChatContext } from "../App";
import { ChatProps, Chats, CommandProps } from "../utils/types";
import { useState, useRef, useContext } from "react";
import { parse } from "flatted";

export const Chat = ({ isAi, message }: ChatProps) => {
  return (
    <>
      <div
        className={`${
          isAi
            ? "bg-tron-green text-tron-gold "
            : "ml-auto bg-blue-500 text-white "
        }w-60 mb-2 rounded-xl p-2 font-bold md:w-[350px]`}
      >
        {message}
      </div>
    </>
  );
};

const generateUniqueId = (): string => {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`;
};

// ? Fetches response from ChatGPT. Returns generated text.
const getBotMessage = async (prompt: Chats[]): Promise<string> => {
  let response = await axios.post(
    // "https://edbot.onrender.com/botmessage",
    "http://localhost:8000/botmessage",
    { prompt },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// ? Fetches response from ElevenLabs. Returns url to file name on server.
const getBotSpeech = async (text: string) => {
  try {
    const response = await axios.post(
      // "https://edbot.onrender.com/labs",
      "http://localhost:8000/labs",
      {
        message: text,
        voice: "21m00Tcm4TlvDq8ikWAM",
      }
    );
    if (!response.status) {
      throw new Error("Something went wrong with fetching the voice");
    }
    // console.log(response);
    // console.log(response.data.env.blob);
    // return response.data.env.blob;
    // const blob = new Blob(response.data, { type: "audio/mpeg" });
    // return blob;

    const url = response.data.file;
    return url;
  } catch (error) {
    console.log(error);
    return new Error("Something went wrong");
  }
};

const Command = ({ loading, setLoading, isTyping, setAudio }: CommandProps) => {
  const textareaRef = useRef(null);
  const [command, setCommand] = useState("");
  const { setMessages }: any = useContext(ChatContext);
  const [chatHistory, setChatHistory] = useState<Chats[]>([]);

  // * Resize Textarea with input.
  const handleSizeChange = (e: any) => {
    const textarea: any = textareaRef.current;
    setCommand(e.target.value);
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // ? Concatenates messages to array. requests response from api and displays results.
  const addMessages = async (message: string) => {
    message = message.trim();
    if (loading || isTyping || message.length < 1) return;
    setLoading(true);

    const userId: string = generateUniqueId();
    const botId: string = generateUniqueId();

    const textarea: any = textareaRef.current;
    textarea.style.height = "auto";

    // * Adds chat history to messages array and <Chat array.
    const updatedChatHistory: Chats[] = [
      ...chatHistory,
      { role: "user", content: message },
    ];
    setChatHistory(updatedChatHistory);
    setCommand("");
    setMessages((prevMessages: JSX.Element[]) => [
      ...prevMessages,
      <Chat key={userId} isAi={false} message={message} />,
    ]);

    // * Fetch ChatGPT Response and Eleven Labs TTS.
    const botMessage = await getBotMessage(updatedChatHistory);
    setAudio(null);
    setLoading(false);

    setChatHistory((prevChatHistory: Chats[]) => [
      ...prevChatHistory,
      { role: "assistant", content: botMessage },
    ]);

    setMessages((prevMessages: JSX.Element[]) => [
      ...prevMessages,
      <Chat key={botId} isAi={true} message={botMessage} />,
    ]);
    const botSpeech = await getBotSpeech(botMessage);
    setAudio(botSpeech);
  };

  return (
    <>
      <div className="fixed bottom-1 left-0 w-full">
        <div className="h-2 w-full bg-tron-gold"></div>
        <div className="flex w-full items-center justify-center gap-2">
          <textarea
            placeholder=" Send Edbot a message!"
            ref={textareaRef}
            value={command}
            disabled={isTyping || loading}
            onChange={(e) => handleSizeChange(e)}
            className="my-5 h-10 max-h-32 w-4/5 resize-none rounded-xl bg-tron-green p-2 text-tron-gold shadow-xl"
          />
          <div className="cursor-pointer" onClick={() => addMessages(command)}>
            <svg // Send Button
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`${(isTyping || loading) && "bg-yellow-300"}h-5 w-5`}
            >
              <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};
export default Command;
