// to mimic redux related types
declare type Action<Payload> = {
    type: string;
    payload?: Payload;
}

declare type Duck<State, Payload> = {
    (payload?: Payload): Action<Payload>,
    actionType: string,
    payloadReducer: PayloadReducer<State, Payload>
};

declare type Reducer<State> = {
     (state: State, action: Action<any>): State;
}

declare type PayloadReducer<State, Payload> = {
     (state: State, payload: Payload): State;
}

declare type Store = {
    dispatch(action: Action<any>);
}
