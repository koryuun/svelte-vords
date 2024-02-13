<script>
import { createEventDispatcher } from 'svelte'

import { rightToLeft } from './stores'

export let className = ""



const dispatch = createEventDispatcher()

//Возвращает функцию для обработки выбора дека
function clickHandler(deckName) {
    return () => {
        dispatch("deckSelected", {deckName})
    }
}


</script>




<div class="deck-selection {className}">
    <button on:click={clickHandler("words")} >Words</button>
    <button on:click={clickHandler("sanat")} >Sanat</button>
    <button on:click={clickHandler("verbit")} >Verbit</button>
    <button on:click={ () => rightToLeft.toggle()} >
        {$rightToLeft ? "←": "→"}
    </button>
</div>

<style>

.deck-selection {
    display: flex;
    flex-direction: column;
}

button {
    font-size: 30px;
}

</style>