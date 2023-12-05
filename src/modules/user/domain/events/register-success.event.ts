export class RegisterSuccessEvent {
    constructor(
        public readonly id: number,
        public readonly amount: number
    ) {}
}