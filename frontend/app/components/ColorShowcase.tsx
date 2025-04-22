import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";

// Type definitions for props
type ColorSwatchProps = {
  bgClass: string;
  colorName: string;
  shade: string;
  textColorClass: string;
};

type ColorFamilyProps = {
  title: string;
  family: string;
  shades: string[];
};

const ColorShowcase: React.FC = () => {
  const { colorScheme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  // Individual color swatch
  const ColorSwatch: React.FC<ColorSwatchProps> = ({
    bgClass,
    colorName,
    shade,
    textColorClass,
  }) => (
    <View className="w-1/3 p-1 mb-2">
      <View
        className={`h-16 rounded-md mb-1 items-center justify-center ${bgClass}`}
      >
        <Text className={`text-sm font-semibold ${textColorClass}`}>
          {shade}
        </Text>
      </View>
      <Text
        className={`text-xs ${isDark ? "text-text-dark" : "text-text-light"}`}
      >
        {`${colorName}-${shade}`}
      </Text>
    </View>
  );

  // Section for a color family
  const ColorFamily: React.FC<ColorFamilyProps> = ({
    title,
    family,
    shades,
  }) => {
    // Determine text color for each shade
    const getTextColor = (family: string, shade: string): string => {
      const shadeNum = parseInt(shade);

      if (family === "pinkRed") {
        return shadeNum < 500 ? "text-pinkRed-950" : "text-white";
      } else if (family === "neonGreen") {
        return shadeNum < 600 ? "text-neonGreen-950" : "text-white";
      } else if (family === "deepBlue") {
        return shadeNum < 400 ? "text-deepBlue-950" : "text-white";
      }

      return shadeNum < 500 ? "text-black" : "text-white";
    };

    return (
      <View
        className={`mb-8 p-4 rounded-lg ${
          isDark ? "bg-surface-dark" : "bg-surface-light"
        }`}
      >
        <Text
          className={`text-lg font-bold mb-3 ${
            isDark ? "text-foreground-dark" : "text-primary-light"
          }`}
        >
          {title} Color Scale
        </Text>
        <Text
          className={`mb-2 ${isDark ? "text-text-dark" : "text-text-light"}`}
        >
          Use <Text className="font-semibold">{`bg-${family}-{shade}`}</Text> or{" "}
          <Text className="font-semibold">{`text-${family}-{shade}`}</Text>
        </Text>
        <View className="flex-row flex-wrap">
          {shades.map((shade) => (
            <ColorSwatch
              key={`${family}-${shade}`}
              bgClass={`bg-${family}-${shade}`}
              colorName={family}
              shade={shade}
              textColorClass={getTextColor(family, shade)}
            />
          ))}
        </View>
      </View>
    );
  };

  // Available shades
  const allShades = [
    "50",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
    "950",
  ];

  // Base colors section
  const BaseColors: React.FC = () => (
    <View
      className={`mb-8 p-4 rounded-lg ${
        isDark ? "bg-surface-dark" : "bg-surface-light"
      }`}
    >
      <Text
        className={`text-lg font-bold mb-3 ${
          isDark ? "text-foreground-dark" : "text-primary-light"
        }`}
      >
        Base Theme Colors
      </Text>
      <View className="flex-row flex-wrap">
        <View className="w-1/2 p-1 mb-2">
          <View
            className={`h-16 rounded-md mb-1 items-center justify-center ${
              isDark ? "bg-background-dark" : "bg-background-light"
            }`}
          >
            <Text className={isDark ? "text-text-dark" : "text-primary-light"}>
              Background
            </Text>
          </View>
          <Text
            className={`text-xs ${
              isDark ? "text-text-dark" : "text-text-light"
            }`}
          >
            {isDark ? "bg-background-dark" : "bg-background-light"}
          </Text>
        </View>

        <View className="w-1/2 p-1 mb-2">
          <View
            className={`h-16 rounded-md mb-1 items-center justify-center ${
              isDark ? "bg-surface-dark" : "bg-surface-light"
            }`}
          >
            <Text className={isDark ? "text-text-dark" : "text-primary-light"}>
              Surface
            </Text>
          </View>
          <Text
            className={`text-xs ${
              isDark ? "text-text-dark" : "text-text-light"
            }`}
          >
            {isDark ? "bg-surface-dark" : "bg-surface-light"}
          </Text>
        </View>

        <View className="w-1/2 p-1 mb-2">
          <View
            className={`h-16 rounded-md mb-1 items-center justify-center ${
              isDark ? "bg-primary-dark" : "bg-primary-light"
            }`}
          >
            <Text
              className={
                isDark ? "text-background-dark" : "text-foreground-light"
              }
            >
              Primary
            </Text>
          </View>
          <Text
            className={`text-xs ${
              isDark ? "text-text-dark" : "text-text-light"
            }`}
          >
            {isDark ? "bg-primary-dark" : "bg-primary-light"}
          </Text>
        </View>

        <View className="w-1/2 p-1 mb-2">
          <View
            className={`h-16 rounded-md mb-1 items-center justify-center ${
              isDark ? "bg-secondary-dark" : "bg-secondary-light"
            }`}
          >
            <Text className={isDark ? "text-background-dark" : "text-white"}>
              Secondary
            </Text>
          </View>
          <Text
            className={`text-xs ${
              isDark ? "text-text-dark" : "text-text-light"
            }`}
          >
            {isDark ? "bg-secondary-dark" : "bg-secondary-light"}
          </Text>
        </View>
      </View>
    </View>
  );

  const ComponentExamples: React.FC = () => (
    <View
      className={`mb-8 p-4 rounded-lg ${
        isDark ? "bg-surface-dark" : "bg-surface-light"
      }`}
    >
      <Text
        className={`text-lg font-bold mb-3 ${
          isDark ? "text-foreground-dark" : "text-primary-light"
        }`}
      >
        Component Examples
      </Text>

      {/* Buttons */}
      <View className="mb-6">
        <Text
          className={`font-semibold mb-2 ${
            isDark ? "text-text-dark" : "text-text-light"
          }`}
        >
          Buttons
        </Text>

        <View className="mb-2">
          <TouchableOpacity className="bg-pinkRed-600 py-2 px-4 rounded-md mb-1">
            <Text className="text-white font-medium text-center">
              Pink Red Button
            </Text>
          </TouchableOpacity>
          <Text
            className={`text-xs ${
              isDark ? "text-text-dark" : "text-text-light"
            }`}
          >
            bg-pinkRed-600 text-white
          </Text>
        </View>

        <View className="mb-2">
          <TouchableOpacity className="bg-neonGreen-500 py-2 px-4 rounded-md mb-1">
            <Text className="text-neonGreen-950 font-medium text-center">
              Neon Green Button
            </Text>
          </TouchableOpacity>
          <Text
            className={`text-xs ${
              isDark ? "text-text-dark" : "text-text-light"
            }`}
          >
            bg-neonGreen-500 text-neonGreen-950
          </Text>
        </View>

        <View className="mb-2">
          <TouchableOpacity className="bg-deepBlue-700 py-2 px-4 rounded-md mb-1">
            <Text className="text-white font-medium text-center">
              Deep Blue Button
            </Text>
          </TouchableOpacity>
          <Text
            className={`text-xs ${
              isDark ? "text-text-dark" : "text-text-light"
            }`}
          >
            bg-deepBlue-700 text-white
          </Text>
        </View>
      </View>

      {/* Cards */}
      <View>
        <Text
          className={`font-semibold mb-2 ${
            isDark ? "text-text-dark" : "text-text-light"
          }`}
        >
          Cards
        </Text>

        <View className="mb-2">
          <View className="bg-white border border-pinkRed-200 rounded-md p-3 mb-1">
            <Text className="font-bold text-pinkRed-700 mb-1">
              Pink Card Title
            </Text>
            <Text className="text-text-light text-sm mb-2">
              This is a card with pink accents.
            </Text>
            <TouchableOpacity className="bg-pinkRed-500 py-1 px-3 rounded self-start">
              <Text className="text-white text-xs">Action</Text>
            </TouchableOpacity>
          </View>
          <Text
            className={`text-xs ${
              isDark ? "text-text-dark" : "text-text-light"
            }`}
          >
            bg-white border-pinkRed-200 text-pinkRed-700
          </Text>
        </View>

        <View className="mb-2">
          <View className="bg-deepBlue-50 border border-deepBlue-200 rounded-md p-3 mb-1">
            <Text className="font-bold text-deepBlue-800 mb-1">
              Blue Card Title
            </Text>
            <Text className="text-text-light text-sm mb-2">
              This is a card with blue accents.
            </Text>
            <TouchableOpacity className="bg-deepBlue-600 py-1 px-3 rounded self-start">
              <Text className="text-white text-xs">Action</Text>
            </TouchableOpacity>
          </View>
          <Text
            className={`text-xs ${
              isDark ? "text-text-dark" : "text-text-light"
            }`}
          >
            bg-deepBlue-50 border-deepBlue-200 text-deepBlue-800
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView
      className={`flex-1 ${
        isDark ? "bg-background-dark" : "bg-background-light"
      }`}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text
            className={`text-2xl font-bold ${
              isDark ? "text-foreground-dark" : "text-primary-light"
            }`}
          >
            Color Reference
          </Text>
          <TouchableOpacity
            className={`py-2 px-4 rounded-lg ${
              isDark ? "bg-secondary-dark" : "bg-primary-light"
            }`}
            onPress={toggleColorScheme}
          >
            <Text
              className={
                isDark ? "text-background-dark" : "text-foreground-light"
              }
            >
              {isDark ? "Light Mode" : "Dark Mode"}
            </Text>
          </TouchableOpacity>
        </View>

        <BaseColors />

        {/* Pink Red Color Scale */}
        <ColorFamily title="Pink Red" family="pinkRed" shades={allShades} />

        {/* Neon Green Color Scale */}
        <ColorFamily title="Neon Green" family="neonGreen" shades={allShades} />

        {/* Deep Blue Color Scale */}
        <ColorFamily title="Deep Blue" family="deepBlue" shades={allShades} />

        <ComponentExamples />
      </View>
    </ScrollView>
  );
};

export default ColorShowcase;
