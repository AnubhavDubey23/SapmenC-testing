import { useState, useEffect } from 'react';
import useMe from '../auth/useMe';
import useUpdateUser from './useUpdateUser';

const useProfilePicture = () => {
  const { user, getUser } = useMe();
  const { updateUser } = useUpdateUser();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (user) {
      setProfilePicture(user.profilePicture);
    }
  }, [user]);

  const updateProfilePicture = async (newProfilePicture: string) => {
    try {
      setLoading(true);
      await updateUser({ profilePicture: newProfilePicture });
      setProfilePicture(newProfilePicture);
    } catch (error) {
      // Error is already handled in useUpdateUser
      console.error('Failed to update profile picture', error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, profilePicture, updateProfilePicture };
};

export default useProfilePicture;
