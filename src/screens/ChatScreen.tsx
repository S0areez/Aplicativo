import React, { useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { Message, useChat } from '../hooks/useChat';
import { useAuthStore } from '../store/useAuthStore';

export function ChatScreen() {
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: number, content: string } | null>(null);
  const { messages, sendMessage } = useChat();
  const { user } = useAuthStore();
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const swipeableRefs = useRef<Map<number, any>>(new Map());

  // Inverte as mensagens para o FlatList inverted (mais recentes primeiro)
  const reversedMessages = [...messages].reverse();

  const handleSend = async () => {
    if (text.trim()) {
      try {
        const messageText = text.trim();
        const currentReply = replyTo;
        setText('');
        setReplyTo(null);
        await sendMessage(messageText, currentReply || undefined);
      } catch (error: any) {
        alert(error.message || 'Erro ao enviar mensagem. Verifique sua conexão.');
      }
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.sender_id === user?.id;
    
    const MessageContent = (
      <View 
        className={`mb-3 p-3 rounded-2xl max-w-[85%] ${
          isMine ? 'bg-indigo-600 self-end' : 'bg-slate-800 self-start'
        }`}
      >
        {item.reply_content && (
          <View className="bg-black/20 p-2 rounded-lg mb-2 border-l-4 border-indigo-400">
            <Text className="text-indigo-300 text-xs font-bold mb-1">
              Em resposta a:
            </Text>
            <Text className="text-slate-300 text-xs italic" numberOfLines={2}>
              {item.reply_content}
            </Text>
          </View>
        )}
        <Text className="text-white text-base">{item.content}</Text>
        <Text className="text-indigo-200/60 text-[10px] mt-1 self-end">
          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );

    return (
      <Swipeable
        ref={(ref) => {
          if (ref) swipeableRefs.current.set(item.id, ref);
          else swipeableRefs.current.delete(item.id);
        }}
        renderLeftActions={() => (
          <View className="justify-center items-start px-6">
            <Text className="text-indigo-400 text-xs font-bold">Responder</Text>
          </View>
        )}
        onSwipeableWillOpen={() => {
          setReplyTo({ id: item.id, content: item.content });
          inputRef.current?.focus();
          // Fecha o swipe automaticamente após um pequeno delay
          setTimeout(() => {
            swipeableRefs.current.get(item.id)?.close();
          }, 100);
        }}
      >
        {MessageContent}
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 bg-slate-950"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View className="flex-1 px-4">
          <FlatList
            ref={flatListRef}
            data={reversedMessages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMessage}
            showsVerticalScrollIndicator={false}
            inverted
            contentContainerStyle={{ paddingVertical: 20 }}
          />

          <View className="pb-4">
            {replyTo && (
              <View className="bg-slate-900 p-3 rounded-t-2xl border-t border-l border-r border-slate-800 flex-row justify-between items-center">
                <View className="flex-1 border-l-4 border-indigo-500 pl-3">
                  <Text className="text-indigo-400 text-xs font-bold">Respondendo...</Text>
                  <Text className="text-slate-400 text-xs" numberOfLines={1}>{replyTo.content}</Text>
                </View>
                <TouchableOpacity onPress={() => setReplyTo(null)}>
                  <Text className="text-slate-500 font-bold px-2">X</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <View className={`flex-row items-center ${replyTo ? 'bg-slate-900 rounded-b-2xl border-b border-l border-r border-slate-800' : 'bg-slate-900 rounded-full border border-slate-800'} p-2`}>
              <TextInput
                ref={inputRef}
                className="flex-1 text-white px-4 py-2 max-h-32"
                placeholder="Diz algo..."
                placeholderTextColor="#64748b"
                value={text}
                onChangeText={setText}
                multiline
              />
              <TouchableOpacity 
                onPress={handleSend}
                disabled={!text.trim()}
                className={`ml-2 w-12 h-12 items-center justify-center rounded-full ${text.trim() ? 'bg-indigo-500' : 'bg-slate-800'}`}
              >
                <Text className="text-white font-bold text-xl">{'>'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}
