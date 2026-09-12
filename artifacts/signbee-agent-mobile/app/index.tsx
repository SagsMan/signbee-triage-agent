import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

type Mode = "in-person" | "virtual";
type Screen =
  | "onboarding"
  | "home"
  | "request"
  | "matching"
  | "matched"
  | "chat"
  | "payment-method"
  | "card-details"
  | "payment"
  | "backup"
  | "success";
type Tab = "home" | "requests" | "profile";

type Draft = {
  mode: Mode;
  situation: string;
  destination: string;
  platform: string;
  language: string;
  setting: string;
};

type ChatMessage = {
  id: string;
  body: string;
  from: "agent" | "me";
  time: string;
};

const initialDraft: Draft = {
  mode: "in-person",
  situation: "",
  destination: "",
  platform: "",
  language: "Nigerian Sign Language",
  setting: "Other",
};

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    body: "Hi Ify, I’m Mary, your interpreter for tomorrow’s event. Do you have any specific requests or information I should know before the session?",
    from: "agent",
    time: "09:10 AM",
  },
  {
    id: "2",
    body: "Hello Mary! Thanks for reaching out, it’s a business workshop by 10 AM, at our Lagos office. It’ll be in-person.",
    from: "me",
    time: "09:15 AM",
  },
  {
    id: "3",
    body: "Alright, noted. Looking forward to supporting your event.",
    from: "agent",
    time: "09:16 AM",
  },
  {
    id: "4",
    body: "Alright, see you.",
    from: "me",
    time: "Just now",
  },
];

function triggerHaptic() {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

function AppButton({
  label,
  onPress,
  secondary = false,
  disabled = false,
  icon,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Feather.glyphMap;
}) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={() => {
        triggerHaptic();
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: secondary ? colors.secondary : colors.primary,
          opacity: disabled ? 0.48 : pressed ? 0.78 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          {
            color: secondary
              ? colors.secondaryForeground
              : colors.primaryForeground,
          },
        ]}
      >
        {label}
      </Text>
      {icon ? (
        <Feather
          name={icon}
          size={18}
          color={
            secondary ? colors.secondaryForeground : colors.primaryForeground
          }
        />
      ) : null}
    </Pressable>
  );
}

function TopBar({
  title = "SignBee",
  onBack,
  onClose,
}: {
  title?: string;
  onBack?: () => void;
  onClose?: () => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.topBar}>
      {onBack ? (
        <Pressable
          accessibilityLabel="Go back"
          onPress={onBack}
          style={styles.iconButton}
          hitSlop={10}
        >
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
      ) : (
        <View style={styles.iconButton} />
      )}
      <Text style={[styles.topBarTitle, { color: colors.foreground }]}>
        {title}
      </Text>
      {onClose ? (
        <Pressable
          accessibilityLabel="Close"
          onPress={onClose}
          style={[styles.closeButton, { backgroundColor: colors.muted }]}
          hitSlop={10}
        >
          <Feather name="x" size={17} color={colors.foreground} />
        </Pressable>
      ) : (
        <View style={styles.iconButton} />
      )}
    </View>
  );
}

function BrandMark({ large = false }: { large?: boolean }) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.brandMark,
        large ? styles.brandMarkLarge : null,
        { backgroundColor: colors.foreground },
      ]}
    >
      <Image
        source={require("../assets/images/icon.png")}
        style={large ? styles.logoLarge : styles.logoSmall}
      />
    </View>
  );
}

function AppSplash() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.flex,
        styles.splashScreen,
        { backgroundColor: colors.primary },
      ]}
    >
      <View
        style={[styles.splashCenter, { marginTop: insets.top - insets.bottom }]}
      >
        <Image
          source={require("../assets/images/splash-logo.png")}
          resizeMode="contain"
          style={styles.splashLogo}
        />
      </View>
    </View>
  );
}

function Onboarding({ onDone }: { onDone: () => void }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.onboardingContent,
          { paddingTop: insets.top + 22, paddingBottom: insets.bottom + 18 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.onboardingBrand, { color: colors.foreground }]}>
          SignBee
        </Text>
        <View style={styles.onboardingArt}>
          <Image
            source={require("../assets/images/onboarding-art.png")}
            resizeMode="contain"
            style={styles.onboardingArtImage}
          />
        </View>
        <Image
          accessibilityLabel="Build a More Inclusive World. Connect with certified interpreters and bridge communication gaps instantly."
          source={require("../assets/images/onboarding-copy.png")}
          resizeMode="contain"
          style={styles.onboardingCopyImage}
        />
        <View style={styles.pagination}>
          <View
            style={[
              styles.paginationActive,
              { backgroundColor: colors.foreground },
            ]}
          />
          <View
            style={[styles.paginationDot, { backgroundColor: colors.muted }]}
          />
          <View
            style={[styles.paginationDot, { backgroundColor: colors.muted }]}
          />
        </View>
        <View style={styles.onboardingActions}>
          <Pressable onPress={onDone} hitSlop={12}>
            <Text style={[styles.skipText, { color: colors.foreground }]}>
              Skip
            </Text>
          </Pressable>
          <AppButton label="Next" onPress={onDone} icon="arrow-right" />
        </View>
      </ScrollView>
    </View>
  );
}

function Home({
  onStart,
  onMatched,
  tab,
  onTab,
}: {
  onStart: () => void;
  onMatched: () => void;
  tab: Tab;
  onTab: (tab: Tab) => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const profile = tab === "profile";
  const requests = tab === "requests";
  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 22,
          paddingBottom: insets.bottom + 106,
          paddingHorizontal: 22,
        }}
      >
        <View style={styles.homeHeader}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>
              {profile
                ? "YOUR ACCOUNT"
                : requests
                  ? "YOUR REQUESTS"
                  : "WELCOME BACK"}
            </Text>
            <Text style={[styles.homeTitle, { color: colors.foreground }]}>
              {profile ? "Profile" : requests ? "Your requests" : "Hi, Steve"}
            </Text>
          </View>
          <View style={[styles.avatar, { backgroundColor: colors.lilac }]}>
            <Text style={[styles.avatarText, { color: colors.foreground }]}>
              S
            </Text>
          </View>
        </View>

        {profile ? (
          <View style={styles.profileContent}>
            <View
              style={[
                styles.profileCard,
                { backgroundColor: colors.foreground },
              ]}
            >
              <View
                style={[
                  styles.avatarLarge,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text
                  style={[styles.avatarTextLarge, { color: colors.foreground }]}
                >
                  S
                </Text>
              </View>
              <Text style={[styles.profileName, { color: colors.white }]}>
                Steve Adebayo
              </Text>
              <Text style={[styles.profileCaption, { color: colors.muted }]}>
                Lagos, Nigeria
              </Text>
            </View>
            {[
              "Personal details",
              "Notification preferences",
              "Help & support",
            ].map((item) => (
              <Pressable
                key={item}
                style={[
                  styles.settingsRow,
                  { borderBottomColor: colors.border },
                ]}
              >
                <Text
                  style={[styles.settingsLabel, { color: colors.foreground }]}
                >
                  {item}
                </Text>
                <Feather
                  name="chevron-right"
                  size={18}
                  color={colors.mutedForeground}
                />
              </Pressable>
            ))}
          </View>
        ) : requests ? (
          <View>
            <RequestRow
              title="Business workshop"
              meta="In-person · Tomorrow, 10:00 AM"
              status="Interpreter matched"
              onPress={onMatched}
            />
            <RequestRow
              title="Hospital appointment"
              meta="Virtual · Aug 23, 2:30 PM"
              status="Completed"
              muted
            />
            <View style={styles.emptyNote}>
              <Feather name="inbox" size={20} color={colors.mutedForeground} />
              <Text
                style={[
                  styles.emptyNoteText,
                  { color: colors.mutedForeground },
                ]}
              >
                Your next request will appear here.
              </Text>
            </View>
          </View>
        ) : (
          <>
            <View
              style={[styles.heroCard, { backgroundColor: colors.foreground }]}
            >
              <View style={styles.heroOrb} />
              <Text style={[styles.heroLabel, { color: colors.primary }]}>
                INTERPRETER MATCHING
              </Text>
              <Text style={[styles.heroTitle, { color: colors.white }]}>
                Tell us what you need.{"\n"}We’ll find the right fit.
              </Text>
              <Text style={[styles.heroBody, { color: colors.muted }]}>
                Describe your situation and SignBee Agent will take care of the
                next steps.
              </Text>
              <AppButton
                label="Find an interpreter"
                onPress={onStart}
                icon="arrow-up-right"
              />
            </View>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Active request
              </Text>
              <Pressable onPress={onMatched}>
                <Text style={[styles.linkText, { color: colors.foreground }]}>
                  View all
                </Text>
              </Pressable>
            </View>
            <RequestRow
              title="Business workshop"
              meta="In-person · Tomorrow, 10:00 AM"
              status="Interpreter matched"
              onPress={onMatched}
            />
            <View
              style={[styles.tipCard, { backgroundColor: colors.softGreen }]}
            >
              <View
                style={[styles.tipIcon, { backgroundColor: colors.primary }]}
              >
                <Feather
                  name="message-circle"
                  size={18}
                  color={colors.foreground}
                />
              </View>
              <View style={styles.tipCopy}>
                <Text style={[styles.tipTitle, { color: colors.foreground }]}>
                  Need help?
                </Text>
                <Text
                  style={[
                    styles.tipBody,
                    { color: colors.secondaryForeground },
                  ]}
                >
                  Our support team is available if you need a hand.
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={19}
                color={colors.foreground}
              />
            </View>
          </>
        )}
      </ScrollView>
      <BottomNav active={tab} onChange={onTab} />
    </View>
  );
}

function RequestRow({
  title,
  meta,
  status,
  onPress,
  muted = false,
}: {
  title: string;
  meta: string;
  status: string;
  onPress?: () => void;
  muted?: boolean;
}) {
  const colors = useColors();
  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.requestRow,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.requestStatusDot,
          { backgroundColor: muted ? colors.muted : colors.primary },
        ]}
      />
      <View style={styles.requestRowCopy}>
        <Text style={[styles.requestTitle, { color: colors.foreground }]}>
          {title}
        </Text>
        <Text style={[styles.requestMeta, { color: colors.mutedForeground }]}>
          {meta}
        </Text>
        <Text
          style={[
            styles.requestStatus,
            { color: muted ? colors.mutedForeground : colors.success },
          ]}
        >
          {status}
        </Text>
      </View>
      {onPress ? (
        <Feather
          name="chevron-right"
          size={18}
          color={colors.mutedForeground}
        />
      ) : null}
    </Pressable>
  );
}

function BottomNav({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (tab: Tab) => void;
}) {
  const colors = useColors();
  const items: {
    key: Tab;
    label: string;
    icon: keyof typeof Feather.glyphMap;
  }[] = [
    { key: "home", label: "Home", icon: "home" },
    { key: "requests", label: "Requests", icon: "layers" },
    { key: "profile", label: "Profile", icon: "user" },
  ];
  return (
    <View
      style={[
        styles.bottomNav,
        { backgroundColor: colors.white, borderTopColor: colors.border },
      ]}
    >
      {items.map((item) => {
        const selected = active === item.key;
        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            key={item.key}
            onPress={() => {
              triggerHaptic();
              onChange(item.key);
            }}
            style={styles.bottomNavItem}
          >
            <Feather
              name={item.icon}
              size={20}
              color={selected ? colors.foreground : colors.mutedForeground}
            />
            <Text
              style={[
                styles.bottomNavLabel,
                {
                  color: selected ? colors.foreground : colors.mutedForeground,
                },
              ]}
            >
              {item.label}
            </Text>
            {selected ? (
              <View
                style={[
                  styles.navIndicator,
                  { backgroundColor: colors.primary },
                ]}
              />
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

function RequestForm({
  draft,
  setDraft,
  onSubmit,
  onCancel,
}: {
  draft: Draft;
  setDraft: React.Dispatch<React.SetStateAction<Draft>>;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const valid =
    draft.situation.trim().length > 8 &&
    (draft.mode === "virtual"
      ? draft.platform.trim().length > 0
      : draft.destination.trim().length > 0);
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.flex, { backgroundColor: colors.background }]}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 30 }}
        >
          <View style={{ paddingHorizontal: 42, paddingTop: insets.top + 14 }}>
            <TopBar title="SignBee Agent" onClose={onCancel} />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <View style={styles.modeSwitch}>
              {(["in-person", "virtual"] as Mode[]).map((mode) => {
                const selected = draft.mode === mode;
                return (
                  <Pressable
                    key={mode}
                    onPress={() =>
                      setDraft((current) => ({ ...current, mode }))
                    }
                    style={[
                      styles.modeButton,
                      {
                        backgroundColor: selected ? colors.white : colors.lilac,
                        borderBottomColor: selected
                          ? colors.primary
                          : "transparent",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.modeLabel,
                        {
                          color: selected
                            ? colors.foreground
                            : colors.mutedForeground,
                        },
                      ]}
                    >
                      {mode === "in-person" ? "In-person" : "Virtual"}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <FieldLabel label="What’s the situation?" />
            <TextInput
              multiline
              numberOfLines={5}
              placeholder="e.g. I need an interpreter urgently, my patient just came in for an emergency consultation..."
              placeholderTextColor={colors.mutedForeground}
              value={draft.situation}
              onChangeText={(situation) =>
                setDraft((current) => ({ ...current, situation }))
              }
              style={[
                styles.textArea,
                {
                  borderColor: colors.border,
                  color: colors.foreground,
                  backgroundColor: colors.white,
                },
              ]}
              textAlignVertical="top"
            />

            <FieldLabel
              label={
                draft.mode === "in-person"
                  ? "Where are you?"
                  : "Preferred platform"
              }
            />
            <TextInput
              placeholder={
                draft.mode === "in-person"
                  ? "e.g. 40 GRA Road, Beside Kwara Hotel"
                  : "e.g. Zoom, Google Meet, or WhatsApp Video"
              }
              placeholderTextColor={colors.mutedForeground}
              value={
                draft.mode === "in-person" ? draft.destination : draft.platform
              }
              onChangeText={(value) =>
                setDraft((current) =>
                  draft.mode === "in-person"
                    ? { ...current, destination: value }
                    : { ...current, platform: value },
                )
              }
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.foreground,
                  backgroundColor: colors.white,
                },
              ]}
            />
            {draft.mode === "in-person" ? (
              <Pressable
                onPress={() =>
                  setDraft((current) => ({
                    ...current,
                    destination: current.destination || "Lagos, Nigeria",
                  }))
                }
                style={styles.locationButton}
              >
                <Feather name="map-pin" size={18} color={colors.success} />
                <Text
                  style={[styles.locationText, { color: colors.foreground }]}
                >
                  Use my current location
                </Text>
              </Pressable>
            ) : null}
          </View>
        </ScrollView>
        <View
          style={[
            styles.formFooter,
            {
              backgroundColor: colors.background,
              paddingBottom: insets.bottom + 12,
              paddingHorizontal: 42,
            },
          ]}
        >
          <Pressable onPress={onCancel} hitSlop={12}>
            <Text style={[styles.cancelText, { color: colors.foreground }]}>
              Cancel
            </Text>
          </Pressable>
          <View style={{ width: 164 }}>
            <AppButton
              label="Submit"
              onPress={() => {
                if (valid) onSubmit();
              }}
              icon="arrow-right"
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function FieldLabel({ label }: { label: string }) {
  const colors = useColors();
  return (
    <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
      {label}
    </Text>
  );
}

function Matching({ onCancel }: { onCancel: () => void }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const steps = [
    "Read your request",
    "Filtered interpreters who are free now",
    "Ranking by distance & fit",
  ];
  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <View style={{ paddingHorizontal: 22, paddingTop: insets.top + 14 }}>
        <TopBar title="SignBee Agent" onClose={onCancel} />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.triageContent,
          { paddingBottom: insets.bottom + 26 },
        ]}
      >
        <View
          style={[styles.statusCard, { backgroundColor: colors.softGreen }]}
        >
          <View style={styles.triageHeading}>
            <Text style={[styles.triageTitle, { color: colors.foreground }]}>
              Triaging your request · 6s
            </Text>
            <ActivityIndicator size="small" color={colors.foreground} />
          </View>
          {steps.map((step, index) => (
            <View key={step} style={styles.statusRow}>
              <View
                style={[
                  styles.statusCheck,
                  { backgroundColor: index === 2 ? "#D6F8DF" : "#D6F8DF" },
                ]}
              >
                {index < 2 ? (
                  <Feather name="check" size={18} color="#2BAA60" />
                ) : null}
              </View>
              <View style={styles.triageStepCopy}>
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        index === 2
                          ? colors.mutedForeground
                          : colors.foreground,
                    },
                  ]}
                >
                  {step}
                </Text>
                <Text
                  style={[
                    styles.triageSubtext,
                    {
                      color:
                        index === 2
                          ? colors.mutedForeground
                          : colors.mutedForeground,
                    },
                  ]}
                >
                  {index === 0
                    ? "A&E visit · unplanned"
                    : index === 1
                      ? "42 interpreters scanned"
                      : "Within 5 km of M13"}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <View style={[styles.progressTrack, { backgroundColor: colors.lilac }]}>
          <View
            style={[styles.progressFill, { backgroundColor: colors.primary }]}
          />
        </View>
        <Text style={[styles.matchingHint, { color: colors.mutedForeground }]}>
          Usually matched in under 30 seconds
        </Text>
        <Pressable
          onPress={onCancel}
          style={[styles.triageCancel, { backgroundColor: colors.lilac }]}
        >
          <Text
            style={[styles.triageCancelText, { color: colors.mutedForeground }]}
          >
            Cancel
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Matched({
  onChat,
  onPayment,
  onBack,
}: {
  onChat: () => void;
  onPayment: () => void;
  onBack: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 22,
          paddingTop: insets.top + 14,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <TopBar title="Your interpreter" onBack={onBack} />
        <View
          style={[styles.matchHero, { backgroundColor: colors.foreground }]}
        >
          <View
            style={[styles.onlineAvatar, { backgroundColor: colors.primary }]}
          >
            <Text
              style={[styles.onlineAvatarText, { color: colors.foreground }]}
            >
              M
            </Text>
          </View>
          <View style={styles.onlineBadge}>
            <View
              style={[styles.onlineDot, { backgroundColor: colors.success }]}
            />
            <Text style={[styles.onlineLabel, { color: colors.success }]}>
              Online now
            </Text>
          </View>
          <Text style={[styles.matchName, { color: colors.white }]}>
            Mary Olayemi
          </Text>
          <Text style={[styles.matchMeta, { color: colors.muted }]}>
            Certified interpreter · 8 years experience
          </Text>
          <View style={styles.matchTags}>
            <View style={[styles.matchTag, { backgroundColor: colors.lilac }]}>
              <Text style={[styles.matchTagText, { color: colors.foreground }]}>
                NSL
              </Text>
            </View>
            <View style={[styles.matchTag, { backgroundColor: colors.lilac }]}>
              <Text style={[styles.matchTagText, { color: colors.foreground }]}>
                Lagos
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Request details
          </Text>
        </View>
        <View
          style={[
            styles.detailCard,
            { backgroundColor: colors.white, borderColor: colors.border },
          ]}
        >
          <DetailItem label="Session" value="Business workshop" />
          <DetailItem label="When" value="Tomorrow · 10:00 AM" />
          <DetailItem label="Where" value="Lagos, Nigeria" />
        </View>
        <View style={styles.matchedActions}>
          <View style={{ flex: 1 }}>
            <AppButton
              label="Message"
              onPress={onChat}
              secondary
              icon="message-circle"
            />
          </View>
          <View style={{ flex: 1 }}>
            <AppButton
              label="Continue"
              onPress={onPayment}
              icon="arrow-right"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  const colors = useColors();
  return (
    <View style={styles.detailItem}>
      <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
      <Text style={[styles.detailValue, { color: colors.foreground }]}>
        {value}
      </Text>
    </View>
  );
}

function Chat({
  onBack,
  onPayment,
}: {
  onBack: () => void;
  onPayment: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const data = useMemo(() => [...messages].reverse(), [messages]);
  const send = () => {
    if (!draft.trim()) return;
    setMessages((current) => [
      ...current,
      { id: `${Date.now()}`, body: draft.trim(), from: "me", time: "Just now" },
    ]);
    setDraft("");
    triggerHaptic();
  };
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.flex, { backgroundColor: colors.background }]}>
        <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 18 }}>
          <View style={styles.chatHeader}>
            <Pressable onPress={onBack} style={styles.iconButton} hitSlop={10}>
              <Feather name="arrow-left" size={22} color={colors.foreground} />
            </Pressable>
            <View
              style={[styles.chatAvatar, { backgroundColor: colors.primary }]}
            >
              <Text
                style={[styles.chatAvatarText, { color: colors.foreground }]}
              >
                M
              </Text>
            </View>
            <View style={styles.chatHeaderCopy}>
              <Text style={[styles.chatName, { color: colors.foreground }]}>
                Mary Olayemi
              </Text>
              <View style={styles.chatOnline}>
                <View
                  style={[
                    styles.onlineDot,
                    { backgroundColor: colors.success },
                  ]}
                />
                <Text
                  style={[
                    styles.chatOnlineText,
                    { color: colors.mutedForeground },
                  ]}
                >
                  Online
                </Text>
              </View>
            </View>
            <Pressable style={styles.chatAction}>
              <Feather name="phone" size={18} color={colors.success} />
            </Pressable>
            <Pressable style={styles.chatAction}>
              <Feather name="video" size={18} color={colors.success} />
            </Pressable>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.chatStarted, { color: colors.mutedForeground }]}>
            Steve just started a conversation
          </Text>
        </View>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={{
            paddingHorizontal: 22,
            paddingTop: 10,
            paddingBottom: 18,
          }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBlock,
                item.from === "me" ? styles.messageMine : styles.messageTheirs,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  {
                    backgroundColor:
                      item.from === "me" ? colors.softGreen : colors.muted,
                    borderBottomRightRadius: item.from === "me" ? 4 : 22,
                    borderBottomLeftRadius: item.from === "agent" ? 4 : 22,
                  },
                ]}
              >
                <Text
                  style={[styles.messageText, { color: colors.foreground }]}
                >
                  {item.body}
                </Text>
              </View>
              <Text
                style={[styles.messageTime, { color: colors.mutedForeground }]}
              >
                {item.time}
              </Text>
            </View>
          )}
        />
        <View
          style={[
            styles.chatFooter,
            {
              paddingBottom: insets.bottom + 10,
              backgroundColor: colors.background,
            },
          ]}
        >
          <View
            style={[
              styles.chatInputWrap,
              { borderColor: colors.border, backgroundColor: colors.white },
            ]}
          >
            <Feather
              name="paperclip"
              size={16}
              color={colors.mutedForeground}
            />
            <TextInput
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={send}
              placeholder="Message Mary"
              placeholderTextColor={colors.mutedForeground}
              style={[styles.chatInput, { color: colors.foreground }]}
              returnKeyType="send"
            />
            <Pressable
              onPress={send}
              style={[styles.sendButton, { backgroundColor: colors.primary }]}
              hitSlop={8}
            >
              <Feather name="send" size={16} color={colors.foreground} />
            </Pressable>
          </View>
          <Pressable onPress={onPayment} style={styles.paymentLink}>
            <Text
              style={[
                styles.paymentLinkText,
                { color: colors.mutedForeground },
              ]}
            >
              View request payment
            </Text>
            <Feather
              name="chevron-right"
              size={16}
              color={colors.mutedForeground}
            />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function PaymentMethod({
  onClose,
  onCard,
  onTransfer,
}: {
  onClose: () => void;
  onCard: () => void;
  onTransfer: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <View style={{ paddingHorizontal: 50, paddingTop: insets.top + 14 }}>
        <TopBar title="Payment method" onClose={onClose} />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.paymentChoices}>
          <PaymentChoice
            icon="credit-card"
            label="Debit/Credit Card"
            onPress={onCard}
          />
          <PaymentChoice
            icon="home"
            label="Bank Transfer"
            onPress={onTransfer}
          />
        </View>
      </View>
      <View
        style={[styles.bottomCancel, { paddingBottom: insets.bottom + 14 }]}
      >
        <Pressable
          onPress={onClose}
          style={[styles.largeCancel, { backgroundColor: colors.lilac }]}
        >
          <Text
            style={[styles.largeCancelText, { color: colors.mutedForeground }]}
          >
            Cancel
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function PaymentChoice({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.paymentChoice,
        { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Feather name={icon} size={26} color={colors.foreground} />
      <Text style={[styles.paymentChoiceLabel, { color: colors.foreground }]}>
        {label}
      </Text>
      <View style={[styles.radio, { borderColor: colors.mutedForeground }]} />
    </Pressable>
  );
}

function CardDetails({
  onClose,
  onPay,
}: {
  onClose: () => void;
  onPay: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const valid =
    number.replace(/\s/g, "").length >= 12 &&
    expiry.length >= 4 &&
    cvv.length >= 3;
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.flex, { backgroundColor: colors.background }]}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: 50,
            paddingTop: insets.top + 14,
            paddingBottom: 28,
          }}
        >
          <TopBar title="Enter card details" onClose={onClose} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.cardLabel, { color: colors.foreground }]}>
            Card number
          </Text>
          <TextInput
            value={number}
            onChangeText={setNumber}
            keyboardType="number-pad"
            placeholder="0000 0000 0000 0000"
            placeholderTextColor={colors.mutedForeground}
            style={[
              styles.cardInput,
              { borderColor: colors.border, color: colors.foreground },
            ]}
          />
          <View style={styles.cardFieldsRow}>
            <View style={styles.cardFieldHalf}>
              <Text style={[styles.cardLabel, { color: colors.foreground }]}>
                Expiry date
              </Text>
              <View
                style={[
                  styles.cardInputWithIcon,
                  { borderColor: colors.border },
                ]}
              >
                <TextInput
                  value={expiry}
                  onChangeText={setExpiry}
                  placeholder="MM/YY"
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.cardInputInner, { color: colors.foreground }]}
                />
                <Feather name="calendar" size={22} color={colors.foreground} />
              </View>
            </View>
            <View style={styles.cardFieldHalf}>
              <Text style={[styles.cardLabel, { color: colors.foreground }]}>
                CVV
              </Text>
              <View
                style={[
                  styles.cardInputWithIcon,
                  { borderColor: colors.border },
                ]}
              >
                <TextInput
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="number-pad"
                  placeholder="123"
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.cardInputInner, { color: colors.foreground }]}
                />
                <Feather
                  name="chevron-down"
                  size={22}
                  color={colors.mutedForeground}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <View
          style={[
            styles.formFooter,
            {
              backgroundColor: colors.background,
              paddingBottom: insets.bottom + 14,
            },
          ]}
        >
          <Pressable onPress={onClose} hitSlop={12}>
            <Text style={[styles.cancelText, { color: colors.foreground }]}>
              Cancel
            </Text>
          </Pressable>
          <View style={{ width: 142 }}>
            <AppButton
              label="Pay"
              onPress={() => {
                if (valid) onPay();
              }}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function Payment({
  onSent,
  onBack,
}: {
  onSent: () => void;
  onBack: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{
          padding: 22,
          paddingTop: insets.top + 14,
          paddingBottom: insets.bottom + 22,
        }}
      >
        <TopBar title="Transfer ₦22,000.50" onClose={onBack} />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={[styles.bankCard, { backgroundColor: colors.white }]}>
          <DetailItem label="BANK NAME" value="Paystack - Titan" />
          <DetailItem label="ACCOUNT NUMBER" value="2218765831" />
          <DetailItem label="AMOUNT" value="NGN 22,000.50" />
        </View>
        <Text style={[styles.expiryCopy, { color: colors.mutedForeground }]}>
          This account is for this transaction only and expires in{" "}
          <Text style={{ color: colors.success }}>20:19 mins</Text>
        </Text>
        <View style={styles.paymentActions}>
          <Pressable onPress={onBack} hitSlop={12}>
            <Text style={[styles.cancelText, { color: colors.foreground }]}>
              Cancel
            </Text>
          </Pressable>
          <View style={{ width: 132 }}>
            <AppButton label="Sent" onPress={onSent} icon="check" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Backup({
  onClose,
  onHome,
}: {
  onClose: () => void;
  onHome: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const people = [
    { initial: "U", name: "Uzor Kenny", time: "14 min away" },
    { initial: "A", name: "Amara John", time: "16 min away" },
    { initial: "A", name: "Amara John", time: "14 min away" },
  ];
  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 50,
          paddingTop: insets.top + 14,
          paddingBottom: insets.bottom + 28,
        }}
      >
        <TopBar title="Backups on standby" onClose={onClose} />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.backupList}>
          {people.map((person) => (
            <View
              key={`${person.name}-${person.time}`}
              style={[
                styles.backupRow,
                { borderColor: colors.border, backgroundColor: colors.white },
              ]}
            >
              <View
                style={[styles.backupAvatar, { backgroundColor: colors.lilac }]}
              >
                <Text
                  style={[styles.backupInitial, { color: colors.foreground }]}
                >
                  {person.initial}
                </Text>
              </View>
              <View style={styles.backupCopy}>
                <Text style={[styles.backupName, { color: colors.foreground }]}>
                  {person.name}
                </Text>
                <Text style={[styles.backupTime, { color: colors.success }]}>
                  {person.time}
                </Text>
              </View>
              <Text
                style={[styles.backupRate, { color: colors.mutedForeground }]}
              >
                ₦ 20,000/hr
              </Text>
            </View>
          ))}
        </View>
        <Pressable
          onPress={onHome}
          style={[styles.largeCancel, { backgroundColor: colors.lilac }]}
        >
          <Text
            style={[styles.largeCancelText, { color: colors.mutedForeground }]}
          >
            Cancel
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Success({
  onHome,
  onChat,
  onBackups,
}: {
  onHome: () => void;
  onChat: () => void;
  onBackups: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.monitorContent,
          { paddingTop: insets.top + 56, paddingBottom: insets.bottom + 24 },
        ]}
      >
        <View
          style={[styles.monitorMark, { backgroundColor: colors.softGreen }]}
        >
          <Feather name="check" size={42} color={colors.success} />
        </View>
        <Text style={[styles.monitorTitle, { color: colors.foreground }]}>
          Mary is on the way
        </Text>
        <Text style={[styles.monitorSubtitle, { color: colors.foreground }]}>
          Arriving in 7 minutes
        </Text>
        <View style={[styles.arrivalCard, { backgroundColor: "#FCFAF3" }]}>
          <View style={[styles.arrivalIcon, { borderColor: colors.border }]}>
            <Feather name="home" size={22} color={colors.mutedForeground} />
          </View>
          <View style={styles.arrivalCopy}>
            <Text style={[styles.arrivalTitle, { color: colors.foreground }]}>
              Meets you at A&E Hospital reception
            </Text>
            <Text
              style={[styles.arrivalMeta, { color: colors.mutedForeground }]}
            >
              Expected 9:48am
            </Text>
          </View>
        </View>
        <View
          style={[styles.monitorCard, { backgroundColor: colors.softGreen }]}
        >
          <View
            style={[styles.monitorIcon, { backgroundColor: colors.foreground }]}
          >
            <Image
              source={require("../assets/images/icon.png")}
              style={styles.monitorIconImage}
            />
          </View>
          <View style={styles.monitorCopy}>
            <Text
              style={[styles.monitorCardTitle, { color: colors.foreground }]}
            >
              SignBee Agent is monitoring.
            </Text>
            <Text
              style={[
                styles.monitorCardBody,
                { color: colors.mutedForeground },
              ]}
            >
              If Mary is delayed, Uzor will be swapped in automatically.
            </Text>
          </View>
        </View>
        <AppButton label="Message Mary" onPress={onChat} />
        <Pressable onPress={onBackups} style={styles.backupLink}>
          <Text style={[styles.backupLinkText, { color: colors.success }]}>
            View standby interpreters
          </Text>
        </Pressable>
        <Pressable onPress={onHome} style={styles.homeLink}>
          <Text style={[styles.homeLinkText, { color: colors.success }]}>
            Back to Home
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

export default function Index() {
  const [screen, setScreen] = useState<Screen>("onboarding");
  const [tab, setTab] = useState<Tab>("home");
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [booting, setBooting] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      AsyncStorage.getItem("signbee_has_onboarded"),
      new Promise((resolve) => setTimeout(resolve, 800)),
    ])
      .then(([value]) => {
        if (active) {
          setScreen(value === "true" ? "home" : "onboarding");
          setBooting(false);
          setShowSplash(false);
        }
      })
      .catch(() => {
        if (active) {
          setBooting(false);
          setShowSplash(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (screen !== "matching") return;
    const timeout = setTimeout(() => setScreen("matched"), 2200);
    return () => clearTimeout(timeout);
  }, [screen]);

  const finishOnboarding = () => {
    void AsyncStorage.setItem("signbee_has_onboarded", "true");
    setScreen("home");
  };
  const resetToHome = () => {
    setDraft(initialDraft);
    setTab("home");
    setScreen("home");
  };

  if (showSplash || booting) return <AppSplash />;

  if (screen === "onboarding") return <Onboarding onDone={finishOnboarding} />;
  if (screen === "request") {
    return (
      <RequestForm
        draft={draft}
        setDraft={setDraft}
        onSubmit={() => setScreen("matching")}
        onCancel={resetToHome}
      />
    );
  }
  if (screen === "matching") return <Matching onCancel={resetToHome} />;
  if (screen === "matched") {
    return (
      <Matched
        onChat={() => setScreen("chat")}
        onPayment={() => setScreen("payment-method")}
        onBack={resetToHome}
      />
    );
  }
  if (screen === "chat")
    return (
      <Chat
        onBack={() => setScreen("matched")}
        onPayment={() => setScreen("payment")}
      />
    );
  if (screen === "payment-method") {
    return (
      <PaymentMethod
        onClose={() => setScreen("matched")}
        onCard={() => setScreen("card-details")}
        onTransfer={() => setScreen("payment")}
      />
    );
  }
  if (screen === "card-details") {
    return (
      <CardDetails
        onClose={() => setScreen("payment-method")}
        onPay={() => setScreen("payment")}
      />
    );
  }
  if (screen === "payment")
    return (
      <Payment
        onSent={() => setScreen("success")}
        onBack={() => setScreen("matched")}
      />
    );
  if (screen === "backup")
    return <Backup onClose={() => setScreen("success")} onHome={resetToHome} />;
  if (screen === "success") {
    return (
      <Success
        onHome={resetToHome}
        onChat={() => setScreen("chat")}
        onBackups={() => setScreen("backup")}
      />
    );
  }
  return (
    <Home
      onStart={() => {
        setTab("home");
        setScreen("request");
      }}
      onMatched={() => setScreen("matched")}
      tab={tab}
      onTab={setTab}
    />
  );
}

/* Previous screen routing is intentionally kept above the styling block. */

const styles = StyleSheet.create({
  flex: { flex: 1 },
  splashScreen: { alignItems: "center", justifyContent: "center" },
  splashCenter: { alignItems: "center", justifyContent: "center" },
  splashLogo: { width: 112, height: 100 },
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#27233E",
  },
  brandMark: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  brandMarkLarge: { width: 88, height: 88, borderRadius: 24 },
  logoSmall: { width: 28, height: 28 },
  logoLarge: { width: 62, height: 62 },
  topBar: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topBarTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 21,
    letterSpacing: -0.8,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: { height: 1, width: "100%" },
  eyebrow: { fontFamily: "Inter_700Bold", fontSize: 11, letterSpacing: 1.2 },
  button: {
    minHeight: 54,
    borderRadius: 28,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: { fontFamily: "Inter_700Bold", fontSize: 15 },
  onboardingContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 22,
  },
  onboardingBrand: {
    fontFamily: "Inter_500Medium",
    fontSize: 28,
    letterSpacing: -1,
    marginTop: 8,
  },
  onboardingArt: {
    height: 390,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  onboardingArtImage: { width: 332, height: 332 },
  onboardingCopyImage: { width: "100%", height: 80, marginTop: 2 },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 28,
  },
  paginationActive: { width: 32, height: 10, borderRadius: 5 },
  paginationDot: { width: 10, height: 10, borderRadius: 5 },
  onboardingActions: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  skipText: { fontFamily: "Inter_500Medium", fontSize: 16, padding: 12 },
  homeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 26,
  },
  homeTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 30,
    letterSpacing: -1.2,
    marginTop: 5,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontFamily: "Inter_700Bold", fontSize: 18 },
  heroCard: {
    minHeight: 328,
    borderRadius: 28,
    padding: 24,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  heroOrb: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#3D385B",
    top: -58,
    right: -28,
  },
  heroLabel: {
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.2,
    fontSize: 11,
    marginBottom: 13,
  },
  heroTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    lineHeight: 33,
    letterSpacing: -1,
    maxWidth: 280,
  },
  heroBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
    marginBottom: 22,
    maxWidth: 290,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 28,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    letterSpacing: -0.4,
  },
  linkText: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  requestRow: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  requestStatusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  requestRowCopy: { flex: 1 },
  requestTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  requestMeta: { fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 4 },
  requestStatus: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    marginTop: 8,
  },
  tipCard: {
    borderRadius: 20,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  tipCopy: { flex: 1, marginHorizontal: 12 },
  tipTitle: { fontFamily: "Inter_700Bold", fontSize: 14 },
  tipBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 84,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
  },
  bottomNavItem: { width: 90, alignItems: "center", position: "relative" },
  bottomNavLabel: { fontFamily: "Inter_500Medium", fontSize: 11, marginTop: 5 },
  navIndicator: { width: 5, height: 5, borderRadius: 3, marginTop: 6 },
  profileContent: { marginTop: 4 },
  profileCard: {
    borderRadius: 26,
    padding: 22,
    alignItems: "center",
    marginBottom: 18,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarTextLarge: { fontFamily: "Inter_700Bold", fontSize: 28 },
  profileName: { fontFamily: "Inter_700Bold", fontSize: 20 },
  profileCaption: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    marginTop: 4,
  },
  settingsRow: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  settingsLabel: { fontFamily: "Inter_500Medium", fontSize: 15 },
  emptyNote: { alignItems: "center", paddingTop: 36, gap: 10 },
  emptyNoteText: { fontFamily: "Inter_400Regular", fontSize: 14 },
  formIntro: { paddingTop: 28, paddingBottom: 22 },
  formTitle: { fontFamily: "Inter_700Bold", fontSize: 28, letterSpacing: -1 },
  formBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    maxWidth: 290,
  },
  modeSwitch: { flexDirection: "row", gap: 4, marginTop: 58, marginBottom: 45 },
  modeButton: {
    flex: 1,
    minHeight: 66,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    borderBottomWidth: 3,
  },
  modeLabel: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
  fieldLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    marginBottom: 10,
    marginTop: 5,
  },
  textArea: {
    minHeight: 204,
    borderWidth: 1,
    borderRadius: 16,
    padding: 26,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 39,
  },
  input: {
    minHeight: 84,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 26,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    marginBottom: 18,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 2,
    marginBottom: 22,
  },
  locationText: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  chipRow: { gap: 8, paddingBottom: 12, paddingTop: 2 },
  chip: { paddingHorizontal: 16, paddingVertical: 11, borderRadius: 20 },
  chipText: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  formFooter: {
    paddingTop: 12,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cancelText: { fontFamily: "Inter_700Bold", fontSize: 17 },
  matchingCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  matchingIcon: {
    width: 72,
    height: 72,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  matchingTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    letterSpacing: -1,
    marginTop: 10,
    textAlign: "center",
  },
  matchingBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 10,
    maxWidth: 300,
  },
  statusCard: {
    width: "100%",
    borderRadius: 19,
    paddingHorizontal: 40,
    paddingVertical: 35,
    marginTop: 48,
    gap: 18,
  },
  triageContent: { paddingHorizontal: 50 },
  triageHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  triageTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    letterSpacing: -0.6,
  },
  statusRow: { flexDirection: "row", alignItems: "flex-start", gap: 18 },
  statusCheck: {
    width: 43,
    height: 43,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  triageStepCopy: { flex: 1, paddingTop: 1 },
  statusText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    lineHeight: 23,
    flex: 1,
  },
  triageSubtext: { fontFamily: "Inter_500Medium", fontSize: 15, marginTop: 5 },
  matchingHint: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 17,
    marginTop: 35,
  },
  progressTrack: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    marginTop: 37,
    overflow: "hidden",
  },
  progressFill: { width: "58%", height: "100%", borderRadius: 4 },
  triageCancel: {
    width: "100%",
    minHeight: 80,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 63,
  },
  triageCancelText: { fontFamily: "Inter_600SemiBold", fontSize: 19 },
  matchHero: {
    borderRadius: 26,
    padding: 24,
    alignItems: "center",
    marginTop: 22,
  },
  onlineAvatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  onlineAvatarText: { fontFamily: "Inter_700Bold", fontSize: 32 },
  onlineBadge: { flexDirection: "row", alignItems: "center", gap: 6 },
  onlineDot: { width: 7, height: 7, borderRadius: 4 },
  onlineLabel: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
  matchName: { fontFamily: "Inter_700Bold", fontSize: 23, marginTop: 10 },
  matchMeta: { fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 5 },
  matchTags: { flexDirection: "row", gap: 8, marginTop: 16 },
  matchTag: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 16 },
  matchTagText: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
  detailCard: { borderWidth: 1, borderRadius: 18, padding: 17, gap: 16 },
  detailItem: { gap: 5 },
  detailLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  detailValue: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  matchedActions: { flexDirection: "row", gap: 10, marginTop: 22 },
  chatHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  chatAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  chatAvatarText: { fontFamily: "Inter_700Bold", fontSize: 17 },
  chatHeaderCopy: { flex: 1 },
  chatName: { fontFamily: "Inter_700Bold", fontSize: 15 },
  chatOnline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  chatOnlineText: { fontFamily: "Inter_400Regular", fontSize: 12 },
  chatAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3EFF8",
  },
  chatStarted: {
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    paddingVertical: 12,
  },
  messageBlock: { maxWidth: "84%", marginVertical: 7 },
  messageMine: { alignSelf: "flex-end", alignItems: "flex-end" },
  messageTheirs: { alignSelf: "flex-start", alignItems: "flex-start" },
  messageBubble: { padding: 15, borderRadius: 22 },
  messageText: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 20 },
  messageTime: { fontFamily: "Inter_400Regular", fontSize: 11, marginTop: 6 },
  chatFooter: { paddingHorizontal: 18, paddingTop: 8 },
  chatInputWrap: {
    minHeight: 52,
    borderRadius: 28,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 5,
  },
  chatInput: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    paddingHorizontal: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
    paddingTop: 12,
  },
  paymentLinkText: { fontFamily: "Inter_500Medium", fontSize: 12 },
  bankCard: { borderRadius: 20, padding: 20, gap: 22, marginTop: 26 },
  expiryCopy: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 18,
  },
  paymentActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 48,
  },
  successContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  successMark: {
    width: 76,
    height: 76,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    letterSpacing: -1.2,
  },
  successBody: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 10,
    maxWidth: 310,
  },
  successCard: {
    width: "100%",
    borderRadius: 20,
    padding: 20,
    marginTop: 28,
    marginBottom: 18,
  },
  successCardLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    letterSpacing: 1.1,
  },
  successCardTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    marginTop: 10,
  },
  successCardMeta: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    marginTop: 5,
  },
  paymentChoices: { gap: 20, marginTop: 72 },
  paymentChoice: {
    minHeight: 100,
    borderWidth: 2,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  paymentChoiceLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 22,
    flex: 1,
  },
  radio: { width: 32, height: 32, borderRadius: 16, borderWidth: 2 },
  bottomCancel: { marginTop: "auto", paddingHorizontal: 50 },
  largeCancel: {
    minHeight: 80,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
  },
  largeCancelText: { fontFamily: "Inter_600SemiBold", fontSize: 20 },
  cardLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 23,
    marginTop: 72,
    marginBottom: 32,
  },
  cardInput: {
    minHeight: 100,
    borderWidth: 2,
    paddingHorizontal: 32,
    fontFamily: "Inter_500Medium",
    fontSize: 23,
  },
  cardFieldsRow: { flexDirection: "row", gap: 20 },
  cardFieldHalf: { flex: 1 },
  cardInputWithIcon: {
    minHeight: 100,
    borderWidth: 2,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  cardInputInner: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 22 },
  backupList: { gap: 32, marginTop: 69, marginBottom: 45 },
  backupRow: {
    minHeight: 154,
    borderWidth: 2,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  backupAvatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: "center",
    justifyContent: "center",
  },
  backupInitial: { fontFamily: "Inter_700Bold", fontSize: 36 },
  backupCopy: { flex: 1 },
  backupName: { fontFamily: "Inter_600SemiBold", fontSize: 22 },
  backupTime: { fontFamily: "Inter_500Medium", fontSize: 20, marginTop: 8 },
  backupRate: { fontFamily: "Inter_400Regular", fontSize: 17 },
  monitorContent: { flexGrow: 1, alignItems: "center", paddingHorizontal: 50 },
  monitorMark: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  monitorTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    letterSpacing: -1.2,
    marginTop: 44,
    textAlign: "center",
  },
  monitorSubtitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 24,
    marginTop: 16,
    textAlign: "center",
  },
  arrivalCard: {
    width: "100%",
    minHeight: 142,
    borderRadius: 18,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 65,
    gap: 25,
  },
  arrivalIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  arrivalCopy: { flex: 1 },
  arrivalTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
    lineHeight: 26,
  },
  arrivalMeta: { fontFamily: "Inter_500Medium", fontSize: 16, marginTop: 6 },
  monitorCard: {
    width: "100%",
    minHeight: 145,
    borderRadius: 18,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 22,
    gap: 22,
  },
  monitorIcon: {
    width: 80,
    height: 80,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  monitorIconImage: { width: 48, height: 48 },
  monitorCopy: { flex: 1 },
  monitorCardTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
    lineHeight: 26,
  },
  monitorCardBody: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    lineHeight: 22,
    marginTop: 5,
  },
  backupLink: { marginTop: 22, padding: 8 },
  backupLinkText: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  homeLink: { marginTop: 4, padding: 8 },
  homeLinkText: { fontFamily: "Inter_600SemiBold", fontSize: 18 },
});
