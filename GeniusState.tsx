import * as React from "react";
import { Storage } from "./GeniusStorage";

export class State {

    private static _nsStorage: string[] = ["_state"];

    private _stateGet: any;
    private _stateRef: any;
    private _stateDirty: any;
    private _dispatchReducer: any;

    static make(initState: any, identifier?: string[]) {
        //Setup Underlying React Hooks
        const refState = React.useRef(initState);
        const getState = React.useCallback(() => refState.current, [])
        const dirtyState = React.useRef(Object.assign({}, refState.current));
        const [reducerState, reducerDispatch] = React.useReducer(
            (oldState: any, changesState: any) => {
                let newState = this.reducer(oldState, changesState);
                refState.current = newState;
                return newState;
            },
            initState
        );
        //Create State Management Rssult
        let result = new State(refState, getState, dirtyState, reducerDispatch);
        //Save Manager in Global Registry If Needed
        if (identifier) {
            Storage.set(identifier, result, this._nsStorage);
        }
        return result;
    }

    static fetch(identifier: string[]): State | null {
        if (!Storage.exists(identifier, this._nsStorage)) {
            return null;
        }
        let result = Storage.get(identifier, this._nsStorage);
        return result;
    }

    static reducer(oS: any, cS: any) {
        let nS = { ...oS, ...cS };
        return nS;
    };

    constructor(stateRef: any, stateGet: any, stateDirty: any, dispatchReducer: any) {
        this._stateGet = stateGet;
        this._stateRef = stateRef;
        this._stateDirty = stateDirty;
        this._dispatchReducer = dispatchReducer;
    }

    get state() {
        return this._stateDirty.current;
    }

    update() {
        this._dispatchReducer(this.state);
    }

}