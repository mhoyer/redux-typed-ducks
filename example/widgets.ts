// An adopted sample from https://github.com/erikras/ducks-modular-redux#example
import {createDuck, createReducer} from '../index';

const widgetDucks = {
    loadWidgets: createDuck('my-app/widgets/LOAD', (state) => {
        return /*next*/state;
    }),
    createWidget: createDuck('my-app/widgets/CREATE', (state, widget) => {
        return /*next*/state;
    }),
    updateWidget: createDuck('my-app/widgets/UPDATE', (state, widget) => {
        return /*next*/state;
    }),
    removeWidget: createDuck('my-app/widgets/REMOVE', (state, widget) => {
        return /*next*/state;
    }),
};

createReducer(widgetDucks, {});
