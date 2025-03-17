"use client"
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserById } from '@/lib/auth';
import Image from 'next/image';
import ResetPassword from '@/components/ResetPassword';

export default function ProfilePage() {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserInfo(user.id);
    } else {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        fetchUserInfo(parsedUser.id);
      } else {
        setError('User not found');
        setLoading(false);
      }
    }
  }, [user]);

  const fetchUserInfo = async (userId: string) => {
    try {
      const data = await getUserById(userId);
      setUserInfo(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Image
            src={userInfo?.photo_url || '/default-profile.png'}
            alt="Profile"
            className="w-16 h-16 rounded-full mr-4"
            width={64}
            height={64}
          />
          <div>
            <h2 className="text-xl font-bold text-black">{userInfo?.name}</h2>
            <p className="text-gray-600">{userInfo?.email}</p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-black">Role</h3>
          <p className="text-gray-600">{userInfo?.role}</p>
        </div>
      </div>
      <ResetPassword userEmail={userInfo?.email || ''} />
    </div>
    
    </>
  );
}
