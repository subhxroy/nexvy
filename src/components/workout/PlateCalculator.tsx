import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Line, G } from 'react-native-svg';

interface PlateConfig {
  weight: number;
  color: string;
  height: number;
  width: number;
}

const PLATES: PlateConfig[] = [
  { weight: 20, color: '#f36458', height: 72, width: 14 },
  { weight: 10, color: '#b9b9b9', height: 60, width: 12 },
  { weight: 5, color: '#797979', height: 48, width: 10 },
  { weight: 2.5, color: '#353535', height: 36, width: 8 },
];

interface PlateCalculatorProps {
  targetWeight: number;
  barWeight?: number;
}

export function PlateCalculator({ targetWeight, barWeight = 20 }: PlateCalculatorProps) {
  // Calculate plates per side
  const weightForPlates = Math.max(0, targetWeight - barWeight);
  const weightPerSide = weightForPlates / 2;

  let remaining = weightPerSide;
  const loadedPlates: PlateConfig[] = [];

  for (const plate of PLATES) {
    const count = Math.floor(remaining / plate.weight);
    for (let i = 0; i < count; i++) {
      loadedPlates.push(plate);
    }
    remaining = remaining % plate.weight;
  }

  // Draw SVG loaded barbell
  const svgWidth = 320;
  const svgHeight = 100;
  const centerY = svgHeight / 2;
  const barLength = 220;

  // Render plates. Stacking from inside (closest to collar) to outside.
  // Collar is at center. Left sleeve starts at center - collarOffset, right sleeve at center + collarOffset.
  const collarOffset = 45;
  const plateSpacing = 2;

  const renderSleevePlates = (side: 'left' | 'right') => {
    let currentX = side === 'left' ? svgWidth / 2 - collarOffset : svgWidth / 2 + collarOffset;
    
    return loadedPlates.map((plate, index) => {
      // For left side, plates stack leftward (subtract width). For right side, stack rightward (add).
      const x = side === 'left' ? currentX - plate.width : currentX;
      
      // Update X offset for next plate
      currentX = side === 'left' ? currentX - plate.width - plateSpacing : currentX + plate.width + plateSpacing;

      return (
        <Rect
          key={`${side}-${index}`}
          x={x}
          y={centerY - plate.height / 2}
          width={plate.width}
          height={plate.height}
          fill={plate.color}
          rx={2}
          ry={2}
        />
      );
    });
  };

  return (
    <View className="items-center bg-[#212121] rounded-card p-4 border border-[#353535]">
      {/* SVG Barbell */}
      <View style={{ width: svgWidth, height: svgHeight }} className="items-center justify-center">
        <Svg width={svgWidth} height={svgHeight}>
          {/* Main Barbell Shaft */}
          <Line
            x1={svgWidth / 2 - barLength / 2}
            y1={centerY}
            x2={svgWidth / 2 + barLength / 2}
            y2={centerY}
            stroke="#b9b9b9"
            strokeWidth="8"
          />

          {/* Left Sleeve Stop (Collar) */}
          <Rect
            x={svgWidth / 2 - collarOffset - 4}
            y={centerY - 16}
            width={8}
            height={32}
            fill="#797979"
            rx={1}
          />
          {/* Right Sleeve Stop (Collar) */}
          <Rect
            x={svgWidth / 2 + collarOffset - 4}
            y={centerY - 16}
            width={8}
            height={32}
            fill="#797979"
            rx={1}
          />

          {/* Loaded Plates */}
          <G>{renderSleevePlates('left')}</G>
          <G>{renderSleevePlates('right')}</G>
        </Svg>
      </View>

      <Text className="text-white text-body-sm font-medium mt-2">
        Target: {targetWeight} kg
      </Text>
      <Text className="text-mute text-caption mt-1">
        Standard bar: {barWeight}kg · Plates per side:
      </Text>

      {/* Plates breakdown */}
      <View className="flex-row flex-wrap justify-center mt-3 gap-2">
        {loadedPlates.length > 0 ? (
          // Group by plate weight
          Array.from(new Set(loadedPlates.map((p) => p.weight))).map((w) => {
            const count = loadedPlates.filter((p) => p.weight === w).length;
            const plateColor = PLATES.find((p) => p.weight === w)?.color ?? '#797979';
            return (
              <View
                key={w}
                style={{ borderColor: '#353535' }}
                className="flex-row items-center bg-[#0b0b0b] px-3 py-1 rounded-full border"
              >
                <View style={{ backgroundColor: plateColor }} className="w-2.5 h-2.5 rounded-full mr-2" />
                <Text className="text-ash text-caption font-medium">
                  {w}kg x {count}
                </Text>
              </View>
            );
          })
        ) : (
          <Text className="text-mute text-caption italic">No plates needed (bar weight only)</Text>
        )}
      </View>
    </View>
  );
}
