export type Chats = {
  role: "user" | "assistant";
  content: string;
};
export type ChatProps = {
  isAi: boolean;
  message: string;
};

export type CommandProps = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isTyping: boolean;
  setAudio: React.Dispatch<any>;
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
