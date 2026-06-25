import 'react-native-get-random-values';
import '@aws-amplify/react-native';

import { Amplify } from 'aws-amplify';

let isConfigured = false;

export function configureAmplify(): void {
  if (isConfigured) {
    return;
  }

  const userPoolId = process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID;
  const userPoolClientId = process.env.EXPO_PUBLIC_COGNITO_USER_POOL_CLIENT_ID;

  if (userPoolId === undefined || userPoolClientId === undefined) {
    console.warn('Cognito environment variables are not configured');
    return;
  }

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
        loginWith: {
          email: true,
        },
        signUpVerificationMethod: 'code',
      },
    },
  });
  isConfigured = true;
}
