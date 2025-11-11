import { useEffect, useState } from 'react';
import { authClient } from '../auth-client';

const getInitials = (name?: string | null) => {
  return (
    name
      ?.split(' ')
      ?.map(word => word[0])
      ?.join('')
      ?.toUpperCase() || 'U'
  );
};

export const useCurrentUserData = () => {
  const [data, setData] = useState<{
    name: string;
    image?: string | null;
    isLoading?: boolean;
  }>({
    name: 'U',
    image: undefined,
    isLoading: true,
  });

  useEffect(() => {
    const fetchUserImage = async () => {
      const { data, error } = await authClient.getSession();
      if (error) {
        console.error(error);
      }

      setData({
        name: getInitials(data?.user.name),
        image: data?.user.image ?? null,
        isLoading: false,
      });
    };
    fetchUserImage();
  }, []);

  return data;
};
