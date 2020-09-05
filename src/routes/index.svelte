<script>
  import heroes from "../utils/heroes";
  import getChains from "../utils/get-chains";
  import { fade } from "svelte/transition";
  import Select from "svelte-select";
  import InfiniteLoading from "svelte-infinite-loading";

  var heroNames = Object.keys(heroes);
  var allChains = getChains(heroes);
  $: chains = allChains.filter((chain) => {
    return chain.find((el) => el);
  });

  let selectedHeroes = ["", "", "", ""];
  let curHeroSlot = 0;

  $: items = [
    ...heroNames
      .filter((v) => !selectedHeroes.includes(v))
      .map((v) => ({ value: v, label: parseName(v) })),
  ];
  let isSelectVisible = true;
  let selectedValue;
  let filterText;
  let selRef; // svelte-select handleClick for focusing isn't public. Must access ref @ index 32. API could change on update

  let selectReady = true; // if you're an impatient user, this causes bugs. Hopefully they don't click this much

  var selHeroes;
  $: {
    selHeroes = selectedHeroes.filter((v) => v != ""); // filter out empty strings from selected heroes
    chains = allChains
      .filter((chain) => {
        return chain.find((el) => el);
      })
      .filter((chain) => {
        for (let heroName of selHeroes) {
          if (!chain.includes(heroName)) {
            return false;
          }
        }
        return true;
      });
  }

  function infiniteHandler({ detail }) {
    console.log(detail);
  }

  function parseName(heroName) {
    return heroName == ""
      ? ""
      : heroName == "fMei"
      ? "F/Mei"
      : heroName
          .split(/(?=[A-Z])/)
          .map((name) => name[0].toUpperCase() + name.slice(1))
          .join(" ");
  }
</script>

<style>
  h1,
  p,
  h3 {
    text-align: center;
    margin: 0 auto;
    color: var(--primary-color);
  }
  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  p {
    /* override cascade */
    color: var(--secondary-color);
    margin: 1em auto;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }

  section {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    flex-flow: row wrap;
  }

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column;
    align-items: center;
  }

  /* .outline {
    outline: none;
    transition: all 0.15s ease-out;
  }
  .outline:focus {
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.6);
  } */

  .stack > * + * {
    margin-top: 1.5rem;
  }

  h3 {
    font-weight: 500;
  }

  br {
    width: 7em;
    height: 0.1em;
    margin-bottom: 1em;
    content: "";
    border-top: 1px solid var(--primary-color);
  }

  .arrow {
    color: #fff;
    margin-left: 1em;
    margin-right: 1em;
  }

  .chain {
    white-space: nowrap;
  }

  .selected-heroes {
    display: flex;
    flex-flow: row nowrap;
    margin: 1.5em auto;
  }
  .selected-hero-btn {
    display: flex;
    flex-flow: column;
    justify-content: center;
    border: 1px solid white;
    width: 10em;
    height: 4em;
    background: none;
  }
  .selected-hero-btn:hover {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.2);
  }
  .selected-hero-btn h3 {
    font-weight: 600;
  }

  .select-container {
    color: black;
    width: 12em;
    border: none;
    border-radius: 1em;
    margin-bottom: 1.5em;
  }
</style>

<svelte:head>
  <title>Thunder Thighs Vish</title>
  <link
    rel="icon"
    href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='12 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>" />
</svelte:head>

<div class="container">
  <!-- <div class="input-container">
    <input
      class="outline"
      placeholder="Type in a hero..."
      bind:value
      on:change={(e) => {
        if (heroNames.find((v) => e.target.value.toLowerCase() == v)) {
          value = e.target.value.toLowerCase();
          value = '';
        }
      }} />
  </div> -->

  <div class="selected-heroes">
    {#each selectedHeroes as hero, i}
      <button
        class="selected-hero-btn"
        on:click={() => {
          if (hero) {
            selectedHeroes[i] = '';
          } else {
            function refWait() {
              selRef.$$.ctx[32]();
            }
            setTimeout(refWait, 300);
            isSelectVisible = true;
            curHeroSlot = i;
          }
        }}>
        {#if hero && selectReady}
          <h3
            transition:fade
            on:outrostart={() => (selectReady = i)}
            on:outroend={() => (selectReady = true)}>
            {parseName(hero)}
          </h3>
        {:else if selectReady !== i}
          <p style="font-size: 2em;">+</p>
        {/if}
      </button>
    {/each}
  </div>

  {#if isSelectVisible}
    <div transition:fade class="select-container">
      <Select
        bind:filterText
        bind:selectedValue
        bind:this={selRef}
        {items}
        placeholder="Select hero..."
        noOptionsMessage="No results found 🧀"
        on:select={({ detail: { value } }) => {
          selectedHeroes[curHeroSlot] = value;
          isSelectVisible = false;
          selectedValue = undefined;
          filterText = '';
        }}
        isVirtualList />
    </div>
  {/if}

  {#if selHeroes && selHeroes.length > 0}
    <div>
      {#each chains as chain, i}
        <section transition:fade>
          {#each chain as heroName, i}
            <!-- Arrows -->
            {#if i != 0}
              <p class="arrow">
                {#if heroes[chain[i - 1]].chain[1] == heroes[heroName].chain[0]}
                  &Rarr;
                {:else}&rarr;{/if}
              </p>
            {/if}
            <!-- Hero & chain -->
            <div>
              <h3>{parseName(heroName)}</h3>
              <p class="chain">
                {#if i == 0}
                  {heroes[heroName].chain[0]} / {heroes[heroName].chain[1]}
                {:else if heroes[chain[i - 1]].chain[1] == heroes[heroName].chain[0]}
                  {heroes[heroName].chain[1]}
                {:else}
                  {heroes[heroName].chain[0]} / {heroes[heroName].chain[1]}
                {/if}
              </p>
            </div>
          {/each}
        </section>
        {#if i != chains.length - 1}<br />{/if}
      {/each}
      <!-- TODO: Remove if unable to use <InfiniteLoading on:infinite={infiniteHandler} /> -->
    </div>
  {/if}
</div>
