import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
    isLoggedIn: false,
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isLoggedIn: true,
            };
        default:
            return state;
    }
};

export default rootReducer;

export const loadInitialState = async () => {
    try {
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        return {
            isLoggedIn: isLoggedIn === 'true',
        };
    } catch (error) {
        console.error('Error:', error);
        return initialState;
    }
};