import { Image, StatusBar } from 'react-native';
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

export default function SignBeeSplashScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const bottomInset = Platform.OS === 'web' ? 34 : insets.bottom;
  const markSize = Math.min(Math.max(width * 0.13, 50), 64);
  const accessibilitySize = Math.min(Math.max(width * 0.145, 58), 72);

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
          styles.accessibilityMark,
          {
            width: accessibilitySize,
            height: accessibilitySize,
            left: Math.max(width * 0.08, 24),
            top: topInset + height * 0.45,
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

      <View style={styles.brandLockup}>
        <Image
          source={signbeeMark}
          resizeMode="contain"
          style={{ width: markSize, height: markSize }}
          accessibilityLabel="SignBee mark"
        />
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
    fontFamily: 'Inter_700Bold',
    fontSize: 30,
    letterSpacing: -1,
    lineHeight: 36,
  },
  accessibilityMark: {
    position: 'absolute',
  },
  fill: {
    width: '100%',
    height: '100%',
  },
});