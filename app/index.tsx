import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
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
];

export default function SignBeeApp() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    const transitionTimer = setTimeout(() => {
      setShowOnboarding(true);
    }, 2200);

    return () => clearTimeout(transitionTimer);
  }, []);

  if (!showOnboarding) return <SignBeeSplashScreen />;
  if (showBooking) {
    return <BookingScreen onBack={() => setShowBooking(false)} />;
  }
  return <SignBeeOnboardingScreen onNext={() => setShowBooking(true)} />;
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

function SignBeeOnboardingScreen({ onNext }: { onNext: () => void }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const bottomInset = Platform.OS === 'web' ? 34 : insets.bottom;
  const currentSlide = 0;
  const slide = slides[0];
  const illustrationWidth = Math.min(width * 0.74, 300);
  const illustrationHeight = Math.min(Math.max(height * 0.36, 285), 340);
  const ringSize = Math.min(width * 0.53, 214);
  const characterSize = Math.min(width * 0.46, 186);
  const rightDotSize = Math.min(width * 0.1, 40);
  const leftDotSize = Math.min(width * 0.08, 32);

  const advance = () => {
    void Haptics.selectionAsync();
    onNext();
  };

  const skip = () => {
    void Haptics.selectionAsync();
    onNext();
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
          accessibilityLabel="Next onboarding page"
          testID="next-onboarding"
        >
          <Text style={[styles.nextText, { color: colors.foreground }]}>
            Next
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

type BookingField = 'location' | 'language' | 'duration';

function BookingScreen({ onBack }: { onBack: () => void }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<'in-person' | 'virtual'>('in-person');
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [openField, setOpenField] = useState<BookingField | null>(null);

  const formatDate = (value: Date | null) => {
    if (!value) return 'DD/MM/YY';
    return `${String(value.getDate()).padStart(2, '0')}/${String(
      value.getMonth() + 1,
    ).padStart(2, '0')}/${String(value.getFullYear()).slice(-2)}`;
  };

  const formatTime = (value: Date | null) => {
    if (!value) return '00 / 00';
    return `${String(value.getHours()).padStart(2, '0')} / ${String(
      value.getMinutes(),
    ).padStart(2, '0')}`;
  };

  const handleDateChange = (event: DateTimePickerEvent, value?: Date) => {
    setShowDatePicker(false);
    if (event.type === 'set' && value) {
      setSelectedDate(value);
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, value?: Date) => {
    setShowTimePicker(false);
    if (event.type === 'set' && value) {
      setSelectedTime(value);
    }
  };

  const webDateOptions = Array.from({ length: 7 }, (_, index) => {
    const value = new Date();
    value.setDate(value.getDate() + index);
    return value;
  });
  const webTimeOptions = [9, 10, 11, 12, 13, 14, 15, 16].map((hour) => {
    const value = new Date();
    value.setHours(hour, 0, 0, 0);
    return value;
  });

  const toggleField = (field: BookingField) => {
    setOpenField((current) => (current === field ? null : field));
  };

  return (
    <View
      style={[
        bookingStyles.screen,
        { backgroundColor: colors.onboardingBackground },
      ]}
      testID="signbee-booking-screen"
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.onboardingBackground}
      />
      <ScrollView
        contentContainerStyle={[
          bookingStyles.scrollContent,
          {
            paddingTop: insets.top + 27,
            paddingBottom: Math.max(insets.bottom, 24) + 28,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={bookingStyles.topRow}>
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Back to onboarding"
            hitSlop={12}
            style={({ pressed }) => [bookingStyles.backButton, pressed && styles.pressed]}
          >
            <Ionicons name="arrow-back" size={22} color={colors.bodyText} />
          </Pressable>
          <View
            style={[
              bookingStyles.progressTrack,
              { backgroundColor: colors.progressTrack },
            ]}
            accessibilityLabel="Booking step one of two"
          >
            <View
              style={[
                bookingStyles.progressFill,
                { backgroundColor: colors.brandInk },
              ]}
            />
          </View>
          <View style={bookingStyles.topRowSpacer} />
        </View>

        <View
          style={[
            bookingStyles.urgentCard,
            { backgroundColor: colors.softGreen },
          ]}
        >
          <View
            style={[
              bookingStyles.urgentIconFrame,
              { backgroundColor: colors.foreground, borderColor: colors.tint },
            ]}
          >
            <Image
              source={signbeeMark}
              resizeMode="contain"
              style={bookingStyles.urgentIcon}
              accessibilityLabel="SignBee"
            />
          </View>
          <View style={bookingStyles.urgentCopy}>
            <Text style={[bookingStyles.urgentTitle, { color: colors.brandInk }]}>
              It’s urgent, match me now
            </Text>
            <Text style={[bookingStyles.urgentDescription, { color: colors.bodyText }]}>
              SignBee Agent will match you with a suitable interpreter immediately.
            </Text>
          </View>
        </View>

        <View style={bookingStyles.dividerRow}>
          <View style={[bookingStyles.divider, { backgroundColor: colors.divider }]} />
          <Text style={[bookingStyles.dividerLabel, { color: colors.mutedForeground }]}>
            OR BOOK AHEAD
          </Text>
          <View style={[bookingStyles.divider, { backgroundColor: colors.divider }]} />
        </View>

        <View style={bookingStyles.modeSwitch}>
          <Pressable
            onPress={() => setMode('in-person')}
            accessibilityRole="button"
            accessibilityLabel="Choose in-person interpreting"
            style={[
              bookingStyles.modeOption,
              mode === 'in-person' && bookingStyles.modeOptionActive,
              {
                backgroundColor:
                  mode === 'in-person' ? colors.onboardingBackground : colors.softGray,
                borderBottomColor:
                  mode === 'in-person' ? colors.tint : 'transparent',
              },
            ]}
          >
            <Text
              style={[
                bookingStyles.modeText,
                {
                  color:
                    mode === 'in-person'
                      ? colors.bodyText
                      : colors.mutedForeground,
                },
              ]}
            >
              In-person
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode('virtual')}
            accessibilityRole="button"
            accessibilityLabel="Choose virtual interpreting"
            style={[
              bookingStyles.modeOption,
              mode === 'virtual' && bookingStyles.modeOptionActive,
              {
                backgroundColor:
                  mode === 'virtual' ? colors.onboardingBackground : colors.softGray,
                borderBottomColor:
                  mode === 'virtual' ? colors.tint : 'transparent',
              },
            ]}
          >
            <Text
              style={[
                bookingStyles.modeText,
                {
                  color:
                    mode === 'virtual'
                      ? colors.bodyText
                      : colors.mutedForeground,
                },
              ]}
            >
              Virtual
            </Text>
          </Pressable>
        </View>

        <BookingSelectField
          label="Location"
          required
          placeholder="e.g Nafdac Office Ilorin, Kwara."
          value={location}
          options={['Nafdac Office Ilorin, Kwara.', 'Lagos University Teaching Hospital', 'Online']}
          open={openField === 'location'}
          onToggle={() => toggleField('location')}
          onChange={(value) => {
            setLocation(value);
            setOpenField(null);
          }}
        />

        <BookingSelectField
          label="Select Language"
          required
          placeholder="e.g NSL (Nigerian Sign Language)"
          value={language}
          options={['NSL (Nigerian Sign Language)', 'ASL (American Sign Language)', 'BSL (British Sign Language)']}
          open={openField === 'language'}
          onToggle={() => toggleField('language')}
          onChange={(value) => {
            setLanguage(value);
            setOpenField(null);
          }}
        />

        <View style={bookingStyles.fieldGroup}>
          <Text style={[bookingStyles.fieldLabel, { color: colors.bodyText }]}>
            Choose Date &amp; Time{' '}
            <Text style={[bookingStyles.required, { color: colors.destructive }]}>
              *
            </Text>
          </Text>
          <View style={bookingStyles.dateTimeRow}>
            <Pressable
              onPress={() => {
                setShowTimePicker(false);
                setShowDatePicker((current) => !current);
              }}
              accessibilityRole="button"
              accessibilityLabel="Choose booking date"
              style={[
                bookingStyles.dateTimeField,
                { borderColor: colors.fieldBorder },
              ]}
            >
              <Text
                style={[
                  bookingStyles.inputText,
                  {
                    color: selectedDate
                      ? colors.bodyText
                      : colors.placeholder,
                  },
                ]}
              >
                {formatDate(selectedDate)}
              </Text>
              <Ionicons name="calendar-outline" size={21} color={colors.brandInk} />
            </Pressable>
            <Pressable
              onPress={() => {
                setShowDatePicker(false);
                setShowTimePicker((current) => !current);
              }}
              accessibilityRole="button"
              accessibilityLabel="Choose booking time"
              style={[
                bookingStyles.dateTimeField,
                { borderColor: colors.fieldBorder },
              ]}
            >
              <Text
                style={[
                  bookingStyles.inputText,
                  {
                    color: selectedTime
                      ? colors.bodyText
                      : colors.placeholder,
                  },
                ]}
              >
                {formatTime(selectedTime)}
              </Text>
              <Ionicons name="time-outline" size={21} color={colors.brandInk} />
            </Pressable>
          </View>
          {showDatePicker && Platform.OS !== 'web' && (
            <DateTimePicker
              value={selectedDate ?? new Date()}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={handleDateChange}
            />
          )}
          {showTimePicker && Platform.OS !== 'web' && (
            <DateTimePicker
              value={selectedTime ?? new Date()}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
          {showDatePicker && Platform.OS === 'web' && (
            <View style={[bookingStyles.webOptions, { borderColor: colors.fieldBorder }]}>
              {webDateOptions.map((option) => (
                <Pressable
                  key={option.toISOString()}
                  onPress={() => {
                    setSelectedDate(option);
                    setShowDatePicker(false);
                  }}
                  style={({ pressed }) => [
                    bookingStyles.webOption,
                    pressed && { backgroundColor: colors.softGreen },
                  ]}
                >
                  <Text style={[bookingStyles.optionText, { color: colors.bodyText }]}>
                    {formatDate(option)}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
          {showTimePicker && Platform.OS === 'web' && (
            <View style={[bookingStyles.webOptions, { borderColor: colors.fieldBorder }]}>
              {webTimeOptions.map((option) => (
                <Pressable
                  key={option.toISOString()}
                  onPress={() => {
                    setSelectedTime(option);
                    setShowTimePicker(false);
                  }}
                  style={({ pressed }) => [
                    bookingStyles.webOption,
                    pressed && { backgroundColor: colors.softGreen },
                  ]}
                >
                  <Text style={[bookingStyles.optionText, { color: colors.bodyText }]}>
                    {formatTime(option)}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <BookingSelectField
          label="Duration"
          required
          placeholder="e.g 1 hour"
          value={duration}
          options={['30 minutes', '1 hour', '2 hours', 'Half day']}
          open={openField === 'duration'}
          onToggle={() => toggleField('duration')}
          onChange={(value) => {
            setDuration(value);
            setOpenField(null);
          }}
        />
      </ScrollView>
    </View>
  );
}

function BookingSelectField({
  label,
  required,
  placeholder,
  value,
  options,
  open,
  onToggle,
  onChange,
}: {
  label: string;
  required?: boolean;
  placeholder: string;
  value: string;
  options: string[];
  open: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}) {
  const colors = useColors();

  return (
    <View style={bookingStyles.fieldGroup}>
      <Text style={[bookingStyles.fieldLabel, { color: colors.bodyText }]}>
        {label}{' '}
        {required && (
          <Text style={[bookingStyles.required, { color: colors.destructive }]}>
            *
          </Text>
        )}
      </Text>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel={`Select ${label.toLowerCase()}`}
        style={({ pressed }) => [
          bookingStyles.selectField,
          { borderColor: colors.fieldBorder },
          pressed && styles.pressed,
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            bookingStyles.selectText,
            { color: value ? colors.bodyText : colors.placeholder },
          ]}
        >
          {value || placeholder}
        </Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.mutedForeground}
        />
      </Pressable>
      {open && (
        <View
          style={[
            bookingStyles.options,
            {
              backgroundColor: colors.onboardingBackground,
              borderColor: colors.fieldBorder,
            },
          ]}
        >
          {options.map((option) => (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={({ pressed }) => [
                bookingStyles.option,
                pressed && { backgroundColor: colors.softGreen },
              ]}
            >
              <Text style={[bookingStyles.optionText, { color: colors.bodyText }]}>
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
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

const bookingStyles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 31,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 32,
  },
  backButton: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: 42,
  },
  topRowSpacer: {
    width: 42,
  },
  progressTrack: {
    borderRadius: 999,
    height: 8,
    overflow: 'hidden',
    width: 137,
  },
  progressFill: {
    borderRadius: 999,
    height: '100%',
    width: '30%',
  },
  urgentCard: {
    alignItems: 'center',
    borderRadius: 13,
    flexDirection: 'row',
    marginTop: 54,
    minHeight: 92,
    paddingHorizontal: 17,
    paddingVertical: 13,
  },
  urgentIconFrame: {
    alignItems: 'center',
    borderColor: '#AAF70A',
    borderRadius: 12,
    borderWidth: 2,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  urgentIcon: {
    height: 43,
    width: 43,
  },
  urgentCopy: {
    flex: 1,
    marginLeft: 17,
  },
  urgentTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  urgentDescription: {
    fontSize: 14,
    lineHeight: 19,
    marginTop: 3,
  },
  dividerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 26,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerLabel: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  modeSwitch: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  modeOption: {
    alignItems: 'center',
    borderBottomWidth: 2,
    borderRadius: 15,
    flex: 1,
    justifyContent: 'center',
    minHeight: 52,
  },
  modeOptionActive: {
  },
  modeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  fieldGroup: {
    marginTop: 32,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 21,
    marginBottom: 13,
  },
  required: {
  },
  selectField: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 63,
    paddingHorizontal: 20,
  },
  selectText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    marginRight: 12,
  },
  options: {
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 6,
    overflow: 'hidden',
  },
  option: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 15,
  },
  webOptions: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 6,
    padding: 6,
  },
  webOption: {
    borderRadius: 8,
    minWidth: 66,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 11,
  },
  dateTimeField: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    minHeight: 63,
    paddingHorizontal: 15,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
});