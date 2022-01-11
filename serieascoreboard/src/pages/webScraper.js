let url = 'https://www.espn.com/soccer/scoreboard/_/league/ITA.1/date/'

let xhr = new XMLHttpRequest();

xhr.open('GET', url, true);

xhr.responseType = 'document'; //expecting the response type of the http request to be a web page

xhr.onload = () => {
    if(xhr.readyState == 4 && xhr.status == 200)//if readyState == 4 is true then the http request has been sent. if status == 200 then that means that the request has succeeded
    { 
        let response = xhr.responseXML //returns whole webpage
    }
}

xhr.onerror = () => {
    console.error(xhr.status, xhr.statusText);
}

xhr.send(); //sends http request