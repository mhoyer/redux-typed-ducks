import { BaseAction, Action, Duck, DuckTree } from './createDuck';

export type Reducer<TState> = {
    (state: TState, action: BaseAction | Action<any>): TState;
};

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
export function createReducer<TState>(duckTree: DuckTree<TState> | Duck<TState>, initialState = <TState>{}): Reducer<TState> {
    if (duckTree instanceof Function) {
        const duck = duckTree as Duck<TState>;
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
        const duck = flatDucks[k] as Duck<TState>;
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
