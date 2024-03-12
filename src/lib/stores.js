import { writable } from 'svelte/store'

// Custom store with toggle method
function createRightToLeftStore() {
    const store = writable(false);

    return {
        ...store,
        toggle: () => store.update(state => !state)
    };
}

export const rightToLeft = createRightToLeftStore() //writable(false)


















