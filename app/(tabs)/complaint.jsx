import { View, Text } from 'react-native'
import React from 'react'

import { Link } from 'expo-router'

const Complaint = () => {
  return (
    <View>
      <Link href="/sign-up">Complint</Link>
      <Link href="/home">Click to complint</Link>
    </View>
  )
}

export default Complaint