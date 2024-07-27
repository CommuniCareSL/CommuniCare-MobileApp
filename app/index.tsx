import { Text, View, Image } from "react-native";
import { Link } from 'expo-router'

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
      }}
    >
      <Image source={require('../assets/images/logo.jpg')} style={{ width: 600, height: 500 }} />
      <Link href="/sign-in" style={{ backgroundColor: 'white', padding: 15, borderRadius: 10 }}>
        <Text style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>Start</Text>
      </Link>
    </View>
  );
}
