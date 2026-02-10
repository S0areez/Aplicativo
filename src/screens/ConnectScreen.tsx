import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Clipboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store/useAuthStore';

export function ConnectScreen() {
  const [targetId, setTargetId] = useState('');
  const [nickname, setNickname] = useState('');
  const user = useAuthStore((state) => state.user);
  const history = useAuthStore((state) => state.history);
  const setPartnerId = useAuthStore((state) => state.setPartnerId);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);
  const addToHistory = useAuthStore((state) => state.addToHistory);
  const removeFromHistory = useAuthStore((state) => state.removeFromHistory);

  const copyToClipboard = () => {
    if (user?.id) {
      Clipboard.setString(user.id);
      Alert.alert('Copiado!', 'Seu ID foi copiado para a área de transferência.');
    }
  };

  const connect = async (idToConnect?: string, nameToSave?: string) => {
    const finalId = idToConnect || targetId.trim();
    const finalName = nameToSave || nickname.trim() || 'Namorada';

    if (!finalId) {
      Alert.alert('Atenção', 'Por favor, insira o ID da sua namorada.');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ partner_id: finalId })
      .eq('id', user.id);

    if (!error) {
      // Faz o vínculo reverso para ambos estarem conectados
      const { error: reverseError } = await supabase
        .from('profiles')
        .update({ partner_id: user.id })
        .eq('id', finalId);
      
      if (reverseError) {
        console.warn("Não foi possível atualizar o perfil do parceiro automaticamente.", reverseError.message);
      }

      // Salva no histórico local
      addToHistory(finalId, finalName);

      setIsLoading(true);
      setPartnerId(finalId);
      setTimeout(() => setIsLoading(false), 500);
    } else {
      Alert.alert("Erro", "ID inválido ou erro de conexão.");
    }
  };

  return (
    <View className="flex-1 bg-slate-950 p-6 pt-12">
      <View className="w-full max-w-md self-center">
        <Text className="text-white text-3xl font-bold mb-2 text-center">Conectar Casal</Text>
        <Text className="text-slate-400 mb-6 text-center text-base">
          Peça o ID dela e cole abaixo, ou envie o seu:
        </Text>

        <TouchableOpacity 
          onPress={copyToClipboard}
          className="bg-slate-900 p-4 rounded-2xl border border-indigo-500/30 mb-8 flex-row items-center justify-between"
        >
          <View className="flex-1 mr-2">
            <Text className="text-slate-500 text-[10px] uppercase font-bold mb-1">Seu ID (Toque para copiar)</Text>
            <Text className="text-indigo-400 font-mono text-xs" numberOfLines={1}>{user?.id}</Text>
          </View>
          <Ionicons name="copy-outline" size={20} color="#818cf8" />
        </TouchableOpacity>
        
        <View className="mb-6">
          <Text className="text-white font-bold mb-3 text-lg">Nova Conexão</Text>
          <TextInput
            className="bg-slate-900 text-white p-4 rounded-2xl mb-3 border border-slate-800 text-base"
            placeholder="Nome (Ex: Meu Amor)"
            placeholderTextColor="#64748b"
            value={nickname}
            onChangeText={setNickname}
          />
          <TextInput
            className="bg-slate-900 text-white p-4 rounded-2xl mb-4 border border-slate-800 text-base font-mono"
            placeholder="Cole o ID dela aqui"
            placeholderTextColor="#64748b"
            value={targetId}
            onChangeText={setTargetId}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity 
            onPress={() => connect()} 
            className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-500/20"
          >
            <Text className="text-white text-center font-bold text-lg">Vincular Agora</Text>
          </TouchableOpacity>
        </View>

        {history.length > 0 && (
          <View>
            <Text className="text-white font-bold mb-3 text-lg">Histórico de Conexões</Text>
            {history.map((item) => (
              <View key={item.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 mb-3 flex-row items-center justify-between">
                <TouchableOpacity 
                  onPress={() => connect(item.id, item.name)}
                  className="flex-1"
                >
                  <Text className="text-white font-bold text-base">{item.name}</Text>
                  <Text className="text-slate-500 text-xs font-mono" numberOfLines={1}>{item.id}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => removeFromHistory(item.id)}
                  className="ml-4 p-2"
                >
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}