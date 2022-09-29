<script>
    import { fly, fade } from 'svelte/transition'
    import { createEventDispatcher } from 'svelte'

    export let word
    export let state
    export let flyDelay
    export let flyDirection
    export let index    

    const dispatch = createEventDispatcher()

    let selected, correct, incorrect

    function onMouseDown(event) {  
        if(event.button == 0) {
            dispatch('wordClick', {index})
        }
    }

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
            on:mousedown={onMouseDown}
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
        font-size: 1.5rem;
        text-align: center;        
        justify-content: center;
        align-items: center;
        
        margin: 0rem;
        border-style: outset;        
        border-width: 0.2rem;
        border-radius: 2.0rem;             
        overflow: hidden;                       
        flex-grow: 1;
        
        cursor: default;
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
        margin: 0.3rem;  
        height: 4rem;
        width: 20rem;
        display: flex;                
    }

    

</style>