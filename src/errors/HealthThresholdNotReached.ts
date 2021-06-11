class HealthThresholdNotReached extends Error {
    readonly healthThresholdNotReached = true;
    constructor(message: string) {
        super(message);
    }
}
export default HealthThresholdNotReached;
