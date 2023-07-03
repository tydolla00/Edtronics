import { useEffect, useState } from "react";
import { Notifications, NotificationsProps } from "../utils/types";
//@ts-ignore
import useSound from "use-sound";
import Play from "../assets/newmessage.wav";

const Notification = ({ message }: { message: string }) => {
  const [play] = useSound(Play);
  const [showNotification, setshowNotification] = useState(false);
  const [notification, setNotification] = useState<NotificationsProps>({
    name: "",
    message: "",
  });
  const options: Notifications = {
    ari: {
      name: "Arianna",
      message: "I miss you...",
    },
    reet: {
      name: "Edmund",
      message: "Uhyuhh uhyuhhhh uhyuhhh",
    },
    woah: {
      name: "Jeff",
      message: "We out to paulies?",
    },
    scotty: {
      name: "Scotty",
      message: "Stop calling me Scotty 😡",
    },
    uhyuhhhh: {
      name: "Ty",
      message: "You're such a bot.",
    },
    euaaaa: {
      name: "Jeff",
      message:
        "So nice boss, euaaaa, reet, woah nice, here, here, here. Yo what the. Anyway what's the moves?",
    },
    units: {
      name: "Edmund Arnold Diggle",
      message: "Any units my bro? 🤖",
    },
    bro: {
      name: "Kayla",
      message: "Heyyyy",
    },
  };
  const optionMap = new Map(Object.entries(options));

  // * If there is a keyword match in the options list, return corresponding text.
  const findMessage = (): NotificationsProps => {
    const msgArray = message.split(" ");
    for (let i = 0; i < msgArray.length; i++) {
      msgArray[i] = msgArray[i].replace(/[^a-zA-Z]/g, "").toLowerCase();
      if (optionMap.get(msgArray[i])) {
        const notiMsg: NotificationsProps = optionMap.get(msgArray[i]);
        return notiMsg;
      }
    }
    return undefined;
  };

  useEffect(() => {
    setshowNotification(false); // Can add swipe up animation.
    const noti = findMessage();
    if (noti) {
      // Show the notification by setting showNotification to true.
      setshowNotification(true);
      setNotification(noti);
      play();
    }
  }, [message]);

  return (
    <div className="flex justify-center">
      <div
        className={`${
          !showNotification && "hidden "
        } w-4/5bg-white-300 notification absolute top-0 w-full rounded-md border border-gray-950 bg-opacity-10 bg-clip-padding p-5 backdrop-blur-lg backdrop-filter`}
      >
        <div
          onClick={() => setshowNotification(false)}
          className="absolute right-0 top-0 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div className="flex gap-5">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gray-500 p-5">
            <span className="absolute right-1 top-0 inline-flex h-2 w-2 animate-ping rounded-full bg-red-600 "></span>
            <div>{notification?.name?.charAt(0)}</div>
          </div>
          <div>
            <h1>{notification?.name}</h1>
            <div>{notification?.message}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Notification;
