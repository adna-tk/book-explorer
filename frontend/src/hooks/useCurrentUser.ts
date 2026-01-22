import { useQuery } from "@tanstack/react-query";
import { authAPI, type User } from "../api/auth";
import { useAuth } from "./useAuth";

export const useCurrentUser = () => {
  const { isAuthenticated } = useAuth();

  return useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: () => authAPI.getCurrentUser(),
    enabled: isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};
