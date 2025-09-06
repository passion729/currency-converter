class CurrencyConverter {
    #baseValue: number | undefined = $state(1);
    #baseCurrency = $state("usd");
    #baseRates: Record<string, number> = $derived({});
    #targetValue: number | undefined = $state();
    #targetCurrency = $state("eur");

    currencies = $state({});
    loading = $state(true);
    error: string | undefined = $state();

    get baseValue() {
        return this.#baseValue;
    }

    set baseValue(v) {
        this.#baseValue = v && v < 0 ? 0 : v;
        this.#targetValue = this.#calculateTarget();
    }

    get baseCurrency() {
        return this.#baseCurrency;
    }

    set baseCurrency(v) {
        this.#baseCurrency = v;
        this.#fetchRates();
    }

    get targetValue() {
        return this.#targetValue;
    }

    get targetCurrency() {
        return this.#targetCurrency;
    }

    set targetCurrency(v) {
        this.#targetCurrency = v;
        this.#targetValue = this.#calculateTarget();
    }

    set targetValue(v) {
        this.#targetValue = v
        this.#baseValue = this.#calculateBase();
    }

    get baseRates() {
        return this.#baseRates;
    }
    set baseRates(v) {
        this.#baseRates = v;
        this.targetValue = this.#calculateTarget();
    }

    constructor(baseValue: number, baseCurrency: string, targetCurrency: string) {
        this.baseValue = baseValue;
        this.baseCurrency = baseCurrency;
        this.targetCurrency = targetCurrency;

        this.#loadCurrencies();
        this.#fetchRates();
    }

    #calculateTarget() {
        return this.baseValue
            && this.baseRates[this.targetCurrency]
            && +(this.baseValue * this.baseRates[this.targetCurrency]).toFixed(3);
    }

    #calculateBase() {
        return this.targetValue
            && this.baseRates[this.targetCurrency]
            && +(this.targetValue / this.baseRates[this.targetCurrency]).toFixed(3);
    }

    async #loadCurrencies() {
        this.loading = true;
        this.error = undefined;
        try {
            this.currencies = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.min.json")
                .then((r) => r.json());
        } catch {
            this.error = "An error has occurred";
        }
        this.loading = false;
    }

    async #fetchRates() {
        const res = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${ this.baseCurrency }.json`);
        const resJson = await res.json();
        console.log(resJson);
        this.baseRates = resJson[this.baseCurrency];
    }

    get rate() {
        return this.baseRates[this.targetCurrency];
    }

    switch() {
        const base = this.baseCurrency;
        this.baseCurrency = this.targetCurrency;
        this.targetCurrency = base;
    }

    reset() {

    }
}

export default CurrencyConverter;