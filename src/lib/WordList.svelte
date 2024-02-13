<script>    
    import { createEventDispatcher } from 'svelte';
    import WordView from "./WordView.svelte"

    export let wordIDs    
    export let flyDirection      
    export let getWord
    export let correct = null    
    
    const dispatch = createEventDispatcher()

    // При первом заполнении слов используется дополнительная задержка
    // transition, которая увеличивается с каждым словом.
    // При замене угаданного слова задержка 0
    let flyDelay

    let wordCount = 0  

    let selected = null

    // Временно для опытов
    let listDiv

    export function getOffsetLeft() {
        return listDiv.offsetLeft
    }

    export function getSelected() {
        return selected
    }

    export function resetSelection() {
        selected = null
    }

    export function init() {        
        resetSelection()
        flyDelay = 150
    }

    export function isEmpty() {
        return wordCount === 0
    }

    export function getWordCount() {
        return wordCount
    }

    export function startSwapAnimation(distance)
    {
        distance = -(distance * flyDirection)

        const animation = [
            {transform: "translateX(0)"},
            {transform: `translateX(${distance}px)`}
        ]

        const timing = {duration: 1000, iterations: 1}

        const animate = listDiv.animate(animation, timing)
        animate.onfinish = ()=> dispatch("swapAnimationEnd")
    }
    
    function changeSelection(index) {
        flyDelay = 0

        //!!! Из этого двойного условия можно убрать повтор?
        if(selected === null) {
            selected = index
            dispatch('selection')
        } else if(selected === index) {
            selected = null
        } else {
            selected = index
            dispatch('selection')
        }
    }    

    function wordClick(event) {    
        if(correct !== null) {
            return
        }
        changeSelection(event.detail.index)
        //dispatch('selection')        
    }
    

    function onWordAdded() {
        wordCount++
        dispatch('wordAdded')
    }

    function onWordRemoved() {
        wordCount--
        dispatch('wordRemoved')
    }

</script>


<div class="word-list" bind:this={listDiv}>
    {#each wordIDs as wordID, index}
      <WordView 
        word={getWord(wordID)} {index} 
        state={{selected:selected === index, correct}} 
        {flyDirection} 
        flyDelay={index * flyDelay}
        on:wordClick={wordClick}
        on:wordAdded={onWordAdded}
        on:wordRemoved={onWordRemoved}
        />      
    {/each}
</div>


<style>    
    .word-list {        		
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        padding: 0.5%;
        /*border-style: solid;
        border-width: 3px;     */        
        width: 100%;   
    }
</style>