import { View, Text } from 'react-native'
import React from 'react'

import { Link } from 'expo-router'

const Records = () => {
  return (
    <View>
      <Link href="/sign-up">Records</Link>
      <Link href="/home">Click to Records</Link>
    </View>
  )
}

export default Records