import _ from 'lodash'

const decksPath = 'decks'

let words 



function parseCSV(csvStr) {
    return csvStr.split('\n').map(line => {
        return line.split(';').map( field => field.trim())
    })
}

class LearnBundle {
    constructor(words, deckPath) {
        
        this.words = new Map(words.map(wordInfo => {           
            const sound = new Audio()            
            //new Audio(wordInfo[1].sound)
            return [wordInfo[0], {...wordInfo[1], sound }]
        }))
        
        this.wordSet = [...this.words.keys()]
        this.transSet = [...this.words.keys()]

        this.getWord = this.getWord.bind(this)
        this.getTranslation = this.getTranslation.bind(this)
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

    /**
    * Проверяет корректность пары.    
    * @param {number} wordID
    * @param {number} transID
    */
    isCorrectPair(wordID, transID) {        
        return wordID !== null && wordID === transID
    }

    pronounce(id) {
        this.words.get(id).sound.play()
    }
}

export async function loadWords(deckName) {
    const deckPath = [decksPath, deckName].join('/')
    const csvPah = [deckPath, 'deck.csv'].join('/')    
    return fetch(csvPah)        
        .then(res => res.text())
        .then(x => {
            const allWords = parseCSV(x).map( (wordPair, idx) => {
                return [idx, {'word':wordPair[0], 'trans':wordPair[1], 'sound': wordPair[2]}]
            })            
            words =_.sampleSize(allWords, 20)
            return new LearnBundle(words, deckPath)
        })        
}

  
