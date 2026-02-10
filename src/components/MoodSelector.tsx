import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store/useAuthStore';

const moods = ['😊', '😴', '❤️', '🤯', '🍕', '🏃‍♂️'];

export function MoodSelector() { const user = useAuthStore((state) => state.user);

const updateMood = async (mood: string) => { await supabase .from('profiles') .update({ mood, last_seen: new Date() }) .eq('id', user?.id); };

return ( <View className="flex-row justify-around bg-slate-900 p-4 rounded-3xl mb-6 border border-slate-800"> {moods.map((m) => ( <TouchableOpacity key={m} onPress={() => updateMood(m)} className="p-2 bg-slate-800 rounded-full" > <Text className="text-2xl">{m}</Text> </TouchableOpacity> ))} </View> ); }