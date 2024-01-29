let timer;
let isTimerRunning = false;
let isInBreak = false;
let cyclesBeforeLongBreak = 4;
let longBreakTime = 300; // 5 minutes in seconds

// Recupera o estado do temporizador e ciclos concluídos do localStorage
let timeLeft = parseInt(localStorage.getItem('timeLeft')) || 1500; // 25 minutes in seconds
let cyclesCompleted = parseInt(localStorage.getItem('cyclesCompleted')) || 0;

function startTimer() {
    if (!isTimerRunning) {
        timer = setInterval(updateTimer, 1000);
        isTimerRunning = true;
        document.getElementById("startBtn").innerHTML = "Pause";
    } else {
        clearInterval(timer);
        isTimerRunning = false;
        document.getElementById("startBtn").innerHTML = "Resume";
    }
}

function setCustomTime() {
    const customTimeInput = document.getElementById("customTime");
    const customTime = parseInt(customTimeInput.value);

    if (!isNaN(customTime) && customTime > 0) {
        timeLeft = customTime * 60;
        updateDisplay();
        customTimeInput.value = ""; // Limpar o campo de entrada
    } else {
        alert("Please enter a valid positive number for custom time.");
    }
}

function updateTimer() {
    if (timeLeft === 0) {
        clearInterval(timer);
        isTimerRunning = false;
        document.getElementById("startBtn").innerHTML = "Start";
        playAlarm();

        if (!isInBreak) {
            cyclesCompleted++;
            localStorage.setItem('cyclesCompleted', cyclesCompleted);
        }

        if (isInBreak) {
            timeLeft = 1500; // Tempo padrão para Pomodoro
            isInBreak = false;
        } else {
            if (cyclesCompleted < cyclesBeforeLongBreak) {
                timeLeft = longBreakTime;
                isInBreak = true;
            } else {
                timeLeft = 1500; // Tempo padrão para Pomodoro
                cyclesCompleted = 0; // Reseta a contagem de ciclos
            }
        }

        showNotification(isInBreak ? "Break time! Take a 5-minute break." : "Pomodoro completed! Take a break.");

        // Adicione este log
        console.log('Updated localStorage with timeLeft:', timeLeft);
        localStorage.setItem('timeLeft', timeLeft);
        localStorage.setItem('isInBreak', isInBreak);
        localStorage.setItem('cyclesCompleted', cyclesCompleted);

        updateDisplay();
        startTimer(); // Inicia automaticamente o próximo timer
    } else {
        timeLeft--;
        updateDisplay();
    }
}
function resetTimer() {
    clearInterval(timer);
    isTimerRunning = false;
    document.getElementById("startBtn").innerHTML = "Start";
    timeLeft = 1500;
    cyclesCompleted = 0;
    isInBreak = false;

    // Reseta os valores no localStorage
    localStorage.removeItem('timeLeft');
    localStorage.removeItem('isInBreak');
    localStorage.removeItem('cyclesCompleted');

    updateDisplay();
}

function playAlarm() {
    const alarm = document.getElementById("alarm");
    alarm.play();
}

function showNotification(message) {
    if ('Notification' in window) {
        Notification.requestPermission().then(function (permission) {
            if (permission === 'granted') {
                const notification = new Notification('Pomodoro Timer', {
                    body: message
                });

                // Adicionando animação usando anime.js
                anime({
                    targets: notification,
                    translateY: [-10, 0],
                    opacity: [0, 1],
                    duration: 800,
                    easing: 'easeInOutQuad'
                });
            }
        });
    }
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    document.getElementById("timer").innerHTML = `${minutes}:${seconds}`;
    document.getElementById("cyclesCompleted").innerHTML = `Cycles completed: ${cyclesCompleted}`;
}

// Ao carregar a página, verifica se há um temporizador em andamento e inicia-o
window.addEventListener('load', function() {
    const savedIsInBreak = localStorage.getItem('isInBreak') === 'true';
    const savedTimeLeft = parseInt(localStorage.getItem('timeLeft')) || 0;

    if ((isTimerRunning || savedIsInBreak) && savedTimeLeft > 0) {
        // Se estiver em pausa ou o temporizador estiver em execução com tempo restante, continua o temporizador
        isInBreak = savedIsInBreak;
        timeLeft = savedTimeLeft;
        startTimer();
    } else if (!isTimerRunning && savedTimeLeft > 0) {
        // Se não estiver em execução, mas há tempo restante, inicia o temporizador
        timeLeft = savedTimeLeft;
        startTimer();
    } else {
        // Caso contrário, apenas atualiza a exibição
        updateDisplay();
    }
});

// Adicione estas linhas ao seu arquivo JavaScript
$(document).ready(function() {
    // Mostrar/esconder dropdown ao clicar no botão
    $('#helpBtn').click(function() {
        $('#instructionsDropdown').fadeToggle(200);
    });
});

// Adicione estas linhas ao seu arquivo JavaScript

// Função para obter o idioma salvo no armazenamento local
function getSavedLanguage() {
    return localStorage.getItem('preferredLanguage') || navigator.language || navigator.userLanguage;
}

// Função para definir o idioma da página
function setLanguage(language) {
    // Adicione condições para suportar vários idiomas, se necessário
    if (language === 'pt') {
        // Configuração para o idioma português
        document.documentElement.lang = 'pt';
        // Salva a preferência de idioma no armazenamento local
        localStorage.setItem('preferredLanguage', 'pt');
    } else {
        // Defina o idioma padrão ou outros idiomas aqui
        document.documentElement.lang = 'en';
        localStorage.setItem('preferredLanguage', 'en');
    }
}

// Verifica se o idioma está salvo e configura a página
setLanguage(getSavedLanguage());