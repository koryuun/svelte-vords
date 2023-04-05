<script>

  import './global.css'
  import VisibleWords from "./lib/VisibleWords.svelte";

  //const apiUrl = 'http://192.168.108.5:3000/words'
  //const apiUrl = 'words/words.csv'

  let child

  let wordsLeft = 0
  let deckName

  // Идёт игра
  let gameOn = false
  
  function onStart() {    
    gameOn = true    
  }

  function onEnd() {
    //content = ''    
    child.end()
  }

  function onVisibleWordCountChanged(event) {
    wordsLeft = event.detail.wordCount
  }
    
</script>

<main>    
  {#if gameOn}
    <div class="info">
      {wordsLeft}
    </div>
  {/if}
  <div class="buttons">
    {#if gameOn}
      <button on:click={onEnd}>Конец</button>      
    {/if}
       
  </div>
  {#if gameOn}
    <VisibleWords 
      deckName={deckName}
      bind:this={child}       
      on:gameOver={()=> gameOn = false}      
      on:wordCountChanged={onVisibleWordCountChanged}/>           
  {:else}
    <div class="deck-selection">
      <select bind:value={deckName} size="4">
        <optgroup label="English">
          <option value='words'>Words</option>
        </optgroup>
        <optgroup label="Suomi">
          <option value='sanat'>Sanat</option>
        </optgroup>
      </select>
      <button on:click={onStart}>Старт</button>  
    </div>
  {/if}
</main>

<style>
  main {
    display: grid;
    grid-template-columns: 1fr auto auto auto 1fr;
    margin: 0 auto;    
    /*width: min-content;*/
    overflow: hidden;    
  }

  .info {
    font-size: 1.3rem;

    grid-column: 2;
    grid-row: 1;    
  }

  .buttons {
    grid-column: -2 / -3;
    grid-row: span 1;
    justify-self: center;    
  }

  .deck-selection {    
    display: flex;
    grid-column: 2 / -2;
    grid-row: 2;    
  }

  button, select{
    font-size: 1.3rem;
  }
  
</style>
