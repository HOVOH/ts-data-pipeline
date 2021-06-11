import PipeError from "./PipeError";

class CriticalDataError extends PipeError{
    constructor(reason: string) {
        super(true, reason);
    }
}

export default CriticalDataError;
