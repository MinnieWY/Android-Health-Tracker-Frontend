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
    preference: string;
}

export interface MaterialListItemDTO {
    id?: string;
    name: string;
    shorDescription: string;
    type: string;
    url: string;
    content: string;
}
export interface MaterialItemDTO {
    id?: string;
    name: string;
    shorDescription: string;
    type: string;
    url: string;
    content: string;
}

export interface UserSearchResultDTO {
    id?: string;
    username: string;
}

export interface FriendDTO {
    id?: string;
    username: string;
    email: string;
    isFriend: boolean;
}