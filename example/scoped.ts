import {createDuck, createScopedReducers} from '../index';

// State and ducks for 'Admin' scope
type AdminState = { users: string[] };
const deleteUserDuck = createDuck('admin/DELETE_USER', (state: AdminState, userId: string) => {
    state.users = state.users.filter(u => u !== userId);
    return state;
});

// State and ducks for 'User' scope
type UserState = { password: string };
const updatePwdDuck = createDuck('user/UPDATE_PROFILE', (state: UserState, pwd: string) => {
    state.password = pwd;
    return state;
});

// Bringing scoped states and ducks together
const scopedInitialState = {
    admin: { users: [] },
    user: { password: 'topsecret' }
};
const scopedDucks = {
    admin: {
        deleteUser: deleteUserDuck
    },
    user: {
        updatePwd: updatePwdDuck
        // ... add more ducks here
    }
};

// Creating the scoped reducers
const scopedReducers = createScopedReducers(scopedDucks, scopedInitialState);
// scopedReducers then looks like:
// {
//     admin: (state: AdminState, action: Action) => { /* reducer-logic */ },
//     user: (state: UserState, action: Action) => { /* reducer-logic */ },
// }


let prevState: AdminState = { users: ['mhoyer'] };
let dispatchedAction = { type: 'admin/DELETE_USER', payload: 'mhoyer' };

const nextState = scopedReducers.admin(prevState, dispatchedAction); // -> { users: [] }
