export type Chats = {
  role: "user" | "assistant";
  content: string;
};
export type ChatProps = {
  isAi: boolean;
  message: string;
};

export type Notifications = {
  [key: string]: {
    name: string;
    message: string;
  };
};

export type NotificationsProps =
  | {
      name: string | undefined;
      message: string | undefined;
    }
  | undefined;
