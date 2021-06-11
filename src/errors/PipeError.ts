export interface IPipeError {
    throwAway: boolean;
    pipeError: true;
}

class PipeError extends Error implements IPipeError{

    throwAway: boolean;
    pipeError: true = true;

    constructor(throwAway: boolean, message: string) {
        super(message);
        this.throwAway = throwAway;
    }

}
export default PipeError;
