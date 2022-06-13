'use strict';

function fundamental() {}

fundamental.prototype.registerEffect = (effectFunction) => {
    effectFunction(); // <-- but when? Well maybe I can compile it from code.
}

fundamental.prototype.attach = (mutableElem, emitter) => {
    fundamental.registerEffect(() => {
        mutableElem = emitter.getState();
    })
} 

fundamental.prototype.source = (initValue) => {
    return (function() {
        function sourceInstance() {
            this.getState = getState;
            this.update = updater;
        }
        let _state = initValue;
        let _prevState = initValue;
        let _effectList = [];

        function getState() {
            return _state;
        }

        function updater(k) {
            if (typeof k === 'function') {
                _state = k(_prevState);
            } else {
                _state = k;
            }
            _prevState = _state;
            
            for (let fn of _effectList) {
                if (typeof fn === 'function') {
                    fn(_state);
                }
            }
        }

        return new sourceInstance();
    })();
}
const f_ = new fundamental();

let time1 = f_.source(600);
let time2 = f_.source(600);


f_.registerEffect(() => {
    console.log("State1:", time1.getState())
})

f_.registerEffect(() => {
    console.log("State2:", time2.getState())
})

const _ = setInterval(() => {
    time1.update((prev) => { return prev - 1})
}, 600)

const _$ = setInterval(() => {
    time2.update((prev) => { return prev - 1})
}, 800)



// startButton.addEventListener("click", startHandler);
// stopButton.addEventListener("click", stopHandler);

// function formattedTime(time) {
//     let minutes = Math.floor(time / 60);
//     let seconds =  time - (minutes * 60);
    
//     let minDisplay = `${minutes}`;
//     if (minutes < 10) {
//         minDisplay = `0${minutes}`;;
//     }

//     let secDisplay = `${seconds}`;
//     if (seconds < 10) {
//         secDisplay = `0${seconds}`;
//     }

//     return `${minDisplay}:${secDisplay}`;
// }
