import {
  confirmSignUp as amplifyConfirmSignUp,
  fetchAuthSession,
  getCurrentUser,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  signUp as amplifySignUp,
} from 'aws-amplify/auth';

export interface AuthUser {
  email: string;
  userId: string;
}

export interface SignUpResult {
  isSignUpComplete: boolean;
}

export async function restoreAuthUser(): Promise<AuthUser | null> {
  try {
    const [user, session] = await Promise.all([getCurrentUser(), fetchAuthSession()]);
    const email = session.tokens?.idToken?.payload.email;

    return {
      email: typeof email === 'string' ? email : user.username,
      userId: user.userId,
    };
  } catch {
    return null;
  }
}

export async function signUp(email: string, password: string): Promise<SignUpResult> {
  const result = await amplifySignUp({
    username: email,
    password,
    options: {
      userAttributes: {
        email,
      },
    },
  });

  return {
    isSignUpComplete: result.isSignUpComplete,
  };
}

export async function confirmSignUp(email: string, confirmationCode: string): Promise<void> {
  await amplifyConfirmSignUp({
    username: email,
    confirmationCode,
  });
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const result = await amplifySignIn({
    username: email,
    password,
  });

  if (!result.isSignedIn) {
    throw new Error(`Additional sign-in step required: ${result.nextStep.signInStep}`);
  }

  const user = await restoreAuthUser();

  if (user === null) {
    throw new Error('Unable to restore the signed-in user');
  }

  return user;
}

export async function signOut(): Promise<void> {
  await amplifySignOut();
}
