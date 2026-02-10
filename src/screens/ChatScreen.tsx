import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useChat } from '../hooks/useChat';
import { useAuthStore } from '../store/useAuthStore';

export function ChatScreen() {
  const [text, setText] = useState('');
  const { messages, sendMessage } = useChat();
  const { user } = useAuthStore();

  const handleSend = async () => {
    if (text.trim()) {
      try {
        const messageText = text.trim();
        setText(''); // Limpa o input imediatamente para melhor UX
        await sendMessage(messageText);
      } catch (error: any) {
        alert(error.message || 'Erro ao enviar mensagem. Verifique sua conexão.');
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-950"
      keyboardVerticalOffset={100}
    >
      <View className="flex-1 p-4">
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isMine = item.sender_id === user?.id;
            return (
              <View 
                className={`mb-3 p-3 rounded-2xl max-w-[80%] ${
                  isMine ? 'bg-indigo-600 self-end' : 'bg-slate-800 self-start'
                }`}
              >
                <Text className="text-white text-base">{item.content}</Text>
                <Text className="text-slate-400 text-[10px] mt-1 self-end">
                  {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        <View className="flex-row items-center mt-4">
          <TextInput
            className="flex-1 bg-slate-900 text-white p-4 rounded-full border border-slate-800"
            placeholder="Diz algo para ela..."
            placeholderTextColor="#64748b"
            value={text}
            onChangeText={setText}
            multiline={false}
          />
          <TouchableOpacity 
            onPress={handleSend}
            className="ml-3 bg-indigo-500 p-4 rounded-full w-14 h-14 items-center justify-center"
          >
            <Text className="text-white font-bold text-xl">{'>'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
