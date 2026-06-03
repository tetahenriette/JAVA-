import * as actionTypes from '../actions/types';

const initialState = {
    bookings: [],
    currentBooking: null,
    loading: false,
    error: null,
    success: false
};

export default function bookingReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.BOOKING_START:
            return {
                ...state,
                loading: true,
                error: null,
                success: false
            };
        case actionTypes.BOOKING_SUCCESS:
            return {
                ...state,
                currentBooking: action.payload,
                loading: false,
                success: true
            };
        case actionTypes.FETCH_BOOKINGS_SUCCESS:
            return {
                ...state,
                bookings: action.payload,
                loading: false
            };
        case actionTypes.BOOKING_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false,
                success: false
            };
        case actionTypes.CLEAR_BOOKING:
            return {
                ...state,
                currentBooking: null,
                success: false
            };
        default:
            return state;
    }
}
