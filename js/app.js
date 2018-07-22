// ascending sort by "cost in credits"
// null values moved to the end of the array
function sortByCostInCredits(input) {
  var i = input.length - 1;
  while (i > 0) {
    var swap = 0;
    for (var j = 0; j < i; j++) {
      if (input[j].cost_in_credits === null ||
        parseInt(input[j].cost_in_credits, 10) > parseInt(input[j + 1].cost_in_credits, 10)) {
        [input[j], input[j + 1]] = [input[j + 1], input[j]];
        swap = j;
      }
    }
    i = swap;
  }
}


// remove the elements from the array with the value of "consumables" = null
function delNullConsumables(input) {
  for (var i = input.length - 1; i >= 0; i--) {
    if (input[i].consumables === null) {
      input.splice(i, 1);
    }
  }
}


// replace null values in all objects to 'unknown'
function replaceNullValuesToUnknown(input) {
  for (var i = 0; i < input.length; i++) {
    for (var k in input[i]) {
      if (input[i][k] === null) {
        input[i][k] = 'unknown';
      }
    }
  }
}


// display sorted and modified list of ships
function displayListOfShips(input) {
  // set target element for the list
  var target = document.querySelector('.spaceship-list');

  for (var i = 0; i < input.length; i++) {
    var div = document.createElement('div');
    div.className = 'oneShip';
    var result = '';
    for (var k in input[i]) {
      if (input[i].hasOwnProperty(k)) {
        result += k + ' : ' + input[i][k] + '<br>';
        // display image of ship
        if (k === 'image') {
          result += '<br><img src= /img/' + input[i][k] + ' alt="imgOfShip" class="imgOfShips">';
        }
      }
    }
    result += '<br><hr>';
    div.innerHTML = result;
    target.appendChild(div);
  }
}


// get statistics

// get the number of the ships with one crew member
function getNumberOfShipsWithOneCrew(input) {
  var counter = 0;
  for (var i = 0; i < input.length; i++) {
    if (parseInt(input[i].crew, 10) === 1) {
      counter++;
    }
  }
  return counter;
}


// get the model name of the ship with the biggest cargo capacity
function getNameOfShipWithBiggestCargo(input) {
  var name = '';
  var maxCapacity = parseInt(input[0].cargo_capacity, 10);
  for (var i = 1; i < input.length; i++) {
    if (parseInt(input[i].cargo_capacity, 10) > maxCapacity) {
      maxCapacity = parseInt(input[i].cargo_capacity, 10);
      name = input[i].model;
    }
  }
  return name;
}


// get the number of all passengers of all ships
function getSumOfAllPassengers(input) {
  var sumPassengers = 0;
  for (var i = 0; i < input.length; i++) {
    if (isNaN(parseInt(input[i].passengers, 10)) === false) {
      sumPassengers += parseInt(input[i].passengers, 10);
    }
  }
  return sumPassengers;
}


// get the picture of the longest ship
function getImgOfLongestShip(input) {
  var img = '';
  var maxLength = parseInt(input[0].lengthiness, 10);
  for (var i = 1; i < input.length; i++) {
    if (parseInt(input[i].lengthiness, 10) > maxLength) {
      maxLength = parseInt(input[i].lengthiness, 10);
      img = input[i].image;
    }
  }
  return '<img src=/img/' + img + ' alt="imageOfLongestShip" class= "imgOfLongest">';
}


// display results of statistics functions above
function displayStatistics(input) {
  var stats = `Egy fős legénységű hajók száma: ${getNumberOfShipsWithOneCrew(input)} db<br>
  A legnagyobb rakterű hajó neve: ${getNameOfShipWithBiggestCargo(input)}<br>
  Az összes utas száma: ${getSumOfAllPassengers(input)}<br>
  A leghosszabb hajó képe: <br> ${getImgOfLongestShip(input)}`;
  var target = document.querySelector('.spaceship-list');
  var div = document.createElement('div');
  div.className = 'statistics';
  div.innerHTML = stats;
  target.appendChild(div);
}


// display result of search
function displayResult(result) {
  var oldDiv = document.querySelector('.resultOfSearch');
  if (oldDiv !== null) {
    oldDiv.remove();
  }
  var div = document.createElement('div');
  div.className = 'resultOfSearch';
  var target = document.querySelector('.one-spaceship');
  div.innerHTML = result;
  target.appendChild(div);
}


// search function
function searchForShipModel(userDatas) {
  var search = document.querySelector('#search-text').value.toLowerCase();
  var result = '';
  for (var i = 0; i < userDatas.length; i++) {
    if (userDatas[i].model.toLowerCase().indexOf(search) > -1) {
      for (var k in userDatas[i]) {
        if (userDatas[i].hasOwnProperty(k)) {
          result += k + ' : ' + userDatas[i][k] + '<br>';
          if (k === 'image') {
            result += '<br><img src= /img/' + userDatas[i][k] + ' alt="imgOfShip" class="' + userDatas[i].model + 'Found">';
            displayResult(result);
          }
        }
      }
      break;
    }
  }
}


function getData(url, callbackFunc) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function a() {
    if (this.readyState === 4 && this.status === 200) {
      callbackFunc(this);
    }
  };
  xhttp.open('GET', url, true);
  xhttp.send();
}

function successAjax(xhttp) {
  // Innen lesz elérhető a JSON file tartalma, tehát az adatok amikkel dolgoznod kell
  var userDatas = JSON.parse(xhttp.responseText);
  sortByCostInCredits(userDatas);
  delNullConsumables(userDatas);
  replaceNullValuesToUnknown(userDatas);
  displayListOfShips(userDatas);
  displayStatistics(userDatas);
  document.getElementById('search-button').addEventListener('click', function search() {
    searchForShipModel(userDatas);
  });
}

getData('/json/spaceships.json', successAjax);
