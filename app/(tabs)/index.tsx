import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, Modal, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MoodSelector } from '../../src/components/MoodSelector';
import { UploadModal } from '../../src/components/UploadModal';
import { useAuth } from '../../src/hooks/useAuth';
import { useMoments } from '../../src/hooks/useMoments';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function HomeScreen() {
  const { moments, isLoading, refetch } = useMoments();
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { signOut } = useAuth();
  const user = useAuthStore((state) => state.user);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <View className="flex-1 bg-slate-950 pt-12 px-4">
      <View className="mb-6 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Text className="text-white text-3xl font-bold mr-4">OurSpace</Text>
          <TouchableOpacity 
            onPress={signOut}
            className="bg-slate-900 p-2 rounded-xl border border-slate-800"
          >
            <Ionicons name="log-out-outline" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          className="bg-indigo-600 p-2 rounded-full"
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <MoodSelector />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6366f1"
            colors={["#6366f1"]}
          />
        }
      >
        {isLoading && !refreshing ? (
          <ActivityIndicator color="#6366f1" size="large" className="mt-10" />
        ) : moments.length === 0 ? (
          <View className="items-center mt-10">
            <Text className="text-slate-500 text-lg">Nenhum momento compartilhado ainda.</Text>
            <Text className="text-slate-600 text-sm mt-2">Clique no "+" para adicionar!</Text>
          </View>
        ) : (
          moments.map((moment) => (
            <View key={moment.id} className="bg-slate-900 rounded-3xl mb-6 overflow-hidden border border-slate-800">
              {moment.image_url && (
                <TouchableOpacity 
                  activeOpacity={0.9} 
                  onPress={() => setSelectedImage(moment.image_url)}
                >
                  <Image 
                    source={{ uri: moment.image_url }} 
                    className="w-full h-64 bg-slate-800"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
              <View className="p-5">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-indigo-400 font-bold text-sm">
                    {moment.user_id === user?.id ? 'Você' : 'Parceiro(a)'}
                  </Text>
                  <Text className="text-slate-600 text-xs">
                    {new Date(moment.created_at).toLocaleDateString()}
                  </Text>
                </View>
                {moment.description ? (
                  <Text className="text-white text-base leading-6">{moment.description}</Text>
                ) : null}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal para Ver Foto Completa */}
      <Modal
        visible={!!selectedImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View className="flex-1 bg-black/95 justify-center items-center">
          <TouchableOpacity 
            style={{ position: 'absolute', top: 50, right: 20, zIndex: 10 }}
            onPress={() => setSelectedImage(null)}
          >
            <Ionicons name="close-circle" size={40} color="white" />
          </TouchableOpacity>
          
          {selectedImage && (
            <Image 
              source={{ uri: selectedImage }}
              style={{ width: '100%', height: '80%' }}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      <UploadModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        onUploadSuccess={refetch}
      />
    </View>
  );
}
