import { useMutation } from '@tanstack/react-query';
import { loginAdmin } from '../api/auth';

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: loginAdmin,
  });
};