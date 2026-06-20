import { View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { GPSPoint } from '../../types/activity.types';
import { colors } from '../../constants/tokens';

interface RouteTraceProps {
  points: GPSPoint[];
  width?: number;
  height?: number;
  color?: string;
}

export function RouteTrace({
  points,
  width = 200,
  height = 80,
  color = colors.brand,
}: RouteTraceProps) {
  if (points.length < 2) {
    return (
      <View
        style={{ width, height }}
        className="bg-[#212121] rounded-card items-center justify-center"
      >
        <View className="w-3/4 h-px bg-[#353535]" />
      </View>
    );
  }

  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latRange = maxLat - minLat || 1;
  const lngRange = maxLng - minLng || 1;

  const padding = 10;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  const pointStrings = points
    .map((p) => {
      const x = padding + ((p.lng - minLng) / lngRange) * usableWidth;
      const y = padding + ((maxLat - p.lat) / latRange) * usableHeight;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View style={{ width, height }} className="bg-[#212121] rounded-card overflow-hidden">
      <Svg width={width} height={height}>
        <Polyline points={pointStrings} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}
