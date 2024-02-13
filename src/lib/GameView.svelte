<script>
    import GamePanel from "./GamePanel.svelte";
    import VisibleWords from "./VisibleWords.svelte"

    export let className = ""
    export let deckName

    let child
    let wordsLeft
    
    function onVisibleWordCountChanged(event) {
        wordsLeft = event.detail.wordCount
    }

</script>

<div class="game-view {className}">    
    <GamePanel 
        on:close={()=>child.end()}          
        on:swapLeftRight={() => child.swapLeftAndRight()  }
        {wordsLeft} />
    <VisibleWords 
      deckName={deckName}
      bind:this={child}       
      on:gameOver
      on:wordCountChanged={onVisibleWordCountChanged}/>    
</div>


<style>
    .game-view {            
            /*background: yellow;*/
            --base: 700px; 
            width: var(--base);
            height: calc(var(--base) * 0.6 );
            display: flex;
            flex-direction: column;
    }

    @media screen and (max-width: 736px) {
        .game-view {            
            /*background: red;*/
            --base: 95vw;             
        }
    }
</style>