import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store/useAuthStore';

export function UploadModal({ visible, onClose, onUploadSuccess }: { visible: boolean; onClose: () => void; onUploadSuccess: () => void }) {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!description && !image) return;
    
    // Pega o ID do usuário direto da sessão atual do Supabase para ser infalível
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id || user?.id;

    if (!currentUserId) {
      alert("Erro: Usuário não identificado. Tente fazer logout e login novamente.");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = null;

      if (image) {
        const fileExt = image.split('.').pop();
        const fileName = `${currentUserId}-${Math.random()}.${fileExt}`;
        const filePath = `${currentUserId}/${fileName}`;

        const formData = new FormData();
        formData.append('file', {
          uri: image,
          name: fileName,
          type: `image/${fileExt}`,
        } as any);

        const { error: uploadError } = await supabase.storage
          .from('moments')
          .upload(filePath, formData);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('moments')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      const { error } = await supabase.from('moments').insert([
        {
          description,
          image_url: imageUrl,
          user_id: currentUserId,
        },
      ]);

      if (error) throw error;
      
      setDescription('');
      setImage(null);
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
          
          <TouchableOpacity 
            onPress={pickImage}
            className="w-full h-48 bg-slate-800 rounded-2xl mb-4 items-center justify-center overflow-hidden border border-slate-700 border-dashed"
          >
            {image ? (
              <Image source={{ uri: image }} className="w-full h-full" />
            ) : (
              <View className="items-center">
                <Text className="text-indigo-400 font-bold text-lg">+ Adicionar Foto</Text>
                <Text className="text-slate-500 text-xs mt-1">Clique para selecionar</Text>
              </View>
            )}
          </TouchableOpacity>

          <TextInput
            className="bg-slate-800 text-white p-4 rounded-2xl mb-4"
            placeholder="Escreva uma legenda..."
            placeholderTextColor="#94a3b8"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <View className="flex-row gap-4">
            <TouchableOpacity 
              onPress={() => {
                setImage(null);
                setDescription('');
                onClose();
              }}
              disabled={loading}
              className="flex-1 p-4 rounded-2xl bg-slate-800 items-center"
            >
              <Text className="text-white font-semibold">Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleUpload}
              disabled={loading || (!image && !description)}
              className="flex-1 p-4 rounded-2xl bg-indigo-600 items-center justify-center flex-row"
            >
              {loading && <ActivityIndicator size="small" color="white" className="mr-2" />}
              <Text className="text-white font-semibold">
                {loading ? 'Postando...' : 'Compartilhar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
