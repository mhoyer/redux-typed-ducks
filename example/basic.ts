import {createDuck, createReducer, createDispatchedActions} from '../index';

// Create ducks
const replaceDuck = createDuck('duck/REPLACE', replaceReducer);
const revertDuck = createDuck('duck/REVERT', replaceReducer);

// A duck is an action creator, but also has meta fields assigned.
replaceDuck.actionType;     // -> 'duck/REPLACE'
replaceDuck.payloadReducer; // -> replaceReducer()
replaceDuck('ribbit');      // -> { type:'duck/REPLACE', payload:'ribbit' } 

// Interestingly, we do not have to fiddle with FSAs in our 
// reducer implementations and can focus on the payload.
function replaceReducer(state: string, payload: string) {
    const nextState = payload;
    return nextState;
};


// At some point we need to create the actual reducer.
const initialState = 'initial string state';
const ducks = {
    replaceDuck,
    revertDuck
};
const reducer = createReducer(ducks); // 2nd param is optional initial state

// redux or @ngrx/store will later execute the reducer like so:
const prevState = 'previous state'; // some randome state
const dispatchedAction = { type: 'MY_FIRST_DUCK', payload: 'ribbit' };
const nextState = reducer(prevState, dispatchedAction); // -> 'ribbit'


// Additionally we can already wire up the ducks with the store 
// to create self-dispating action functions.
const fakeStore = {dispatch: (action) => { console.log(action); }};
const actions = createDispatchedActions(ducks, fakeStore);
actions.replaceDuck('next'); // -> dispatches the 'duck/REPLACE' action 
                             //    with 'next' as payload. It also returns
                             //    the generated action object.

// Exporting the actions object will help to prune boiler plate code 
// in your actual application components.
