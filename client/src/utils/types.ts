export type Chats = {
  role: "user" | "assistant";
  content: string;
};
export type ChatProps = {
  isAi: boolean;
  message: string;
};
