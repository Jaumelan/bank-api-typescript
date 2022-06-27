class AmountValidator {
    public errors: string;

    public value: number;

    private onlyNumbersAndPeriodRegex = /^\d+\.?\d{0,2}$/gi;

    public constructor(value: number) {
        this.errors = '';
        this.value = this.validate(value);
    }

    private validate(value: number): number {
        if (!value) {
            this.errors += 'value:O valor não pode ser vazio.|';
            return 0;
        }

        if (value < 0) {
            this.errors += 'value:O valor não pode ser negativo.|';
            return 0;
        }

        if (value > 10000.00) {
            this.errors += 'value:O valor não pode ser maior que R$ 10000,00.|';
            return 0;
        }

        if (!this.onlyNumbersAndPeriodRegex.test(value.toString())) {
            this.errors += 'value:O valor deve conter apenas números e ponto.|';
            return 0;
        }

        if (!value.toString().trim()) {
            this.errors += 'value:O valor não pode só conter espaços em branco.|';
            return 0;
        }

        return value;
    }
}

export { AmountValidator };
