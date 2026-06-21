import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, NativeSyntheticEvent, NativeScrollEvent, StyleSheet, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';

interface ScrollWheelPickerProps {
  values: number[];
  selectedValue: number;
  onValueChange: (value: number) => void;
  formatValue?: (value: number) => string;
  itemHeight?: number;
  visibleItems?: number;
}

export function ScrollWheelPicker({
  values,
  selectedValue,
  onValueChange,
  formatValue = (v) => String(v),
  itemHeight = 44,
  visibleItems = 5,
}: ScrollWheelPickerProps) {
  const flatListRef = useRef<FlatList<number>>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isInitialMount = useRef(true);

  const containerHeight = itemHeight * visibleItems;
  const listOffset = Math.floor(visibleItems / 2);

  // We pad the values list with empty entries at start/end so that
  // the first and last real values can align perfectly to the center
  const paddedValues = React.useMemo(() => {
    const pad = Array(listOffset).fill(null);
    return [...pad, ...values, ...pad];
  }, [values, listOffset]);

  const syncToSelected = useCallback(() => {
    const realIndex = values.indexOf(selectedValue);
    if (realIndex !== -1) {
      setActiveIndex(realIndex);
      // Wait for layout
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: realIndex * itemHeight,
          animated: false,
        });
      }, 50);
    }
  }, [selectedValue, values, itemHeight]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      syncToSelected();
    }
  }, [syncToSelected]);

  // If selected value changes from parent, sync the offset
  useEffect(() => {
    const realIndex = values.indexOf(selectedValue);
    if (realIndex !== -1 && realIndex !== activeIndex) {
      setActiveIndex(realIndex);
      flatListRef.current?.scrollToOffset({
        offset: realIndex * itemHeight,
        animated: true,
      });
    }
  }, [selectedValue, values, itemHeight, activeIndex]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / itemHeight);
    
    if (index >= 0 && index < values.length) {
      if (index !== activeIndex) {
        setActiveIndex(index);
        onValueChange(values[index]!);
        Haptics.selectionAsync().catch(() => {});
      }
    }
  };

  const renderItem = ({ item, index }: { item: number | null; index: number }) => {
    if (item === null) {
      return <View style={{ height: itemHeight }} />;
    }

    const realIndex = index - listOffset;
    const isSelected = realIndex === activeIndex;
    const distanceFromCenter = Math.abs(realIndex - activeIndex);

    // Fade out items further away from the center
    const opacity = distanceFromCenter === 0 ? 1 : distanceFromCenter === 1 ? 0.6 : 0.25;
    const scale = distanceFromCenter === 0 ? 1.15 : distanceFromCenter === 1 ? 1 : 0.85;

    return (
      <View
        style={[
          styles.item,
          { height: itemHeight, opacity, transform: [{ scale }] }
        ]}
      >
        <Text
          style={[
            styles.itemText,
            isSelected && styles.itemTextSelected
          ]}
        >
          {formatValue(item)}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      {/* Target selection bars */}
      <View
        style={[
          styles.selectionIndicator,
          {
            height: itemHeight,
            top: (containerHeight - itemHeight) / 2,
          }
        ]}
      />
      <FlatList
        ref={flatListRef}
        data={paddedValues}
        renderItem={renderItem}
        keyExtractor={(_, index) => String(index)}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0b0b0b',
  },
  selectionIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#353535',
    backgroundColor: '#212121',
    opacity: 0.15,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  itemText: {
    color: '#b9b9b9',
    fontSize: 18,
    fontFamily: 'System',
    fontWeight: '400',
  },
  itemTextSelected: {
    color: '#f36458',
    fontSize: 22,
    fontWeight: '600',
  },
});
