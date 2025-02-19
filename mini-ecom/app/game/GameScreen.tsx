import React, { useState, useEffect, useRef } from "react";
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

const { width, height } = Dimensions.get("window");
const LOG_SIZE = width * 0.5;
const ARROW_LENGTH = LOG_SIZE * 0.6;
const INITIAL_ARROWS = 5;
const IMPACT_RADIUS = 10; // Allowed impact angle range for collision detection

const GameScreen = () => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [remainingArrows, setRemainingArrows] = useState(INITIAL_ARROWS);
  const [arrows, setArrows] = useState<{ angle: number }[]>([]);

  const rotation = useSharedValue(0);

  // Start rotating the log
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 6000 / level, // Speed increases with level
        easing: Easing.linear,
      }),
      -1
    );
  }, [level]);

  // Rotating log animated style
  const logStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // Check if new arrow collides with an existing one
  const checkCollision = (newAngle: number) => {
    return arrows.some(
      (arrow) => Math.abs(arrow.angle - newAngle) < IMPACT_RADIUS
    );
  };

  // Handle arrow launch
  const launchArrow = () => {
    if (remainingArrows > 0) {
      const currentRotation = rotation.value % 360;

      if (checkCollision(currentRotation)) {
        Alert.alert("Game Over!", "An arrow is already at this position.", [
          { text: "Restart", onPress: resetGame },
        ]);
      } else {
        setArrows([...arrows, { angle: currentRotation }]);
        setScore((prev) => prev + 1);
        setRemainingArrows((prev) => prev - 1);

        // Level up every 5 successful arrows
        if ((score + 1) % 5 === 0) {
          setLevel((prev) => prev + 1);
          setRemainingArrows(INITIAL_ARROWS);
        }
      }
    }
  };

  // Reset game state
  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setRemainingArrows(INITIAL_ARROWS);
    setArrows([]);
  };

  return (
    <TouchableWithoutFeedback onPress={launchArrow}>
      <View style={styles.container}>
        {/* Game Stats */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Score: {score}</Text>
          <Text style={styles.infoText}>Level: {level}</Text>
          <Text style={styles.infoText}>Arrows Left: {remainingArrows}</Text>
        </View>

        {/* Game Area */}
        <View style={styles.gameArea}>
          <Animated.View style={[styles.log, logStyle]}>
            {/* Render Stuck Arrows */}
            {arrows.map((arrow, index) => (
              <View
                key={index}
                style={[
                  styles.stuckArrow,
                  {
                    transform: [
                      { rotate: `${arrow.angle}deg` },
                      { translateY: -LOG_SIZE / 2 },
                    ],
                  },
                ]}
              />
            ))}
          </Animated.View>
        </View>

        {/* Arrow Launcher */}
        <View style={styles.launcherArea}>
          <View style={styles.arrowLauncher} />
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
  log: {
    width: LOG_SIZE,
    height: LOG_SIZE,
    borderRadius: LOG_SIZE / 2,
    backgroundColor: "#8B4513",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  stuckArrow: {
    position: "absolute",
    width: 4,
    height: ARROW_LENGTH,
    backgroundColor: "#fff",
  },
  launcherArea: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowLauncher: {
    width: 4,
    height: ARROW_LENGTH,
    backgroundColor: "#fff",
  },
});

export default GameScreen;
