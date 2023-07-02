import { getAuth, onIdTokenChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export function useAuthentication() {
  const auth = getAuth();
  const [user, setUser] = useState();

  useEffect(() => {
    const unsubscribeFromAuthStatuChanged = onIdTokenChanged(
      auth,
      async (user) => {
        if (user) {
          
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User

          setUser(user);
        } else {
          // User is signed out
          setUser(undefined);
        }
      }
    );

    return unsubscribeFromAuthStatuChanged;
  }, []);

  return {
    user,
    setUser,
  };
}
