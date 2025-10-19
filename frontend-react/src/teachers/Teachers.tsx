import React from "react";
import { useTeachers } from "./useTeachers";

export const Teachers = () => {
  const { data, isLoading, isError, error } = useTeachers();
  if (isError) {
    return <h1>{error.message}</h1>;
  }
  if (isLoading) return <h1>loading ...</h1>;

  return (
    <div>
      {data?.map((teacher) => (
        <h1>{teacher.email}</h1>
      ))}
    </div>
  );
};
