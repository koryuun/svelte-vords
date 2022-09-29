const correctSound = new Audio('sound/ok2.wav')
const wrongSound = new Audio('sound/wrong1.wav')


export function playCorrect() {
    correctSound.play()
}

export function playWrong() {
    wrongSound.play()
}
