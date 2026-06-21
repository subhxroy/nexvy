import { useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNutrition } from '../../../src/hooks/useNutrition';
import { useGeminiText } from '../../../src/hooks/useGeminiText';
import { FoodRow } from '../../../src/components/nutrition/FoodRow';
import { Button } from '../../../src/components/ui/Button';
import { Divider } from '../../../src/components/ui/Divider';
import { MonoLabel } from '../../../src/components/ui/MonoLabel';
import { Card } from '../../../src/components/ui/Card';

const DEMO_FOODS = [
  { id: '1', name: 'Chicken Breast', brandName: '', calories: 165, protein: 31, carbs: 0, fat: 3.6, servingGrams: 100 },
  { id: '2', name: 'White Rice (cooked)', brandName: '', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, servingGrams: 100 },
  { id: '3', name: 'Broccoli', brandName: '', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, servingGrams: 100 },
  { id: '4', name: 'Egg (whole)', brandName: '', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, servingGrams: 50 },
  { id: '5', name: 'Oatmeal', brandName: 'Quaker', calories: 154, protein: 5.4, carbs: 27, fat: 2.6, servingGrams: 100 },
  { id: '6', name: 'Greek Yogurt', brandName: 'Fage', calories: 59, protein: 10, carbs: 3.6, fat: 0.7, servingGrams: 100 },
  { id: '7', name: 'Banana', brandName: '', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, servingGrams: 100 },
  { id: '8', name: 'Whey Protein', brandName: 'Optimum Nutrition', calories: 120, protein: 24, carbs: 3, fat: 1.5, servingGrams: 30 },
];

const DESCRIBE_PRESETS = [
  "3 scrambled eggs, 2 slices of sourdough toast, and black coffee",
  "Double scoop whey protein shake with banana and oat milk",
  "200g grilled chicken breast, 150g brown rice, and steamed broccoli",
  "A slice of pepperoni pizza and a can of cola"
];

export default function FoodLogScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { selectedMealType, addFoodItem } = useNutrition();
  const { isParsing, error, result, parse, reset } = useGeminiText();

  const [activeTab, setActiveTab] = useState<'search' | 'ai'>('search');
  const [query, setQuery] = useState('');
  const [description, setDescription] = useState('');

  const filteredFoods = query
    ? DEMO_FOODS.filter(
        (f) =>
          f.name.toLowerCase().includes(query.toLowerCase()) ||
          f.brandName.toLowerCase().includes(query.toLowerCase())
      )
    : DEMO_FOODS;

  const handleAddFood = useCallback(async (food: typeof DEMO_FOODS[0]) => {
    await addFoodItem(selectedMealType, {
      foodId: food.id,
      name: food.name,
      brandName: food.brandName,
      servingGrams: food.servingGrams,
      calories: food.calories,
      macros: { protein: food.protein, carbs: food.carbs, fat: food.fat },
      source: 'manual',
    });
    router.back();
  }, [selectedMealType, addFoodItem, router]);

  const handleAIAnalyze = useCallback(async () => {
    if (!description.trim()) return;
    await parse(description);
  }, [description, parse]);

  const handlePresetSelect = useCallback(async (preset: string) => {
    setDescription(preset);
    await parse(preset);
  }, [parse]);

  const handleAddAIResult = useCallback(() => {
    if (!result) return;
    addFoodItem(selectedMealType, {
      foodId: 'ai-text-' + Date.now(),
      name: result.name,
      brandName: 'AI Estimate',
      servingGrams: result.servingGrams,
      calories: result.calories,
      macros: { protein: result.protein, carbs: result.carbs, fat: result.fat },
      source: 'text_ai',
    });
    router.back();
  }, [result, selectedMealType, addFoodItem, router]);

  const handleResetAI = useCallback(() => {
    setDescription('');
    reset();
  }, [reset]);

  return (
    <View className="flex-1 bg-[#0b0b0b]">
      {/* Header & Tabs */}
      <View style={{ paddingTop: insets.top + 8 }} className="px-4 pb-3">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
            <Ionicons name="chevron-back" size={24} color="white" />
            <Text className="text-white text-heading-md font-medium ml-1">Log Food</Text>
          </TouchableOpacity>
          <Text className="text-mute text-caption capitalize font-semibold">{selectedMealType}</Text>
        </View>

        {/* Custom Tab Selector */}
        <View className="flex-row bg-[#212121] rounded-xl p-1 mb-1">
          <TouchableOpacity
            onPress={() => setActiveTab('search')}
            className={`flex-1 py-2 rounded-lg items-center ${
              activeTab === 'search' ? 'bg-[#353535]' : ''
            }`}
          >
            <Text className={`text-caption font-semibold ${
              activeTab === 'search' ? 'text-white' : 'text-mute'
            }`}>
              Search Database
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('ai')}
            className={`flex-1 py-2 rounded-lg items-center ${
              activeTab === 'ai' ? 'bg-[#353535]' : ''
            }`}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="sparkles"
                size={12}
                color={activeTab === 'ai' ? '#f36458' : '#797979'}
                className="mr-1"
              />
              <Text className={`text-caption font-semibold ${
                activeTab === 'ai' ? 'text-white' : 'text-mute'
              }`}>
                Gemini AI Describe
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Contents */}
      {activeTab === 'search' ? (
        <View className="flex-1">
          <View className="px-4 pb-3">
            <View className="flex-row items-center bg-[#212121] rounded-xl h-11 px-4">
              <Ionicons name="search" size={16} color="#797979" />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search food..."
                placeholderTextColor="#797979"
                className="flex-1 text-ash text-body-sm ml-2"
              />
            </View>
          </View>

          <FlatList
            data={filteredFoods}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <FoodRow
                name={item.name}
                brandName={item.brandName}
                calories={item.calories}
                protein={item.protein}
                carbs={item.carbs}
                fat={item.fat}
                servingGrams={item.servingGrams}
                onPress={() => handleAddFood(item)}
              />
            )}
            ListHeaderComponent={
              <MonoLabel text="COMMON FOODS" className="mb-2 mt-2" />
            }
          />
        </View>
      ) : (
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {!result && !isParsing && (
            <View className="space-y-4">
              <Text className="text-ash text-body-sm">
                Describe what you ate in natural language. Gemini AI will estimate the ingredients and macronutrients.
              </Text>

              <View className="bg-[#212121] rounded-xl p-4 border border-[#353535]">
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="e.g. 2 scrambled eggs, a cup of oatmeal with honey, and a glass of orange juice"
                  placeholderTextColor="#797979"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="text-white text-body-sm h-28"
                />
              </View>

              <Button
                title="Analyze description"
                onPress={handleAIAnalyze}
                variant="brand"
                disabled={!description.trim()}
              />

              {/* Quick Testing Presets */}
              <View className="pt-4">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="sparkles" size={14} color="#f36458" className="mr-1" />
                  <MonoLabel text="TEST PRESETS (TAP TO INSTANT DESCRIBE)" />
                </View>
                <View className="space-y-2">
                  {DESCRIBE_PRESETS.map((preset) => (
                    <TouchableOpacity
                      key={preset}
                      onPress={() => handlePresetSelect(preset)}
                      activeOpacity={0.7}
                      className="bg-[#212121] border border-[#353535] rounded-xl p-3"
                    >
                      <Text className="text-white text-caption font-semibold">{preset}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {isParsing && (
            <Card className="items-center py-8 border border-[#f36458]/30">
              <ActivityIndicator size="small" color="#f36458" className="mb-2" />
              <Text className="text-white text-body-sm">Gemini AI is parsing description...</Text>
            </Card>
          )}

          {error && (
            <Card className="border border-error">
              <Text className="text-error text-body-sm font-semibold mb-1">Analysis Failed</Text>
              <Text className="text-ash text-caption mb-3">{error}</Text>
              <Button title="Try Again" onPress={handleResetAI} variant="primary" />
            </Card>
          )}

          {result && !isParsing && (
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
              <Button title="Add to Daily Log" onPress={handleAddAIResult} variant="brand" className="mb-2" />
              <Button title="Cancel & Reset" onPress={handleResetAI} variant="secondary" />
            </Card>
          )}
        </ScrollView>
      )}
    </View>
  );
}
