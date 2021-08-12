export interface IPipeError {
    pipeError: true;
}

class PipeError extends Error implements IPipeError{

    pipeError: true = true;

    constructor(message: string) {
        super(message);
    }

}
export default PipeError;
