import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
  Button,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Audio } from "expo-av";
import useGameStore from "@/hooks/useGameStore";
import Arrow from "@/components/ui/Arrow";

const { width, height } = Dimensions.get("window");

const LOG_SIZE = width * 0.6;
const ARROW_LENGTH = LOG_SIZE * 0.6;
const IMPACT_THRESHOLD = 15;
const FIXED_IMPACT_ANGLE = 0;
const LOG_COLOR = "#CD853F";
const ARROW_COLOR = "#A0522D";

const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;
const angleDifference = (a: number, b: number) => {
  let diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
};


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
    rotationSpeed,
    level,
    nextLevel,
    highScore,
    updateHighScore,
  } = useGameStore();

  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: rotationSpeed, easing: Easing.linear }),
      -1
    );
  }, [rotationSpeed]);

  const rotatingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const playSound = async (soundFile: any) => {
    try {
      const { sound } = await Audio.Sound.createAsync(soundFile);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const playCollisionSound = async () => {
    await playSound(require("@/assets/collision.wav"));
  };

  const arrowShootSound = async () => {
    await playSound(require("@/assets/arrow_shoot.wav"));
  };

  const checkCollision = (newLocalAngle: number) => {
    return arrows.some((existingAngle: number) => {
      return angleDifference(existingAngle, newLocalAngle) < IMPACT_THRESHOLD;
    });
  };

  const launchArrow = () => {
    const OFFSET = 175;
    if (remainingArrows > 0 && !gameOver) {
      arrowShootSound();
      const newLocalAngle = normalizeAngle(
        FIXED_IMPACT_ANGLE - rotation.value + OFFSET
      );
      if (checkCollision(newLocalAngle)) {
        setGameOver(true);
        playCollisionSound();
        updateHighScore(score);
        Alert.alert("Game Over!", "Arrow collision detected!", [
          { text: "Restart", onPress: reset },
        ]);
      } else {
        addArrow(newLocalAngle);
        incrementScore();
        decrementArrows();
        if (remainingArrows === 1) {
          Alert.alert("Level Complete!", "Congratulations!", [
            { text: "Next Level", onPress: () => {
            nextLevel(level);
            rotation.value = 0; 
            }},
          ]);
        }
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={launchArrow}>
      <View style={styles.container}>
        <View style={styles.gameArea}>
          <Animated.View style={[styles.logContainer, rotatingStyle]}>
            <Animated.Image
              source={require("@/assets/images/woodenLog.png")}
              style={styles.log}
              resizeMode="contain"
            />
            {arrows.map((angle: number, index: number) => (
              <Animated.View
                key={index}
                style={{
                  position: "absolute",
                  transform: [
                    { rotate: `${angle}deg` },
                    { translateY: -LOG_SIZE / 1.6 },
                  ],
                }}
              >
                <Arrow />
              </Animated.View>
            ))}
          </Animated.View>
        </View>
        <View style={styles.launcherArea}>
          <Arrow inverted={true} />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Score: {score}</Text>
          <Text style={styles.infoText}>High Score: {highScore}</Text>
          <Text style={styles.infoText}>Arrows Left: {remainingArrows}</Text>
          <Button title="Reset Game" onPress={reset} color="#FF6347" />
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
  trajectoryArrow: {
    position: "absolute",
    bottom: 0, // Start from bottom position
  },
});

export default GameScreen;
