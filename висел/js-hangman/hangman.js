// Массив слов для игры
const words = ["mister", "minecraft", "mama", "papa"];
// Выбор случайного слова из массива
const word = pickWord(words);

// Переменные для управления ходом игры
let turnCount = 11; // Количество доступных попыток
let remainingLetters = word.length; // Количество букв, которые нужно угадать
let alreadyUsedLetters = []; // Массив для уже введённых букв
let counterOfConfirmActions = 0; // Счётчик нажатий кнопки "Next"
let answerArray = setupAnswerArray(word); // Массив для отображения текущего состояния слова
let newGameState; // Переменная для хранения текущего состояния игры

// Функция для выбора случайного слова из массива слов
function pickWord(words) {
    return words[Math.floor(Math.random() * words.length)];
}

// Функция для создания массива подчеркиваний по длине выбранного слова
function setupAnswerArray(word) {
    let answerArray = [];
    for (let i = 0; i < word.length; i++) {
        answerArray[i] = "_"; // Добавляем подчеркивание для каждой буквы
    }
    return answerArray;
}

// Функция для отображения приветственного сообщения
function showGreeting(turnCount, answerArray) {
    document.getElementById("displayStatus").innerHTML = `"Виселица" — это игра на отгадывание слова.<br>
        У вас есть ${turnCount} попыток.<br>
        Загаданное компьютером слово:<br>
        ${answerArray.join(" ")}<br>
        Нажмите "Next" для начала игры.`;
}

// Функция для начала игры
function startGame(turnCount, answerArray) {
    showGreeting(turnCount, answerArray);
}

// Функция для выхода из игры
function exitGame(word) {
    document.getElementById("displayStatus").innerHTML = `Жаль, что вы вышли из игры.<br>
        Загаданное слово было: "${word}"`;
    setNewElementsVisibilityAfterGameExit();
}

// Функция обработки догадок пользователя
function confirmActions(word, answerArray) {
    if (counterOfConfirmActions % 2 === 0) {
        // Первое нажатие кнопки — просьба ввести букву
        document.getElementById("displayStatus").innerHTML = `Введите букву, которая, по вашему мнению, есть в слове: `;
        document.getElementById("showAlreadyUsedLetters").innerHTML = `Использованные буквы:<br>
            ${alreadyUsedLetters.join(', ')}`;
        counterOfConfirmActions += 1;
    } else {
        // Ввод буквы пользователем
        const guess = document.getElementById("guessOfPlayer").value.toLowerCase();

        // Проверка на пустой ввод или повторение буквы
        if (guess === "" || guess === " " ) {
            document.getElementById("displayStatus").innerHTML = "Введите только <b>одну букву</b>: ";
        } else if (alreadyUsedLetters.includes(guess)) {
            document.getElementById("displayStatus").innerHTML = `Вы <b>уже использовали</b> эту букву. Введите другую: `;
        } else {
            // Вызов функции проверки догадки и обновления состояния
            openLettersAndNotify(guess, word, answerArray, remainingLetters, turnCount);
            remainingLetters = newGameState.newRemainingLetters;
            turnCount = newGameState.newTurnCount;
            counterOfConfirmActions += 1;
        }

        document.getElementById("showAlreadyUsedLetters").innerHTML = `Использованные буквы:<br>
            ${alreadyUsedLetters.join(', ')}`;
    }
}

// Функция проверки буквы и обновления игры
function openLettersAndNotify(guess, word, answerArray, remainingLetters) {
    let correctLetter = false;
    alreadyUsedLetters.push(guess);

    // Проверка совпадений буквы с буквами в слове
    for (let j = 0; j < word.length; j++) {
        if (word[j] === guess && answerArray[j] === "_") {
            answerArray[j] = guess; // Открываем букву
            remainingLetters--;
            correctLetter = true;
        }
    }

    // Проверка на окончание игры (слово угадано или попытки закончились)
    if (remainingLetters === 0) {
        showAnswerAndRatePlayer(turnCount, word);
    } else if (remainingLetters > 0) {
        if (turnCount === 1 && !correctLetter) {
            turnCount--;
            showAnswerAndRatePlayer(turnCount, word);
        } else {
            // Обновление информации на экране
            if (!correctLetter) {
                turnCount--;
                document.getElementById("displayStatus").innerHTML = `К сожалению, этой буквы нет в слове:<br>
                    ${answerArray.join(" ")}<br>
                    Осталось ${turnCount} попыток.`;
            } else {
                document.getElementById("displayStatus").innerHTML = `Правильная буква:<br>
                    ${answerArray.join(" ")}<br>
                    Осталось ${turnCount} попыток.`;
            }
        }
    }

    // Обновление состояния игры
    return newGameState = {
        newRemainingLetters: remainingLetters,
        newTurnCount: turnCount,
    };
}

// Функция для отображения результата игры
function showAnswerAndRatePlayer(turnCount, word) {
    if (turnCount === 0) {
        document.getElementById("displayStatus").innerHTML = `Попытки закончились!<br>
            Загаданное слово было: "${word}"`;
    } else {
        document.getElementById("displayStatus").innerHTML = `Победа!<br>
            Загаданное слово было: "${word}"`;
    }
    setNewElementsVisibilityAfterGameExit();
}

// Функция для изменения видимости элементов после завершения игры
function setNewElementsVisibilityAfterGameExit() {
    document.getElementById("guessOfPlayer").style.display = "none";
    document.getElementById("interactWithPlayer").style.display = "none";
    document.getElementById("confirmActions").style.display = "none";
    document.getElementById("exitButton").style.display = "none";
    document.getElementById("restartGame").style.visibility = "visible";
}
