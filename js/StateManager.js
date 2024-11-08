class StateManager extends EventTarget {
    
    static STATE_WELCOME = "stateWelcome";
    static STATE_PLAYING = "statePlaying";
    static STATE_SCORE = "stateScore";
    static STATE_WINNER = "stateWinner";
    static #states = [StateManager.STATE_WELCOME, StateManager.STATE_PLAYING, StateManager.STATE_SCORE, StateManager.STATE_WINNER];

    static #instance; //# makes it a private property only used and seen inside of the class
    

    #currentState;

    constructor(name) {
        if(StateManager.#instance != null) { //if class already has an instance, error
            throw new Error("StateManager is a singleton, it's not meant to be instanced more than once.");
        } else {
            super(); //takes child class and executes it in parent class
            StateManager.#instance = this;
        }
    }

    get state(){
        return this.#currentState;
    }

    set state(newState) {
        if(StateManager.#states.includes(newState)) { //checks if the state called exists
            var stateManagerEvent = new StateManagerEvent(StateManagerEvent.STATE_CHANGE, newState, this.#currentState); //new state
            this.#currentState = newState; //changes value of current state
            this.dispatchEvent(stateManagerEvent);
        } else {
            throw new Error("Requested state is invalid (" + newState + ")");
        }
    }
}