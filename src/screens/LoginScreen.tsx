import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleAuth = async () => {
    if (!email || !password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        await signUp(email, password);
        alert('Conta criada com sucesso! Verifique seu e-mail se necessário ou tente logar.');
        setIsRegistering(false);
      } else {
        await signIn(email, password);
      }
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
        <Text className="text-slate-400 mb-10 text-center text-lg">
          {isRegistering ? 'Crie uma conta para o casal.' : 'O refúgio digital de vocês dois.'}
        </Text>
        
        <TextInput
          className="bg-slate-900 text-white p-5 rounded-2xl mb-4 border border-slate-800 text-lg"
          placeholder="E-mail"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          className="bg-slate-900 text-white p-5 rounded-2xl mb-6 border border-slate-800 text-lg"
          placeholder="Senha"
          placeholderTextColor="#94a3b8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          onPress={handleAuth}
          disabled={loading}
          className="bg-indigo-600 p-5 rounded-2xl items-center shadow-lg shadow-indigo-500/20 mb-6"
        >
          <Text className="text-white font-bold text-xl">
            {loading ? 'Aguarde...' : isRegistering ? 'Cadastrar' : 'Entrar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setIsRegistering(!isRegistering)}
          className="items-center"
        >
          <Text className="text-indigo-400 text-base">
            {isRegistering ? 'Já tem uma conta? Entre aqui' : 'Não tem conta? Cadastre-se agora'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}