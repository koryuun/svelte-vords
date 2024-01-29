<script>
    import { createEventDispatcher} from 'svelte'
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
        font-size: calc(var(--base) * 0.035 );  
        padding: 0px;
    }

    .info {
        font-size: calc(var(--base) * 0.04 );  
        color: black;
    }
</style>