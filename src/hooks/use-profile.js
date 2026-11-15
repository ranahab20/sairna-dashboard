import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '../api/profile';

export const useGetMyProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getMyProfile,
  });
};