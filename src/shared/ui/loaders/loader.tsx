import React, { memo, useEffect } from "react";
import { View, ViewStyle } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "../../lib";
import { Styles } from "../../styles";
import { getStyles } from "./styles";

type InfiniteDotLoaderProps = {
  dotSize?: number;
  dotCount?: number;
  spacing?: number;
  speed?: number;
  staggerDelay?: number;
  containerStyle?: ViewStyle;
};

const AnimatedDot = memo(
  ({
    size,
    color,
    delay,
    speed,
  }: {
    size: number;
    color: string;
    delay: number;
    speed: number;
  }) => {
    const scale = useSharedValue(0.3);
    const opacity = useSharedValue(0.2);

    useEffect(() => {
      const target = withTiming(1, {
        duration: speed / 2,
        easing: Easing.inOut(Easing.ease),
      });

      scale.value = withDelay(delay, withRepeat(target, -1, true));
      opacity.value = withDelay(delay, withRepeat(target, -1, true));

      return () => {
        cancelAnimation(scale);
        cancelAnimation(opacity);
      };
    }, [delay, speed]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: 0.2 + opacity.value * 0.8,
    }));

    return (
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
          animatedStyle,
        ]}
      />
    );
  },
);
AnimatedDot.displayName = "AnimatedDot";

export const Loader = ({
  dotSize = 20,
  dotCount = 3,
  spacing = 10,
  speed = 900,
  staggerDelay,
  containerStyle,
}: InfiniteDotLoaderProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const stagger = staggerDelay ?? speed / dotCount;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.row, { gap: spacing }]}>
        {Array.from({ length: dotCount }).map((_, i) => (
          <AnimatedDot
            key={i}
            size={dotSize}
            color={Styles[theme].IconAccent}
            delay={i * stagger}
            speed={speed}
          />
        ))}
      </View>
    </View>
  );
};
