class StateManagerEvent extends Event {

    static STATE_CHANGE = "stateChange";

    newState;
    previousState;

    constructor(type, newState, previousState) {
        super(type);
        this.newState = newState;
        this.previousState = previousState;
    }
}