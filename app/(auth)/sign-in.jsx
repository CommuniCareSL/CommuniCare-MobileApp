import { View, Text } from 'react-native'
import React from 'react'

import { Link } from 'expo-router'

const SignIn = () => {
  return (
    <View>
      <Link href="/sign-up">Click to Sign Up Page</Link>
      <Link href="/home">Click to Home Page</Link>
    </View>
  )
}

export default SignIn