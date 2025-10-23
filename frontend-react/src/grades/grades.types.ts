import type { SubjectNameResponse  } from "../subjects/subjects.types";

export interface Grade {
    id: number;
    subject?: SubjectNameResponse;
    value?: number;
}