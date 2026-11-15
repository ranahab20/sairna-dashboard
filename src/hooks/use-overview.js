import { useQuery } from '@tanstack/react-query';
import { getOverview } from '../api/overview';

export const useGetOverview = () => {
  return useQuery({
    queryKey: ['overview'],
    queryFn: getOverview,
  });
};