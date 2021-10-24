const cheapestTicket = document.getElementById('cheapest-ticket');

let tickets = [];
let searchId = '';

function getTickets() {
    return fetch('https://front-test.beta.aviasales.ru/tickets?searchId='+searchId)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      tickets = tickets.concat(data.tickets);
      if (data.stop != true) {
        return getTickets()
      } else {
        return tickets;
      }
    })
    .catch(error => {
      return getTickets()
    });
  };

fetch('https://front-test.beta.aviasales.ru/search')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    searchId = data.searchId;
    getTickets().then((tickets) => {
        document.getElementById("cheap").click();
    });
  });

  //сортирока по цене
 function sortByPrice() {
    return tickets.sort(function(min, max) {
       return Number(min.price) - Number(max.price)
     })
 };

 function sortByTime() {
    return tickets.sort(function(min, max) {
       return (Number(min.segments[0].duration)+Number(min.segments[1].duration)) - (Number(max.segments[0].duration)+Number(max.segments[1].duration))
     })
 };

 function getTime(dateTime, duration=null) {
   let _date = new Date(dateTime);
   if (duration) {
     //_date.setMinutes( _date.getMinutes() + duration )
     _date = new Date(_date.getTime() + duration*60000);
   }
   let _hours = _date.getUTCHours();
   let _minutes = _date.getUTCMinutes();
   return  (_hours > 9 ? _hours : '0'+ _hours) +':'+ (_minutes > 9 ? _minutes : '0'+ _minutes)
 }

 function getTimeWay(minutes){
   let _hours = Math.trunc(minutes/60);
   let _minutes = minutes % 60;
   return _hours+ 'ч ' + _minutes+'м'
 }

 function getNoun(number) {
    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20 ) {
      return n + ' пересадок';
    }
    n %= 10;
    if (n === 1) {
      return n + ' пересадка';
    }
    if (n >= 2 && n <= 4) {
      return n + ' пересадки';
    }
     if ( n === 0 ) {
       return 'прямой рейс'
     }
    return n + ' пересадок';
  }

  function filterTickets(){
       render(tickets);
  }

  function renderTickets(event, tabName) {
    let i, tablinks;
    
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    if (tabName == 'cheap') {
      render(sortByPrice());
    } else if (tabName == 'quick') {
       render(sortByTime());
    }
    //document.getElementById(cityName).style.display = "block";
    event.currentTarget.className += " active";
  }


 function render(sortedTickets) {
   let ticketCards = '';
   let j = 0;
   let avaliableStops = [];
   let allStops = false;
   let checkedFilters= document.querySelectorAll('.filter:checked');
   checkedFilters.forEach((checkedFilter) => {
     if (checkedFilter.value == 'all') {
       allStops = true;
     } else{
       avaliableStops.push(Number(checkedFilter.value));
     }
   })

  for (let i = 0; i < sortedTickets.length && j < 5; i++) {
   if (!allStops && avaliableStops.length > 0 && (!avaliableStops.includes(sortedTickets[i].segments[0].stops.length) || !avaliableStops.includes(sortedTickets[i].segments[1].stops.length)))
   {
     continue;
   }
   ticketCards +=  `
        <div class="tickets__card">
          <div class="ticket__header">

            <div class="ticket__price">
              <p class="price">${sortedTickets[i].price} ₽</p>
            </div>
            <div class="ticket__logo-company">
              <img class="logo__comp" src="http://pics.avs.io/110/36/${sortedTickets[i].carrier}.png" alt="logo-company">
            </div>

          </div>

          <div class="ticket__there">
            <div class="ticket__direction">
              <h3 class="city">${sortedTickets[i].segments[0].origin} - ${sortedTickets[i].segments[0].destination}</h3>
              <p class="time">${getTime(sortedTickets[i].segments[0].date)} - ${getTime(sortedTickets[i].segments[0].date,sortedTickets[i].segments[0].duration)}</p>
            </div>
          
            <div class="time-way">
              <h3 class="way">В пути</h3>
              <p class="time">${getTimeWay(sortedTickets[i].segments[0].duration)}</p>
            </div>

            <div class="transfer">
              <h3 class="transfer-namber">${getNoun(sortedTickets[i].segments[0].stops.length)}</h3>
              <p class="transfer-city">${sortedTickets[i].segments[0].stops.join(',')}</p>
            </div>
          </div>

          <div class="ticket__back">
            <div class="ticket__direction">
              <h3 class="city">${sortedTickets[i].segments[1].origin} - ${sortedTickets[i].segments[1].destination}</h3>
              <p class="time">${getTime(sortedTickets[i].segments[1].date)} - ${getTime(sortedTickets[i].segments[1].date,sortedTickets[i].segments[0].duration)}</p>
            </div>
          
            <div class="time-way">
              <h3 class="way">В пути</h3>
              <p class="time">${getTimeWay(sortedTickets[i].segments[1].duration)}</p>
            </div>

            <div class="transfer">
              <h3 class="transfer-namber">${getNoun(sortedTickets[i].segments[1].stops.length)}</h3>
              <p class="transfer-city">${sortedTickets[i].segments[1].stops.join(',')}</p>
            </div>
          </div>
        </div>
   `;
    j++;
   }
   cheapestTicket.style.display = 'block';
   cheapestTicket.innerHTML = ticketCards;
 }



const menuButton = document.querySelector(".mobil__menu");
const aside = document.querySelector(".aside");

menuButton.addEventListener('click', () => {
  aside.classList.toggle("is__open");
})
  