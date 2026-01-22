import { useQuery } from "@tanstack/react-query";
import { authAPI, type User } from "../api/auth";

export const useCurrentUser = () => {
  return useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: () => authAPI.getCurrentUser(),
    enabled: !!localStorage.getItem("access_token"),
    retry: false,
    staleTime: 5 * 60 * 1000, 
  });
};
