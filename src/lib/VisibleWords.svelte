<script>    
    // @ts-ignore
    import _ from 'lodash'
    
    import { createEventDispatcher, onMount } from 'svelte'
    
    import { loadWords } from './LearnBundle'
    import { rightToLeft } from './stores'
    import { playCorrect, playWrong } from './sound'
    import WordList from "./WordList.svelte"    



    export let deckName

    const VISIBLE_WORDS_COUNT = 5

    const dispatch = createEventDispatcher()

    let wordIDs = new Array(VISIBLE_WORDS_COUNT).fill(null);
    let transIDs = new Array(VISIBLE_WORDS_COUNT).fill(null);

    let correct = null

    let wordList
    let transList

    let lastCorrectPair = {wordIdx:null, transIdx:null}
    
    let learnBundle = null

    onMount(start)
    

    function getWord(wordID) {
        return wordID === null ? null : learnBundle.getWord(wordID)        
    }

    function getTrans(wordID) {
        return wordID === null ? null : learnBundle.getTranslation(wordID)
    }

    function getVisibleWordCount() {
        return wordIDs.reduce( (total, value) =>  total + (value ? 1: 0), 0)
    }

    function getTotalWordCount() {        
        if(learnBundle) {            
            return learnBundle.getWordCount() + wordList.getWordCount()//getVisibleWordCount()
        } else {
            return 0
        }
    }


    function fillWords() {        
        let initialWords = []
        let initialTrans = []

        const firstPairID = learnBundle.takeCorrectPair()
        initialWords.push(firstPairID)
        initialTrans.push(firstPairID)        

        for(let i = 1; learnBundle.hasMoreWords() && i < VISIBLE_WORDS_COUNT; i++) {
            const {wordID, transID} = learnBundle.takeAnyPair()
            initialWords.push(wordID)
            initialTrans.push(transID)        
        }

        wordIDs = _.shuffle(initialWords)
        transIDs = _.shuffle(initialTrans)        
    }

    function start() {   
        //wordIDs = new Array(VISIBLE_WORDS_COUNT).fill(null);
        //transIDs = new Array(VISIBLE_WORDS_COUNT).fill(null);   

        loadWords(deckName).then(result => {
            learnBundle = result   
            lastCorrectPair.wordIdx = null
            lastCorrectPair.transIdx = null
            fillWords()            
            wordList.init()
            transList.init()
            dispatchWordCountChangedEvent()
            dispatch('gameStart')
        })

    }

    export function end() {
        console.log("End")

        for(let i = 0; i < VISIBLE_WORDS_COUNT; ++i) {
            wordIDs[i] = null
            transIDs[i] = null
            
        }        
        learnBundle = null

        dispatchWordCountChangedEvent()
        //dispatch('gameOver')
    }

    function hasCorrectPair() {
        return wordIDs.some(wordID => transIDs.some(
                transID => learnBundle.isCorrectPair(wordID, transID)
            )
        )
    }


    function resetSelection() {
        correct = null
        wordList.resetSelection()
        transList.resetSelection()        
    }

    function addNewPair() {     
        let newPair   
        if(hasCorrectPair()){
            newPair = learnBundle.takeAnyPair()
        } else {
            newPair = learnBundle.takeCorrectTransAndAnyWord(wordIDs)
        }        
        const {wordIdx, transIdx} = lastCorrectPair
        const {wordID, transID} = newPair

        wordIDs[wordIdx] = wordID
        transIDs[transIdx] = transID
    }
    
    function onEndShowResult(wordIdx, transIdx) {
        if(correct) {
            lastCorrectPair = {wordIdx, transIdx}
            // Remove the correct pair
            wordIDs[wordIdx] = null
            transIDs[transIdx] = null                     
        } else {
            resetSelection()
        }                
    }

    function onSelect() {       
        console.log('onSelect') 
        const wordIdx = wordList.getSelected()
        const transIdx = transList.getSelected()        

        if(wordIdx !== null && transIdx === null) {
            learnBundle.pronounce(wordIDs[wordIdx])
        }


        if(wordIdx === null || transIdx === null) {
            correct = null
            return
        }
        correct = learnBundle.isCorrectPair(wordIDs[wordIdx], transIDs[transIdx])
        if(correct) {
            if(!learnBundle.pronounce(wordIDs[wordIdx])) {
                playCorrect()
            }
        } else {
            playWrong()
        }

        setTimeout(() => onEndShowResult(wordIdx, transIdx), 500)
    }

    function onWordRemoved() {        

        if(correct === true) {  
            console.log('correct=', correct)                              
            dispatchWordCountChangedEvent()
            resetSelection();            
            //Здесь должно быть добавление новой пары взамен удалённой
            if(learnBundle.hasMoreWords())
            {
                addNewPair()
            } else {                    
                if(wordList.isEmpty()) {
                    dispatch('gameOver')
                }
            }                            
        } else if(wordList.isEmpty()) {
            dispatch('gameOver')
        }

    }

    function dispatchWordCountChangedEvent() {
        dispatch('wordCountChanged', {wordCount:getTotalWordCount()})
    }

</script>


<div class="visible-words" class:right-to-left={$rightToLeft}>        
    <WordList             
        bind:this={wordList} wordIDs={wordIDs} getWord={getWord}
        flyDirection={$rightToLeft ? 1: -1}
        {correct}
        on:selection={onSelect}
        on:wordAdded={dispatchWordCountChangedEvent}
        on:wordRemoved={onWordRemoved}
        />    
    <WordList
        bind:this={transList} wordIDs={transIDs} getWord={getTrans}
        flyDirection={$rightToLeft ? -1: 1}
        {correct}
        on:selection={onSelect}        
        />         
</div>

<style>
    .visible-words {
        display: flex;           

        /*background-color: black;*/
        height: 90%;        
    }

    .right-to-left {
        flex-direction: row-reverse;
    }
    
</style>