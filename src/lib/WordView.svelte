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
    
    function onIntroStart() {
        dispatch('wordAdded')
    }

    function onOutroEnd() {        
        dispatch('wordRemoved')                
    }

    function onMouseDown(event) {  
        if(event.button == 0) {
            dispatch('wordClick', {index})
        }
    }    

    function onToggleRepeat() {          
        dispatch('toggleRepeat', {index})        
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
            on:introstart={onIntroStart}            
            on:outroend={onOutroEnd}
            >     
            
                <div></div>
                <div>{word.word}</div>                                     

                {#if word.repeat === null}
                    <div></div>
                {:else}
                    <div 
                        class="repeat-button"
                        class:repeat-selected={word.repeat}
                        on:mousedown|stopPropagation={onToggleRepeat}>                                     
                        ⥁
                    </div>                
                {/if}

                
            
            
            
        </div>            
    {/if}
</div>



<style>            
    .word-button {                
        height: 90%;
        display: flex;
        font-size: calc(var(--base) * 0.035 );
        text-align: center;   
        gap: 10%;     
        justify-content: space-between;
        align-items: center;
        
        margin: 0;
        border-style: outset;        
        border-width: 0.15em;
        border-radius: 3.0em;

        overflow: hidden;                       
        flex-grow: 1;
        
        cursor: default;

      
        background-color: #E6E6E6; 
        border-color: #D9D9D9;
        color: #000000;
    }

    .selected {        
        border-style: inset;
        /*
        background-color: #DEDEFF; 
        border-color: #4848B4;
        color: #4848B4;
        */
        background-color: #B3D1FF; 
        border-color: #3366CC;
        color: #FFFFFF;
    }

    .correct {        
        /*
        background-color: #DEFFDE;         
        border-color: #00A000;
        color: #00A000;
        */
        background-color: #B3FFB3;         
        border-color: #99FF99;
        color: #FFFFFF;
    }

    .incorrect {       
        /* 
        background-color: #FFDEDE;         
        border-color: #B44848;
        color: #B44848;
        */
        background-color: #FFB3B3;         
        border-color: #FF9999;
        color: #FFFFFF;
    }
    
    .container {      
        margin: 0.5%;
        height: 100%;
        width: 100%;
        /*display: flex;*/
    }

    .word-button > div {
        min-width: 10%;
        margin: 0;        
    }

    .repeat-button {        
        margin: 2%;        
        color: #A0A0A0;
    }
    
    .repeat-selected {
        color: inherit;
    }
    

</style>