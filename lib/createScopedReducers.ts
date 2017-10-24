import { createReducer, Reducer } from './createReducer';
import { Duck, DuckTree } from './createDuck';

export type ScopedDuckTree<TState> = {
    [PScope in keyof TState]: Duck<TState[PScope], any> | DuckTree<TState[PScope]>;
};

export type ScopedReducerMap<TState> = {
    [PScope in keyof TState]: Reducer<TState[PScope]>;
};

/**
 * Creates a map of reducer functions for a given map of ducks (or duck trees).
 */
export function createScopedReducers<TState>(scopedDucks: ScopedDuckTree<TState>, scopedInitialStates: TState): ScopedReducerMap<TState> {
    return Object.keys(scopedDucks).reduce((reducerMap, k) => {
        const duck = (scopedDucks as any)[k];
        const initialState = scopedInitialStates && scopedInitialStates[k];
        if (initialState === undefined) {
            throw new Error(`Given scoped initial state does not contain an entry for '${k}'.`);
        }

        reducerMap[k] = createReducer(duck, initialState);
        return reducerMap;
    }, {}) as ScopedReducerMap<TState>;
}
