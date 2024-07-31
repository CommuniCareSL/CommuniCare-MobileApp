import { View, Text } from 'react-native'
import React from 'react'

import { Link } from 'expo-router'

const Appointment = () => {
  return (
    <View>
      <Link href="/sign-up">Appointment</Link>
      <Link href="/home">Click to Appointment</Link>
    </View>
  )
}

export default Appointment