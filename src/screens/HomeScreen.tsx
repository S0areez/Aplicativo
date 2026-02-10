import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MoodSelector } from '../components/MoodSelector';
import { UploadModal } from '../components/UploadModal';
import { useMoments } from '../hooks/useMoments';

export function HomeScreen() {
  const { moments, isLoading, refetch } = useMoments();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View className="flex-1 bg-slate-950 pt-12 px-4">
      <View className="mb-6 flex-row justify-between items-center">
        <Text className="text-white text-3xl font-bold">OurSpace</Text>
        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          className="bg-indigo-600 p-2 rounded-full"
        >
          <Text className="text-white font-bold px-2">+</Text>
        </TouchableOpacity>
      </View>

      <MoodSelector />

      <ScrollView showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator color="#6366f1" size="large" className="mt-10" />
        ) : (
          moments.map((moment) => (
            <View key={moment.id} className="bg-slate-900 p-4 rounded-3xl mb-4 border border-slate-800">
              <Text className="text-white text-lg">{moment.description}</Text>
              <Text className="text-slate-500 text-sm mt-2">
                {new Date(moment.created_at).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <UploadModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        onUploadSuccess={refetch}
      />
    </View>
  );
}
