import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
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
  const [showOnboarding, setShowOnboarding] = useState(Platform.OS === 'web');
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    const transitionTimer = setTimeout(() => {
      setShowOnboarding(true);
    }, 900);

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

type InterpreterFilters = {
  mode: 'in-person' | 'virtual';
  situation: string;
  location: string;
  preferredPlatform: string;
};

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
  const [servicePurpose, setServicePurpose] = useState('Medical');
  const [notes, setNotes] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [openField, setOpenField] = useState<BookingField | null>(null);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showTriageSheet, setShowTriageSheet] = useState(false);
  const [showWebLocationPermission, setShowWebLocationPermission] =
    useState(false);
  const [appliedFilters, setAppliedFilters] = useState<InterpreterFilters | null>(
    null,
  );

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

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAttachedImage(result.assets[0].uri);
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

        <View style={bookingStyles.fieldGroup}>
          <Text style={[bookingStyles.fieldLabel, { color: colors.bodyText }]}>
            Service Purpose{' '}
            <Text style={[bookingStyles.required, { color: colors.destructive }]}>
              *
            </Text>
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={bookingStyles.purposeRow}
          >
            {['Medical', 'Concert', 'Religion', 'Business'].map((purpose) => {
              const active = servicePurpose === purpose;
              return (
                <Pressable
                  key={purpose}
                  onPress={() => setServicePurpose(purpose)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`Choose ${purpose.toLowerCase()} service purpose`}
                  style={[
                    bookingStyles.purposeChip,
                    {
                      backgroundColor: active ? colors.brandInk : colors.softGray,
                    },
                  ]}
                >
                  <Text
                    style={[
                      bookingStyles.purposeText,
                      { color: active ? colors.foreground : colors.mutedForeground },
                    ]}
                  >
                    {purpose}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={bookingStyles.fieldGroup}>
          <Text style={[bookingStyles.fieldLabel, { color: colors.bodyText }]}>
            Additional Notes{' '}
            <Text style={[bookingStyles.optional, { color: colors.mutedForeground }]}>
              (Optional)
            </Text>
          </Text>
          <TextInput
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            placeholder="e.g Interpreter should arrive 15 minutes early for setup."
            placeholderTextColor={colors.placeholder}
            style={[
              bookingStyles.notesInput,
              {
                borderColor: colors.fieldBorder,
                color: colors.bodyText,
              },
            ]}
            textAlignVertical="top"
            accessibilityLabel="Additional notes"
          />
        </View>

        <View style={bookingStyles.fieldGroup}>
          <Text style={[bookingStyles.fieldLabel, { color: colors.bodyText }]}>
            Attach image{' '}
            <Text style={[bookingStyles.optional, { color: colors.mutedForeground }]}>
              (Optional)
            </Text>
          </Text>
          <Pressable
            onPress={pickImage}
            accessibilityRole="button"
            accessibilityLabel={attachedImage ? 'Change attached image' : 'Choose image'}
            style={({ pressed }) => [
              bookingStyles.attachField,
              { borderColor: colors.fieldBorder },
              pressed && styles.pressed,
            ]}
          >
            {attachedImage ? (
              <Image
                source={{ uri: attachedImage }}
                resizeMode="cover"
                style={bookingStyles.attachmentPreview}
                accessibilityLabel="Selected attachment preview"
              />
            ) : (
              <Ionicons name="cloud-upload-outline" size={19} color={colors.mutedForeground} />
            )}
            <Text style={[bookingStyles.attachText, { color: colors.mutedForeground }]}>
              {attachedImage ? 'Change image' : 'Choose image'}
            </Text>
          </Pressable>
        </View>

        {appliedFilters && (
          <View
            style={[
              bookingStyles.appliedFilterCard,
              {
                backgroundColor: colors.softGreen,
                borderColor: colors.tint,
              },
            ]}
          >
            <View style={bookingStyles.appliedFilterCopy}>
              <Text style={[bookingStyles.appliedFilterTitle, { color: colors.brandInk }]}>
                Filters applied
              </Text>
              <Text
                numberOfLines={1}
                style={[bookingStyles.appliedFilterSummary, { color: colors.bodyText }]}
              >
                {[
                  appliedFilters.mode === 'in-person' ? 'In-person' : 'Virtual',
                  appliedFilters.situation,
                  appliedFilters.location || appliedFilters.preferredPlatform,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
            </View>
            <Pressable
              onPress={() => setShowFilterSheet(true)}
              accessibilityRole="button"
              accessibilityLabel="Edit interpreter filters"
              hitSlop={10}
              style={({ pressed }) => [pressed && styles.pressed]}
            >
              <Ionicons name="options-outline" size={22} color={colors.brandInk} />
            </Pressable>
          </View>
        )}

        <Pressable
          onPress={() => {
            void Haptics.selectionAsync();
            setShowFilterSheet(true);
          }}
          accessibilityRole="button"
          accessibilityLabel="Find interpreters"
          style={({ pressed }) => [
            bookingStyles.findButton,
            { backgroundColor: colors.tint },
            pressed && styles.pressed,
          ]}
        >
          <Text style={[bookingStyles.findButtonText, { color: colors.brandInk }]}>
            Find Interpreters
          </Text>
        </Pressable>
      </ScrollView>

      <InterpreterFilterSheet
        visible={showFilterSheet}
        initialFilters={appliedFilters}
        defaultMode={mode}
        onClose={() => setShowFilterSheet(false)}
        onApply={(filters) => {
          setAppliedFilters(filters);
          setMode(filters.mode);
          setShowFilterSheet(false);
          setShowTriageSheet(true);
          void Haptics.selectionAsync();
        }}
      />
      <TriageProgressSheet
        visible={showTriageSheet}
        onClose={() => setShowTriageSheet(false)}
      />
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

function InterpreterFilterSheet({
  visible,
  initialFilters,
  defaultMode,
  onClose,
  onApply,
}: {
  visible: boolean;
  initialFilters: InterpreterFilters | null;
  defaultMode: 'in-person' | 'virtual';
  onClose: () => void;
  onApply: (filters: InterpreterFilters) => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [locationPermission, requestLocationPermission] =
    Location.useForegroundPermissions();
  const [showWebLocationPermission, setShowWebLocationPermission] =
    useState(false);
  const [mode, setMode] = useState<'in-person' | 'virtual'>(
    initialFilters?.mode || defaultMode,
  );
  const [situation, setSituation] = useState(initialFilters?.situation || '');
  const [location, setLocation] = useState(initialFilters?.location || '');
  const [preferredPlatform, setPreferredPlatform] = useState(
    initialFilters?.preferredPlatform || '',
  );

  useEffect(() => {
    if (!visible) return;
    setMode(initialFilters?.mode || defaultMode);
    setSituation(initialFilters?.situation || '');
    setLocation(initialFilters?.location || '');
    setPreferredPlatform(initialFilters?.preferredPlatform || '');
  }, [defaultMode, initialFilters, visible]);

  const useCurrentLocation = async () => {
    if (Platform.OS === 'web') {
      setShowWebLocationPermission(true);
      return;
    }

    if (locationPermission?.granted) {
      setLocation('Current location');
      return;
    }

    const permission = await requestLocationPermission();
    if (!permission.granted) {
      return;
    }

    setLocation('Current location');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={filterSheetStyles.modalRoot}>
        <Pressable
          style={filterSheetStyles.backdrop}
          onPress={onClose}
          accessibilityLabel="Close filter sheet"
        />
        <View
          style={[
            filterSheetStyles.sheet,
            {
              backgroundColor: colors.onboardingBackground,
              paddingBottom: Math.max(insets.bottom, 18),
            },
          ]}
        >
          <View style={filterSheetStyles.grabber} />
          <View style={filterSheetStyles.header}>
            <Text
              style={[filterSheetStyles.title, { color: colors.bodyText }]}
              accessibilityRole="header"
            >
              SignBee Agent
            </Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close filters"
              hitSlop={12}
              style={({ pressed }) => [
                filterSheetStyles.closeButton,
                { backgroundColor: colors.softGray },
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="close" size={22} color={colors.bodyText} />
            </Pressable>
          </View>
          <View
            style={[
              filterSheetStyles.divider,
              { backgroundColor: colors.divider },
            ]}
          />

          <KeyboardAwareScrollViewCompat
            contentContainerStyle={filterSheetStyles.content}
            keyboardShouldPersistTaps="handled"
            bottomOffset={96}
            showsVerticalScrollIndicator={false}
          >
            <View style={filterSheetStyles.modeRow}>
              {(['in-person', 'virtual'] as const).map((option) => {
                const selected = mode === option;
                const label = option === 'in-person' ? 'In-person' : 'Virtual';
                return (
                  <Pressable
                    key={option}
                    onPress={() => setMode(option)}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`Choose ${label.toLowerCase()} interpreting`}
                    style={[
                      filterSheetStyles.modeOption,
                      {
                        backgroundColor: selected
                          ? colors.onboardingBackground
                          : colors.softGray,
                        borderBottomColor: selected
                          ? colors.tint
                          : 'transparent',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        filterSheetStyles.modeText,
                        {
                          color: selected
                            ? colors.bodyText
                            : colors.placeholder,
                        },
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[filterSheetStyles.sectionLabel, { color: colors.foreground }]}>
              What's the situation?
            </Text>
            <TextInput
              multiline
              numberOfLines={4}
              value={situation}
              onChangeText={setSituation}
              placeholder="e.g I need an interpreter urgently, my patient just came in for an emergency consultation and can’t communicate..."
              placeholderTextColor={colors.placeholder}
              style={[
                filterSheetStyles.situationInput,
                { borderColor: colors.fieldBorder, color: colors.bodyText },
                Platform.OS === 'web' &&
                  ({ resize: 'vertical' } as unknown as object),
              ]}
              textAlignVertical="top"
              accessibilityLabel="Describe the situation"
            />

            <Text style={[filterSheetStyles.sectionLabel, { color: colors.foreground }]}>
              {mode === 'in-person' ? 'Where are you?' : 'Preferred platform'}
            </Text>
            <TextInput
              value={mode === 'in-person' ? location : preferredPlatform}
              onChangeText={
                mode === 'in-person' ? setLocation : setPreferredPlatform
              }
              placeholder={
                mode === 'in-person'
                  ? 'e.g 40 GRA Road, Beside Kwara Hotel'
                  : 'e.g Zoom, Google Meet, or WhatsApp Video'
              }
              placeholderTextColor={colors.placeholder}
              style={[
                filterSheetStyles.singleLineInput,
                { borderColor: colors.fieldBorder, color: colors.bodyText },
              ]}
              accessibilityLabel={
                mode === 'in-person'
                  ? 'Interpreter location'
                  : 'Preferred video platform'
              }
              returnKeyType="done"
            />

            {mode === 'in-person' && (
              <Pressable
                onPress={() => {
                  void useCurrentLocation();
                }}
                accessibilityRole="button"
                accessibilityLabel="Use my current location"
                style={({ pressed }) => [
                  filterSheetStyles.currentLocationButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name="location-outline"
                  size={25}
                  color={colors.locationGreen}
                />
                <Text
                  style={[
                    filterSheetStyles.currentLocationText,
                    { color: colors.bodyText },
                  ]}
                >
                  Use my current location
                </Text>
              </Pressable>
            )}
          </KeyboardAwareScrollViewCompat>

          <LocationPermissionModal
            visible={showWebLocationPermission}
            onClose={() => setShowWebLocationPermission(false)}
            onAllow={async () => {
              setShowWebLocationPermission(false);
              const permission = locationPermission?.granted
                ? locationPermission
                : await requestLocationPermission();
              if (permission.granted) {
                setLocation('Current location');
              }
            }}
          />

          <View style={filterSheetStyles.footer}>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Cancel interpreter filters"
              style={({ pressed }) => [
                filterSheetStyles.cancelButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[filterSheetStyles.cancelText, { color: colors.brandInk }]}>
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                onApply({
                  mode,
                  situation: situation.trim(),
                  location: mode === 'in-person' ? location.trim() : '',
                  preferredPlatform:
                    mode === 'virtual' ? preferredPlatform.trim() : '',
                });
              }}
              accessibilityRole="button"
              accessibilityLabel="Submit interpreter request"
              style={({ pressed }) => [
                filterSheetStyles.applyButton,
                { backgroundColor: colors.tint },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[filterSheetStyles.applyText, { color: colors.brandInk }]}>
                Submit
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function LocationPermissionModal({
  visible,
  onClose,
  onAllow,
}: {
  visible: boolean;
  onClose: () => void;
  onAllow: () => Promise<void>;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const bottomInset = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={[
          locationPermissionStyles.modalRoot,
          { backgroundColor: colors.onboardingBackground },
        ]}
      >
        <View
          style={[
            locationPermissionStyles.content,
            { paddingTop: topInset, paddingBottom: bottomInset },
          ]}
        >
          <View
            style={[
              locationPermissionStyles.grabber,
              { backgroundColor: colors.softGray },
            ]}
          />

          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close location permission prompt"
            hitSlop={12}
            style={({ pressed }) => [
              locationPermissionStyles.closeButton,
              { backgroundColor: colors.softGray },
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="close" size={24} color={colors.bodyText} />
          </Pressable>

          <View
            style={[
              locationPermissionStyles.checkCircle,
              { backgroundColor: colors.softGreen },
            ]}
          >
            <Ionicons name="checkmark" size={54} color={colors.locationGreen} />
          </View>

          <Text
            style={[
              locationPermissionStyles.title,
              { color: colors.foreground },
            ]}
            accessibilityRole="header"
          >
            Allow “SignBee” to use{'\n'}your location?
          </Text>
          <Text
            style={[
              locationPermissionStyles.description,
              { color: colors.bodyText },
            ]}
          >
            This helps us match you with the{'\n'}nearest available interpreter, especially{'\n'}for urgent requests.
          </Text>

          <View style={locationPermissionStyles.actions}>
            <Pressable
              onPress={() => {
                void onAllow();
              }}
              accessibilityRole="button"
              accessibilityLabel="Allow SignBee to use your location while using the app"
              style={({ pressed }) => [
                locationPermissionStyles.allowButton,
                { backgroundColor: colors.tint },
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[
                  locationPermissionStyles.allowText,
                  { color: colors.brandInk },
                ]}
              >
                Allow While Using App
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                void onAllow();
              }}
              accessibilityRole="button"
              accessibilityLabel="Allow SignBee to use your location once"
              style={({ pressed }) => [
                locationPermissionStyles.onceButton,
                { backgroundColor: colors.triageCancel },
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[
                  locationPermissionStyles.onceText,
                  { color: colors.mutedForeground },
                ]}
              >
                Allow once
              </Text>
            </Pressable>

            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Do not allow SignBee to use your location"
              style={({ pressed }) => [
                locationPermissionStyles.denyButton,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[
                  locationPermissionStyles.denyText,
                  { color: colors.mutedForeground },
                ]}
              >
                Don’t Allow
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function TriageProgressSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={triageStyles.modalRoot}>
        <Pressable
          style={triageStyles.backdrop}
          onPress={onClose}
          accessibilityLabel="Close triage progress"
        />
        <View
          style={[
            triageStyles.sheet,
            {
              backgroundColor: colors.onboardingBackground,
              paddingBottom: Math.max(insets.bottom, 18),
            },
          ]}
          testID="triage-progress-sheet"
        >
          <View style={triageStyles.grabber} />
          <View style={triageStyles.header}>
            <Text
              style={[triageStyles.title, { color: colors.foreground }]}
              accessibilityRole="header"
            >
              SignBee Agent
            </Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close triage progress"
              hitSlop={12}
              style={({ pressed }) => [
                triageStyles.closeButton,
                { backgroundColor: colors.softGray },
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="close" size={21} color={colors.foreground} />
            </Pressable>
          </View>
          <View
            style={[
              triageStyles.divider,
              { backgroundColor: colors.divider },
            ]}
          />

          <View
            style={[
              triageStyles.content,
              { paddingBottom: Math.max(insets.bottom, 18) + 12 },
            ]}
          >
            <View
              style={[
                triageStyles.triageCard,
                { backgroundColor: colors.triageCard },
              ]}
            >
              <View style={triageStyles.triageCardTitleRow}>
                <Text style={[triageStyles.triageTitle, { color: colors.foreground }]}>
                  Triaging your request · 6s
                </Text>
                <Ionicons
                  name="paper-plane-outline"
                  size={27}
                  color={colors.foreground}
                />
              </View>

              <TriageStep
                complete
                title="Read your request"
                detail="A&E visit · unplanned"
                colors={colors}
              />
              <TriageStep
                complete
                title="Filtered for who is free now"
                detail="42 interpreters scanned"
                colors={colors}
              />
              <TriageStep
                title="Ranking by distance & fit"
                detail="Within 5 km of M13"
                colors={colors}
              />
            </View>

            <View
              style={[
                triageStyles.progressTrack,
                { backgroundColor: colors.progressBackground },
              ]}
            >
              <View
                style={[
                  triageStyles.progressFill,
                  { backgroundColor: colors.tint },
                ]}
              />
            </View>

            <Text style={[triageStyles.timingText, { color: colors.triageText }]}>
              Usually matched in under 30 seconds
            </Text>

            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Cancel triage"
              style={({ pressed }) => [
                triageStyles.cancelButton,
                { backgroundColor: colors.triageCancel },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[triageStyles.cancelText, { color: colors.placeholder }]}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function TriageStep({
  complete = false,
  title,
  detail,
  colors,
}: {
  complete?: boolean;
  title: string;
  detail: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={triageStyles.step}>
      <View
        style={[
          triageStyles.stepIcon,
          {
            backgroundColor: complete
              ? colors.triageCheck
              : colors.triagePending,
          },
        ]}
      >
        {complete && (
          <Ionicons name="checkmark" size={26} color={colors.triageGreen} />
        )}
      </View>
      <View style={triageStyles.stepCopy}>
        <Text style={[triageStyles.stepTitle, { color: colors.triageText }]}>
          {title}
        </Text>
        <Text style={[triageStyles.stepDetail, { color: colors.triageText }]}>
          {detail}
        </Text>
      </View>
    </View>
  );
}

const locationPermissionStyles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 28,
  },
  grabber: {
    borderRadius: 999,
    height: 6,
    marginTop: 16,
    width: 74,
  },
  closeButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    borderRadius: 999,
    height: 40,
    justifyContent: 'center',
    marginRight: 4,
    marginTop: 38,
    width: 40,
  },
  checkCircle: {
    alignItems: 'center',
    borderRadius: 999,
    height: 128,
    justifyContent: 'center',
    marginTop: 2,
    width: 128,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 38,
    marginTop: 46,
    textAlign: 'center',
  },
  description: {
    fontSize: 20,
    lineHeight: 33,
    marginTop: 28,
    textAlign: 'center',
  },
  actions: {
    alignSelf: 'stretch',
    marginTop: 'auto',
  },
  allowButton: {
    alignItems: 'center',
    borderRadius: 28,
    justifyContent: 'center',
    minHeight: 74,
    paddingHorizontal: 18,
  },
  allowText: {
    fontSize: 21,
    fontWeight: '700',
  },
  onceButton: {
    alignItems: 'center',
    borderRadius: 28,
    justifyContent: 'center',
    marginTop: 16,
    minHeight: 74,
    paddingHorizontal: 18,
  },
  onceText: {
    fontSize: 21,
    fontWeight: '600',
  },
  denyButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 74,
    paddingHorizontal: 18,
  },
  denyText: {
    fontSize: 21,
    fontWeight: '600',
  },
});

const triageStyles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(51, 41, 79, 0.08)',
  },
  sheet: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    maxHeight: '100%',
    minHeight: '100%',
    overflow: 'hidden',
  },
  grabber: {
    alignSelf: 'center',
    backgroundColor: '#F1F0F3',
    borderRadius: 999,
    height: 6,
    marginBottom: 34,
    marginTop: 16,
    width: 74,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 42,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.9,
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: 999,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  divider: {
    height: 1,
    marginHorizontal: 42,
    marginTop: 25,
  },
  content: {
    paddingHorizontal: 42,
    paddingTop: 48,
  },
  triageCard: {
    borderRadius: 20,
    paddingHorizontal: 39,
    paddingVertical: 35,
  },
  triageCardTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  triageTitle: {
    fontSize: 23,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  step: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 18,
    marginBottom: 22,
  },
  stepIcon: {
    alignItems: 'center',
    borderRadius: 7,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  stepCopy: {
    flex: 1,
    paddingTop: 1,
  },
  stepTitle: {
    fontSize: 21,
    fontWeight: '700',
    lineHeight: 27,
  },
  stepDetail: {
    fontSize: 18,
    lineHeight: 27,
    marginTop: 4,
  },
  progressTrack: {
    borderRadius: 999,
    height: 8,
    marginTop: 38,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    borderRadius: 999,
    height: '100%',
    width: '62%',
  },
  timingText: {
    fontSize: 21,
    fontWeight: '700',
    marginTop: 27,
  },
  cancelButton: {
    alignItems: 'center',
    borderRadius: 22,
    justifyContent: 'center',
    marginTop: 64,
    minHeight: 80,
    width: '100%',
  },
  cancelText: {
    fontSize: 22,
    fontWeight: '700',
  },
});

const filterSheetStyles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(51, 41, 79, 0.08)',
  },
  sheet: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    maxHeight: '100%',
    minHeight: '100%',
    overflow: 'hidden',
  },
  grabber: {
    alignSelf: 'center',
    backgroundColor: '#F1F0F3',
    borderRadius: 999,
    height: 6,
    marginBottom: 34,
    marginTop: 16,
    width: 74,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 42,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.9,
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: 999,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  divider: {
    height: 1,
    marginHorizontal: 42,
    marginTop: 25,
  },
  content: {
    paddingBottom: 30,
    paddingHorizontal: 42,
    paddingTop: 58,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 16,
  },
  modeOption: {
    alignItems: 'center',
    borderBottomWidth: 2,
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
    minHeight: 68,
  },
  modeText: {
    fontSize: 22,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    marginBottom: 22,
    marginTop: 44,
  },
  situationInput: {
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 20,
    lineHeight: 28,
    minHeight: 204,
    paddingHorizontal: 26,
    paddingTop: 24,
  },
  singleLineInput: {
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 20,
    minHeight: 84,
    paddingHorizontal: 26,
  },
  currentLocationButton: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 22,
    paddingVertical: 4,
  },
  currentLocationText: {
    fontSize: 19,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 56,
    paddingTop: 22,
  },
  cancelButton: {
    minHeight: 54,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  cancelText: {
    fontSize: 23,
    fontWeight: '700',
  },
  applyButton: {
    alignItems: 'center',
    borderRadius: 28,
    justifyContent: 'center',
    minHeight: 68,
    minWidth: 166,
    paddingHorizontal: 30,
  },
  applyText: {
    fontSize: 23,
    fontWeight: '700',
  },
});

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
  purposeRow: {
    gap: 8,
    paddingRight: 12,
  },
  purposeChip: {
    borderRadius: 18,
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  purposeText: {
    fontSize: 13,
    fontWeight: '600',
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
  optional: {
    fontSize: 14,
    fontWeight: '400',
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
  notesInput: {
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 15,
    lineHeight: 21,
    minHeight: 96,
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  attachField: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 62,
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  attachmentPreview: {
    borderRadius: 6,
    height: 38,
    marginRight: 10,
    width: 38,
  },
  attachText: {
    fontSize: 15,
    marginLeft: 8,
  },
  appliedFilterCard: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
    minHeight: 68,
    paddingHorizontal: 16,
  },
  appliedFilterCopy: {
    flex: 1,
    marginRight: 12,
  },
  appliedFilterTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  appliedFilterSummary: {
    fontSize: 13,
    marginTop: 4,
  },
  findButton: {
    alignItems: 'center',
    borderRadius: 14,
    justifyContent: 'center',
    marginTop: 32,
    minHeight: 53,
  },
  findButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});