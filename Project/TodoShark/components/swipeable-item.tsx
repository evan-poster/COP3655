import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableOpacity,
} from 'react-native';
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
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow left swipe (negative dx)
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        translateX.flattenOffset();
        
        const currentValue = gestureState.dx + lastOffset.current;
        
        // If swiped past threshold, trigger delete
        if (currentValue < -deleteThreshold) {
          Animated.timing(translateX, {
            toValue: -300,
            duration: 200,
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
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <View style={styles.deleteBackground}>
        <ThemedText style={styles.deleteText}>Delete</ThemedText>
      </View>
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
    paddingRight: 20,
    borderRadius: 8,
    width: '100%',
  },
  deleteText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  swipeableContent: {
    backgroundColor: 'transparent',
  },
});
