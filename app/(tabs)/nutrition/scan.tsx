import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { lookupBarcode } from '../../../src/services/openfoodfacts';
import { useNutrition } from '../../../src/hooks/useNutrition';

export default function BarcodeScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const { selectedMealType, addFoodItem } = useNutrition();
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBarCodeScanned = useCallback(
    async ({ data }: { data: string }) => {
      if (scanned) return;
      setScanned(true);

      try {
        const food = await lookupBarcode(data);
        addFoodItem(selectedMealType, food);
        router.back();
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Product not found';
        setError(msg);
        setTimeout(() => {
          setScanned(false);
          setError(null);
        }, 3000);
      }
    },
    [scanned, selectedMealType, addFoodItem, router]
  );

  if (!permission) {
    return (
      <View className="flex-1 bg-[#0b0b0b] items-center justify-center">
        <Text className="text-ash text-body-sm">Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-[#0b0b0b] items-center justify-center px-8">
        <Ionicons name="camera-outline" size={48} color="#797979" />
        <Text className="text-white text-heading-md mt-4 mb-2">Camera Required</Text>
        <Text className="text-ash text-body-sm text-center mb-6">
          We need camera access to scan barcodes
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-[#f36458] h-[52px] rounded-full items-center justify-center px-8"
        >
          <Text className="text-[#0b0b0b] text-button font-medium">Grant Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <CameraView
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'] }}
        className="flex-1"
      >
        <View
          style={{ paddingTop: insets.top + 8 }}
          className="flex-row items-center justify-between px-4 pb-4"
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-heading-md font-medium">Scan Barcode</Text>
          <View style={{ width: 24 }} />
        </View>

        <View className="flex-1 items-center justify-center">
          <View className="w-64 h-64 border-2 border-white/60 rounded-lg" />
          <Text className="text-white text-body-sm mt-4">
            Point camera at a barcode
          </Text>
        </View>

        {error && (
          <View className="absolute bottom-24 left-4 right-4 bg-[#dd0000] rounded-xl py-3 px-4">
            <Text className="text-white text-body-sm text-center">{error}</Text>
          </View>
        )}
      </CameraView>
    </View>
  );
}
