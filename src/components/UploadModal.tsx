import React, { useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store/useAuthStore';

export function UploadModal({ visible, onClose, onUploadSuccess }: { visible: boolean; onClose: () => void; onUploadSuccess: () => void }) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  const handleUpload = async () => {
    if (!description) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from('moments').insert([
        {
          description,
          user_id: user?.id,
          created_at: new Date(),
        },
      ]);

      if (error) throw error;
      
      setDescription('');
      onUploadSuccess();
      onClose();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-slate-900 p-6 rounded-t-3xl">
          <Text className="text-white text-xl font-bold mb-4">Novo Momento</Text>
          
          <TextInput
            className="bg-slate-800 text-white p-4 rounded-2xl mb-4"
            placeholder="O que está acontecendo?"
            placeholderTextColor="#94a3b8"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <View className="flex-row gap-4">
            <TouchableOpacity 
              onPress={onClose}
              className="flex-1 p-4 rounded-2xl bg-slate-800 items-center"
            >
              <Text className="text-white font-semibold">Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleUpload}
              disabled={loading}
              className="flex-1 p-4 rounded-2xl bg-indigo-600 items-center"
            >
              <Text className="text-white font-semibold">
                {loading ? 'Enviando...' : 'Postar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
