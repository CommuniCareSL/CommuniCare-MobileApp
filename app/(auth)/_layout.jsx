import { Redirect, Stack } from "expo-router";


const AuthLayout = () => {

  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: true,
          }}
        />
      </Stack>

    </>
  );
};

export default AuthLayout;
