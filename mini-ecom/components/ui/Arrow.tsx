import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Polygon, Rect } from "react-native-svg";

const ARROW_LENGTH = 60; // Adjust as needed
const ARROW_COLOR = "#A0522D"; // Brown color for the shaft
const ARROW_HEAD_COLOR = "lightgray"; // Gray for the arrowhead
const ARROW_FEATHERS_COLOR = "lightblue"; // Blue for the feathers

interface ArrowProps {
    inverted?: boolean;
}

const Arrow: React.FC<ArrowProps> = ({ inverted = false }) => {
    return (
        <Svg
            height={ARROW_LENGTH}
            width="10"
            style={[styles.arrowSvg, inverted && styles.inverted]}
        >
            {/* Arrowhead */}
            <Polygon
                points={`0,${ARROW_LENGTH * 0.8} 5,${ARROW_LENGTH} 10,${
                    ARROW_LENGTH * 0.8
                }`}
                fill={ARROW_HEAD_COLOR}
            />
            {/* Shaft */}
            <Rect
                x="4"
                y="0"
                width="2"
                height={ARROW_LENGTH * 0.8}
                fill={ARROW_COLOR}
            />
            
            {/* Feathers */}
            <Polygon
                points={`0,0 5,${ARROW_LENGTH * 0.2} 10,0`}
                fill={ARROW_FEATHERS_COLOR}
            />
            <Polygon
                points={`0,${ARROW_LENGTH * 0.3} 5,${ARROW_LENGTH * 0.5} 10,${
                    ARROW_LENGTH * 0.3
                }`}
                fill={ARROW_FEATHERS_COLOR}
            />
        </Svg>
    );
};

const styles = StyleSheet.create({
    arrowSvg: {
        transform: [{ rotate: "0deg" }],
    },
    inverted: {
        transform: [{ rotate: "180deg" }],
    },
});

export default Arrow;
