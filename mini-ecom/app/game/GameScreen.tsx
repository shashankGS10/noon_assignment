import React, { useState, useEffect } from "react";
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

// Normalize an angle to 0–360°
const normalizeAngle = (angle) => ((angle % 360) + 360) % 360;

// Get minimal angular difference between two angles
const angleDifference = (a, b) => {
  let diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
};

const GameScreen = () => {
  const [score, setScore] = useState(0);
  const [remainingArrows, setRemainingArrows] = useState(INITIAL_ARROWS);
  // We record each arrow’s impact as a local angle (in degrees) on the log.
  const [arrows, setArrows] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  // Log rotation shared value (in degrees)
  const rotation = useSharedValue(0);

  // Start continuous rotation of the log.
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: ROTATION_SPEED, easing: Easing.linear }),
      -1
    );
  }, []);

  // Animated style for the log’s container (rotates continuously)
  const rotatingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // Collision detection: if the new impact position is too close to any previous one,
  // then a collision has occurred.
  const checkCollision = (newLocalAngle) => {
    return arrows.some((existingAngle) => {
      return angleDifference(existingAngle, newLocalAngle) < IMPACT_THRESHOLD;
    });
  };

  // When the arrow is launched, it always travels along the y‑axis and hits the log
  // at the fixed world impact angle (FIXED_IMPACT_ANGLE). However, because the log is
  // rotating, the actual part of the log that meets the impact point is determined by
  // the current rotation. We record that “local” impact angle as:
  //  localImpactAngle = normalizeAngle(FIXED_IMPACT_ANGLE – currentLogRotation)
  const launchArrow = () => {
    const OFFSET = 180;
    if (remainingArrows > 0 && !gameOver) {
      const newLocalAngle = normalizeAngle(FIXED_IMPACT_ANGLE - rotation.value + OFFSET);

      
      if (checkCollision(newLocalAngle)) {
        setGameOver(true);
        Alert.alert("Game Over!", "Arrow collision detected!", [
          { text: "Restart", onPress: resetGame },
        ]);
      } else {
        setArrows([...arrows, newLocalAngle]);
        setScore((prev) => prev + 1);
        setRemainingArrows((prev) => prev - 1);
        
        // Level complete condition (for example purposes, restart when all arrows are used)
        if (remainingArrows === 1) {
          Alert.alert("Level Complete!", "Congratulations!", [
            { text: "Next Level", onPress: resetGame },
          ]);
        }
      }
    }
  };

  // Reset the game state
  const resetGame = () => {
    setScore(0);
    setRemainingArrows(INITIAL_ARROWS);
    setArrows([]);
    setGameOver(false);
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
                {arrows.map((angle, index) => (
                  <View
                    key={index}
                    style={[
                      styles.stuckArrow,
                      {
                        transform: [
                          // Each arrow is drawn at its stored local impact angle.
                          { rotate: `${angle}deg` },
                          // Then translated outward so that its tip touches the log’s perimeter.
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
