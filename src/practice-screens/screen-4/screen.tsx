import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 📐 Sizes
const BOX_SIZE = 100;
const RING_RADIUS = 120;

// 🎯 Ring center point
const CENTER_X = SCREEN_WIDTH / 2;
const CENTER_Y = SCREEN_HEIGHT / 2;

// 🧠 Gesture context type
type DragContext = {
  initialX: number;
  initialY: number;
};

export const PracticeScreenFour: React.FC = () => {
  const boxTranslateX = useSharedValue(CENTER_X - BOX_SIZE / 2);
  const boxTranslateY = useSharedValue(CENTER_Y - BOX_SIZE / 2);

  const panGestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, DragContext>({
    onStart: (_, ctx) => {
      ctx.initialX = boxTranslateX.value;
      ctx.initialY = boxTranslateY.value;
    },
    onActive: (event, ctx) => {
      boxTranslateX.value = ctx.initialX + event.translationX;
      boxTranslateY.value = ctx.initialY + event.translationY;
    },
    onEnd: () => {
      const boxCenterX = boxTranslateX.value + BOX_SIZE / 2;
      const boxCenterY = boxTranslateY.value + BOX_SIZE / 2;

      const dx = boxCenterX - CENTER_X;
      const dy = boxCenterY - CENTER_Y;
      const distanceSquared = dx * dx + dy * dy;
      const ringRadiusSquared = RING_RADIUS * RING_RADIUS;

      const isInsideRing = distanceSquared <= ringRadiusSquared;

      if (isInsideRing) {
        boxTranslateX.value = withSpring(CENTER_X - BOX_SIZE / 2);
        boxTranslateY.value = withSpring(CENTER_Y - BOX_SIZE / 2);
      } else {
        boxTranslateX.value = withSpring(boxTranslateX.value);
        boxTranslateY.value = withSpring(boxTranslateY.value);
      }
    },
  });

  const animatedBoxStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: boxTranslateX.value }, { translateY: boxTranslateY.value }],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <Animated.View style={styles.snapRing} />
      <PanGestureHandler onGestureEvent={panGestureHandler}>
        <Animated.View style={[styles.box, animatedBoxStyle]} />
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  snapRing: {
    position: 'absolute',
    top: CENTER_Y - RING_RADIUS,
    left: CENTER_X - RING_RADIUS,
    width: RING_RADIUS * 2,
    height: RING_RADIUS * 2,
    borderRadius: RING_RADIUS,
    borderWidth: 2,
    borderColor: 'gray',
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    backgroundColor: 'dodgerblue',
    borderRadius: 16,
    position: 'absolute',
  },
});
