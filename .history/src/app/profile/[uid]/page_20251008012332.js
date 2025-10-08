'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { auth, db } from '../../../firebase/firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import ChatWindow from '../../../chat/ChatWindow';

export default function ProfilePage() {
  const { uid } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Track logged-in user
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) setShowLogin(false);
    });
    return () => unsub();
  }, []);

  // Fetch public profile
  useEffect(() => {
    if (!profileUser && uid) {
      const fetchProfile = async () => {
        try {
          const userRef = doc(db, 'publicUsers', uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            setProfileUser(snap.data());
          }
        } catch (err) {
          console.error('Failed to fetch profile:', err.message);
        }
      };
      fetchProfile();
    }
  }, [uid, profileUser]);

  // Start chat (for logged-in users)
  async function handleStartChat() {
    if (!currentUser || !uid) return;

    const sortedUIDs = [currentUser.uid, uid].sort();
    const chatsRef = collection(db, 'chats');
    const chatQuery = query(chatsRef, where('participants', '==', sortedUIDs));
    const snapshot = await getDocs(chatQuery);

    let chatRefId;
    if (!snapshot.empty) {
      chatRefId = snapshot.docs[0].id;
    } else {
      const newChatRef = await addDoc(chatsRef, {
        participants: sortedUIDs,
        createdAt: serverTimestamp(),
        lastMessage: '',
        lastSender: '',
      });
      chatRefId = newChatRef.id;

      await addDoc(collection(db, 'chats', chatRefId, 'messages'), {
        text: `${currentUser.uid} started the chat.`,
        sender: currentUser.uid,
        createdAt: serverTimestamp(),
      });
    }

    setChatId(chatRefId);
    setIsChatVisible(true);
  }

  // Handle email/password sign-in
  async function handleSignIn(e) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowLogin(false);
      setEmail('');
      setPassword('');
    } catch (err) {
      alert(err.message);
    }
  }

  // Handle Google sign-in
  async function handleGoogleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setShowLogin(false);
    } catch (err) {
      alert(err.message);
    }
  }

  if (!profileUser) {
    return (
      <p className="text-[#001f3f] p-12 text-center text-xl">Loading profile…</p>
    );
  }

  const displayName = profileUser.displayName || uid;
  const photoURL = profileUser.photoURL || '/images/default-avatar.png';
  const isOwnProfile = currentUser?.uid === uid;

  const showcasePhotos = [
    'https://firebasestorage.googleapis.com/v0/b/YOUR_APP/o/photo1.jpg?alt=media',
    'https://firebasestorage.googleapis.com/v0/b/YOUR_APP/o/photo2.jpg?alt=media',
    'https://firebasestorage.googleapis.com/v0/b/YOUR_APP/o/photo3.jpg?alt=media',
  ];

  return (
    <div className="bg-white text-[#001f3f] min-h-screen px-6 sm:px-12 py-14 font-serif">
      {/* Hero */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <img
          src={photoURL}
          alt={`Portrait of ${displayName}`}
          className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full border-[6px] border-[#001f3f] shadow-md mx-auto mb-5"
        />
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-wide mb-4 uppercase">
          {displayName}
        </h1>
        <p className="text-lg max-w-xl mx-auto italic text-[#4b5060]">
          “Crafting legacy through stories and visuals.”
        </p>
      </div>

      {/* Full-width Image */}
      <div className="max-w-4xl mx-auto mb-10">
        <img
          src={showcasePhotos[0]}
          alt="Feature banner"
          className="w-full h-[400px] object-cover rounded-md shadow-md"
        />
      </div>

      {/* Editorial Text */}
      <div className="max-w-3xl mx-auto space-y-8 text-lg leading-relaxed text-[#2d2d2d] mb-12">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed congue, sapien non dignissim
          egestas, sapien tortor volutpat magna, eget tincidunt purus felis in libero.
        </p>
        <p>
          Integer gravida libero nec ultricies cursus. Maecenas nec erat a eros pharetra sagittis.
          Etiam et sapien id libero dictum eleifend. Nulla facilisi. Suspendisse potenti.
        </p>
        <p>
          Vivamus a volutpat sem. Phasellus fringilla mauris at mattis lacinia. Duis id justo ut risus
          feugiat laoreet. Fusce sollicitudin justo in libero facilisis, eget laoreet purus iaculis.
        </p>
      </div>

      {/* Two Side-by-Side Images */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
        {showcasePhotos.slice(1).map((url, idx) => (
          <div key={idx} className="rounded-lg overflow-hidden shadow-lg">
            <img src={url} alt={`Showcase ${idx + 2}`} className="w-full h-[280px] object-cover" />
          </div>
        ))}
      </div>

      {/* Chat Option */}
      {!isOwnProfile && (
        <div className="text-center mb-14">
          {currentUser ? (
            <button
              onClick={handleStartChat}
              className="bg-[#001f3f] text-white hover:bg-[#0b2b4f] px-6 py-3 text-lg font-medium rounded-full shadow-lg transition-colors"
            >
              Message Seller 💬
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="bg-gray-400 text-white px-6 py-3 text-lg font-medium rounded-full shadow-lg"
            >
              Sign in to Message 💬
            </button>
          )}
        </div>
      )}

      {/* Embedded Login Modal */}
      {showLogin && !currentUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl mb-4 text-center">Sign in to continue</h2>
            <form onSubmit={handleSignIn} className="mb-4">
              <input
                type="email"
                placeholder=""
                className="w-full mb-3 p-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder=""
                className="w-full mb-3 p-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                className="bg-[#001f3f] text-white px-4 py-2 rounded w-full"
              >
                Sign In
              </button>
            </form>
            <button
              onClick={handleGoogleSignIn}
              className="bg-red-500 text-white px-4 py-2 rounded w-full mb-2"
            >
              Sign in with Google
            </button>
            <button
              onClick={() => setShowLogin(false)}
              className="mt-2 text-gray-500 underline w-full text-center"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isChatVisible && chatId && currentUser && (
        <div className="max-w-2xl mx-auto mt-10">
          <ChatWindow chatId={chatId} currentUserId={currentUser.uid} />
        </div>
      )}
    </div>
  );
}