export interface NotificationModel{
    id: number,
    message: string,
    link: string,
    is_read: boolean,
    created_at: string,
    user_id: number
}