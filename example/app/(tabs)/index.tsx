import { SafeAreaView, StyleSheet } from "react-native";

import { useChat } from "react-native-parlant";
import {
  GiftedChat,
  IMessage,
  Send,
  SendProps,
} from "react-native-gifted-chat";
import { useCallback } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

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

  const renderSend = useCallback((props: SendProps<IMessage>) => {
    return (
      <Send
        {...props}
        containerStyle={{
          justifyContent: "flex-end",
          paddingHorizontal: 10,
          marginBottom: 55,
        }}
      >
        <MaterialIcons size={30} color="blue" name="send" />
      </Send>
    );
  }, []);

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
        renderSend={renderSend}
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
    fontSize: 16,
    lineHeight: 20,
    marginHorizontal: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 50,
  },
});
