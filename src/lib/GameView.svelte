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
            /* Отношение высоты к ширине */         
            --hwratio: 0.6;
            /* Ширина, которая вычислена из ширины окна */
            --width-from-width: calc(min(95vw , 800px));
            /* Ширина, которая вычислена из высоты окна */
            --width-from-height: calc(95vh / var(--hwratio));
            /* Окончательная ширина, 
            которая рассчитывается так чтобы всё всегда влезало */
            --base: calc(min(var(--width-from-width),
                            var(--width-from-height)));
            width: var(--base);
            height: calc(var(--base) * var(--hwratio) );
            display: flex;
            flex-direction: column;
    }
    
</style>