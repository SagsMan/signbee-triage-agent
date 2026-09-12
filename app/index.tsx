import { useEffect, useRef, useState } from 'react';
import { Animated, Image, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useColors } from '@/hooks/useColors';

const signbeeMark = require('@/assets/images/signbee-mark.png');
const accessibilityMark = require('@/assets/images/accessibility-mark.png');
const locationMark = require('@/assets/images/location-mark.png');
const topSignMark = require('@/assets/images/top-sign-mark.png');

export default function SignBeeSplashScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const traceOffset = useRef(new Animated.Value(0)).current;
  const traceOpacity = useRef(new Animated.Value(0)).current;
  const [traceDashOffset, setTraceDashOffset] = useState(0);
  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const bottomInset = Platform.OS === 'web' ? 34 : insets.bottom;
  const markSize = Math.min(Math.max(width * 0.13, 50), 64);
  const accessibilitySize = Math.min(Math.max(width * 0.145, 58), 72);
  const locationIconSize = accessibilitySize * 0.56;
  const topSignSize = Math.min(Math.max(width * 0.18, 64), 80);
  const lowerIconTop = topInset + height * 0.35;
  const lowerIconLeft = Math.max(width * 0.08, 24);
  const lowerIconRight = Math.max(width * 0.08, 24);
  const lowerIconLeftCenter = lowerIconLeft + accessibilitySize / 2;
  const lowerIconRightCenter =
    width - lowerIconRight - accessibilitySize / 2;
  const lowerIconCenterY = lowerIconTop + accessibilitySize / 2;
  const topSignCenterX = width / 2;
  const topSignCenterY =
    topInset + height * 0.19 + topSignSize / 2;
  const curveControlInset = Math.max(width * 0.24, 92);
  const tracePath = [
    `M ${lowerIconLeftCenter} ${lowerIconCenterY}`,
    `Q ${topSignCenterX - curveControlInset} ${topSignCenterY}`,
    `${topSignCenterX} ${topSignCenterY}`,
    `Q ${topSignCenterX + curveControlInset} ${topSignCenterY}`,
    `${lowerIconRightCenter} ${lowerIconCenterY}`,
  ].join(' ');
  const tracePathLength = Math.max(width + height, 720);

  useEffect(() => {
    const traceListener = traceOffset.addListener(({ value }) => {
      setTraceDashOffset(value);
    });
    const tracing = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(traceOffset, {
            toValue: -tracePathLength,
            duration: 720,
            useNativeDriver: false,
          }),
          Animated.sequence([
            Animated.timing(traceOpacity, {
              toValue: 1,
              duration: 100,
              useNativeDriver: false,
            }),
            Animated.delay(520),
            Animated.timing(traceOpacity, {
              toValue: 0,
              duration: 100,
              useNativeDriver: false,
            }),
          ]),
        ]),
        Animated.parallel([
          Animated.timing(traceOffset, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }),
          Animated.timing(traceOpacity, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }),
        ]),
      ]),
      { iterations: 3 },
    );

    tracing.start();

    return () => {
      tracing.stop();
      traceOffset.removeListener(traceListener);
    };
  }, [traceOffset, traceOpacity, tracePathLength]);

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
          paddingTop: topInset,
          paddingBottom: bottomInset,
        },
      ]}
      testID="signbee-splash-screen"
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
      />

      <View
        style={[
          styles.topSignMark,
          {
            width: topSignSize,
            height: topSignSize,
            top: topInset + height * 0.19,
          },
        ]}
      >
        <Image
          source={topSignMark}
          resizeMode="contain"
          style={styles.fill}
          accessibilityLabel="Sign icon"
        />
      </View>

      <View
        style={[
          styles.accessibilityMark,
          {
            width: accessibilitySize,
            height: accessibilitySize,
            left: lowerIconLeft,
            top: lowerIconTop,
          },
        ]}
      >
        <Image
          source={accessibilityMark}
          resizeMode="contain"
          style={styles.fill}
          accessibilityLabel="Accessibility"
        />
      </View>

      <View
        style={[
          styles.locationMark,
          {
            width: accessibilitySize,
            height: accessibilitySize,
            right: lowerIconRight,
            top: lowerIconTop,
          },
        ]}
      >
        <View
          style={[
            styles.locationBubble,
            { backgroundColor: colors.locationBubble },
          ]}
        />
        <Image
          source={locationMark}
          resizeMode="contain"
          style={{
            width: locationIconSize,
            height: locationIconSize,
          }}
          accessibilityLabel="Location"
        />
      </View>

      <Animated.View
        style={[styles.traceLayer, { opacity: traceOpacity }]}
      >
        <Svg width={width} height={height}>
          <Path
            d={tracePath}
            fill="none"
            stroke={colors.foreground}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={[2, 8]}
            strokeDashoffset={traceDashOffset}
          />
        </Svg>
      </Animated.View>

      <View style={styles.brandLockup}>
        <View
          style={{ width: markSize, height: markSize }}
          accessible
          accessibilityLabel="SignBee mark"
        >
          <Image
            source={signbeeMark}
            resizeMode="contain"
            style={styles.fill}
          />
        </View>
        <Text
          style={[styles.wordmark, { color: colors.foreground }]}
          accessibilityRole="header"
        >
          SignBee
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  brandLockup: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  wordmark: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 36,
  },
  accessibilityMark: {
    position: 'absolute',
  },
  topSignMark: {
    position: 'absolute',
  },
  locationMark: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationBubble: {
    ...StyleSheet.absoluteFill,
    borderRadius: 999,
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  traceLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
  },
});