import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScalePressable } from '../ui/ScalePressable';

interface ScanActionPillsProps {
  onBarcode: () => void;
  onPhoto: () => void;
  onText: () => void;
}

export function ScanActionPills({ onBarcode, onPhoto, onText }: ScanActionPillsProps) {
  return (
    <View className="flex-row justify-center space-x-6 mb-6">
      <ScalePressable
        onPress={onBarcode}
        className="items-center"
      >
        <View className="w-14 h-14 rounded-full bg-[#212121] border border-[#353535] items-center justify-center mb-1">
          <Ionicons name="barcode-outline" size={24} color="#b9b9b9" />
        </View>
        <Text className="text-mute text-caption">Scan</Text>
      </ScalePressable>

      <ScalePressable
        onPress={onPhoto}
        className="items-center"
      >
        <View className="w-14 h-14 rounded-full bg-[#212121] border border-[#353535] items-center justify-center mb-1">
          <Ionicons name="camera-outline" size={24} color="#b9b9b9" />
        </View>
        <Text className="text-mute text-caption">Photo</Text>
      </ScalePressable>

      <ScalePressable
        onPress={onText}
        className="items-center"
      >
        <View className="w-14 h-14 rounded-full bg-[#212121] border border-[#353535] items-center justify-center mb-1">
          <Ionicons name="create-outline" size={24} color="#b9b9b9" />
        </View>
        <Text className="text-mute text-caption">Describe</Text>
      </ScalePressable>
    </View>
  );
}

