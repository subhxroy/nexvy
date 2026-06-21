import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Line } from 'react-native-svg';

interface LineChartProps {
  data: number[];
  labels: string[];
  height?: number;
  color?: string;
  gradientColor?: string;
  suffix?: string;
  regressionData?: number[];
  targetValue?: number;
}

export function LineChart({
  data,
  labels,
  height = 160,
  color = '#f36458',
  gradientColor = '#f36458',
  suffix = 'kg',
  regressionData,
  targetValue,
}: LineChartProps) {
  const screenWidth = Dimensions.get('window').width - 48; // padding margin
  const chartWidth = screenWidth;
  const chartHeight = height - 30; // space for labels

  if (!data || data.length === 0) {
    return (
      <View style={{ height }} className="items-center justify-center bg-[#212121] rounded-2xl">
        <Text className="text-mute text-caption">No data available</Text>
      </View>
    );
  }

  const allVals = targetValue !== undefined ? [...data, targetValue] : data;
  const maxVal = Math.max(...allVals) * 1.05; // 5% padding on top
  const minVal = Math.min(...allVals) * 0.95; // 5% padding on bottom
  const valueRange = maxVal - minVal || 1;

  // Generate points
  const points = data.map((val, index) => {
    const x = data.length > 1 ? (index / (data.length - 1)) * (chartWidth - 20) + 10 : chartWidth / 2;
    const y = chartHeight - ((val - minVal) / valueRange) * (chartHeight - 20) - 10;
    return { x, y, val };
  });

  // Build path string
  let pathD = '';
  let areaD = '';

  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    areaD = `M ${points[0].x} ${chartHeight} L ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${points[i].x} ${points[i].y}`;
      areaD += ` L ${points[i].x} ${points[i].y}`;
    }

    areaD += ` L ${points[points.length - 1].x} ${chartHeight} Z`;
  }

  // Regression line coordinates
  let regressionPathD = '';
  if (regressionData && regressionData.length === data.length) {
    const regPoints = regressionData.map((val, index) => {
      const x = data.length > 1 ? (index / (data.length - 1)) * (chartWidth - 20) + 10 : chartWidth / 2;
      const y = chartHeight - ((val - minVal) / valueRange) * (chartHeight - 20) - 10;
      return { x, y };
    });
    if (regPoints.length > 0) {
      regressionPathD = `M ${regPoints[0].x} ${regPoints[0].y}`;
      for (let i = 1; i < regPoints.length; i++) {
        regressionPathD += ` L ${regPoints[i].x} ${regPoints[i].y}`;
      }
    }
  }

  // Target value line coordinate
  let targetLineY: number | null = null;
  if (targetValue !== undefined) {
    targetLineY = chartHeight - ((targetValue - minVal) / valueRange) * (chartHeight - 20) - 10;
  }

  // Draw grid levels (3 lines)
  const gridLevels = [0, 0.5, 1];

  return (
    <View style={{ height }}>
      <View style={{ height: chartHeight }} className="relative">
        <Svg width={chartWidth} height={chartHeight}>
          <Defs>
            <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={gradientColor} stopOpacity="0.25" />
              <Stop offset="100%" stopColor={gradientColor} stopOpacity="0.0" />
            </LinearGradient>
          </Defs>

          {/* Grid lines */}
          {gridLevels.map((lvl, idx) => {
            const y = 10 + lvl * (chartHeight - 20);
            const gridVal = maxVal - lvl * valueRange;
            return (
              <React.Fragment key={idx}>
                <Line
                  x1="10"
                  y1={y}
                  x2={chartWidth - 10}
                  y2={y}
                  stroke="#353535"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <Text
                  className="absolute text-[9px] text-[#797979] right-2"
                  style={{ top: y - 6 }}
                >
                  {Math.round(gridVal)}
                  {suffix}
                </Text>
              </React.Fragment>
            );
          })}

          {/* Area under curve */}
          {areaD && <Path d={areaD} fill="url(#chartGradient)" />}

          {/* Target value dashed line */}
          {targetLineY !== null && (
            <Line
              x1="10"
              y1={targetLineY}
              x2={chartWidth - 10}
              y2={targetLineY}
              stroke="#dd0000"
              strokeWidth="1.5"
              strokeDasharray="5 5"
            />
          )}

          {/* Regression line */}
          {regressionPathD && (
            <Path
              d={regressionPathD}
              fill="none"
              stroke="#797979"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          )}

          {/* Line path */}
          {pathD && (
            <Path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          )}

          {/* Point circles */}
          {points.map((pt, idx) => (
            <Circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r="4.5"
              fill="#0b0b0b"
              stroke={color}
              strokeWidth="2"
            />
          ))}
        </Svg>
      </View>

      {/* X Labels */}
      <View className="flex-row justify-between px-2 mt-2">
        {labels.map((lbl, idx) => (
          <Text key={idx} className="text-[10px] text-[#797979]">
            {lbl}
          </Text>
        ))}
      </View>
    </View>
  );
}
