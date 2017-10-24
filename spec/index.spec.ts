import {Duck, createDuck, createReducer, createActionDispatchers, createScopedReducers} from '../index';

const replaceReducer = (state: string, payload: string) => {
    return payload;
};
const revertReducer = (state: string) => {
    return state.split('').reverse().join('');
};

describe('Creating a duck', () => {
    let ribbit: Duck<string, string>;

    beforeEach(() => {
        ribbit = createDuck('RIBBIT', replaceReducer);
    });

    it('provides the action creator', () => {
        const action = ribbit('hello');

        expect(action.type).toBe('RIBBIT');
        expect(action.payload).toBe('hello');
    });

    it('assigns the action type', () => {
        expect(ribbit.actionType).toBe('RIBBIT');
    });

    it('assigns the payload reducer', () => {
        expect(ribbit.payloadReducer).toBe(replaceReducer);
    });

    describe('Creating a reducer from a single duck', () => {
        it('enables call of the one payload reducers when invoked with matching action', () => {
            const reducer = createReducer(ribbit);

            const nextState = reducer('prev state', {
                type: 'RIBBIT',
                payload: 'payload',
            });

            expect(nextState).toBe('payload');
        });

        it('returns previous state when type of action does not match the type of the duck', () => {
            const reducer = createReducer(ribbit);

            const nextState = reducer('prev state', {
                type: 'NOMATCH'
            });

            expect(nextState).toBe('prev state');
        });
    });
});

describe('Given some ducks.', () => {
    const ducks = {
        swim: createDuck('SWIM', replaceReducer),
        dive: createDuck('DIVE', revertReducer),
    };

    describe('Creating a reducer from ducks map', () => {
        it('enables call of nested reducers when invoked with matching action', () => {
            const reducer = createReducer(ducks);

            const nextState = reducer('prev state', {
                type: 'SWIM',
                payload: 'payload',
            });

            expect(nextState).toBe('payload');
        });

        it('supports actions without payload', () => {
            const reducer = createReducer(ducks);

            const nextState = reducer('prev state', {
                type: 'DIVE'
            });

            expect(nextState).toBe('etats verp');
        });

        it('returns previous state when type of action does not match one of the ducks', () => {
            const reducer = createReducer(ducks);

            const nextState = reducer('prev state', {
                type: 'NOMATCH'
            });

            expect(nextState).toBe('prev state');
        });
    });

    describe('Creating a reducer map from a scoped ducks map', () => {
        it('enables call of nested reducers when invoked with matching action', () => {
            const initialState = { swim: '', dive: '' };
            const reducer = createScopedReducers(ducks, initialState);

            const nextState = reducer.swim('prev state', {
                type: 'SWIM',
                payload: 'payload',
            });

            expect(nextState).toBe('payload');
        });

        it('supports actions without payload', () => {
            const initialState = { swim: '', dive: '' };
            const reducer = createScopedReducers(ducks, initialState);

            const nextState = reducer.dive('prev state', {
                type: 'DIVE'
            });

            expect(nextState).toBe('etats verp');
        });

        it('returns previous state when type of action does not match one of the ducks', () => {
            const initialState = { swim: '', dive: '' };
            const reducer = createScopedReducers(ducks, initialState);

            const nextState = reducer.swim('prev state', {
                type: 'NOMATCH'
            });

            expect(nextState).toBe('prev state');
        });

        it('returns previous state when type of action was targeting a different scope', () => {
            const initialState = { swim: '', dive: '' };
            const reducer = createScopedReducers(ducks, initialState);

            const nextState = reducer.swim('prev state', {
                type: 'DIVE'
            });

            expect(nextState).toBe('prev state');
        });
    });

    describe('Creating dispatch actions from a tree of ducks', () => {
        let dispatchedActions = [];
        const fakeStore = {
            dispatch: (action) => { dispatchedActions.push(action); }
        };
        const actions = createActionDispatchers(ducks, fakeStore);

        beforeEach(() => {
            dispatchedActions = [];
        });

        it('provides the actionType for each duck', () => {
            const diveAction = actions.dive;

            expect(diveAction.actionType).toBe('DIVE');
        });

        it('calls dispatch function of given store', () => {
            const action = actions.swim('payload');

            expect(dispatchedActions.length).toBe(1);
            expect(dispatchedActions[0].type).toBe('SWIM');
            expect(dispatchedActions[0].payload).toBe('payload');
        });

        it('provides each duck action with returning actual action object', () => {
            const action = actions.dive();

            expect(action.type).toBe('DIVE');
            expect(action.payload).toBeUndefined();
        });
    });
});

describe('Given some nested ducks.', () => {
    const ducks = {
        nested: {
            swim: createDuck('SWIM', replaceReducer),
            dive: createDuck('DIVE', revertReducer),
        }
    };

    describe('Creating a reducer from a tree of ducks', () => {
        it('enables call of nested reducers when invoked with matching action', () => {
            const reducer = createReducer(ducks);

            const nextState = reducer('prev state', {
                type: 'SWIM',
                payload: 'payload',
            });

            expect(nextState).toBe('payload');
        });

        it('supports actions without payload', () => {
            const reducer = createReducer(ducks);

            const nextState = reducer('prev state', {
                type: 'DIVE'
            });

            expect(nextState).toBe('etats verp');
        });

        it('returns previous state when type of action does not match one of the ducks', () => {
            const reducer = createReducer(ducks);

            const nextState = reducer('prev state', {
                type: 'NOMATCH'
            });

            expect(nextState).toBe('prev state');
        });
    });

    describe('Creating a reducer map from a scoped ducks map', () => {

        it('enables call of nested reducers when invoked with matching action', () => {
            const initialState = { nested: 'initial state' };
            const reducer = createScopedReducers(ducks, initialState);

            const nextState = reducer.nested('prev state', {
                type: 'SWIM',
                payload: 'payload',
            });

            expect(nextState).toBe('payload');
        });

        it('supports actions without payload', () => {
            const initialState = { nested: 'initial state' };
            const reducer = createScopedReducers(ducks, initialState);

            const nextState = reducer.nested('prev state', {
                type: 'DIVE'
            });

            expect(nextState).toBe('etats verp');
        });

        it('returns previous state when type of action does not match one of the ducks', () => {
            const initialState = { nested: 'initial state' };
            const reducer = createScopedReducers(ducks, initialState);

            const nextState = reducer.nested('prev state', {
                type: 'NOMATCH'
            });

            expect(nextState).toBe('prev state');
        });
    });

    describe('Creating dispatch actions from a tree of ducks', () => {
        let dispatchedActions = [];
        const fakeStore = {
            dispatch: (action) => { dispatchedActions.push(action); }
        };
        const actions = createActionDispatchers(ducks, fakeStore);

        beforeEach(() => {
            dispatchedActions = [];
        });

        it('calls dispatch function of given store', () => {
            const action = actions.nested.swim('payload');

            expect(dispatchedActions.length).toBe(1);
            expect(dispatchedActions[0].type).toBe('SWIM');
            expect(dispatchedActions[0].payload).toBe('payload');
        });

        it('provides the actionType for each duck', () => {
            const diveAction = actions.nested.dive;

            expect(diveAction.actionType).toBe('DIVE');
        });

        it('provides each duck action with returning actual action object', () => {
            const action = actions.nested.dive();

            expect(action.type).toBe('DIVE');
            expect(action.payload).toBeUndefined();
        });
    });
});
