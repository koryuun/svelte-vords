<script>

  import VisibleWords from "./lib/VisibleWords.svelte";

  //const apiUrl = 'http://192.168.108.5:3000/words'
  const apiUrl = 'words/words.csv'

  let content = 'Какой-то текст снизу'

  let child


  
  function onStart() {    
    child.start()
  }

  function onEnd() {
    //content = ''
    child.end()
  }
    
</script>

<main>    
  <div class="buttons">
    <button on:click={onStart}>Старт</button>  
    <button on:click={onEnd}>Конец</button>    
  </div>
  <VisibleWords bind:this={child} />   
  <div class="content">
    {content}
  </div>   
</main>

<style>
  main {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    margin: 0 auto;
    /*width: min-content;*/
  }

  .buttons {
    grid-column: 2 / 3;
    grid-row: span 1;
    justify-self: center;
  }

  .content {
    grid-column: 1 / 4;
    grid-row: 3 / 4;
  }
</style>
