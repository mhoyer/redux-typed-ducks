/**
 * Creates a new duck which is an action creator in a first place.
 * Use createDispatchedActions() to convert an object literal with ducks 
 * into a set of self-dispatching actions.
 */
export function createDuck<State, Payload>(type: string, reducer: NestedReducer<State, Payload>): Duck<State, Payload> {
    const duck = <any> ((payload: Payload) => {
        return {
            type,
            payload
        };
    });
    duck.actionType = type;
    duck.reducer = reducer;

    return duck;
}

/**
 * Creates a reducer function from given ducks collection.
 */
export function createReducer<State>(ducks, initialState = <State>{}): Reducer<State> {
    let payloadReducers = {};

    // slice the ducks and prepare lookup object 
    Object.keys(ducks).forEach(k => {
        const duck = <Duck<State, any>> ducks[k];
        const actionType = duck.actionType;
        const reducer = duck.reducer;

        // validate the duck
        if (!(duck instanceof Function)) {
            throw new Error(`Given duck for '${k}' is not a function.`);
        }

        if (!(reducer instanceof Function)) {
            throw new Error(`Given duck for '${k}' has no valid payload reducer.`);
        }

        if (!actionType) {
            throw new Error(
                `Given action '${k}' does not have a propper action type ('${actionType}') assigned. ` +
                `Did you miss running createDuck('ACTION_TYPE', ${k})?`);
        }

        // assign payload reducer of duck to payloadReducers using action type as key
        payloadReducers[actionType] = reducer;
    });

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

    let dispatchedActions = {};
    Object.keys(ducks)
        .forEach(k => {
            const dispatchedActionHandler = createDispatchedActionHandler(ducks[k]);
            dispatchedActions[k] = dispatchedActionHandler;
        });

    return <Ducks> dispatchedActions;
}
