import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Easing, TouchableWithoutFeedback, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const logRadius = width * 0.25; // Adjust relative to screen width
const arrowLength = logRadius * 0.6;
const initialArrowsPerLevel = 5;

const GameScreen = () => {
    const rotation = useRef(new Animated.Value(0)).current;
    const arrowY = useRef(new Animated.Value(height * 0.7)).current; // Start arrow lower
    const [arrows, setArrows] = useState<{ angle: number }[]>([]);
    const [level, setLevel] = useState(1);
    const [remainingArrows, setRemainingArrows] = useState(initialArrowsPerLevel);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [highScore, setHighScore] = useState(0);
    const [targetRadius, setTargetRadius] = useState(logRadius);
    const [arrowSound, setArrowSound] = useState<Audio.Sound | null>(null);
    const [collisionSound, setCollisionSound] = useState<Audio.Sound | null>(null);
    const arrowRotation = useRef(new Animated.Value(0)).current;
    const arrowsLeft = useRef(initialArrowsPerLevel);


    // Sound loading (as before)
    useEffect(() => {
        async function loadSounds() {
            const arrowSoundObject = new Audio.Sound();
            const collisionSoundObject = new Audio.Sound();
            try {
                await arrowSoundObject.loadAsync(require('./assets/arrow_shoot.wav'));
                await collisionSoundObject.loadAsync(require('./assets/collision.wav'));
                setArrowSound(arrowSoundObject);
                setCollisionSound(collisionSoundObject);
            } catch (error) {
                console.log("Error loading sounds:", error);
            }
        }

        loadSounds();

        return () => {
            if (arrowSound) {
                arrowSound.unloadAsync();
            }
            if (collisionSound) {
                collisionSound.unloadAsync();
            }
        };
    }, []);

    // High score loading/saving (as before)
    useEffect(() => {
        const loadHighScore = async () => {
            try {
                const storedHighScore = await AsyncStorage.getItem('highScore');
                if (storedHighScore) {
                    setHighScore(parseInt(storedHighScore));
                }
            } catch (error) {
                console.log("Error loading high score:", error);
            }
        };

        loadHighScore();
    }, []);

    useEffect(() => {
        const saveHighScore = async () => {
            try {
                await AsyncStorage.setItem('highScore', highScore.toString());
            } catch (error) {
                console.log("Error saving high score:", error);
            }
        };

        saveHighScore();
    }, [highScore]);

    
    useEffect(() => {
        startRotation();
        setTargetRadius(logRadius + Math.random() * 5);
    }, [level]);

    // Start rotating the target
    const startRotation = () => {
        rotation.setValue(0);
        Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 6000 / (level * 1.1),
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    };

    const fireArrowAnimation = () => {
        Animated.parallel([
            Animated.timing(arrowY, {
                toValue: height / 2 - targetRadius - arrowLength,
                duration: 200, // Reduced duration for snappier animation
                easing: Easing.ease,
                useNativeDriver: false,
            }),
            Animated.timing(arrowRotation, {
                toValue: -90, // Rotate 90 degrees counter-clockwise
                duration: 200,
                easing: Easing.ease,
                useNativeDriver: false,
            })
        ]).start(() => {
            arrowY.setValue(height * 0.7); // Reset arrow position
            arrowRotation.setValue(0); // Reset rotation
        });
    };


    const collisionAngleTolerance = 15;

    // Check for collision with existing arrows
    const checkCollision = (newArrow: { angle: number }) => {
        return arrows.some(arrow => {
            const angleDifference = Math.abs(arrow.angle - newArrow.angle);
            return Math.min(angleDifference, 360 - angleDifference) < collisionAngleTolerance;
        });
    };

    // Fire arrow: Check for collision, increase score, or end game
    const fireArrow = () => {
        if (gameOver || arrowsLeft.current <= 0) return;

        fireArrowAnimation();

        if (arrowSound) {
            arrowSound.replayAsync();
        }

        const currentRotation = (rotation as any)._value * 360 % 360;
        const newArrow = { angle: currentRotation };

        if (checkCollision(newArrow)) {
            if (collisionSound) {
                collisionSound.replayAsync();
            }
            setGameOver(true);
            if (score > highScore) {
                setHighScore(score);
            }
        } else {
            setArrows([...arrows, newArrow]);
            arrowsLeft.current -= 1
            setScore(score + 1);
            setRemainingArrows(arrowsLeft.current)

            if (arrowsLeft.current === 0) {
                setLevel(level + 1);
                setRemainingArrows(initialArrowsPerLevel + level);
                arrowsLeft.current = initialArrowsPerLevel + level
            }
        }
    };

    // Handle reset button press
    const handleReset = () => {
        setArrows([]);
        setLevel(1);
        setRemainingArrows(initialArrowsPerLevel);
        setScore(0);
        setGameOver(false);
        arrowsLeft.current = initialArrowsPerLevel;
    };

    const renderArrows = () => {
        return (
            <View style={styles.arrowsContainer}>
                <Text style={styles.arrowsText}>Arrows Left: {remainingArrows}</Text>
            </View>
        );
    };

    const renderScore = () => {
        return (
            <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>Score: {score}</Text>
            </View>
        );
    };

    const renderHighscore = () => {
        return (
            <View style={styles.highScoreContainer}>
                <Text style={styles.scoreText}>High Score: {highScore}</Text>
            </View>
        );
    };
    const renderTarget = () => {
        return (
            <Animated.View
                style={[
                    styles.log,
                    {
                        width: targetRadius * 2,
                        height: targetRadius * 2,
                        borderRadius: targetRadius,
                        transform: [{ rotate: rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }],
                    },
                ]}
            >
                {arrows.map((arrow, index) => (
                    <View
                        key={index}
                        style={[
                            styles.stuckArrow,
                            {
                                transform: [{ rotate: `${arrow.angle}deg` }, { translateY: -targetRadius + 5 }],
                            },
                        ]}
                    />
                ))}
            </Animated.View>
        );
    };

    const renderCurrentArrow = () => {
        return (
            <Animated.View
                style={[
                    styles.arrow,
                    {
                        bottom: 'auto',
                        top: arrowY,
                        transform: [{ translateY: 0 }, { rotate: arrowRotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-90deg'] }) }],
                    },
                ]}
            />
        );
    };
    const renderBottomUI = () => {
        return (
            <View style={styles.bottomContainer}>
                <Text style={styles.numberArrows}>{arrowsLeft.current}</Text>
                <Image style={styles.image} source={require("@/assets/images/arrow.png")} />
            </View>
        );
    };

    return (
        <TouchableWithoutFeedback onPress={fireArrow}>
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    {renderHighscore()}

                    {renderScore()}
                </View>


                {gameOver && (
                    <View style={styles.gameOverContainer}>
                        <Text style={styles.gameOverText}>Game Over!</Text>
                        <Text style={styles.finalScoreText}>Final Score: {score}</Text>
                        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                            <Text style={styles.resetButtonText}>Reset Game</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {renderTarget()}
                {renderCurrentArrow()}
                {renderBottomUI()}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222',
    },
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    bottomContainer: {
        alignItems: "center",
        flexDirection: "row",
        bottom: 50,
        justifyContent: "center",
        marginLeft: 15,
        position: "absolute",
        width: "100%"
    },
    image: {
        height: 50,
        marginLeft: 10,
        resizeMode: "contain",
        width: 30,
    },
    numberArrows: {
        color: "#fff",
        fontSize: 40,
        fontWeight: "bold",
    },
    log: {
        width: logRadius * 2,
        height: logRadius * 2,
        borderRadius: logRadius,
        backgroundColor: '#A0522D', // Brown color
        position: 'absolute',
        top: height / 2 - logRadius,
        alignSelf: 'center',
    },
    arrow: {
        width: 3,
        height: arrowLength,
        backgroundColor: '#ddd',
        position: 'absolute',
        bottom: 'auto',
        transformOrigin: 'top',
        left: width / 2 - 1.5,
    },
    stuckArrow: {
        width: 3,
        height: arrowLength,
        backgroundColor: '#ddd',
        position: 'absolute',
        top: 0,
        left: -1,
        transformOrigin: 'top',
    },
    levelText: {
        color: '#fff',
        fontSize: 20,
        position: 'absolute',
        top: 40,
    },
    scoreContainer: {
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 5,
    },
    highScoreContainer: {
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 5,
    },
    scoreText: {
        color: '#fff',
        fontSize: 16,
    },
    arrowsContainer: {
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 5,
    },
    arrowsText: {
        color: '#fff',
        fontSize: 16,
    },
    gameOverContainer: {
        position: 'absolute',
        top: height / 2 - 60,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 20,
        borderRadius: 10,
    },
    gameOverText: {
        color: '#FF4136',
        fontSize: 32,
        fontWeight: 'bold',
    },
    finalScoreText: {
        color: '#fff',
        fontSize: 20,
        marginTop: 10,
    },
    resetButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#FF4136',
        borderRadius: 5,
    },
    resetButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default GameScreen;
