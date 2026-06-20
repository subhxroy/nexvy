import { View } from 'react-native';
import { MacroRing } from '../ui/MacroRing';
import { colors } from '../../constants/tokens';

interface MacroRowProps {
  protein: { current: number; target: number };
  carbs: { current: number; target: number };
  fat: { current: number; target: number };
}

export function MacroRow({ protein, carbs, fat }: MacroRowProps) {
  return (
    <View className="flex-row justify-around py-4">
      <MacroRing
        current={protein.current}
        target={protein.target}
        color={colors.brand}
        label="Protein"
        delay={0}
      />
      <MacroRing
        current={carbs.current}
        target={carbs.target}
        color={colors.linkBlue}
        label="Carbs"
        delay={100}
      />
      <MacroRing
        current={fat.current}
        target={fat.target}
        color={colors.success}
        label="Fat"
        delay={200}
      />
    </View>
  );
}
