import { Action } from './createDuck';

export type Store = {
    dispatch(action: Action<any>): any;
};

 /**
 * Converts a tree of ducks into a tree of self-dispatching actions
 * by wrapping each duck with store.dispatch().
 */
export function createActionDispatchers<TDuckTree>(ducks: TDuckTree, store: Store): TDuckTree {
    const createDispatchedActionHandler = (origActionHandler) => {
        return function() {
            const action = origActionHandler.apply(this, arguments);
            return store.dispatch(action) || action;
        };
    };

    return <TDuckTree> Object.keys(ducks)
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
}

/**
 * @deprecated renamed to `createActionDispatchers()`.
 */
export function createDispatchedActions<TDuckTree>(ducks: TDuckTree, store: Store): TDuckTree {
    console.info(`Function \`createDispatchedActions()\` is marked OBSOLETE. Use \`createActionDispatchers()\` instead.`);
    return createActionDispatchers(ducks, store);
}
