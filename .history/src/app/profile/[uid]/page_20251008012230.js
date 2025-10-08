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
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import ChatWindow from '../../../chat/ChatWindow';
import PostProduct from '@/app/post/PostProduct';

export default function ProfilePage() {
  const { uid } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [creatorProducts, setCreatorProducts] = useState([]); // ✅ Products from Stripe metadata

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

  // Fetch profile from Firestore
  useEffect(() => {
    if (uid) {
      const fetchProfile = async () => {
        try {
          const userRef = doc(db, 'publicUsers', uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) setProfileUser(snap.data());
        } catch (err) {
          console.error('Failed to fetch profile:', err.message);
        }
      };
      fetchProfile();
    }
  }, [uid]);

  // ✅ Fetch all products for this creator (via new API)
  useEffect(() => {
    const fetchCreatorProducts = async () => {
      if (!uid) return;
      try {
        const res = await fetch(`/api/creatorProducts?creator=${uid}`);
        const data = await res.json();

        if (data?.data) {
          setCreatorProducts(data.data);
          console.log('🎨 Creator products fetched:', data.data);
        }
      } catch (err) {
        console.error('Error fetching creator products:', err.message);
      }
    };

    fetchCreatorProducts();
  }, [uid]);

  // Chat logic
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

  // Auth handlers
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
      <p className="text-[#001f3f] p-12 text-center text-xl">
        Loading profile…
      </p>
    );
  }

  const displayName = profileUser.displayName || uid;
  const photoURL = profileUser.photoURL || '/images/default-avatar.png';
  const isOwnProfile = currentUser?.uid === uid;

  return (
    <div className="bg-white text-[#001f3f] min-h-screen px-6 sm:px-12 py-14 font-serif">
      {/* Hero Section */}
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

      {/* 🧵 Creator Products Section */}
      <div className="max-w-5xl mx-auto mb-16">
        <h2 className="text-2xl font-semibold mb-6">
          {isOwnProfile
            ? 'Your Listed Products'
            : `${displayName}'s Handmade Products`}
        </h2>

        {creatorProducts.length === 0 ? (
          <p className="text-gray-600 italic">
            {isOwnProfile
              ? 'You haven’t uploaded any products yet.'
              : 'This creator has no listed products yet.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {creatorProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-50 rounded-xl shadow-md overflow-hidden border"
              >
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {product.description}
                  </p>
                  <p className="text-blue-700 font-medium mb-3">
                    ${product.price}
                  </p>
                  {isOwnProfile && (
                    <PostProduct currentProduct={product} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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

      {/* Login Modal */}
      {showLogin && !currentUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl mb-4 text-center">Sign in to continue</h2>
            <form onSubmit={handleSignIn} className="mb-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full mb-3 p-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
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

      {/* Chat */}
      {isChatVisible && chatId && currentUser && (
        <div className="max-w-2xl mx-auto mt-10">
          <ChatWindow chatId={chatId} currentUserId={currentUser.uid} />
        </div>
      )}
    </div>
  );
}
