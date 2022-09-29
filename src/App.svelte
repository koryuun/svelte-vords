<script>

  import VisibleWords from "./lib/VisibleWords.svelte";

  //const apiUrl = 'http://192.168.108.5:3000/words'
  //const apiUrl = 'words/words.csv'

  let child

  let wordsLeft = 0
  
  function onStart() {    
    child.start()
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
  <div class="info">
    {wordsLeft}
  </div>
  <div class="buttons">
    <button on:click={onStart}>Старт</button>  
    <button on:click={onEnd}>Конец</button>    
  </div>
  <VisibleWords bind:this={child} on:wordCountChanged={onVisibleWordCountChanged}/>   
  <div class="content">
    <hr/>
  </div>   
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

    grid-column: 2 / 2;
    grid-row: span 1;    
  }

  .buttons {
    grid-column: -2 / -3;
    grid-row: span 1;
    justify-self: center;    
  }

  button {
    font-size: 1.3rem;
  }

  .content {
    grid-column: 1 / -1;
    grid-row: 3 / 4;
  }
</style>
