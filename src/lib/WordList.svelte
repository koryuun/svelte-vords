<script>    
    import { createEventDispatcher } from 'svelte';
    import WordView from "./WordView.svelte"

    export let wordIDs    
    export let flyDirection      
    export let getWord
    export let correct = null    
    
    const dispatch = createEventDispatcher()

    let selected = null

    export function getSelected() {
        return selected
    }

    export function resetSelection() {
        selected = null
    }

    export function init() {
        resetSelection()
    }
    
    function changeSelection(index) {
        if(selected === null) {
            selected = index
        } else if(selected === index) {
            selected = null
        } else {
            selected = index
        }
    }

    function wordClick(event) {    
        if(correct !== null) {
            return
        }
        changeSelection(event.detail.index)
        dispatch('selection')
    }
    
    

</script>


<div>
    {#each wordIDs as wordID, index}
      <WordView 
        word={getWord(wordID)} {index} 
        state={{selected:selected === index, correct}} 
        {flyDirection} 
        flyDelay={index * 150}
        on:wordClick={wordClick}
        on:wordRemoved
        />      
    {/each}
</div>


<style>
    /*
    div {        		
        border-style: solid;
        border-width: 3px;        
    }*/
</style>