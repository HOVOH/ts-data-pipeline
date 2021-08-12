import PipeError from "./PipeError";

class DataError extends PipeError{

    readonly dataError: boolean = true;
    readonly data: any;
    readonly critical:boolean = false;

    constructor(message: string, data: any) {
        super(message);
        this.data = data;
    }

}
export default DataError;
