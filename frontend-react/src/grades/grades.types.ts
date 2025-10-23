import type { SubjectNameResponse } from "../subjects/types/subjects.types";

export interface Grade {
  id: number;
  subject?: SubjectNameResponse;
  value?: number;
}