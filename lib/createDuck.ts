export type Action<TPayload> = {
    type: string;
    payload?: TPayload;
};

export type PayloadReducer<TState, TPayload> = {
    (state: TState, payload: TPayload): TState;
};

export type Duck<TState, TPayload> = {
    (payload?: TPayload): Action<TPayload>;
    actionType: string;
    payloadReducer: PayloadReducer<TState, TPayload>;
};

export type DuckTree<TState> = {
    [key: string]: Duck<TState, any> | DuckTree<TState>;
};

/**
 * Creates a new duck which is an action creator in a first place.
 * Use createActionDispatchers() to convert an object literal with ducks
 * into a set of self-dispatching actions.
 */
export function createDuck<TState, TPayload>(type: string, payloadReducer: PayloadReducer<TState, TPayload>): Duck<TState, TPayload> {
    const duck = <any> ((payload: TPayload) => {
        return {
            type,
            payload
        };
    });
    duck.actionType = type;
    duck.payloadReducer = payloadReducer;

    return duck;
}
