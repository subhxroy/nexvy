import { useState, useMemo, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { exercises, searchExercises, ExerciseDefinition, muscleGroups } from '../../../src/constants/exercises';
import { muscleGroupColors, muscleGroupLabels } from '../../../src/constants/muscleGroups';
import { ExerciseRow } from '../../../src/components/workout/ExerciseRow';
import { MonoLabel } from '../../../src/components/ui/MonoLabel';
import { useWorkoutStore } from '../../../src/stores/useWorkoutStore';

export default function ExercisePickerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const addExercise = useWorkoutStore((s) => s.addExercise);
  const [query, setQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const filteredExercises = useMemo(() => {
    let results = query ? searchExercises(query) : exercises;
    if (selectedGroup) {
      results = results.filter((e) => e.muscleGroup === selectedGroup);
    }
    return results;
  }, [query, selectedGroup]);

  const handleSelect = useCallback(
    (exercise: ExerciseDefinition) => {
      addExercise({
        exerciseId: exercise.id,
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
      });
      router.back();
    },
    [addExercise, router]
  );

  return (
    <View className="flex-1 bg-[#0b0b0b]">
      <View style={{ paddingTop: insets.top + 8 }} className="px-4 pb-3">
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#b9b9b9" />
          </TouchableOpacity>
          <Text className="text-white text-heading-md font-medium">Exercise Picker</Text>
          <View style={{ width: 24 }} />
        </View>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search exercises..."
          placeholderTextColor="#797979"
          className="bg-[#212121] text-ash text-body-sm h-11 rounded-xl px-4"
        />
      </View>

      <FlatList
        horizontal
        data={muscleGroups}
        showsHorizontalScrollIndicator={false}
        className="max-h-12 mb-2"
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item: group }) => {
          const isSelected = selectedGroup === group;
          const color = muscleGroupColors[group] ?? '#797979';
          return (
            <TouchableOpacity
              key={group}
              onPress={() => setSelectedGroup(isSelected ? null : group)}
              className={`px-3 py-1.5 rounded-full mr-2 ${isSelected ? '' : 'bg-[#212121]'}`}
              style={isSelected ? { backgroundColor: color + '30' } : {}}
            >
              <Text
                style={isSelected ? { color } : {}}
                className={`text-caption-tight ${isSelected ? '' : 'text-ash'}`}
              >
                {muscleGroupLabels[group] ?? group}
              </Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(g) => g}
      />

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <ExerciseRow
            name={item.name}
            muscleGroup={item.muscleGroup}
            onPress={() => handleSelect(item)}
          />
        )}
        ListEmptyComponent={
          <View className="py-12 items-center">
            <Text className="text-mute text-caption">No exercises found</Text>
          </View>
        }
      />
    </View>
  );
}
