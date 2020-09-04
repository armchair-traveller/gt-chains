<script>
  import heroes from "../utils/heroes";
  import getChains from "../utils/get-chains";

  let value = "";

  var heroNames = Object.keys(heroes);
  var allChains = getChains(heroes);
  $: chains = allChains.filter((chain) => {
    return chain.find((el) => el == "hekate");
  });
</script>

<style>
  h1,
  p {
    text-align: center;
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  p {
    margin: 1em auto;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }

  section {
    display: flex;
  }

  .container {
    background-color: #dce3e9;
    width: 100%;
    display: flex;
    flex-flow: column;
    align-items: center;
  }

  input {
    margin-top: 2.5em;
    border: none;
    padding: 0.5em 1em;
    border-radius: 1em;
  }
  .outline {
    outline: none;
    transition: all 0.15s ease-out;
  }
  .outline:focus {
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.6);
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
  {#each heroNames.filter((v) => v.includes(value)) as hero}
    <p>{hero[0].toUpperCase() + hero.slice(1)}</p>
  {/each}

  {#each chains as chain}
    <section>
      {#each chain as heroName}
        <div>
          <p>{heroName}</p>
          <p>{heroes[heroName].chain[0]} -> {heroes[heroName].chain[1]}</p>
        </div>
      {/each}
    </section>
  {/each}
</div>
