import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn(email);
      alert('Verifique seu e-mail para o link de acesso!');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center px-6 bg-slate-950">
      <View className="w-full max-w-md">
        <Text className="text-white text-5xl font-bold mb-2 text-center">OurSpace</Text>
        <Text className="text-slate-400 mb-10 text-center text-lg">O refúgio digital de vocês dois.</Text>
        
        <TextInput
          className="bg-slate-900 text-white p-5 rounded-2xl mb-4 border border-slate-800 text-lg"
          placeholder="Seu e-mail"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity 
          onPress={handleLogin}
          disabled={loading}
          className="bg-indigo-600 p-5 rounded-2xl items-center shadow-lg shadow-indigo-500/20"
        >
          <Text className="text-white font-bold text-xl">
            {loading ? 'Enviando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}