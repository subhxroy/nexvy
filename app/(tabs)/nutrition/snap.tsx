import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useGeminiVision } from '../../../src/hooks/useGeminiVision';
import { useNutrition } from '../../../src/hooks/useNutrition';
import { Button } from '../../../src/components/ui/Button';
import { Card } from '../../../src/components/ui/Card';
import { MonoLabel } from '../../../src/components/ui/MonoLabel';

const NUTRITION_PRESETS = [
  {
    name: 'Avocado Toast with Egg',
    imageUri: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop',
  },
  {
    name: 'Grilled Salmon & Broccoli',
    imageUri: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&auto=format&fit=crop',
  },
  {
    name: 'Oatmeal Bowl with Berries',
    imageUri: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=500&auto=format&fit=crop',
  },
  {
    name: 'Double Cheeseburger & Fries',
    imageUri: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop',
  },
];

export default function SnapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { selectedMealType, addFoodItem } = useNutrition();
  const { isAnalyzing, error, result, analyze, reset } = useGeminiVision();
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.8,
    });

    if (!pickerResult.canceled && pickerResult.assets[0]?.base64) {
      setImageUri(pickerResult.assets[0].uri);
      await analyze(pickerResult.assets[0].base64);
    }
  }, [analyze]);

  const takePhoto = useCallback(async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    const cameraResult = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.8,
    });

    if (!cameraResult.canceled && cameraResult.assets[0]?.base64) {
      setImageUri(cameraResult.assets[0].uri);
      await analyze(cameraResult.assets[0].base64);
    }
  }, [analyze]);

  const handleSelectPreset = useCallback(async (preset: typeof NUTRITION_PRESETS[0]) => {
    setImageUri(preset.imageUri);
    // Use a tiny 1x1 transparent GIF base64 string as the placeholder image bytes for testing
    const testBase64 = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    await analyze(testBase64, preset.name);
  }, [analyze]);

  const handleAddResult = useCallback(async () => {
    if (!result) return;
    await addFoodItem(selectedMealType, {
      foodId: 'ai-' + Date.now(),
      name: result.name,
      brandName: '',
      servingGrams: result.servingGrams,
      calories: result.calories,
      macros: { protein: result.protein, carbs: result.carbs, fat: result.fat },
      source: 'photo_ai',
    });
    router.back();
  }, [result, selectedMealType, addFoodItem, router]);

  const handleReset = useCallback(() => {
    setImageUri(null);
    reset();
  }, [reset]);

  return (
    <View className="flex-1 bg-[#0b0b0b]">
      <View style={{ paddingTop: insets.top + 8 }} className="flex-row items-center justify-between px-4 pb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#b9b9b9" />
        </TouchableOpacity>
        <Text className="text-white text-heading-md font-medium">AI Meal Scanner</Text>
        <View style={{ width: 24 }} />
      </View>

      {!imageUri && (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 16, paddingBottom: insets.bottom + 16 }}>
          <View className="items-center mb-6">
            <View className="w-24 h-24 rounded-full bg-[#212121] items-center justify-center mb-4">
              <Ionicons name="camera" size={36} color="#797979" />
            </View>
            <Text className="text-white text-heading-md mb-1 text-center">Analyze meal photo</Text>
            <Text className="text-ash text-body-sm text-center px-4">
              Gemini AI will analyze your photo and estimate its macronutrient breakdown instantly.
            </Text>
          </View>

          <View className="space-y-3 w-full mb-8">
            <Button title="Take Photo" onPress={takePhoto} variant="primary" />
            <Button title="Choose from Library" onPress={pickImage} variant="secondary" />
          </View>

          <View className="w-full">
            <View className="flex-row items-center mb-3">
              <Ionicons name="sparkles" size={14} color="#f36458" className="mr-1" />
              <MonoLabel text="TEST PRESETS (NO CAMERA REQUIRED)" />
            </View>
            <View className="flex-row flex-wrap justify-between">
              {NUTRITION_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset.name}
                  onPress={() => handleSelectPreset(preset)}
                  activeOpacity={0.8}
                  className="w-[48%] bg-[#212121] rounded-card overflow-hidden mb-3 border border-[#353535]"
                >
                  <Image source={{ uri: preset.imageUri }} className="w-full h-24" />
                  <View className="p-2">
                    <Text className="text-white text-caption font-semibold" numberOfLines={2}>
                      {preset.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      {imageUri && (
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          <Image
            source={{ uri: imageUri }}
            className="w-full h-64 rounded-card mb-4 border border-[#212121]"
            resizeMode="cover"
          />

          {isAnalyzing && (
            <Card className="items-center py-6 border border-[#f36458]/30">
              <ActivityIndicator size="small" color="#f36458" className="mb-2" />
              <Text className="text-white text-body-sm">Gemini AI is analyzing your food...</Text>
            </Card>
          )}

          {error && (
            <Card className="border border-error">
              <Text className="text-error text-body-sm font-semibold mb-1">Analysis Failed</Text>
              <Text className="text-ash text-caption mb-3">{error}</Text>
              <Button title="Try Again" onPress={handleReset} variant="primary" />
            </Card>
          )}

          {result && (
            <Card className="border border-[#f36458]/20">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-white text-heading-md font-medium">{result.name}</Text>
                <View className="px-2 py-0.5 bg-[#f36458]/10 rounded border border-[#f36458]/30">
                  <Text className="text-[#f36458] text-caption-tight font-semibold uppercase">
                    {result.confidence} confidence
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-around mb-4 bg-[#0b0b0b]/40 py-4 rounded-xl border border-[#353535]/30">
                <View className="items-center">
                  <Text className="text-white text-heading-lg font-bold">{Math.round(result.calories)}</Text>
                  <Text className="text-mute text-caption-tight font-semibold">CALORIES</Text>
                </View>
                <View className="items-center">
                  <Text className="text-[#ff5c5c] text-heading-lg font-bold">{Math.round(result.protein)}g</Text>
                  <Text className="text-mute text-caption-tight font-semibold">PROTEIN</Text>
                </View>
                <View className="items-center">
                  <Text className="text-[#ffdf5c] text-heading-lg font-bold">{Math.round(result.carbs)}g</Text>
                  <Text className="text-mute text-caption-tight font-semibold">CARBS</Text>
                </View>
                <View className="items-center">
                  <Text className="text-[#5cff9d] text-heading-lg font-bold">{Math.round(result.fat)}g</Text>
                  <Text className="text-mute text-caption-tight font-semibold">FAT</Text>
                </View>
              </View>
              <Text className="text-mute text-caption text-center mb-4">
                Estimated Serving Size: ~{Math.round(result.servingGrams)}g
              </Text>
              <Button title="Add to Daily Log" onPress={handleAddResult} variant="brand" className="mb-2" />
              <Button title="Cancel & Reset" onPress={handleReset} variant="secondary" />
            </Card>
          )}
        </ScrollView>
      )}
    </View>
  );
}
