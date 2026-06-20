import { View, Text, Image } from 'react-native';

interface AvatarProps {
  name?: string;
  photoURL?: string | null;
  size?: number;
  showRing?: boolean;
  className?: string;
}

export function Avatar({
  name = '',
  photoURL,
  size = 48,
  showRing = false,
  className = '',
}: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const fontSize = size * 0.4;

  if (photoURL) {
    return (
      <View
        className={`rounded-full overflow-hidden ${className}`}
        style={{
          width: size,
          height: size,
          borderWidth: showRing ? 2 : 0,
          borderColor: showRing ? '#f36458' : 'transparent',
        }}
      >
        <Image
          source={{ uri: photoURL }}
          style={{ width: size, height: size }}
        />
      </View>
    );
  }

  return (
    <View
      className={`rounded-full bg-[#353535] items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        borderWidth: showRing ? 2 : 0,
        borderColor: showRing ? '#f36458' : 'transparent',
      }}
    >
      <Text
        style={{ fontSize, lineHeight: fontSize * 1.2 }}
        className="text-white font-medium"
      >
        {initials || '?'}
      </Text>
    </View>
  );
}
