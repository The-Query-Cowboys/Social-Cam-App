import { useClerk } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";

export const SignOutButton = () => {
  const { signOut } = useClerk();
  const { isDark } = useTheme();

  const buttonStyle = `py-3 px-8 border rounded-lg w-4/5 max-w-md mx-auto flex items-center justify-center mt-4 ${
    isDark ? "bg-neonGreen-700" : "bg-neonGreen-500"
  }`;

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to your desired page
      Linking.openURL(Linking.createURL("/"));
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <TouchableOpacity onPress={handleSignOut} className={buttonStyle}>
      <Text
        className={`font-bold ${isDark ? "text-text-dark" : "text-text-light"}`}
      >
        Sign out
      </Text>
    </TouchableOpacity>
  );
};
