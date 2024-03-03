// Эта фигня сюда вписана потому что VSCode выдаёт непонятные
// ошибки, похожие на ошибки TypeScript, хотя это Javascript
// @ts-nocheck


import _ from 'lodash'

const decksPath = 'decks'

// Максимальное количество слов в одной игре
const WORDS_IN_GAME = 20

function parseCSV(csvStr) {
    return csvStr.split('\n').map(line => {
        return line.split(';').map( field => field.trim())
    })
}

class LearnBundle {
    constructor(allWords, deckPath) {
        this.deckPath = deckPath

        this.repeatWordsSet = this.loadRepeatWords()

        const chosenWords = this.chooseWords(allWords)

        const soundPath = [deckPath, 'sound'].join('/')
        
        this.words = new Map(chosenWords.map(wordInfo => {   
            let soundName = wordInfo.sound
            if(!soundName) {
                // Если нет имени файла для произношения,
                // пытаемся создать его из слова.                
                soundName = wordInfo.word + '.mp3'
            }
            const sound = new Audio([soundPath, soundName].join('/'))            
            const newWordObj = {..._.omit(wordInfo,'id'), sound }                               
            return [wordInfo.id, newWordObj]
        }))
        
        this.wordSet = [...this.words.keys()]
        this.transSet = [...this.words.keys()]

        this.getWord = this.getWord.bind(this)
        this.getTranslation = this.getTranslation.bind(this)
        this.getRepeatFlag = this.getRepeatFlag.bind(this)
        this.toggleRepeatFlag = this.toggleRepeatFlag.bind(this)
        this.saveRepeatFlags = this.saveRepeatFlags.bind(this)
    }

    chooseWords(allWords) {
        const repeatWords = []
        const noRepeatWords = []

        allWords.forEach(element => {
            if( this.repeatWordsSet.has(element.word) ) {
                repeatWords.push(element)
            } else {
                noRepeatWords.push(element)
            }
        });


        if(repeatWords.length  < this.repeatWordsSet.size) {
            console.log("Cleaning needed!")
            //!!!
            // Тут неплохо бы добавить чистку списка слов для повторения
            // чтобы не замусоривался отстутвующими словами
            // Для этого выкинуть из repeatWordsSet всё, чего нет в repeatWords
            // Потому что если всё правильно, то слова в них должны совпадать.            
            
        }

        let chosen = _.sampleSize(repeatWords, WORDS_IN_GAME)
        const wordsLeftCount = WORDS_IN_GAME - chosen.length
        if(wordsLeftCount > 0) {
            const sample = _.sampleSize(noRepeatWords, wordsLeftCount)            
            chosen = chosen.concat(sample)  
        }
        return chosen
    }

    getStorageKey() {
        return "wordpairs/" + this.deckPath + "/repeatWords"
    }

    loadRepeatWords() {
        const storedStr = localStorage.getItem(this.getStorageKey())
        if(!storedStr) {
            return new Set()
        }
        
        let repeatWords

        try {
            const arr = JSON.parse(storedStr)
            repeatWords = new Set(arr)
        } catch(e) {
            console.log(e.message)
            repeatWords = new Set()
        }
        return repeatWords
    }
    
    saveRepeatFlags() {
        console.log("saveRepeatFlags")
        const repeatWords = Array.from(this.repeatWordsSet)
        const repeatWordsStr = JSON.stringify(repeatWords)        
        localStorage.setItem(this.getStorageKey(), repeatWordsStr)        
        console.log(repeatWords)
    }

    removePair(wordID, transID) {
        _.pull(this.wordSet, wordID)
        _.pull(this.transSet, transID)
    }

    takeCorrectPair() {
        const allCorrectIDs = _.intersection(this.wordSet, this.transSet)
        const id = _.sample(allCorrectIDs)
        this.removePair(id, id)
        return id
    }

    takeAnyPair() {
        const wordID = _.sample(this.wordSet)
        const transID = _.sample(this.transSet)
        this.removePair(wordID, transID)
        return {wordID, transID}
    }    

    /**
     * Забирает ID перевода к любому из указанных ID слов и к нему
     * любой ID слова. То есть забирается заведомо неправильная пара
     * с известным ID перевода
     * @param {number[]} wordIDs
     */
     takeCorrectTransAndAnyWord(wordIDs) {        
        const transID = _.sample(_.intersection(wordIDs, this.transSet))            
        const wordID = _.sample(this.wordSet)
        this.removePair(wordID, transID)
        return {wordID, transID}
     }

    hasMoreWords() {
        return this.wordSet.length > 0
    }

    getWordCount() {
        return this.wordSet.length
    }
    
    getWord(id) {
        return this.words.get(id).word        
    }

    getTranslation(id) {
        return this.words.get(id).trans        
    }

    getRepeatFlag(id) {
        const word = this.words.get(id).word        
        return this.repeatWordsSet.has(word)
    }

    toggleRepeatFlag(id) {
        const word = this.words.get(id).word
        const repeat = this.repeatWordsSet.has(word)
        if(repeat) {
            this.repeatWordsSet.delete(word)
        } else {
            this.repeatWordsSet.add(word)
        }        
    }

    /**
    * Проверяет корректность пары.    
    * @param {number} wordID
    * @param {number} transID
    */
    isCorrectPair(wordID, transID) {        
        return wordID !== null && wordID === transID
    }

    // Пытается воспроизвести произношение.
    // Возвращает, получилось возпроизвести или нет
    pronounce(id) {
        const HAVE_ENOUGH_DATA = 4

        const sound = this.words.get(id).sound

        const soundReady = sound.readyState === HAVE_ENOUGH_DATA

        if(soundReady) {
            sound.play()
        }
        return soundReady
    }
}

export async function loadWords(deckName) {
    const deckPath = [decksPath, deckName].join('/')
    const csvPah = [deckPath, 'deck.csv'].join('/')    
    return fetch(csvPah)        
        .then(res => res.text())
        .then(x => {
            const allWords = parseCSV(x).map( (wordPair, idx) => {
                return {
                    'id': idx,
                    'word':wordPair[0], 
                    'trans':wordPair[1], 
                    'sound': wordPair[2]}
            })                        
            return new LearnBundle(allWords, deckPath)
        })        
}

  
