<script lang="ts">
    import dummyRates from "$lib/utils/dummy-rates";

    let baseValue: number | undefined = $state(1);
    let baseCurrency = $state("usd");
    let baseRates: Record<string, number> = $derived({});
    let targetCurrency = $state("eur");

    const currenciesPromise = fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.min.json")
        .then((r) => r.json());

    let targetValue = {
        get value() {
            console.log("target: ", calculateTarget());
            return calculateTarget();
        },
        set value(v) {
            console.log("base: ", calculateBase(v));
            baseValue = calculateBase(v);
        }
    };

    $inspect(baseCurrency);

    async function fetchRates() {
        const res = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency}.json`);
        const resJson = await res.json();
        console.log(resJson);
        baseRates = resJson[baseCurrency];
    }

    $effect(() => {
        fetchRates()
    })

    function calculateTarget() {
        return baseValue && baseRates[targetCurrency] && +(baseValue * baseRates[targetCurrency]).toFixed(3);
    }

    function calculateBase(targetValue?: number) {
        return targetValue && baseRates[targetCurrency] && +(targetValue / baseRates[targetCurrency]).toFixed(3);
    }


</script>

{#await currenciesPromise}
    <p>Loading...</p>
{:then currencies}
    <div class="wrapper">
        <div class="conversion">
        <span class="base">
            {Number(1).toLocaleString("en-US", {
                style: "currency",
                currency: baseCurrency,
                currencyDisplay: "name"
            })} equals
        </span>
            <span class="target">
            {baseRates[targetCurrency]?.toLocaleString("en-US", {
                style: "currency",
                currency: targetCurrency,
                currencyDisplay: "name"
            })}
        </span>
        </div>
        <div class="base">
            <!--suppress CommaExpressionJS -->
            <input type="number"
                   bind:value={baseValue}
            />
            <select bind:value={baseCurrency}>
                <!--将对象抽取为[key, value]的list-->
                {#each Object.entries(currencies) as [key, value]}
                    <option value={key}>{value}</option>
                {/each}
            </select>
        </div>
        <div class="target">
            <input type="number"
                   bind:value={targetValue.value} />
            <select bind:value={targetCurrency}>
                <!--将对象抽取为[key, value]的list-->
                {#each Object.entries(currencies) as [key, value]}
                    <option value={key}>{value}</option>
                {/each}
            </select>
        </div>
    </div>
{/await}


<style lang="scss">
  .wrapper {
    font-family: Arial, Helvetica, sans-serif;
    background-color: #131313;
    padding: 20px;
    margin: 20px 10px;
    border-radius: 10px;

    .conversion {
      margin-bottom: 20px;

      span.base {
        opacity: 0.6;
        font-size: 14px;
        display: block;
        margin-bottom: 5px;
      }

      span.target {
        font-size: 28px;
        display: block;
      }
    }

    .base {
      margin-bottom: 15px;
    }

    .base,
    .target {
      select,
      input {
        background-color: transparent;
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 5px;
        padding: 10px;

        &:focus-visible {
          outline: 1px solid rgb(65, 189, 209);
        }
      }

      input {
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      }
    }
  }
</style>