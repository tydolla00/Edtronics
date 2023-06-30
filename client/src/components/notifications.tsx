import { Notifications, NotificationsProps } from "../utils/types";

const Notification = ({ message }: { message: string }) => {
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
  const notification = findMessage();
  return (
    <div className="flex justify-center">
      <div
        className={`${
          !notification && "hidden "
        } w-4/5bg-white-300 notification absolute top-0 w-full rounded-md border border-gray-950 bg-opacity-10 bg-clip-padding p-5 backdrop-blur-lg backdrop-filter`}
      >
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
