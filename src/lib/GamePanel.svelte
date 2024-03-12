<script>
    import { createEventDispatcher} from 'svelte'

    import { rightToLeft } from './stores'

    export let wordsLeft

    const dispatch = createEventDispatcher()
    
</script>


<div class=game-panel>        
    <div class="info">
        {#if wordsLeft}
            {wordsLeft}
        {/if}        
    </div>
        
    <button on:click={ ()=> dispatch("swapLeftRight") }>
        <!-- {$rightToLeft ? "←": "→"} -->
        <div style="transform: rotateY({$rightToLeft ? "0.5turn": "0turn"});">            
            <svg            
                viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                class="lucide lucide-arrow-right-left">
                <path d="m16 3 4 4-4 4"/>
                <path d="M20 7H4"/>
                <path d="m8 21-4-4 4-4"/>
                <path d="M4 17h16"/>
            </svg>
        </div>

    </button>
    <button on:click={() =>dispatch('close')}>        
        <svg 
            viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" 
            class="lucide lucide-x">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
        </svg>        
    </button>
</div>

<style>    
    .game-panel {
        display: flex;
        justify-content: space-between;
        /*background-color: blue;*/
        height: 10%;
    }

    button {
        --size:calc(var(--base)* 0.06);
        text-align: center;
        font-size: calc(var(--size) * 0.5 );         
        border-radius: 50%;
        border-width: calc(var(--size) * 0.05 );        
        padding: 0%;        
        height: var(--size);
        width: var(--size);   
        /* Чтобы не устанавливалась странная высота */
        line-height: 0;     
    }

    .info {
        font-size: calc(var(--base) * 0.04 );  
        color: black;
    }

    .lucide-arrow-right-left, .lucide-x{
        width: calc(var(--base) * 0.04 );
        height: auto;
    }

    .lucide-x {
        color: #C00000;        
    }    



</style>