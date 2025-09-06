<h3 align="center">
  💬 React Native Parlant
</h3>

<p align="center">
A React Native library for integrating <a href="https://www.parlant.io"
target="_blank">Parlant AI</a> agents<br />into your React Native, Expo, and React
applications.
</p>

<p align="center">
  <a href="https://snack.expo.dev/@flyreel/react-native-parlant-example" target="_blank">🕹️ Snack playground</a>
   • 
  <a href="https://www.linkedin.com/feed/update/urn:li:activity:7369036507208183808/" target="_blank">👀 Watch a demo</a> 
  <br />
  <a href="https://x.com/icookandcode" target="_blank">🚀 Need help building your agent? Connect with Adrian on X 
</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/react-native-parlant">
    <img alt="npm version" src="https://badge.fury.io/js/react-native-parlant.svg?icon=si%3Anpm"/>
  </a>
  <a title='License' href="https://github.com/watadarkstar/react-native-parlant/blob/master/LICENSE" height="18">
    <img src='https://img.shields.io/badge/license-MIT-blue.svg' />
  </a>
  <a title='Tweet' href="https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20React%20Native%20Parlant%20repository&url=https://github.com/watadarkstar/react-native-parlant&via=icookandcode&hashtags=react,reactnative,opensource,github,ai,parlant" height="18">
    <img src='https://img.shields.io/twitter/url/http/shields.io.svg?style=social' />
  </a>
</p>

## Installation

Yarn:

```bash
yarn add react-native-parlant
```

Npm:

```bash
npm install --save react-native-parlant
```

Expo

```bash
npx expo install react-native-parlant
```

## Quick Start

```tsx
import { SafeAreaView, StyleSheet } from "react-native";
import { useChat } from "react-native-parlant";
import { GiftedChat, IMessage } from "react-native-gifted-chat";

export default function Example() {
  const { messages, sendMessage, isTyping, isLoading } = useChat({
    agentId: "agent-id",
    api: "http://localhost:8800",
  });
  const onSend = (messages: IMessage[]) => {
    const userMessage = messages[0]?.text || "";
    sendMessage(userMessage);
  };

  return (
    <SafeAreaView style={styles.container}>
      <GiftedChat
        messages={messages}
        placeholder="Start typing..."
        onSend={onSend}
        isTyping={isTyping || isLoading}
        user={{
          _id: 1,
          name: "You",
        }}
        alwaysShowSend
        textInputProps={{
          style: styles.textInput,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
```

## API Reference

### `useChat(props: Props)`

The main hook for managing chat sessions with Parlant AI agents.

#### Props

| Prop              | Type                     | Required | Default                 | Description                           |
| ----------------- | ------------------------ | -------- | ----------------------- | ------------------------------------- |
| `agentId`         | `string`                 | ✅       | -                       | The ID of the Parlant AI agent        |
| `api`             | `string`                 | ✅       | `http://localhost:8800` | The Parlant API endpoint              |
| `initialMessages` | `IMessage[]`             | ❌       | `[]`                    | Initial messages to populate the chat |
| `moderation`      | `string`                 | ❌       | `"auto"`                | Moderation setting for messages       |
| `customerId`      | `string`                 | ❌       | `"guest"`               | Unique identifier for the customer    |
| `title`           | `string`                 | ❌       | `"New Conversation"`    | Title for the chat session            |
| `maxRetries`      | `number`                 | ❌       | `3`                     | Maximum retries for message fetching  |
| `headers`         | `Record<string, string>` | ❌       | `{}`                    | Custom headers for API requests       |
| `aiAvatar`        | `string`                 | ❌       | `""`                    | Avatar URL for AI agent messages      |

#### Returns

| Property      | Type                                         | Description                           |
| ------------- | -------------------------------------------- | ------------------------------------- |
| `messages`    | `IMessage[]`                                 | Array of chat messages                |
| `sendMessage` | `(message: string) => Promise<MessageEvent>` | Function to send a message            |
| `isLoading`   | `boolean`                                    | Whether a message is being sent       |
| `isTyping`    | `boolean`                                    | Whether the agent is currently typing |

### `append(currentMessages, newMessages, inverted?)`

Utility function for appending messages to the chat.

#### Parameters

- `currentMessages` (`TMessage[]`) - Existing messages array
- `newMessages` (`TMessage[]`) - New messages to append
- `inverted` (`boolean`, default: `true`) - Whether to prepend (true) or append (false) messages

## Types

### `IMessage`

```typescript
interface IMessage {
  _id: string | number;
  text: string;
  createdAt: Date | number;
  user: {
    _id: string | number;
    name?: string;
    avatar?: string | number | renderFunction;
  };
  image?: string;
  video?: string;
  audio?: string;
  system?: boolean;
  sent?: boolean;
  received?: boolean;
  pending?: boolean;
  quickReplies?: QuickReplies;
}
```

### `MessageEvent`

```typescript
interface MessageEvent {
  id: string;
  source: string;
  kind: "message" | "status";
  offset: number;
  creation_utc: string;
  correlation_id: string;
  data: {
    message: string;
    participant: {
      id: string;
      display_name: string;
    };
    flagged: boolean;
    tags: string[];
    status?: "typing" | "ready";
  };
  deleted: boolean;
}
```

### `Session`

```typescript
interface Session {
  id: string;
  agent_id: string;
  customer_id: string;
  creation_utc: string;
  title: string;
  mode: string;
  consumption_offsets: {
    client: number;
  };
}
```

## Features

- 🤖 **Real-time AI Chat** - Connect to Parlant AI agents with real-time messaging
- 📱 **Cross-Platform** - Works with React Native, Expo, and React applications
- 🔄 **Auto-Reconnection** - Automatic retry logic for robust connections
- 🎯 **TypeScript Support** - Full TypeScript definitions included
- 💾 **Session Management** - Automatic session creation and management
- 🔒 **Content Moderation** - Built-in support for message moderation
- ⚡ **Long Polling** - Efficient real-time message fetching
- 🎨 **Customizable** - Flexible message and user interface customization

## Advanced Usage

### Custom Headers

```tsx
const { messages, sendMessage } = useChat({
  agentId: "your-agent-id",
  api: "https://your-api.com",
  headers: {
    Authorization: "Bearer your-token",
    "X-Custom-Header": "custom-value",
  },
});
```

### Initial Messages

```tsx
const initialMessages: IMessage[] = [
  {
    _id: 1,
    text: "Hello! How can I help you today?",
    createdAt: new Date(),
    user: {
      _id: 2,
      name: "AI Assistant",
      avatar: "https://example.com/avatar.png",
    },
  },
];

const { messages, sendMessage } = useChat({
  agentId: "your-agent-id",
  api: "https://your-api.com",
  initialMessages,
});
```

### Error Handling

```tsx
const handleSendMessage = async (text: string) => {
  try {
    await sendMessage(text);
  } catch (error) {
    if (error.message === "Failed to send message") {
      // Handle send failure
      console.error("Message failed to send");
    } else if (error.message === "Failed to create session") {
      // Handle session creation failure
      console.error("Could not establish chat session");
    }
  }
};
```

## Requirements

- React 16.8+ (for hooks support)
- TypeScript 4.0+ (optional but recommended)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For questions and support, please contact [Adrian](https://x.com/icookandcode) on X or open an issue on GitHub.

---

<div align="center">

**Ready to build AI agents that actually work?**

⭐ **Star this repo** • 💬 **[Contact Adrian to Build It](https://x.com/icookandcode)**

_Built with ❤️ by [Adrian](https://x.com/icookandcode)_

</div>

---

**Keywords:** react-native, react, parlant, ai, agent, chat, conversation, typescript, react-native-parlant
