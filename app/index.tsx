import { StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>S</Text>
          </View>
          <Text style={styles.brandName}>SignBee</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.eyebrow}>TRIAGE AGENT</Text>
          <Text style={styles.title}>Your Expo Go frontend is ready.</Text>
          <Text style={styles.description}>
            This is the clean starting point for the SignBee interpreter
            triage experience. The Python agent remains available at the
            repository root for the next step.
          </Text>

          <View style={styles.placeholderCard}>
            <Text style={styles.cardTitle}>Ready for the next instruction</Text>
            <Text style={styles.cardBody}>
              Intake, matching, status, and messaging screens can be added
              here when you are ready.
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>SignBee Triage Agent · Expo Go</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F7F2",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: "space-between",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#AAFF00",
  },
  brandMarkText: {
    color: "#1A1340",
    fontSize: 20,
    fontWeight: "800",
  },
  brandName: {
    color: "#1A1340",
    fontSize: 20,
    fontWeight: "700",
  },
  content: {
    gap: 18,
  },
  eyebrow: {
    color: "#6B6790",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.8,
  },
  title: {
    maxWidth: 340,
    color: "#1A1340",
    fontSize: 42,
    lineHeight: 46,
    fontWeight: "800",
  },
  description: {
    maxWidth: 360,
    color: "#514D6F",
    fontSize: 17,
    lineHeight: 26,
  },
  placeholderCard: {
    marginTop: 12,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#E8FFB0",
  },
  cardTitle: {
    color: "#1A1340",
    fontSize: 17,
    fontWeight: "800",
  },
  cardBody: {
    marginTop: 8,
    color: "#514D6F",
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    color: "#8A86A3",
    fontSize: 12,
  },
});