'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCurrentUserData } from '@/lib/hooks/use-current-user-data';
import { Spinner } from './ui/spinner';

export const CurrentUserAvatar = () => {
  const userData = useCurrentUserData();
  const { name, image, isLoading } = userData;

  return (
    <Avatar>
      {image && <AvatarImage src={image} alt={name} />}
      <AvatarFallback className="bg-primary text-white">{isLoading ? <Spinner /> : name}</AvatarFallback>
    </Avatar>
  );
};
