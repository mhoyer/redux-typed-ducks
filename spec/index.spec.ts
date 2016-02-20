import {createDuck, createReducer, createDispatchedActions} from '../index';

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
});

describe('Given some ducks.', () => {
    let ducks = {
        swim: createDuck('SWIM', replaceReducer),
        dive: createDuck('DIVE', revertReducer),
    };

    describe('Creating a reducer from ducks collection', () => {
        it('enables call of nested reducers when invoked with matching action', () => {
            const reducer = createReducer(ducks);

            const nextState = reducer('prev state', {
                type: 'SWIM',
                payload: 'payload',
            });

            expect(nextState).toBe('payload');
        });

        it('support actions without payload', () => {
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

    describe('Creating dispatch actions from ducks collection', () => {
        let dispatchedActions = [];
        const fakeStore = {
            dispatch: (action) => { dispatchedActions.push(action); }
        };
        const actions = createDispatchedActions(ducks, fakeStore);

        beforeEach(() => {
            dispatchedActions = [];
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
