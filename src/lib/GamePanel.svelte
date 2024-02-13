<script>
    import { createEventDispatcher} from 'svelte'

    import { rightToLeft } from './stores'

    export let wordsLeft
    let wordsTotal = "?"
    
    const dispatch = createEventDispatcher()
    
</script>


<div class=game-panel>        
    <div class="info">
        {#if wordsLeft}
            {wordsLeft}
        {/if}        
    </div>
        
    <button on:click={ ()=> dispatch("swapLeftRight") }>
        {$rightToLeft ? "←": "→"}
    </button>
    <button on:click={() =>dispatch('close')}>❌</button>
</div>

<style>    
    .game-panel {
        display: flex;
        justify-content: space-between;
        /*background-color: blue;*/
        height: 10%;
    }

    button {
        --size:calc(var(--base)* 0.06);
        text-align: center;
        font-size: calc(var(--size) * 0.5 );         
        border-radius: 50%;
        border-width: calc(var(--size) * 0.05 );        
        padding: 0%;        
        height: var(--size);
        width: var(--size);        
    }

    .info {
        font-size: calc(var(--base) * 0.04 );  
        color: black;
    }
</style>