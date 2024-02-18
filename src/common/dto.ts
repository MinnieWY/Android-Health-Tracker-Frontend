export interface AbstractDTO {
    dateModified: string;
    dateCreated: string;
    modifiedBy: string;
    createdBy: string;
}

export interface UserDTO {
    id?: string;
    username: string;
    password: string;
    email: string;
    status: string;
}