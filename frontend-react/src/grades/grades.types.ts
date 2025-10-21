import type { SubjectName  } from "../subjects/subjects.types";

export interface Grade {
    id: number;
    subject?: SubjectName;
    value?: number;
}