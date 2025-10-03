const gridContainer = document.getElementById('sudoku-grid');
const timeDisplay = document.getElementById('time');
const scoreDisplay = document.getElementById('score');
const wrongDisplay = document.getElementById('wrong');
const leaderboardList = document.getElementById('leaderboard-list');
const popup = document.getElementById('popup');
const popupScore = document.getElementById('popup-score');
const difficultySelect = document.getElementById('difficultySelect');

let timer, seconds = 0, paused = true;
let score = 0, correctCount = 0, wrongCount = 0;
let sudoku = [], solution = [];
const maxCorrect = 5, maxWrong = 5;

const baseSudoku = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9]
];

function startTimer(){
    clearInterval(timer);
    timer = setInterval(()=>{
        if(!paused){
            seconds++;
            let mins = String(Math.floor(seconds/60)).padStart(2,'0');
            let secs = String(seconds%60).padStart(2,'0');
            timeDisplay.textContent = `${mins}:${secs}`;
        }
    },1000);
}

function generateSudoku(difficulty='easy'){
    gridContainer.innerHTML='';
    sudoku = JSON.parse(JSON.stringify(baseSudoku));
    solution = JSON.parse(JSON.stringify(baseSudoku));
    correctCount = score = wrongCount = seconds = 0;
    scoreDisplay.textContent = score;
    wrongDisplay.textContent = `${wrongCount}/${maxWrong}`;
    timeDisplay.textContent = '00:00';

    let removeCount = difficulty==='easy'?30:difficulty==='medium'?40:50;
    for(let i=0;i<removeCount;i++){
        let r=Math.floor(Math.random()*9);
        let c=Math.floor(Math.random()*9);
        sudoku[r][c]=0;
    }

    for(let row=0; row<9; row++){
        for(let col=0; col<9; col++){
            const input = document.createElement('input');
            input.type='text';
            input.maxLength=1;
            input.dataset.row=row;
            input.dataset.col=col;
            const blockIndex = Math.floor(row/3)*3 + Math.floor(col/3);
            input.classList.add(`block-color-${blockIndex%4}`);

            if(sudoku[row][col]!==0){
                input.value = sudoku[row][col];
                input.classList.add('prefilled');
                input.disabled = true;
            } else {
                input.addEventListener('input', (e)=>{
                    if(paused) return;
                    let val = parseInt(e.target.value);
                    let r = parseInt(input.dataset.row);
                    let c = parseInt(input.dataset.col);

                    if(isNaN(val)||val<1||val>9){
                        e.target.value='';
                        return;
                    }

                    if(val===solution[r][c]){
                        e.target.style.backgroundColor='#d4edda';
                        e.target.disabled=true;
                        correctCount++;
                        score+=20;
                        scoreDisplay.textContent=score;
                        if(correctCount>=maxCorrect) endGame();
                    } else {
                        e.target.style.backgroundColor='#f8d7da';
                        wrongCount++;
                        wrongDisplay.textContent = `${wrongCount}/${maxWrong}`;
                        setTimeout(()=>{ e.target.value=''; e.target.style.backgroundColor='white'; },800);
                        if
