/**
 * Creates a new duck which is an action creator in a first place.
 * Use createDispatchedActions() to convert an object literal with ducks 
 * into a set of self-dispatching actions.
 */
export function createDuck<State, Payload>(type: string, payloadReducer: PayloadReducer<State, Payload>): Duck<State, Payload> {
    const duck = <any> ((payload: Payload) => {
        return {
            type,
            payload
        };
    });
    duck.actionType = type;
    duck.payloadReducer = payloadReducer;

    return duck;
}

/**
 * Creates a reducer function from given ducks collection.
 */
export function createReducer<State>(ducks, initialState = <State>{}): Reducer<State> {
    // slice the ducks and prepare payload reducers lookup object 
    const payloadReducers = Object.keys(ducks).reduce((payloadReducers, k) => {
        const duck = <Duck<State, any>> ducks[k];
        const actionType = duck.actionType;
        const payloadReducer = duck.payloadReducer;

        // validate the duck
        if (!(duck instanceof Function)) {
            throw new Error(`Given duck for '${k}' is not a function.`);
        }

        if (!(payloadReducer instanceof Function)) {
            throw new Error(`Given duck for '${k}' has no valid payload reducer.`);
        }

        if (!actionType) {
            throw new Error(
                `Given action '${k}' does not have a propper action type ('${actionType}') assigned. ` +
                `Did you miss running createDuck('ACTION_TYPE', ${k})?`);
        }

        // assign payload reducer of duck to payloadReducers using action type as key
        payloadReducers[actionType] = payloadReducer;
        return payloadReducers;
    }, {});

    return (state: State = initialState, action: Action<any>) => {
        const payloadReducer = payloadReducers[action.type];

        if (payloadReducer) {
            return payloadReducer(state, action.payload);
        }

        return state;
    };
}

/**
 * Converts a ducks object literal from action creators into self-dispatching actions 
 * by wrapping each duck with store.dispatch(). 
 */
export function createDispatchedActions<Ducks>(ducks: Ducks, store: Store): Ducks {
    const createDispatchedActionHandler = (origActionHandler) => {
        return function() {
            const action = origActionHandler.apply(this, arguments);
            return store.dispatch(action) || action;
        };
    };

    return <Ducks> Object.keys(ducks)
        .reduce((dispatchedActions, name) => {
            const dispatchedActionHandler = createDispatchedActionHandler(ducks[name]);
            dispatchedActions[name] = dispatchedActionHandler;
            return dispatchedActions;
        }, {});
}

type Action<Payload> = {
    type: string;
    payload?: Payload;
}

type Duck<State, Payload> = {
    (payload?: Payload): Action<Payload>,
    actionType: string,
    payloadReducer: PayloadReducer<State, Payload>
};

type Reducer<State> = {
     (state: State, action: Action<any>): State;
}

type PayloadReducer<State, Payload> = {
     (state: State, payload: Payload): State;
}

type Store = {
    dispatch(action: Action<any>);
}