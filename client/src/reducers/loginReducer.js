import deepcopy from 'deepcopy';

export const initialUserDataState = {
    user: null,
    token: ""
};

const loginReducer = (userData, action) => {
    let user;
    
    switch (action.type) {
        case "LOGIN":
            user = deepcopy(action.user);
            return { user, token: action.token };
        case "LOGOUT":
            return { user: null, token: "" };
         default:
            return { ...userData };
    }
};

export default loginReducer;