import { Image } from "expo-image";
import { Platform, StyleSheet, TextInput } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { View, TouchableOpacity } from "react-native";

import { useState } from "react";

export default function HomeScreen() {
  const [baseAmount, setBaseAmount] = useState(0);
  const [tipRate, setTipRate] = useState(0.2);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#FFFFFF", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/money.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Tip Calculator</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedView style={styles.selectorContainer}>
          <ThemedText type="subtitle">Select Tip Rate:</ThemedText>
          <View style={styles.selectorRow}>
            <TouchableOpacity onPress={() => setTipRate(0.1)}>
              <ThemedText style={styles.selectorButton}>10%</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTipRate(0.15)}>
              <ThemedText style={styles.selectorButton}>15%</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTipRate(0.2)}>
              <ThemedText style={styles.selectorButton}>20%</ThemedText>
            </TouchableOpacity>
            <TextInput
              placeholder="e.g. 10"
              keyboardType="numeric"
              onChangeText={(text) => {
                const rate = parseFloat(text);
                if (isNaN(rate)) {
                  return;
                }
                setTipRate(rate / 100);
              }}
              style={styles.selectorInput}
            />
          </View>
        </ThemedView>
        <ThemedText type="subtitle">Enter Total Bill Amount:</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="e.g. 100"
          keyboardType="numeric"
          onChangeText={(text) => {
            const amount = parseFloat(text);
            if (isNaN(amount)) {
              return;
            }
            setBaseAmount(amount);
          }}
        />
        <ThemedText type="subtitle">Tip Amount: ${(baseAmount * tipRate).toFixed(2)}</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  selectorContainer: {
    gap: 8,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  selectorRow: {
    flexDirection: "row",
    gap: 8,
    padding: 10,
  },
  selectorButton: {
    backgroundColor: "rgba(142, 142, 142, 0.1)",
    borderRadius: 8,
    padding: 8,
  },
  selectorInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 8,
  },
  input: {
    height: 80,
    borderRadius: 8,
    padding: 8,
    fontSize: 24,
  },
});
