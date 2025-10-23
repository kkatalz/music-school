export interface SubjectResponse {
  id: number;
  name: string;
  studyYear: number;
  semester: number;
}

export interface SubjectNameResponse {
  id: number;
  name: string;
}

export type SubjectInfo = {
  id: number;
  name: string;
  studyYear: number;
  semester: number;
  teachers?: number[];
  students?: number[];
};

export interface CreateSubject {
  name: string;
  studyYear: number;
  semester: number;
}

export interface UpdateSubject {
  name?: string;
  studyYear?: number;
  semester?: number;
}
