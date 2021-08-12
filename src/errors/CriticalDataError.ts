
import DataError from "./DataError";

class CriticalDataError extends DataError{
    readonly critical = true;

    constructor(reason: string, data: any) {
        super(reason, data);
    }
}

export default CriticalDataError;
