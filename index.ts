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

/**
 * Flattens out all functions of an object structure.
 */
function flatMapFunctions(obj) {
    return Object.keys(obj).reduce((functions, key) => {
        const prop = obj[key];
        if (prop instanceof Function) {
            functions[key] = prop;
        } else if (prop instanceof Object) {
            // merge into accumulator
            const nestedFunctions = flatMapFunctions(prop);
            Object.keys(nestedFunctions).forEach(nestedKey => {
                functions[key + '_' + nestedKey] = nestedFunctions[nestedKey];
            });
        } else {
            throw new Error(`Given duck for '${key}' is not a function nor object literal.`);
        }

        return functions;
    }, {});
}

/**
 * Creates a reducer function from given tree of ducks (object literal).
 */
export function createReducer<TState>(duckTree: DuckTree<TState> | Duck<TState, any>, initialState = <TState>{}): Reducer<TState> {
    if (duckTree instanceof Function) {
        const duck = <Duck<TState, any>> duckTree;
        const actionType = duck.actionType;
        const payloadReducer = duck.payloadReducer;

        return (state: TState = initialState, action: Action<any>) => {
            if (actionType !== action.type) return state;

            return payloadReducer(state, action.payload);
        };
    }

    const flatDucks = flatMapFunctions(duckTree);

    // slice the ducks and prepare payload reducers lookup object
    const payloadReducers = Object.keys(flatDucks).reduce((payloadReducers, k) => {
        const duck = <Duck<TState, any>> flatDucks[k];
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

    return (state: TState = initialState, action: Action<any>) => {
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
export function createActionDispatchers<TDucks>(ducks: TDucks, store: Store): TDucks {
    const createDispatchedActionHandler = (origActionHandler) => {
        return function() {
            const action = origActionHandler.apply(this, arguments);
            return store.dispatch(action) || action;
        };
    };

    return <TDucks> Object.keys(ducks)
        .reduce((dispatchedActions, name) => {
            const duck = ducks[name];

            if (duck instanceof Function) {
                const dispatchedActionHandler = createDispatchedActionHandler(duck);
                dispatchedActions[name] = dispatchedActionHandler;
                dispatchedActions[name].actionType = duck.actionType;
            } else if (duck instanceof Object) {
                dispatchedActions[name] = createActionDispatchers(duck, store);
            }

            return dispatchedActions;
        }, {});
};

/**
 * @deprecated renamed to `createActionDispatchers()`.
 */
export function createDispatchedActions<TDucks>(ducks: TDucks, store: Store): TDucks {
    console.info(`Function \`createDispatchedActions()\` is marked OBSOLETE. Use \`createActionDispatchers()\` instead.`);
    return createActionDispatchers(ducks, store);
}

export type Action<TPayload> = {
    type: string;
    payload?: TPayload;
};

export type DuckTree<TState> = {
    [key: string]: Duck<TState, any> | DuckTree<TState>;
};

export type Duck<TState, TPayload> = {
    (payload?: TPayload): Action<TPayload>;
    actionType: string;
    payloadReducer: PayloadReducer<TState, TPayload>;
};

export type Reducer<TState> = {
     (state: TState, action: Action<any>): TState;
};

export type PayloadReducer<TState, TPayload> = {
     (state: TState, payload: TPayload): TState;
};

export type Store = {
    dispatch(action: Action<any>);
};