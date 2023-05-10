(function() {
  let state = 1;
  let game = document.querySelector("#game");
  
    // Створюємо гру та перемішуємо блоки
  createAndSolve(), shuffle();

 // Слухач кліків на ігрових клітинках
  game.addEventListener("click", function(e) {
    if (state == 1) {
// Вмикає анімацію ковзання
      game.className = "animate";
      moveNumberCellToEmpty(e.target, 1);
    }
  });

 // Слухає натискання кнопок керування
  document.getElementById("solve").addEventListener("click", createAndSolve);
  document.getElementById("shuffle").addEventListener("click", shuffle);

  // Створити розв'язану головоломку
  function createAndSolve() {
    if (state == 0) {
      return;
    }
    game.innerHTML = ""; // Очистити ігрову зону
    let n = 1;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let cell = document.createElement("span"); // створюємо одну комірку
        cell.id = `cell-${i}-${j}`; // 'cell-' + i + '-' + j; присвоїти комірці id
        cell.style.left = j * 80 + 1 * j + 1 + "px"; // позиція комірки зліва
        cell.style.top = i * 80 + 1 * i + 1 + "px"; // позиція комірки зверху
        if (n <= 15) {
          
          cell.classList.add("number");
          cell.classList.add(
            (i % 2 === 0 && j % 2 > 0) || (i % 2 > 0 && j % 2 === 0)
              ? "dark"
              : "light"
          ); // чергувати клітинки (темні-світлі)
          cell.innerHTML = (n++).toString();
        } else {
         
          cell.className = "empty";
        }
        game.appendChild(cell);
      }
    }
    
  }

  // перетасувати гру
  function shuffle() {
    if (state == 0) {
      return;
    }
    game.removeAttribute("class"); // прибрати анімацію
    state = 0;
    let previousCell;
    let i = 1;
    let interval = setInterval(function() {
      if (i <= 150) {
        let adjacent = getAdjacentCells(getEmptyCell());
        if (previousCell) {
          for (let j = adjacent.length - 1; j >= 0; j--) {
            if (adjacent[j].innerHTML == previousCell.innerHTML) {
              adjacent.splice(j, 1);
            }
          }
        }
        // Отримує випадкову сусідню комірку і запам'ятовує її для наступної ітерації
        previousCell = adjacent[getRandomNumberBetween(0, adjacent.length - 1)];
        moveNumberCellToEmpty(previousCell, 0);
        i++;
      } else {
        clearInterval(interval);
        state = 1;
      }
    }, 5);
   
  }

  function resetNoOfMoves() {
    noOfMoves = 0;
    document.getElementById("counter").innerText = noOfMoves;
  }

  // Зсуває комірку з числом в порожню комірку
  function moveNumberCellToEmpty(cell, playingOrShuffling) {
  // Перевіряє, чи виділена комірка має номер
    if (cell.className != "empty") {
      // Спроба отримати порожню сусідню комірку
      let emptyCell = getEmptyAdjacentCellIfExists(cell);

      if (emptyCell) {
        if (playingOrShuffling === 1) {
       
        }
      // Існує порожня сусідня комірка...
        // стиль та ідентифікатор числової комірки
        let tempCell = { style: cell.style.cssText, id: cell.id };

       // Обмінюється значеннями ідентифікатора та стилю
        cell.style.cssText = emptyCell.style.cssText;
        cell.id = emptyCell.id;
        emptyCell.style.cssText = tempCell.style;
        emptyCell.id = tempCell.id;

        if (state == 1) {
          // Перевіряє порядок чисел
          checkSolvedState();
        }
      }
    }
  }

 // Отримує певну комірку за рядком та стовпцем.
  function getCell(row, col) {
    return document.getElementById(`cell-${row}-${col}`);
  }

  // отримуємо порожню комірку.
  function getEmptyCell() {
    return game.querySelector(".empty");
  }

  // Отримує порожню сусідню комірку, якщо вона існує.
  function getEmptyAdjacentCellIfExists(cell) {
    // Отримує всі сусідні комірки
    let adjacent = getAdjacentCells(cell);

    // Шукає порожню комірку
    for (let i = 0; i < adjacent.length; i++) {
      if (adjacent[i].className == "empty") {
        return adjacent[i];
      }
    }

    // Порожню сусідню комірку не знайдено...
    return false;
  }

  // Отримує всі сусідні комірки
  function getAdjacentCells(cell) {
    let id = cell.id.split("-");

    // Отримує індекси позицій комірок
    console.log(`id[0] = ${id[0]}`);
    let row = parseInt(id[1]);
    let col = parseInt(id[2]);

    let adjacent = [];

   // Отримує всі можливі сусідні комірки
    if (row < 3) {
      adjacent.push(getCell(row + 1, col)); // right
    }
    if (row > 0) {
      adjacent.push(getCell(row - 1, col)); // left
    }
    if (col < 3) {
      adjacent.push(getCell(row, col + 1)); // top
    }
    if (col > 0) {
      adjacent.push(getCell(row, col - 1)); // bottom
    }
    return adjacent;
  }

 // Перевіряється правильність порядку чисел і отримуємо розв'язаний стан.
  function checkSolvedState() {
    // Перевіряє, чи порожня комірка знаходиться в правильній позиції
    if (getCell(3, 3).className != "empty") {
      return;
    }

    let n = 1;
   // Проходить по всіх комірках і перевіряє числа
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (n <= 15 && getCell(i, j).innerHTML != n.toString()) {
         // Порядок невірний
          return;
        }
        n++;
      }
    }
   // Пазл складено, пропонується перетасувати його
    startCongratsOverLay(), shuffle();
  }

 // Генерує випадкове число
  function getRandomNumberBetween(from, to) {
    return Math.floor(Math.random() * (to - from + 1)) + from;
  }
})();

// ефект накладання...
function startReadyOverLay() {
  document.getElementById("overlay-1").style.display = "block";
}
function endReadyOverLay() {
  document.getElementById("overlay-1").style.display = "none";
}
function startCongratsOverLay() {
  document.getElementById("overlay-2").style.display = "block";
}
function endCongratsOverLay() {
  document.getElementById("overlay-2").style.display = "none";
}
