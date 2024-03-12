<script>
    import GamePanel from "./GamePanel.svelte";
    import VisibleWords from "./VisibleWords.svelte"
    import { rightToLeft } from './stores'

    export let className = ""
    export let deckName

    let child
    let panel
    let wordsLeft

    let swapInProgress = false
    
    function onVisibleWordCountChanged(event) {
        wordsLeft = event.detail.wordCount
    }

    function onSwapLeftAndRight() {        
        if(swapInProgress) {
            return
        }
        swapInProgress = true
        child.swapLeftAndRight()
        panel.aninimateSwap()
    }

    function onSwapAnimationEnd() {
        rightToLeft.toggle()
        swapInProgress = false
    }


</script>

<div class="game-view {className}">    
    <GamePanel 
        bind:this={panel}
        on:close={()=>child.close()}          
        on:swapLeftRight={onSwapLeftAndRight}
        {wordsLeft} />
    <VisibleWords 
      deckName={deckName}
      bind:this={child}       
      on:gameOver
      on:wordCountChanged={onVisibleWordCountChanged}
      on:swapAnimationEnd={onSwapAnimationEnd}/>    
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