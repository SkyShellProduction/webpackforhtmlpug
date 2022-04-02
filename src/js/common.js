let add = (a, b) => a+b;
console.log(add(2,3));
const heading = document.createElement('h1')
heading.textContent = 'Как интересно!'

// добавляем заголовок в DOM
const root = document.querySelector('#root')
root.append(heading)
class Game {
    name = 'Violin Charades'
    constructor () {
        this.game = 'cs';
        this.cs()
    }
    cs() {
        console.log(this.game);
    }
}
const myGame = new Game()