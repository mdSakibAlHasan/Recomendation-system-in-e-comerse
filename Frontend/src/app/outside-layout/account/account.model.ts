export interface Registration{
    username: string,
    email: string,
    password: string,
}

export interface Login{
    username: string,
    password: string,
}

export interface User{
    message: string,
    token: string,
}