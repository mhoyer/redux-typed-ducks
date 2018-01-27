export interface BaseAction {
    type: string;
}

export interface Action<TPayload> extends BaseAction {
    type: string;
    payload: TPayload;
}

export type PayloadReducer<TState, TPayload> = (state: TState, payload: TPayload) => TState;

export interface Duck<TState, TPayload = any> {
    (payload?: TPayload): Action<TPayload>;
    actionType: string;
    payloadReducer: PayloadReducer<TState, TPayload>;
    /**
     * This variable is never used.
     * It is provided to allow for example "type MyAction = typeof myDuck.ActionTypeDef;"
     */
    ActionTypeDef: Action<TPayload>;
}

export interface DuckWithoutPayload<TState> extends Duck<TState> {
    (): BaseAction;
    actionType: string;
    payloadReducer: PayloadReducer<TState, void>;
}

export interface DuckTree<TState> {
    [key: string]: Duck<TState> | DuckTree<TState>;
}

/**
 * Creates a new duck which is an action creator in a first place.
 * Use createActionDispatchers() to convert an object literal with ducks
 * into a set of self-dispatching actions.
 */
export function createDuck<TState>(type: string, payloadReducer: PayloadReducer<TState, void>): DuckWithoutPayload<TState>;
export function createDuck<TState, TPayload>(type: string, payloadReducer: PayloadReducer<TState, TPayload>): Duck<TState, TPayload>;
export function createDuck(type, payloadReducer) {
    const duck: any = (payload: any) => ({ type, payload });
    duck.actionType = type;
    duck.payloadReducer = payloadReducer;
    return duck;
}
