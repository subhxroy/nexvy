import { View, Text, ScrollView } from 'react-native';
import { Card } from '../ui/Card';
import { MonoLabel } from '../ui/MonoLabel';
import { ScalePressable } from '../ui/ScalePressable';

interface QuickStartCardProps {
  templates: { name: string; exerciseCount: number }[];
  onSelect: (name: string) => void;
}

export function QuickStartCard({ templates, onSelect }: QuickStartCardProps) {
  return (
    <Card>
      <MonoLabel text="QUICK START" className="mb-3" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row space-x-3 pr-2">
          {templates.map((template) => (
            <ScalePressable
              key={template.name}
              onPress={() => onSelect(template.name)}
              className="bg-[#212121] border border-[#353535] rounded-xl p-4 min-w-[140px]"
            >
              <Text className="text-white text-body-sm font-semibold">{template.name}</Text>
              <Text className="text-mute text-caption mt-1">
                {template.exerciseCount} exercises
              </Text>
            </ScalePressable>
          ))}
          <ScalePressable
            onPress={() => onSelect('custom')}
            className="border border-dashed border-[#353535] rounded-xl p-4 min-w-[140px] items-center justify-center"
          >
            <Text className="text-mute text-caption font-medium">Empty Workout</Text>
          </ScalePressable>
        </View>
      </ScrollView>
    </Card>
  );
}

