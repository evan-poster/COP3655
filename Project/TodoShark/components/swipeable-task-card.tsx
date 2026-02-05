import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Task, HuntAction } from '@/types';

interface SwipeableTaskCardProps {
  task: Task;
  onAction: (action: HuntAction) => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 100;
const HAPTIC_THRESHOLD = 80;

export function SwipeableTaskCard({ task, onAction }: SwipeableTaskCardProps) {
  const surfaceColor = useThemeColor({ light: '#FFFFFF', dark: '#1A2332' }, 'background');
  
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const hapticTriggered = useRef({ left: false, right: false, down: false });

  const resetHapticFlags = () => {
    hapticTriggered.current = { left: false, right: false, down: false };
  };

  const triggerHaptic = (direction: 'left' | 'right' | 'down') => {
    if (!hapticTriggered.current[direction]) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      hapticTriggered.current[direction] = true;
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        const isVertical = Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
        return (isHorizontal && Math.abs(gestureState.dx) > 10) || 
               (isVertical && gestureState.dy > 10);
      },
      onPanResponderGrant: () => {
        resetHapticFlags();
      },
      onPanResponderMove: (_, gestureState) => {
        const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        
        if (isHorizontal) {
          // Horizontal swipe (left or right)
          translateX.setValue(gestureState.dx);
          translateY.setValue(0);
          
          // Trigger haptic feedback at threshold
          if (gestureState.dx > HAPTIC_THRESHOLD) {
            triggerHaptic('right');
          } else if (gestureState.dx < -HAPTIC_THRESHOLD) {
            triggerHaptic('left');
          }
        } else if (gestureState.dy > 0) {
          // Vertical swipe (down only)
          translateY.setValue(gestureState.dy);
          translateX.setValue(0);
          
          if (gestureState.dy > HAPTIC_THRESHOLD) {
            triggerHaptic('down');
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        
        if (isHorizontal) {
          // Right swipe - Mark Down (complete)
          if (gestureState.dx > SWIPE_THRESHOLD) {
            Animated.timing(translateX, {
              toValue: 500,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              onAction('complete');
              resetPosition();
            });
          }
          // Left swipe - Take Out
          else if (gestureState.dx < -SWIPE_THRESHOLD) {
            Animated.timing(translateX, {
              toValue: -500,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              onAction('takeOut');
              resetPosition();
            });
          }
          // Snap back
          else {
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
              tension: 100,
              friction: 10,
            }).start();
          }
        } else {
          // Down swipe - Put Back
          if (gestureState.dy > SWIPE_THRESHOLD) {
            Animated.timing(translateY, {
              toValue: SCREEN_HEIGHT,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              onAction('putBack');
              resetPosition();
            });
          }
          // Snap back
          else {
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
              tension: 100,
              friction: 10,
            }).start();
          }
        }
        
        resetHapticFlags();
      },
    })
  ).current;

  const resetPosition = () => {
    translateX.setValue(0);
    translateY.setValue(0);
  };

  // Calculate opacity for swipe indicators
  const rightOpacity = translateX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const leftOpacity = translateX.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const downOpacity = translateY.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Right swipe indicator - Complete */}
      <Animated.View style={[styles.swipeIndicator, styles.rightIndicator, { opacity: rightOpacity }]}>
        <ThemedText style={styles.indicatorText}>✓</ThemedText>
        <ThemedText style={styles.indicatorLabel}>Mark Down</ThemedText>
      </Animated.View>

      {/* Left swipe indicator - Take Out */}
      <Animated.View style={[styles.swipeIndicator, styles.leftIndicator, { opacity: leftOpacity }]}>
        <ThemedText style={styles.indicatorText}>✕</ThemedText>
        <ThemedText style={styles.indicatorLabel}>Take Out</ThemedText>
      </Animated.View>

      {/* Down swipe indicator - Put Back */}
      <Animated.View style={[styles.swipeIndicator, styles.downIndicator, { opacity: downOpacity }]}>
        <ThemedText style={styles.indicatorText}>↻</ThemedText>
        <ThemedText style={styles.indicatorLabel}>Put Back</ThemedText>
      </Animated.View>

      {/* Task Card */}
      <Animated.View
        style={[
          styles.cardWrapper,
          {
            transform: [{ translateX }, { translateY }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <ThemedView style={[styles.card, { backgroundColor: surfaceColor }]}>
          <View style={styles.content}>
            <ThemedText style={styles.title}>{task.title}</ThemedText>
            {task.description && (
              <ThemedText style={styles.description}>{task.description}</ThemedText>
            )}
            <View style={styles.metadata}>
              <ThemedText style={styles.metadataText}>Priority: {task.priority}</ThemedText>
              <ThemedText style={styles.metadataText}>Bucket: {task.bucket}</ThemedText>
            </View>
          </View>
          
          {/* Swipe hint */}
          <View style={styles.hintContainer}>
            <ThemedText style={styles.hintText}>
              ← Swipe to take action →
            </ThemedText>
          </View>
        </ThemedView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    minHeight: 300,
  },
  swipeIndicator: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  rightIndicator: {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
  },
  leftIndicator: {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#FF9800',
    borderRadius: 12,
  },
  downIndicator: {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#2196F3',
    borderRadius: 12,
  },
  indicatorText: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  indicatorLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 8,
  },
  cardWrapper: {
    zIndex: 1,
  },
  card: {
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    minHeight: 280,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 36,
  },
  description: {
    fontSize: 18,
    opacity: 0.8,
    marginBottom: 20,
    lineHeight: 28,
  },
  metadata: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 'auto',
  },
  metadataText: {
    fontSize: 14,
    opacity: 0.6,
  },
  hintContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  hintText: {
    fontSize: 14,
    opacity: 0.5,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
