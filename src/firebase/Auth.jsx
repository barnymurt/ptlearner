import { useState } from 'react';
import { signInWithGoogle, logOut, onAuthChange } from './config';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useState(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        fontFamily: 'var(--font-body)',
        color: 'var(--text-secondary)'
      }}>
        Loading...
      </div>
    );
  }

  return children;
}

export function SignInButton({ onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const user = await signInWithGoogle();
      if (onSuccess) onSuccess(user);
    } catch (err) {
      setError(err.message || 'Sign-in failed');
    }
    setIsLoading(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40px 24px',
      gap: '16px'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '8px' }}>🔐</div>
      <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Sign in to Fluência</h2>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 16px', textAlign: 'center', maxWidth: '280px' }}>
        Sign in to save your phrases across devices
      </p>
      {error && (
        <div style={{ padding: '10px 14px', background: 'var(--error-light)', borderRadius: '8px', fontSize: '13px', color: 'var(--error)' }}>
          ❌ {error}
        </div>
      )}
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 24px',
          background: '#fff',
          color: '#333',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '15px',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '280px',
          justifyContent: 'center'
        }}
      >
        {isLoading ? (
          <>
            <div style={{ width: '18px', height: '18px', border: '2px solid #e2e0dd', borderTopColor: '#333', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            Signing in...
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.123 15.983 5.114 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.114 2 2.123 4.017.957 7.042l3.007 2.332C4.672 5.164 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </>
        )}
      </button>
    </div>
  );
}

export function UserButton({ user, onLogout }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '13px',
          color: 'var(--text-primary)'
        }}
      >
        {user?.photoURL && (
          <img 
            src={user.photoURL} 
            alt={user.displayName || 'User'} 
            style={{ width: '24px', height: '24px', borderRadius: '50%' }} 
          />
        )}
        <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user?.displayName || user?.email || 'User'}
        </span>
        <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>▼</span>
      </button>
      {showMenu && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '4px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '8px 0',
          minWidth: '140px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 9999
        }}>
          <button
            onClick={() => { setShowMenu(false); onLogout(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              color: 'var(--error)',
              textAlign: 'left'
            }}
          >
            🚪 Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export function requireAuth(Component) {
  return function AuthenticatedComponent(props) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useState(() => {
      const unsubscribe = onAuthChange((firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });
      return unsubscribe;
    }, []);

    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <div style={{ width: '24px', height: '24px', border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      );
    }

    if (!user) {
      return <SignInButton />;
    }

    return <Component {...props} user={user} />;
  };
}