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

  let selectReady = [true, true, true, true]; // transition readiness

  var selHeroes;
  $: {
    selHeroes = selectedHeroes.filter((v) => v != ""); // filter out empty strings from selected heroes

    // reactive processing, filter and sort chains according to selected heroes
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
      })
      .sort((a, b) => {
        let matches = 0;
        for (let i = 0; i < a.length; i++) {
          if (a[i] == selectedHeroes[i]) {
            matches--;
          }
          if (b[i] == selectedHeroes[i]) {
            matches++;
          }
        }
        return matches;
      });
  }

  $: infLoaderList = [...chains]; // duplicate chains to mutate w/ infiniteList
  var infiniteList = [];
  $: if (chains.length == infLoaderList.length) {
    infiniteList = infLoaderList.splice(0, 17); // populate w/ init data
  }

  function infiniteHandler({ detail: { loaded, complete } }) {
    if (infLoaderList.length) {
      infiniteList = [...infiniteList, ...infLoaderList.splice(0, 10)];
      loaded();
    } else {
      complete();
    }
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
  p,
  h3 {
    text-align: center;
    margin: 0 auto;
    color: var(--primary-color);
  }

  p {
    /* override cascade */
    color: var(--secondary-color);
    margin: 1em auto;
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

  h3 {
    font-weight: 500;
  }

  hr {
    width: 7em;
    margin-bottom: 1.5em;
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
    flex-flow: row wrap;
    justify-content: center;
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
  .selected-hero-btn:hover,
  .selected-hero-btn:focus {
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
            on:outrostart={() => (selectReady[i] = false)}
            on:outroend={() => (selectReady[i] = true)}>
            {parseName(hero)}
          </h3>
        {:else if selectReady[i] == true}
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

  {#if selHeroes.length > 0}
    {#if !infiniteList.length}
      <p transition:fade>No chains found 🥴</p>
    {/if}

    <div>
      {#each infiniteList as chain, i}
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
        {#if i != infiniteList.length - 1}
          <hr />
        {/if}
      {/each}

      <InfiniteLoading on:infinite={infiniteHandler}>
        <div transition:fade slot="noMore" style="margin-bottom:1.5em;">
          You've reached the end of the chains ⛄&rarr;💧
        </div>
      </InfiniteLoading>
    </div>
  {/if}
</div>
