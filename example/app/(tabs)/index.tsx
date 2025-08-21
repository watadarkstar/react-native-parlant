import { SafeAreaView, StyleSheet } from "react-native";

import { useChat } from "react-native-parlant";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { useCallback } from "react";

export default function HomeScreen() {
  const { messages, sendMessage, isTyping, isLoading } = useChat({
    agentId: "EUMObZArua",
    api: "http://localhost:8800",
    initialMessages: [
      {
        _id: 1,
        text: "Hello! I'm here to help you with any question about cars. What would you like to discuss?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Car Guy",
        },
      },
    ],
  });

  const onSend = useCallback(
    (messages: IMessage[]) => {
      const userMessage = messages[0]?.text || "";

      sendMessage(userMessage);
    },
    [sendMessage]
  );

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
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
