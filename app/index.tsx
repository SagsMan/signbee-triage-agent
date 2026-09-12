import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useColors } from '@/hooks/useColors';

const signbeeMark = require('@/assets/images/signbee-mark.png');
const accessibilityMark = require('@/assets/images/accessibility-mark.png');
const locationMark = require('@/assets/images/location-mark.png');
const topSignMark = require('@/assets/images/top-sign-mark.png');
const onboardingRing = require('@/assets/images/onboarding-ring.png');
const onboardingCharacter = require('@/assets/images/onboarding-character.png');
const onboardingDotLeft = require('@/assets/images/onboarding-dot-left.png');
const onboardingDotRight = require('@/assets/images/onboarding-dot-right.png');

const slides = [
  {
    title: 'Build a More Inclusive World',
    description:
      'Connect with certified interpreters and bridge communication gaps instantly.',
  },
  {
    title: 'Find the Right Interpreter',
    description:
      'Discover certified interpreters who match your language, setting, and needs.',
  },
  {
    title: 'Communicate With Confidence',
    description:
      'Get the support you need whenever communication matters most.',
  },
];

export default function SignBeeApp() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const transitionTimer = setTimeout(() => {
      setShowOnboarding(true);
    }, 2200);

    return () => clearTimeout(transitionTimer);
  }, []);

  return showOnboarding ? <SignBeeOnboardingScreen /> : <SignBeeSplashScreen />;
}

function SignBeeSplashScreen() {
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
        splashStyles.screen,
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
          splashStyles.topSignMark,
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
          style={splashStyles.fill}
          accessibilityLabel="Sign icon"
        />
      </View>

      <View
        style={[
          splashStyles.accessibilityMark,
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
          style={splashStyles.fill}
          accessibilityLabel="Accessibility"
        />
      </View>

      <View
        style={[
          splashStyles.locationMark,
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
            splashStyles.locationBubble,
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
        style={[splashStyles.traceLayer, { opacity: traceOpacity }]}
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

      <View style={splashStyles.brandLockup}>
        <View
          style={{ width: markSize, height: markSize }}
          accessible
          accessibilityLabel="SignBee mark"
        >
          <Image
            source={signbeeMark}
            resizeMode="contain"
            style={splashStyles.fill}
          />
        </View>
        <Text
          style={[splashStyles.wordmark, { color: colors.foreground }]}
          accessibilityRole="header"
        >
          SignBee
        </Text>
      </View>
    </View>
  );
}

function SignBeeOnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [currentSlide, setCurrentSlide] = useState(0);

  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const bottomInset = Platform.OS === 'web' ? 34 : insets.bottom;
  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;
  const illustrationWidth = Math.min(width * 0.74, 300);
  const illustrationHeight = Math.min(Math.max(height * 0.36, 285), 340);
  const ringSize = Math.min(width * 0.53, 214);
  const characterSize = Math.min(width * 0.46, 186);
  const rightDotSize = Math.min(width * 0.1, 40);
  const leftDotSize = Math.min(width * 0.08, 32);

  const advance = () => {
    void Haptics.selectionAsync();
    if (!isLastSlide) {
      setCurrentSlide((value) => value + 1);
    }
  };

  const skip = () => {
    void Haptics.selectionAsync();
    setCurrentSlide(slides.length - 1);
  };

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: topInset + 12,
          paddingBottom: bottomInset + 10,
          backgroundColor: colors.onboardingBackground,
        },
      ]}
      testID="signbee-onboarding-screen"
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.onboardingBackground}
      />

      <View style={styles.header}>
        <Text
          style={[styles.logo, { color: colors.foreground }]}
          accessibilityRole="header"
        >
          SignBee
        </Text>
      </View>

      <View style={styles.content}>
        <View
          style={[
            styles.illustration,
            {
              width: illustrationWidth,
              height: illustrationHeight,
              marginTop: Math.min(height * 0.07, 64),
            },
          ]}
          accessible
          accessibilityLabel="Friendly SignBee guide waving inside a lime circle"
        >
          <Image
            source={onboardingRing}
            resizeMode="contain"
            style={[
              styles.ring,
              {
                width: ringSize,
                height: ringSize * 0.96,
                top: illustrationHeight * 0.16,
              },
            ]}
          />
          <Image
            source={onboardingCharacter}
            resizeMode="contain"
            style={[
              styles.character,
              {
                width: characterSize,
                height: characterSize,
                bottom: illustrationHeight * 0.14,
                transform: [{ translateX: Math.min(width * 0.02, 8) }],
              },
            ]}
          />
          <Image
            source={onboardingDotRight}
            resizeMode="contain"
            style={[
              styles.rightDot,
              {
                width: rightDotSize,
                height: rightDotSize,
                top: illustrationHeight * 0.08,
                right: illustrationWidth * 0.02,
              },
            ]}
          />
          <Image
            source={onboardingDotLeft}
            resizeMode="contain"
            style={[
              styles.leftDot,
              {
                width: leftDotSize,
                height: leftDotSize,
                bottom: illustrationHeight * 0.02,
                left: illustrationWidth * 0.02,
              },
            ]}
          />
        </View>

        <View style={styles.copy}>
          <Text
            style={[styles.title, { color: colors.heading }]}
            accessibilityRole="header"
          >
            {slide.title}
          </Text>
          <Text style={[styles.description, { color: colors.bodyText }]}>
            {slide.description}
          </Text>
        </View>

        <View style={styles.progress} accessibilityLabel={`Onboarding page ${currentSlide + 1} of ${slides.length}`}>
          {slides.map((item, index) => (
            <View
              key={item.title}
              style={[
                styles.progressDot,
                index === currentSlide
                  ? [styles.progressActive, { backgroundColor: colors.heading }]
                  : { backgroundColor: colors.muted },
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={skip}
          style={({ pressed }) => [styles.skipButton, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
          testID="skip-onboarding"
        >
          <Text style={[styles.skipText, { color: colors.foreground }]}>
            Skip
          </Text>
        </Pressable>

        <Pressable
          onPress={advance}
          style={({ pressed }) => [
            styles.nextButton,
            { backgroundColor: colors.tint },
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={isLastSlide ? 'Finish onboarding' : 'Next onboarding page'}
          testID="next-onboarding"
        >
          <Text style={[styles.nextText, { color: colors.foreground }]}>
            {isLastSlide ? 'Get started' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const splashStyles = StyleSheet.create({
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    height: 42,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: '400',
    letterSpacing: -0.7,
  },
  content: {
    alignItems: 'center',
    flex: 1,
  },
  illustration: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
  },
  character: {
    bottom: 0,
    position: 'absolute',
  },
  rightDot: {
    position: 'absolute',
  },
  leftDot: {
    position: 'absolute',
  },
  copy: {
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.8,
    lineHeight: 34,
    textAlign: 'center',
  },
  description: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 23,
    marginTop: 14,
    maxWidth: 350,
    textAlign: 'center',
  },
  progress: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 34,
  },
  progressDot: {
    borderRadius: 999,
    height: 10,
    width: 10,
  },
  progressActive: {
    width: 32,
  },
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    paddingTop: 24,
  },
  skipButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    minWidth: 58,
  },
  skipText: {
    fontSize: 18,
    fontWeight: '500',
  },
  nextButton: {
    alignItems: 'center',
    borderRadius: 28,
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: 25,
  },
  nextText: {
    fontSize: 17,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
});