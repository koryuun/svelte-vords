<script>

  import './global.css'
  import GameView from './lib/GameView.svelte'
  import DeckSelection from './lib/DeckSelection.svelte'

  //const apiUrl = 'http://192.168.108.5:3000/words'
  //const apiUrl = 'words/words.csv'

  const version = "0.2.9"

  let deckName

  // Идёт игра
  let gameOn = false

  function onDeckSelected (event) {
    deckName = event.detail.deckName
    gameOn = true
  }
  
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

    <DeckSelection className="deck-selection-pos" 
      on:deckSelected={ onDeckSelected } />
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

  :global(.deck-selection-pos) {    
    grid-column: 2 / -2;
    grid-row: 2;    
  }
  
</style>
