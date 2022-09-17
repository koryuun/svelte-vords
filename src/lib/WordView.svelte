<script>
    import { fly, fade } from 'svelte/transition'
    import { createEventDispatcher } from 'svelte';

    export let word
    export let state
    export let flyDelay
    export let flyDirection
    export let index    

    const dispatch = createEventDispatcher()

    let selected, correct, incorrect

    $: {
        selected = state.selected
        correct = state.selected && state.correct === true
        incorrect = state.selected && state.correct === false
    }
            
    
</script>



<div  class="container">       
    {#if word !== null}
        <div class="word-button" 
            class:selected class:correct class:incorrect
            on:click={()=> dispatch('wordClick', {index})}
            in:fly={
                { duration:500, x:200 * flyDirection, delay:flyDelay}
            }
            out:fade={{ duration:500}}
            on:outroend={()=> dispatch('wordRemoved')}
            >            
            {word}
        </div>            
    {/if}
</div>



<style>    
    .word-button {        
        display: flex;
        text-align: center;        
        justify-content: center;
        align-items: center;
        
        margin: 0rem;
        border-style: outset;        
        border-width: 0.2rem;
        border-radius: 1.5rem;             
        overflow: hidden;                       
        flex-grow: 1;        
    }

    .selected {
        border-style: inset;
        background-color: #DEDEFF; 
        border-color: #4848B4;
        color: #4848B4;
    }

    .correct {        
        background-color: #DEFFDE;         
        border-color: #00A000;
        color: #00A000;
    }

    .incorrect {        
        background-color: #FFDEDE;         
        border-color: #B44848;
        color: #B44848;
    }
    
    .container {      
        margin: 0.2rem;  
        height: 3rem;
        width: 15rem;
        display: flex;                
    }

    

</style>