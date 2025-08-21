"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.append = exports.useChat = void 0;
const react_1 = require("react");
const defaultProps = {
    agentId: "",
    api: "http://localhost:8800",
    moderation: "auto",
    customerId: "guest",
    title: "New Conversation",
    maxRetries: 3,
    headers: {},
    aiAvatar: "",
};
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
const useChat = ({ api, agentId, initialMessages, moderation, customerId, title, maxRetries, headers, aiAvatar, }) => {
    // Ensure defaults are used for undefined values
    const _api = api !== null && api !== void 0 ? api : defaultProps.api;
    const _agentId = agentId !== null && agentId !== void 0 ? agentId : defaultProps.agentId;
    const _maxRetries = maxRetries !== null && maxRetries !== void 0 ? maxRetries : defaultProps.maxRetries;
    const _moderation = moderation !== null && moderation !== void 0 ? moderation : defaultProps.moderation;
    const _customerId = customerId !== null && customerId !== void 0 ? customerId : defaultProps.customerId;
    const _title = title !== null && title !== void 0 ? title : defaultProps.title;
    const _headers = headers !== null && headers !== void 0 ? headers : defaultProps.headers;
    const _aiAvatar = aiAvatar !== null && aiAvatar !== void 0 ? aiAvatar : defaultProps.aiAvatar;
    const retries = (0, react_1.useRef)(0); // Use a ref to keep track of retries for fetching messages
    const minOffset = (0, react_1.useRef)(0); // Use a ref to keep track of the minimum offset for fetching messages
    const [sessionId, setSessionId] = (0, react_1.useState)("");
    const [messages, setMessages] = (0, react_1.useState)(initialMessages || []);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [isTyping, setIsTyping] = (0, react_1.useState)(false);
    const createSession = async () => {
        const response = await fetch(`${_api}/sessions?allow_greeting=false`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ..._headers,
            },
            body: JSON.stringify({
                agent_id: _agentId,
                customer_id: _customerId,
                title: _title,
            }),
        });
        if (!response.ok) {
            console.error("Failed to create session:", response.statusText);
            throw new Error("Failed to create session");
        }
        const data = await response.json();
        setSessionId(data.id);
        return data.id;
    };
    const sendMessage = async (message) => {
        let _sessionId = sessionId;
        setIsLoading(true);
        // If no session exists, create one
        if (!_sessionId) {
            _sessionId = await createSession();
        }
        const response = await fetch(`${_api}/sessions/${_sessionId}/events?moderation=${_moderation}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ..._headers,
            },
            body: JSON.stringify({
                kind: "message",
                message,
                source: "customer",
            }),
        });
        if (!response.ok) {
            console.error("Failed to send message:", response.statusText);
            console.error(response.body);
            console.error(response.status);
            throw new Error("Failed to send message");
        }
        const json = await response.json();
        setIsLoading(false);
        return json;
    };
    (0, react_1.useEffect)(() => {
        const fetchMessages = async () => {
            if (!sessionId) {
                // This is normal if the session has not been created yet
                // We will create a session when the first message is sent
                return;
            }
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const response = await fetch(`${_api}/sessions/${sessionId}/events?min_offset=${minOffset.current}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        ..._headers,
                    },
                });
                if (!response.ok) {
                    if (response.status === 504) {
                        // This is normal for long polling, because the server times out
                        // every 60 seconds and we just need to re-subscribe
                        // See docs: https://www.parlant.io/docs/engine-internals/conversation-api/#receiving-messages
                        continue;
                    }
                    console.error("Failed to fetch messages:", response.statusText);
                    console.error(response.body);
                    console.error(response.status);
                    if (retries.current < _maxRetries) {
                        retries.current += 1;
                        console.warn(`Retrying fetch events (${retries.current}/${_maxRetries})...`);
                        continue;
                    }
                    else {
                        break;
                    }
                }
                retries.current = 0; // Reset retries on successful fetch
                const data = await response.json();
                if (data.length > 0) {
                    const newMessages = data
                        .filter((event) => event.kind === "message")
                        .map((event) => ({
                        _id: Math.round(Math.random() * 1000000),
                        text: event.data.message,
                        createdAt: new Date(event.creation_utc),
                        user: {
                            _id: event.source === "ai_agent" ? 2 : 1, // Assuming 1 is the customer and 2 is the AI agent
                            name: event.data.participant.display_name,
                            avatar: _aiAvatar,
                        },
                    }));
                    if (newMessages.length > 0) {
                        setMessages((previousMessages) => (0, exports.append)(previousMessages, newMessages));
                    }
                    const lastEvent = data[data.length - 1];
                    if (lastEvent && lastEvent.data.status === "typing") {
                        setIsTyping(true);
                    }
                    else {
                        setIsTyping(false);
                    }
                    if (lastEvent) {
                        minOffset.current = lastEvent.offset + 1;
                    }
                }
            }
        };
        fetchMessages();
    }, [_api, _maxRetries, _headers, sessionId, _aiAvatar]);
    return {
        sendMessage,
        messages,
        isLoading,
        isTyping,
    };
};
exports.useChat = useChat;
/**
 * Appends new messages to the current list of messages.
 *
 * @template TMessage - The type of the message, extending IMessage.
 * @param {TMessage[]} [currentMessages=[]] - The existing array of messages.
 * @param {TMessage[] | TMessage} messages - The new message(s) to append.
 * @param {boolean} [inverted=true] - If true, new messages are prepended; if false, appended.
 * @returns {TMessage[]} The updated array of messages.
 */
const append = (currentMessages = [], messages, inverted = true) => {
    if (!Array.isArray(messages))
        messages = [messages];
    return inverted
        ? messages.concat(currentMessages)
        : currentMessages.concat(messages);
};
exports.append = append;
//# sourceMappingURL=useChat.js.map