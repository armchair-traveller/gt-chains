<script>
  import heroes from "../utils/heroes";
  import getChains from "../utils/get-chains";
  import { fade } from "svelte/transition";

  let value = "";

  let isVisible = true;

  var heroNames = Object.keys(heroes);
  var allChains = getChains(heroes);
  $: chains = allChains.filter((chain) => {
    return chain.find((el) => el);
  });
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

  input {
    border: none;
    padding: 0.5em 1em;
    border-radius: 1em;
    margin: 1.5em auto;
  }
  .outline {
    outline: none;
    transition: all 0.15s ease-out;
  }
  .outline:focus {
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.6);
  }

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
</style>

<svelte:head>
  <title>Thunder Thighs Vish</title>
  <link
    rel="icon"
    href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='12 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>" />
</svelte:head>

<div class="container">
  <div class="input-container">
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
  </div>
  <!-- TODO: Make this into a search dropdown -->
  {#if false}
    {#each heroNames.filter((v) => v.includes(value)) as hero}
      <p>{hero[0].toUpperCase() + hero.slice(1)}</p>
    {/each}
  {/if}

  <button on:click={() => (isVisible = !isVisible)}>Click me</button>

  {#if isVisible}
    {#each chains as chain, i}
      <section transition:fade>
        {#each chain as heroName, i}
          <!-- Arrow logic -->
          {#if i != 0}
            <p class="arrow">
              {#if heroes[chain[i - 1]].chain[1] == heroes[heroName].chain[0]}
                &Rarr;
              {:else}&rarr;{/if}
            </p>
          {/if}
          <!-- Hero & chain -->
          <div>
            <h3>{heroName}</h3>
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
  {/if}
</div>
