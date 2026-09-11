# Week 1 : Logout Redirect Loop in AuthContext

# Hardcoded Mock-User Fallback Breaking Logout

## Error:

> No thrown exception — silent bug. Clicking **Logout** cleared the
> session but the app instantly bounced the user back into
> `/citizen`, and manually visiting `/login` (or refreshing) also
> redirected straight back into the portal every time.

## Relevant Context

In `AuthContext.jsx`, `user` and `token` state were initialized with
hardcoded fallbacks instead of `null` when no session existed:

```javascript
// ❌ Original code
const defaultMockCitizen = {
  id: 'CIT-001',
  name: 'Aryan',
  email: 'aryan@civicpulse.gov.in',
  role: 'citizen',
  location: 'Model Town, Sector 4'
};

const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem('civicpulse_user');
  if (savedUser) {
    try { return JSON.parse(savedUser); } catch (e) { }
  }
  return defaultMockCitizen; // forced mock user when logged out
});

const [token, setToken] = useState(() => {
  return localStorage.getItem('civicpulse_token') ||
         sessionStorage.getItem('civicpulse_token') ||
         'mock-citizen-token'; // forced mock token when logged out
});

const checkAuth = useCallback(async () => {
  const currentToken = token || localStorage.getItem('civicpulse_token');

  if (!currentToken || currentToken === 'mock-citizen-token') {
    if (!user) setUser(defaultMockCitizen); // re-injects mock user
    setLoading(false);
    return;
  }
  // ...
}, [token, user]); // re-runs the instant user/token changes
```

And in `LoginPage.jsx`, an auto-redirect watched `user`:

```javascript
useEffect(() => {
  if (user && !authLoading) {
    if (user.role === 'citizen') {
      navigate('/citizen', { replace: true });
    } else {
      navigate('/authority', { replace: true });
    }
  }
}, [user, authLoading, navigate]);
```

## Key Observation

Logout wasn't actually failing — it was succeeding and then being
silently undone. Tracing the sequence on click:

1. `logout()` ran `clearToken()`, setting `user = null` and
   `token = null` and wiping storage.
2. `checkAuth` had `[token, user]` as dependencies, so it re-ran the
   instant `token`/`user` changed.
3. Inside `checkAuth`, `currentToken` was empty, so the
   `!currentToken` branch fired — and since `!user` was now `true`,
   it called `setUser(defaultMockCitizen)`, undoing the logout
   within the same tick.
4. `navigate('/login')` fired, but `LoginPage`'s `useEffect` saw a
   non-null `user` (the re-injected mock citizen) and immediately
   redirected to `/citizen`.
5. Because `AuthContext`'s initial state *also* fell back to
   `defaultMockCitizen`, even a manual URL visit or page refresh hit
   the same loop.

The root cause was two independent fallbacks — one at init, one in
`checkAuth` — that both treated "no session" as "assume the mock
citizen," so nothing ever stayed logged out.

## Solution

```javascript
// ✅ Fixed
const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem('civicpulse_user');
  if (savedUser) {
    try { return JSON.parse(savedUser); } catch (e) { }
  }
  return null; // unauthenticated by default
});

const [token, setToken] = useState(() => {
  return localStorage.getItem('civicpulse_token') ||
         sessionStorage.getItem('civicpulse_token') ||
         null;
});

const checkAuth = useCallback(async () => {
  const currentToken = token || localStorage.getItem('civicpulse_token');

  if (!currentToken) {
    setUser(null); // no more injecting a mock user
    setLoading(false);
    return;
  }
  // ...validate real token against backend...
}, [token]); // no longer depends on `user`, so it can't re-trigger on logout

const clearToken = () => {
  setUser(null);
  setToken(null);
  localStorage.removeItem('civicpulse_user');
  localStorage.removeItem('civicpulse_token');
  sessionStorage.removeItem('civicpulse_token');
};
```

**Because**

React `useEffect`/`useCallback` dependency arrays re-run their
callback on every render where a listed value changes — including
values the callback itself just set. When a fallback value (like
`defaultMockCitizen`) is used to fill an "empty" state instead of a
true empty value (`null`), any effect that checks `!user` can't
distinguish "genuinely logged out" from "not loaded yet," so it
keeps re-authenticating a fake session. The fix is a general
principle, not just an auth one: default/uninitialized state should
be represented by an unambiguous empty value (`null`/`undefined`),
never a placeholder object that looks valid — otherwise every
consumer of that state has to guess whether it's real.