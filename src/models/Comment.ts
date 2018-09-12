export interface Comment {
    id: number;
    comment: string;
    user_id : number;
    version_id: number;
    created: number;
    modified: number;
    visible: boolean;
}