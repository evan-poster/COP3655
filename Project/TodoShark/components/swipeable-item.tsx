import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/themed-text';

interface SwipeableItemProps {
  children: React.ReactNode;
  onDelete: () => void;
  deleteThreshold?: number;
}

export function SwipeableItem({
  children,
  onDelete,
  deleteThreshold = 100,
}: SwipeableItemProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const lastOffset = useRef(0);
  const hapticTriggered = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal swipes
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderGrant: () => {
        translateX.setOffset(lastOffset.current);
        translateX.setValue(0);
        hapticTriggered.current = false;
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow left swipe (negative dx)
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
          
          // Trigger haptic feedback at threshold
          if (gestureState.dx < -deleteThreshold && !hapticTriggered.current) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            hapticTriggered.current = true;
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        translateX.flattenOffset();
        
        const currentValue = gestureState.dx + lastOffset.current;
        
        // If swiped past threshold, trigger delete
        if (currentValue < -deleteThreshold) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Animated.timing(translateX, {
            toValue: -400,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            onDelete();
            // Reset position after delete
            lastOffset.current = 0;
            translateX.setValue(0);
          });
        } else {
          // Snap back to closed position
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 10,
          }).start();
          lastOffset.current = 0;
        }
        
        hapticTriggered.current = false;
      },
    })
  ).current;

  // Calculate opacity for delete indicator
  const deleteOpacity = translateX.interpolate({
    inputRange: [-deleteThreshold, 0],
    outputRange: [1, 0.3],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.deleteBackground, { opacity: deleteOpacity }]}>
        <ThemedText style={styles.deleteIcon}>🗑️</ThemedText>
        <ThemedText style={styles.deleteText}>Delete</ThemedText>
      </Animated.View>
      <Animated.View
        style={[
          styles.swipeableContent,
          {
            transform: [{ translateX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 24,
    borderRadius: 12,
    width: '100%',
    flexDirection: 'row',
    gap: 8,
  },
  deleteIcon: {
    fontSize: 20,
  },
  deleteText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  swipeableContent: {
    backgroundColor: 'transparent',
  },
});
