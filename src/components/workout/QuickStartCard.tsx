import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from '../ui/Card';
import { MonoLabel } from '../ui/MonoLabel';

interface QuickStartCardProps {
  templates: Array<{ name: string; exerciseCount: number }>;
  onSelect: (name: string) => void;
}

export function QuickStartCard({ templates, onSelect }: QuickStartCardProps) {
  return (
    <Card>
      <MonoLabel text="QUICK START" className="mb-3" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row space-x-3">
          {templates.map((template) => (
            <TouchableOpacity
              key={template.name}
              onPress={() => onSelect(template.name)}
              className="bg-[#353535] rounded-card p-4 min-w-[140]"
            >
              <Text className="text-white text-body-sm font-medium">{template.name}</Text>
              <Text className="text-mute text-caption mt-1">
                {template.exerciseCount} exercises
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => onSelect('custom')}
            className="border border-dashed border-[#353535] rounded-card p-4 min-w-[140] items-center justify-center"
          >
            <Text className="text-mute text-caption">Empty Workout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Card>
  );
}
