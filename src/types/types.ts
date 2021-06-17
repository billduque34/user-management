export interface State {
    filterUsersByRole: Array<Form>,
    paginatedUsers: Array<Form>,
    selectedUser: Form | {},
    users: Array<Form>
}

export interface Role {
    role: {
        name: String,
        id: Number
    }
}

export interface Form {
    lastname: String,
    firstname: String,
    middlename: String,
    nickname: String,
    birthdate: String,
    email: string,
    user_roles: Array<Role> | [],
    active: boolean,
    id: number
}