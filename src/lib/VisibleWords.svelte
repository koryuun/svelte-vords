<script>    
    import _ from 'lodash'
    
    import { loadWords } from './LearnBundle'
    import WordList from "./WordList.svelte"    

    const VISIBLE_WORDS_COUNT = 5

    let wordIDs = new Array(VISIBLE_WORDS_COUNT).fill(null);
    let transIDs = new Array(VISIBLE_WORDS_COUNT).fill(null);

    let correct = null

    let wordList
    let transList

    let lastCorrectPair = {wordIdx:null, transIdx:null}


    // Увеличивается на 1 в момент, когда анимация удаления правильного слова или перевода
    // окончилась. 
    // Нужно для определения момента, когда удаление правильной пары полностьо окончено.    
    let correctPairRemoveCounter = 0


    let learnBundle = null
    

    function getWord(wordID) {
        return wordID === null ? null : learnBundle.getWord(wordID)        
    }

    function getTrans(wordID) {
        return wordID === null ? null : learnBundle.getTranslation(wordID)
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

    export function start() {        
        
        loadWords().then(result => {
            learnBundle = result   
            lastCorrectPair.wordIdx = null
            lastCorrectPair.transIdx = null
            fillWords()            
            wordList.init()
            transList.init()
        })

    }

    export function end() {
        console.log("End")

        for(let i = 0; i < VISIBLE_WORDS_COUNT; ++i) {
            wordIDs[i] = null
            transIDs[i] = null
            
        }
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

    function onChangeSelection() {        
        const wordIdx = wordList.getSelected()
        const transIdx = transList.getSelected()
        if(wordIdx === null || transIdx === null) {
            correct = null
            return
        }
        correct = learnBundle.isCorrectPair(wordIDs[wordIdx], transIDs[transIdx])
        setTimeout(() => onEndShowResult(wordIdx, transIdx), 1000)
    }

    function onWordRemoved() {
        if(correct === true) {        
            correctPairRemoveCounter++
            if(correctPairRemoveCounter == 2) {
                resetSelection();
                correctPairRemoveCounter = 0
                //Здесь должно быть добавление новой пары взамен удалённой
                if(learnBundle.hasMoreWords())
                {
                    addNewPair()
                } else {
                    console.log("Больше нет слов")
                }


                
            }
        }
    }

</script>


<div class="visible-words">    
    <WordList 
        bind:this={wordList} wordIDs={wordIDs} getWord={getWord}  flyDirection={-1}
        {correct}
        on:selection={onChangeSelection}
        on:wordRemoved={onWordRemoved}
        />    
    <WordList
        bind:this={transList} wordIDs={transIDs} getWord={getTrans} flyDirection={1}
        {correct}
        on:selection={onChangeSelection}
        on:wordRemoved={onWordRemoved}
        />        
</div>

<style>
    .visible-words {
        display: flex;      
        width: min-content;
        grid-column: 2 / 3;        
    }
</style>