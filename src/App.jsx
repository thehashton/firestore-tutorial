import './App.css';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { auth } from './lib/firebase';
import Todo from './components/Todo';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
     // Check the user's authentication state when the app loads
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is signed in
        setUser(currentUser);
      } else {
        // User is signed out
        setUser(null)
      }
    })

    return () => unsubscribe();
  })


  // Sign Up
  const signUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      setUser(userCredential.user);
      console.log('User signed up:', userCredential.user);
    })
    .catch(error => {
      console.error('Error signing up:', error);
    });
  }

  // Sign In
  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      setUser(userCredential.user);
      console.log('User signed in:', userCredential.user);
    })
    .catch(error => {
      console.error('Error signing out:', error);
    });
  }

  // Sign Out
  const logOut = () => {
    signOut(auth)
    .then(() => {
      setUser(null);
      console.log('User signed out');
    })
    .catch(error => {
      console.error('Error signing out:', error);
    });
  }



  return (
   <>
    <div>
      {
        !user && (
          <>
            <h1>Firestore Authentication</h1>
            <input type="text" placeholder='Email' value={email} onChange={(event) => setEmail(event.target.value)} />
            <input type="password" placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)} />
            <button onClick={signUp}>Sign up</button>
            <button onClick={signIn}>Sign In</button>
          </>
        )
      }
    </div>

    {
      user && (
        <div>
          <Todo />
          <p>Logged in as: {user.email}</p>
          <button onClick={logOut}>Sign Out</button>
        </div>
      )
    }
   </>
  )
}

export default App;
