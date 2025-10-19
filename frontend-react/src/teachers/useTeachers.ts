import { useQuery } from "@tanstack/react-query";
import { getTeachers } from "./teachers.service";

export const useTeachers = () => {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });
};
