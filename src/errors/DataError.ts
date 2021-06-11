import PipeError from "./PipeError";

class DataError extends PipeError{
    constructor(message: string) {
        super(false, message);

    }

}
export default DataError;
