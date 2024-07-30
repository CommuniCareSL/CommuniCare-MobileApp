import { View, Text } from 'react-native'
import React from 'react'
import { Link } from "expo-router";

const SignUp = () => {
  return (
    <View>
      <Text>SignUp Page</Text>
      <Link href="/home">Click to Home Page</Link>
    </View>
  )
}

export default SignUp
