# Changelog

## [0.4.0](https://github.com/mhoyer/redux-typed-ducks/releases/tag/0.4.0) - not yet released
### Breaking Changes
- Rename `createDispatchedActions()` to `createActionDispatchers()` (old function still available, but obsolete)
### New Features
- Add `createScopedReducers<TState>(scopedDucks, scopedInitialStates)` ([#4](https://github.com/mhoyer/redux-typed-ducks/issues/4), @mhoyer)
- Enable support for single duck w/o wrapping object literal
- Provide `actionType` property on dispatched action functions when calling `createDispatchedActions()` ([#5](https://github.com/mhoyer/redux-typed-ducks/issues/5), @GregOnNet)
- Introduce `DuckTree<State>` type for nested duck structures
- Make Reducer type accept undefined state ([#8](https://github.com/mhoyer/redux-typed-ducks/issues/8), @olee)
### Maintenance
- Extract functions into separate files
- Rename some internal types
- Update NPM packages ([#6](https://github.com/mhoyer/redux-typed-ducks/issues/6), @GregOnNet)

## [0.3.0](https://github.com/mhoyer/redux-typed-ducks/releases/tag/0.3.0) - 2017-03-10
### Fixes
- Generate declarations in build and cleanup ([#2](https://github.com/mhoyer/redux-typed-ducks/issues/2), @TobiasWalle)
### Maintenance
- Update NPM packages ([#1](https://github.com/mhoyer/redux-typed-ducks/issues/1), @GregOnNet)

## [0.2.0](https://github.com/mhoyer/redux-typed-ducks/releases/tag/0.2.0) - 2016-03-16
### New Features
- Add support for nested duck structure for `createDuck()`
### Maintenance
- Update NPM packages

## [0.1.0](https://github.com/mhoyer/redux-typed-ducks/releases/tag/0.1.0) - 2016-03-14
### Initial release

With base API:

- `createDuck(actionType, payloadReducer)`
- `createReducer(ducks, [initialState])`
- `createDispatchedActions(ducks, store)`
