import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

type ColorSwatchProps = {
  colorName: string;
  bgClass: string;
  textClass: string;
};

type ButtonProps = {
  text: string;
  bgClass: string;
  textClass: string;
  onPress?: () => void;
};

type EventCardProps = {
  title: string;
  statusType: "upcoming" | "active" | "past";
};

type AlertProps = {
  type: "success" | "error" | "warning" | "info";
  message: string;
};

const ThemeShowcase: React.FC = () => {
  const { colorScheme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  // Section component for organization
  const Section: React.FC<SectionProps> = ({ title, children }) => (
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
        {title}
      </Text>
      {children}
    </View>
  );

  // Color swatch component
  const ColorSwatch: React.FC<ColorSwatchProps> = ({
    colorName,
    bgClass,
    textClass,
  }) => (
    <View className="mb-2 w-full">
      <View
        className={`h-16 rounded-lg mb-1 justify-center items-center ${bgClass}`}
      >
        <Text className={`font-bold ${textClass}`}>{colorName}</Text>
      </View>
      <Text
        className={`text-xs ${isDark ? "text-text-dark" : "text-text-light"}`}
      >
        {colorName}
      </Text>
    </View>
  );

  // Button component
  const Button: React.FC<ButtonProps> = ({
    text,
    bgClass,
    textClass,
    onPress,
  }) => (
    <TouchableOpacity
      className={`py-3 px-6 rounded-lg mb-2 w-full ${bgClass}`}
      onPress={onPress}
    >
      <Text className={`text-center font-bold ${textClass}`}>{text}</Text>
    </TouchableOpacity>
  );

  // Card component for event examples
  const EventCard: React.FC<EventCardProps> = ({ title, statusType }) => {
    let statusBgClass = "";
    let statusTextClass = "";
    let statusLabel = "";

    switch (statusType) {
      case "upcoming":
        statusBgClass = isDark
          ? "bg-eventStatus-upcoming-dark"
          : "bg-eventStatus-upcoming-light";
        statusTextClass = "text-neutral-100";
        statusLabel = "Upcoming";
        break;
      case "active":
        statusBgClass = isDark
          ? "bg-eventStatus-active-dark"
          : "bg-eventStatus-active-light";
        statusTextClass = "text-neutral-100";
        statusLabel = "Active Now";
        break;
      case "past":
        statusBgClass = isDark
          ? "bg-eventStatus-past-dark"
          : "bg-eventStatus-past-light";
        statusTextClass = isDark ? "text-neutral-900" : "text-neutral-100";
        statusLabel = "Past";
        break;
    }

    return (
      <View
        className={`mb-4 rounded-lg p-4 border ${
          isDark
            ? "bg-surface-dark border-border-dark"
            : "bg-surface-light border-border-light"
        }`}
      >
        <View className="flex-row justify-between items-start">
          <Text
            className={`text-lg font-bold mb-2 ${
              isDark ? "text-foreground-dark" : "text-primary-light"
            }`}
          >
            {title}
          </Text>
          {statusLabel && (
            <View className={`py-1 px-3 rounded-full ${statusBgClass}`}>
              <Text className={`text-xs font-bold ${statusTextClass}`}>
                {statusLabel}
              </Text>
            </View>
          )}
        </View>
        <Text
          className={`mb-2 ${isDark ? "text-text-dark" : "text-text-light"}`}
        >
          Sample event card showing how colors appear in UI components.
        </Text>
        <View className="flex-row mt-2">
          <TouchableOpacity
            className={`mr-2 py-2 px-4 rounded-lg ${
              isDark ? "bg-primary-dark" : "bg-primary-light"
            }`}
          >
            <Text
              className={
                isDark ? "text-background-dark" : "text-foreground-light"
              }
            >
              Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`py-2 px-4 rounded-lg ${
              isDark ? "bg-secondary-dark" : "bg-secondary-light"
            }`}
          >
            <Text
              className={isDark ? "text-background-dark" : "text-neutral-100"}
            >
              Share
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Alert/notification component
  const Alert: React.FC<AlertProps> = ({ type, message }) => {
    let bgClass = "";
    let textClass = "";
    let iconText = "";

    switch (type) {
      case "success":
        bgClass = isDark ? "bg-success-dark" : "bg-success-light";
        textClass = isDark ? "text-background-dark" : "text-neutral-100";
        iconText = "✓";
        break;
      case "error":
        bgClass = isDark ? "bg-error-dark" : "bg-error-light";
        textClass = isDark ? "text-background-dark" : "text-neutral-100";
        iconText = "!";
        break;
      case "warning":
        bgClass = isDark ? "bg-warning-dark" : "bg-warning-light";
        textClass = "text-neutral-900";
        iconText = "⚠";
        break;
      case "info":
        bgClass = isDark ? "bg-secondary-dark" : "bg-secondary-light";
        textClass = isDark ? "text-background-dark" : "text-white";
        iconText = "i";
        break;
    }

    return (
      <View className={`mb-2 p-3 rounded-lg flex-row items-center ${bgClass}`}>
        <View className="w-6 h-6 rounded-full bg-white justify-center items-center mr-2">
          <Text className="text-neutral-900 font-bold text-xs">{iconText}</Text>
        </View>
        <Text className={`flex-1 ${textClass}`}>{message}</Text>
      </View>
    );
  };

  return (
    <ScrollView
      className={`flex-1 ${
        isDark ? "bg-background-dark" : "bg-background-light"
      }`}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-8">
          <Text
            className={`text-2xl font-bold ${
              isDark ? "text-foreground-dark" : "text-primary-light"
            }`}
          >
            Posable Theme Guide
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

        <Section title="Base Colors">
          <View className="flex-row flex-wrap -mx-1">
            <View className="w-1/2 px-1 mb-2">
              <ColorSwatch
                colorName="Background"
                bgClass={isDark ? "bg-background-dark" : "bg-background-light"}
                textClass={isDark ? "text-foreground-dark" : "text-white"}
              />
            </View>
            <View className="w-1/2 px-1 mb-2">
              <ColorSwatch
                colorName="Foreground"
                bgClass={isDark ? "bg-foreground-dark" : "bg-foreground-light"}
                textClass={isDark ? "text-background-dark" : "text-black"}
              />
            </View>
            <View className="w-1/2 px-1 mb-2">
              <ColorSwatch
                colorName="Text"
                bgClass={isDark ? "bg-text-dark" : "bg-text-light"}
                textClass={
                  isDark ? "text-background-dark" : "text-foreground-light"
                }
              />
            </View>
            <View className="w-1/2 px-1 mb-2">
              <ColorSwatch
                colorName="Primary"
                bgClass={isDark ? "bg-primary-dark" : "bg-primary-light"}
                textClass={
                  isDark ? "text-background-dark" : "text-foreground-light"
                }
              />
            </View>
            <View className="w-1/2 px-1 mb-2">
              <ColorSwatch
                colorName="Secondary"
                bgClass={isDark ? "bg-secondary-dark" : "bg-secondary-light"}
                textClass={isDark ? "text-background-dark" : "text-white"}
              />
            </View>
            <View className="w-1/2 px-1 mb-2">
              <ColorSwatch
                colorName="Accent"
                bgClass={isDark ? "bg-accent-dark" : "bg-accent-light"}
                textClass={isDark ? "text-background-dark" : "text-neutral-900"}
              />
            </View>
            <View className="w-1/2 px-1 mb-2">
              <ColorSwatch
                colorName="Surface"
                bgClass={isDark ? "bg-surface-dark" : "bg-surface-light"}
                textClass={
                  isDark ? "text-foreground-dark" : "text-primary-light"
                }
              />
            </View>
            <View className="w-1/2 px-1 mb-2">
              <ColorSwatch
                colorName="Border"
                bgClass={isDark ? "bg-border-dark" : "bg-border-light"}
                textClass={
                  isDark ? "text-background-dark" : "text-primary-light"
                }
              />
            </View>
          </View>
        </Section>

        <Section title="Typography">
          <View className="mb-4">
            <Text
              className={`text-2xl font-bold mb-2 ${
                isDark ? "text-foreground-dark" : "text-primary-light"
              }`}
            >
              Heading Text
            </Text>
            <Text
              className={`text-lg font-semibold mb-2 ${
                isDark ? "text-foreground-dark" : "text-primary-light"
              }`}
            >
              Subheading Text
            </Text>
            <Text
              className={`text-base mb-2 ${
                isDark ? "text-text-dark" : "text-text-light"
              }`}
            >
              This is regular body text that would appear throughout your app.
              It uses the new text color that automatically adjusts between
              light and dark modes for optimal readability.
            </Text>
            <Text
              className={`text-sm mb-2 ${
                isDark
                  ? "text-text-dark opacity-70"
                  : "text-text-light opacity-70"
              }`}
            >
              This is smaller secondary text, like captions or metadata.
            </Text>
            <TouchableOpacity>
              <Text
                className={`text-base ${
                  isDark ? "text-foreground-dark" : "text-primary-light"
                }`}
              >
                This is a text link
              </Text>
            </TouchableOpacity>
          </View>
        </Section>

        <Section title="Buttons">
          <Button
            text="Primary Button"
            bgClass={isDark ? "bg-primary-dark" : "bg-primary-light"}
            textClass={
              isDark ? "text-background-dark" : "text-foreground-light"
            }
          />
          <Button
            text="Secondary Button"
            bgClass={isDark ? "bg-secondary-dark" : "bg-secondary-light"}
            textClass={isDark ? "text-background-dark" : "text-neutral-100"}
          />
          <Button
            text="Accent Button"
            bgClass={isDark ? "bg-accent-dark" : "bg-accent-light"}
            textClass={isDark ? "text-background-dark" : "text-neutral-900"}
          />
          <Button
            text="Success Button"
            bgClass={isDark ? "bg-success-dark" : "bg-success-light"}
            textClass={isDark ? "text-background-dark" : "text-neutral-100"}
          />
          <Button
            text="Error Button"
            bgClass={isDark ? "bg-error-dark" : "bg-error-light"}
            textClass={isDark ? "text-background-dark" : "text-neutral-100"}
          />
        </Section>

        <Section title="Event Cards">
          <EventCard title="Weekend Beach Party" statusType="upcoming" />
          <EventCard title="Office Lunch Meetup" statusType="active" />
          <EventCard title="Birthday Celebration" statusType="past" />
        </Section>

        <Section title="Notifications & Alerts">
          <Alert type="success" message="Event created successfully!" />
          <Alert type="error" message="Failed to upload photo. Try again." />
          <Alert
            type="warning"
            message="Your event is starting in 10 minutes."
          />
          <Alert type="info" message="You have a new invitation." />
        </Section>

        <Section title="Content Block Example">
          <Text
            className={`text-xl font-bold mb-3 ${
              isDark ? "text-foreground-dark" : "text-primary-light"
            }`}
          >
            Event Details
          </Text>
          <Text
            className={`mb-2 ${isDark ? "text-text-dark" : "text-text-light"}`}
          >
            This is an example of how regular text content would appear in your
            app. The text color automatically adjusts between light and dark
            modes.
          </Text>
          <Text
            className={`mb-2 ${isDark ? "text-text-dark" : "text-text-light"}`}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            facilisi. Maecenas non tortor urna. Sed vitae nisi vel purus
            tristique ullamcorper.
          </Text>
          <Text
            className={`mb-2 ${
              isDark
                ? "text-text-dark opacity-70"
                : "text-text-light opacity-70"
            }`}
          >
            Event created on April 15, 2025 • 42 attendees
          </Text>
        </Section>
      </View>
    </ScrollView>
  );
};

export default ThemeShowcase;
