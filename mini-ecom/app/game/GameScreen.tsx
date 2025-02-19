import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import useGameStore from "@/hooks/useGameStore";


const { width } = Dimensions.get("window");

// Game Configurations
const LOG_SIZE = width * 0.6;
const ARROW_LENGTH = LOG_SIZE * 0.6;
const INITIAL_ARROWS = 10;
const IMPACT_THRESHOLD = 15; // Minimum angular difference (in degrees) to avoid collision
const ROTATION_SPEED = 6000; // Duration for one full rotation (ms)
const FIXED_IMPACT_ANGLE = 0; // World-angle at which the arrow always hits (0° = top)

// Colors
const LOG_COLOR = "#CD853F";
const ARROW_COLOR = "#A0522D";

// Utility Functions
const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;
const angleDifference = (a: number, b: number) => {
  let diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
};

// Zustand store for game state


const GameScreen = () => {
  const {
    score,
    remainingArrows,
    arrows,
    gameOver,
    addArrow,
    incrementScore,
    decrementArrows,
    setGameOver,
    reset,
  } = useGameStore();

  // Log rotation shared value (in degrees)
  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: ROTATION_SPEED, easing: Easing.linear }),
      -1
    );
  }, []);

  // Animated style for the rotating log
  const rotatingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // Collision detection: if the new impact position is too close to any previous one, a collision occurs.
  const checkCollision = (newLocalAngle: number) => {
    return arrows.some((existingAngle: number) => {
      return angleDifference(existingAngle, newLocalAngle) < IMPACT_THRESHOLD;
    });
  };

  // Launch arrow: Calculate the impact location (local to the log) based on the current log rotation.
  // Here, we use an OFFSET to adjust alignment if needed.
  const launchArrow = () => {
    const OFFSET = 180;
    if (remainingArrows > 0 && !gameOver) {
      // Calculate local impact angle: this value represents the hit position on the log.
      const newLocalAngle = normalizeAngle(
        FIXED_IMPACT_ANGLE - rotation.value + OFFSET
      );
      if (checkCollision(newLocalAngle)) {
        setGameOver(true);
        Alert.alert("Game Over!", "Arrow collision detected!", [
          { text: "Restart", onPress: reset },
        ]);
      } else {
        addArrow(newLocalAngle);
        incrementScore();
        decrementArrows();
        if (remainingArrows === 1) {
          Alert.alert("Level Complete!", "Congratulations!", [
            { text: "Next Level", onPress: reset },
          ]);
        }
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={launchArrow}>
      <View style={styles.container}>
        {/* Game Stats */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Score: {score}</Text>
          <Text style={styles.infoText}>Arrows Left: {remainingArrows}</Text>
        </View>

        {/* Game Area */}
        <View style={styles.gameArea}>
          <Animated.View style={[styles.logContainer, rotatingStyle]}>
            <View style={styles.log}>
              <View style={styles.innerLogDesign}>
                {arrows.map((angle: number, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.stuckArrow,
                      {
                        transform: [
                          // Render each arrow at its stored local impact angle.
                          { rotate: `${angle}deg` },
                          { translateY: -LOG_SIZE / 2 },
                        ],
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Static Launcher Arrow to indicate the fixed impact point */}
        <View style={styles.launcherArea}>
          <View style={styles.referenceArrow} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  infoContainer: {
    paddingTop: 50,
    alignItems: "center",
  },
  infoText: {
    color: "#fff",
    fontSize: 20,
    marginVertical: 5,
  },
  gameArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logContainer: {
    width: LOG_SIZE,
    height: LOG_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  log: {
    width: LOG_SIZE,
    height: LOG_SIZE,
    borderRadius: LOG_SIZE / 2,
    backgroundColor: LOG_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  innerLogDesign: {
    width: LOG_SIZE * 0.8,
    height: LOG_SIZE * 0.8,
    borderRadius: (LOG_SIZE * 0.8) / 2,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  stuckArrow: {
    position: "absolute",
    width: 4,
    height: ARROW_LENGTH,
    backgroundColor: ARROW_COLOR,
    borderRadius: 2,
  },
  launcherArea: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  referenceArrow: {
    width: 4,
    height: ARROW_LENGTH,
    backgroundColor: ARROW_COLOR,
    borderRadius: 2,
  },
});

export default GameScreen;
