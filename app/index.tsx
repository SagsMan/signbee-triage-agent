import { useEffect, useRef } from 'react';
import { Animated, Image, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useColors } from '@/hooks/useColors';

const signbeeMark = require('@/assets/images/signbee-mark.png');
const accessibilityMark = require('@/assets/images/accessibility-mark.png');
const locationMark = require('@/assets/images/location-mark.png');
const topSignMark = require('@/assets/images/top-sign-mark.png');
const TRACE_DOT_COUNT = 7;
const TRACE_DOT_SIZE = 3;
const TRACE_DOT_GAP = 3;
const TRACE_TRAIL_WIDTH =
  TRACE_DOT_COUNT * TRACE_DOT_SIZE + (TRACE_DOT_COUNT - 1) * TRACE_DOT_GAP;

export default function SignBeeSplashScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const traceProgress = useRef(new Animated.Value(0)).current;
  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const bottomInset = Platform.OS === 'web' ? 34 : insets.bottom;
  const markSize = Math.min(Math.max(width * 0.13, 50), 64);
  const accessibilitySize = Math.min(Math.max(width * 0.145, 58), 72);
  const locationIconSize = accessibilitySize * 0.56;
  const topSignSize = Math.min(Math.max(width * 0.18, 64), 80);

  useEffect(() => {
    const tracing = Animated.loop(
      Animated.timing(traceProgress, {
        toValue: 1,
        duration: 420,
        useNativeDriver: Platform.OS !== 'web',
      }),
      { iterations: 3 },
    );

    tracing.start();

    return () => tracing.stop();
  }, [traceProgress]);

  const traceTranslateX = traceProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [-TRACE_TRAIL_WIDTH, markSize],
  });

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
            left: Math.max(width * 0.08, 24),
            top: topInset + height * 0.35,
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
            right: Math.max(width * 0.08, 24),
            top: topInset + height * 0.35,
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

      <View style={styles.brandLockup}>
        <View
          style={[styles.markFrame, { width: markSize, height: markSize }]}
          accessible
          accessibilityLabel="SignBee mark"
        >
          <Image
            source={signbeeMark}
            resizeMode="contain"
            style={styles.fill}
          />
          <Animated.View
            style={[
              styles.traceTrail,
              {
                top: markSize * 0.48,
                transform: [{ translateX: traceTranslateX }],
              },
            ]}
          >
            {Array.from({ length: TRACE_DOT_COUNT }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.traceDot,
                  {
                    opacity: 1 - index * 0.1,
                    backgroundColor: colors.background,
                    marginRight:
                      index === TRACE_DOT_COUNT - 1 ? 0 : TRACE_DOT_GAP,
                  },
                ]}
              />
            ))}
          </Animated.View>
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
  markFrame: {
    overflow: 'hidden',
  },
  traceTrail: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    height: TRACE_DOT_SIZE,
    pointerEvents: 'none',
  },
  traceDot: {
    width: TRACE_DOT_SIZE,
    height: TRACE_DOT_SIZE,
    borderRadius: TRACE_DOT_SIZE / 2,
  },
});