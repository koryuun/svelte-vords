<script>

  import './global.css'
  import GameView from './lib/GameView.svelte';

  //const apiUrl = 'http://192.168.108.5:3000/words'
  //const apiUrl = 'words/words.csv'

  const version = "0.1.2"

  let deckName

  // Идёт игра
  let gameOn = false
  
</script>

<main>    
  
  {#if gameOn}  
    <GameView 
      className="game-view-pos"
      deckName={deckName}
      on:gameOver={()=> gameOn = false}
      />
  {:else}
    <div class="version">
      v: {version} | vpw: {window.innerWidth} | dpr: {window.devicePixelRatio}
    </div> 
    <div class="deck-selection">
      <select bind:value={deckName} size="5">
        <optgroup label="English">
          <option value='words'>Words</option>
        </optgroup>
        <optgroup label="Suomi">
          <option value='sanat'>Sanat</option>
          <option value='verbit'>Verbit</option>
        </optgroup>
      </select>
      <button on:click={() => gameOn = true}>▶</button>  
    </div>
  {/if}
  
</main>

<style>
  :global(.game-view-pos) {    
    grid-column: 2 / -2;
    grid-row: 2;
  }

  main {
    display: grid;
    grid-template-columns: 1fr auto auto auto 1fr;
    margin: 0 auto;    
    /*width: min-content;*/
    overflow: hidden;
  }

  .version {
    /*font-size: 1.3rem;*/
    grid-column: 1;
    grid-row: 1;    
  }

  .deck-selection {    
    display: flex;
    grid-column: 2 / -2;
    grid-row: 2;    
  }

  select{
    font-size: 1.3rem;
  }
  
</style>
