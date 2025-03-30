export type Id=string | null

export interface List {
    id: string;
    title: string;
}

export interface Task {
    id: string;
    content: string;
    listId: string;
}





