export interface State {
    selectedUser: Form | {},
    filterUsersByRole: Array<Form>,
    filterUsersWithSearch: Array<Form>,
    users: Array<Form>
}

export interface Role {
    role: {
        name: string,
        id: number
    }
}

export interface Form {
    lastname: string,
    firstname: string,
    middlename: String,
    nickname: string,
    birthdate: string,
    email: string,
    user_roles: Array<Role> | [],
    active: boolean,
    id: number
}