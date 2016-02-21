/**
 * Creates a new duck which is an action creator in a first place.
 * Use createDispatchedActions() to convert an object literal with ducks
 * into a set of self-dispatching actions.
 */
function createDuck(type, payloadReducer) {
    var duck = (function (payload) {
        return {
            type: type,
            payload: payload
        };
    });
    duck.actionType = type;
    duck.payloadReducer = payloadReducer;
    return duck;
}
exports.createDuck = createDuck;
/**
 * Creates a reducer function from given ducks collection.
 */
function createReducer(ducks, initialState) {
    if (initialState === void 0) { initialState = {}; }
    // slice the ducks and prepare payload reducers lookup object 
    var payloadReducers = Object.keys(ducks).reduce(function (payloadReducers, k) {
        var duck = ducks[k];
        var actionType = duck.actionType;
        var payloadReducer = duck.payloadReducer;
        // validate the duck
        if (!(duck instanceof Function)) {
            throw new Error("Given duck for '" + k + "' is not a function.");
        }
        if (!(payloadReducer instanceof Function)) {
            throw new Error("Given duck for '" + k + "' has no valid payload reducer.");
        }
        if (!actionType) {
            throw new Error(("Given action '" + k + "' does not have a propper action type ('" + actionType + "') assigned. ") +
                ("Did you miss running createDuck('ACTION_TYPE', " + k + ")?"));
        }
        // assign payload reducer of duck to payloadReducers using action type as key
        payloadReducers[actionType] = payloadReducer;
        return payloadReducers;
    }, {});
    return function (state, action) {
        if (state === void 0) { state = initialState; }
        var payloadReducer = payloadReducers[action.type];
        if (payloadReducer) {
            return payloadReducer(state, action.payload);
        }
        return state;
    };
}
exports.createReducer = createReducer;
/**
 * Converts a ducks object literal from action creators into self-dispatching actions
 * by wrapping each duck with store.dispatch().
 */
function createDispatchedActions(ducks, store) {
    var createDispatchedActionHandler = function (origActionHandler) {
        return function () {
            var action = origActionHandler.apply(this, arguments);
            return store.dispatch(action) || action;
        };
    };
    return Object.keys(ducks)
        .reduce(function (dispatchedActions, name) {
        var dispatchedActionHandler = createDispatchedActionHandler(ducks[name]);
        dispatchedActions[name] = dispatchedActionHandler;
        return dispatchedActions;
    }, {});
}
exports.createDispatchedActions = createDispatchedActions;
