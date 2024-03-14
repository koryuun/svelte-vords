<script>    
    // @ts-ignore
    import _ from 'lodash'
    
    import { createEventDispatcher, onMount } from 'svelte'
    
    import { TRANSLATION, WORD, loadWords } from './LearnBundle'
    import { rightToLeft } from './stores'
    import { playCorrect, playWrong } from './sound'
    import WordList from "./WordList.svelte"    



    export let deckName

    const VISIBLE_WORDS_COUNT = 5

    const dispatch = createEventDispatcher()

    let wordIDs = new Array(VISIBLE_WORDS_COUNT).fill(null);
    let transIDs = new Array(VISIBLE_WORDS_COUNT).fill(null);

    let wordList
    $: wordList = wordIDs.map( wordID => getWord(wordID))       

    let transList
    $: transList = transIDs.map( transID => getTrans(transID))

    let wordListComponent
    let transListComponent

    let correct = null

    

    // Позиции слова и перевода последней угаданной пары. Для замещения новой парой.
    let lastCorrectPair = {wordIdx:null, transIdx:null}
    
    let learnBundle = null
    
    onMount(start)

    export function swapLeftAndRight() {        
        const distance = getListsDictance()
        wordListComponent.startSwapAnimation(distance)
        transListComponent.startSwapAnimation(distance)
    }

    function getWord(wordID) {
        return wordID === null ? null : { 
            word:learnBundle.getWord(wordID),
            repeat: learnBundle.getRepeatFlag(WORD,wordID)
        }
    }

    function getTrans(wordID) {
        return wordID === null ? null : {
            word:learnBundle.getTranslation(wordID),
            repeat:learnBundle.getRepeatFlag(TRANSLATION,wordID)
        }
    }

    // Возвращает расстояние между списками слов для анимации
    function getListsDictance() {

        return Math.abs(wordListComponent.getOffsetLeft() - transListComponent.getOffsetLeft())
    }    

    function getVisibleWordCount() {
        return wordIDs.reduce( (total, value) =>  total + (value ? 1: 0), 0)
    }

    function getTotalWordCount() {        
        if(learnBundle) {            
            return learnBundle.getWordCount() + wordListComponent.getWordCount()//getVisibleWordCount()
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
            wordListComponent.init()
            transListComponent.init()
            dispatchWordCountChangedEvent()
            dispatch('gameStart')
        })

    }

    export function close() {
        console.log("close")

        for(let i = 0; i < VISIBLE_WORDS_COUNT; ++i) {
            wordIDs[i] = null
            transIDs[i] = null            
        }                
        dispatchWordCountChangedEvent()        
    }


    function hasCorrectPair() {
        return wordIDs.some(wordID => transIDs.some(
                transID => learnBundle.isCorrectPair(wordID, transID)
            )
        )
    }


    function resetSelection() {
        correct = null
        wordListComponent.resetSelection()
        transListComponent.resetSelection()        
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


    function onToggleRepeat(event, itemType) {                        
        if(itemType === WORD) {
            const wordID = wordIDs[event.detail.index]
            learnBundle.toggleRepeatFlag(itemType,wordID)
            //Пинаем чтобы реактивно обновить 
            wordIDs = wordIDs
        } else {
            const transID = transIDs[event.detail.index]
            learnBundle.toggleRepeatFlag(itemType,transID)
            //Пинаем чтобы реактивно обновить 
            transIDs = transIDs
        }
                
    }

    function onSelect() {               
        const wordIdx = wordListComponent.getSelected()
        const transIdx = transListComponent.getSelected()        

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

    function gameOver() {
        learnBundle.saveRepeatFlags()
        learnBundle = null
        dispatch('gameOver')
    }

    function onWordRemoved() {        

        if(correct === true) {              
            dispatchWordCountChangedEvent()
            resetSelection();            
            //Здесь должно быть добавление новой пары взамен удалённой
            if(learnBundle.hasMoreWords())
            {
                addNewPair()
            } else {                    
                if(wordListComponent.isEmpty()) {
                    gameOver()
                }
            }                            
        } else if(wordListComponent.isEmpty()) {
            //Это исполняется если слово убралось не потому что правильное,
            //а потому что нажали "Закрыть"
            gameOver()
        }

    }

    function dispatchWordCountChangedEvent() {
        dispatch('wordCountChanged', {wordCount:getTotalWordCount()})
    }

</script>


<div class="visible-words" class:right-to-left={$rightToLeft}>        
    <WordList                    
        bind:this={wordListComponent} 
        words={wordList}        
        flyDirection={$rightToLeft ? 1: -1}
        {correct}
        on:selection={onSelect}
        on:toggleRepeat={(event) => onToggleRepeat(event, WORD)}
        on:wordAdded={dispatchWordCountChangedEvent}
        on:wordRemoved={onWordRemoved}
        />    
    <WordList
        bind:this={transListComponent} 
        words={transList}
        flyDirection={$rightToLeft ? -1: 1}
        {correct}
        on:selection={onSelect}
        on:toggleRepeat={(event ) => onToggleRepeat(event, TRANSLATION)}
        on:swapAnimationEnd
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