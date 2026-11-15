import { useQuery } from '@tanstack/react-query';
import { getCities } from '../api/cities';

export const useGetCities = () => {
  return useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
  });
};