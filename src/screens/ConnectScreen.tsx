import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store/useAuthStore';

export function ConnectScreen() {
  const [targetId, setTargetId] = useState('');
  const user = useAuthStore((state) => state.user);
  const setPartnerId = useAuthStore((state) => state.setPartnerId);

  const connect = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({ partner_id: targetId })
      .eq('id', user.id);

    if (!error) {
      // Faz o vínculo reverso para ambos estarem conectados
      await supabase.from('profiles').update({ partner_id: user.id }).eq('id', targetId);
      setPartnerId(targetId);
    } else {
      alert("ID inválido ou erro de conexão.");
    }
  };

  return (
    <View className="flex-1 bg-slate-950 p-8 justify-center items-center">
      <View className="w-full max-w-md">
        <Text className="text-white text-3xl font-bold mb-4 text-center">Conectar com sua namorada</Text>
        <Text className="text-slate-400 mb-8 text-center text-lg leading-relaxed">
          Peça o ID dela e cole abaixo, ou envie o seu:{"\n"}
          <Text className="text-indigo-400 font-mono text-sm">{user?.id}</Text>
        </Text>
        
        <TextInput
          className="bg-slate-900 text-white p-5 rounded-2xl mb-4 border border-indigo-500/30 text-lg"
          placeholder="Cole o ID do parceiro aqui"
          placeholderTextColor="#64748b"
          value={targetId}
          onChangeText={setTargetId}
        />

        <TouchableOpacity 
          onPress={connect} 
          className="bg-indigo-600 p-5 rounded-2xl shadow-lg shadow-indigo-500/20"
        >
          <Text className="text-white text-center font-bold text-xl">Vincular Agora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}