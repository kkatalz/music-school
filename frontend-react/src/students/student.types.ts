

export interface Student {
    firstName: string;
    lastName: string;
    phone: string;
    parentPhone: string;
    address: string;
    startStudyDate: Date;
    email: string;
    password: string;
}

export interface UpdateStudent {
    firstName?: string;
    lastName?: string;
    phone?: string;
    parentPhone?: string;
    address?: string;
    startStudyDate?: Date;
    email?: string;
}