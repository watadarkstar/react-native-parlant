import type { IMessage, Props, MessageEvent } from "./types";
/**
 * Custom React hook for managing chat sessions and messages with a Parlant AI agent.
 *
 * @param {Object} params - The parameters for the chat hook.
 * @param {IMessage[]} [params.initialMessages] - Optional initial messages to populate the chat.
 * @param {string} params.agentId - The ID of the agent to chat with.
 * @param {string} [params.moderation] - Optional moderation setting.
 * @param {string} [params.customerId] - Optional customer ID for the session.
 * @param {string} [params.title] - Optional title for the chat session.
 * @param {string} [params.api] - Optional API endpoint to use for chat backend.
 * @param {number} [params.maxRetries] - Optional maximum number of retries for fetching messages.
 * @returns {Object} An object containing chat state and functions:
 *   - messages: The array of chat messages.
 *   - isLoading: Boolean indicating if a message is being sent or loaded.
 *   - isTyping: Boolean indicating if the agent is typing.
 *   - sendMessage: Function to send a message to the agent.
 */
export declare const useChat: ({ api, agentId, initialMessages, moderation, customerId, title, maxRetries, headers, aiAvatar, }: Props) => {
    sendMessage: (message: string) => Promise<MessageEvent>;
    messages: IMessage[];
    isLoading: boolean;
    isTyping: boolean;
};
/**
 * Appends new messages to the current list of messages.
 *
 * @template TMessage - The type of the message, extending IMessage.
 * @param {TMessage[]} [currentMessages=[]] - The existing array of messages.
 * @param {TMessage[] | TMessage} messages - The new message(s) to append.
 * @param {boolean} [inverted=true] - If true, new messages are prepended; if false, appended.
 * @returns {TMessage[]} The updated array of messages.
 */
export declare const append: <TMessage extends IMessage>(currentMessages: TMessage[] | undefined, messages: TMessage[], inverted?: boolean) => TMessage[];
//# sourceMappingURL=useChat.d.ts.map