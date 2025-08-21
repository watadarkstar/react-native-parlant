// -------------------- UI types ----------------------

type renderFunction = (x: unknown) => React.ReactNode;

interface User {
  _id: string | number;
  name?: string;
  avatar?: string | number | renderFunction;
}

interface Reply {
  title: string;
  value: string;
  messageId?: number | string;
}
interface QuickReplies {
  type: "radio" | "checkbox";
  values: Reply[];
  keepIt?: boolean;
}

export interface IMessage {
  _id: string | number;
  text: string;
  createdAt: Date | number;
  user: User;
  image?: string;
  video?: string;
  audio?: string;
  system?: boolean;
  sent?: boolean;
  received?: boolean;
  pending?: boolean;
  quickReplies?: QuickReplies;
}

// -------------------- API types ----------------------

interface Participant {
  id: string;
  display_name: string;
}

interface MessageData {
  message: string;
  participant: Participant;
  flagged: boolean;
  tags: string[];
  status?: "typing" | "ready"; // Optional, used for typing status
}

export interface MessageEvent {
  id: string;
  source: string;
  kind: "message" | "status";
  offset: number;
  creation_utc: string;
  correlation_id: string;
  data: MessageData;
  deleted: boolean;
}

interface ConsumptionOffsets {
  client: number;
}

export interface Session {
  id: string;
  agent_id: string;
  customer_id: string;
  creation_utc: string;
  title: string;
  mode: string;
  consumption_offsets: ConsumptionOffsets;
}

// -------------------- Props ----------------------

export interface Props {
  agentId: string;
  api: string;
  initialMessages?: IMessage[];
  moderation?: string;
  customerId?: string;
  title?: string;
  maxRetries?: number;
  headers?: Record<string, string>;
  aiAvatar?: string;
}
