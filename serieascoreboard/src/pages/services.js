export function getMatchDates(matches) {
    /**
     * function returns all the matchday dates in an array where the dates are in the form "month day"
     */
    let matchDates = {}
    
    matches.forEach(element => {
        let date = element.utcDate.slice(0,10);
        if(!(date in matchDates)) matchDates[convertDate(date)] = date;
    });

    return matchDates
}

function convertDate(matchDate){
    /**
     * Function converts the dates so that they follow the format "Month Day"
     * Ex. If the date is 20210821 then the function would return "Aug 21"
     */

    let newDate = ""

    let date = new Date(matchDate.slice(0,4), Number(matchDate.slice(5,7)) - 1 , Number(matchDate.slice(8,10)));
    newDate = date.toDateString().slice(4,7) + " " + date.getUTCDate();
    
    return newDate;
}

export function getMatchDayFixtures(matchDates, fixtureList){
    /**
     * function returns an object with the key's being the match days and the values being an array of matches 
     * that occur on that match day
     */

    let matchDayFixtures = {} 

    for(let key in matchDates){
        matchDayFixtures[key] = [];
    }

    for(let i=0; i<fixtureList.length; i++){
        let date = convertDate(fixtureList[i].utcDate.slice(0,10));
        matchDayFixtures[date].push(fixtureList[i]);
    }

    return matchDayFixtures;

}

export async function getClubCrests() {
    /**
     * returns an object with the key's being the team name and the value's being the url of the crest
     */
     
    const replaceLogoList = [
        'FC Internazionale Milano',
        'Juventus FC',
        'Atalanta BC',
        'US Salernitana 1919',
        'Venezia FC'
    ];

    let crests = {}

    const data = await fetch('https://api.football-data.org/v2/competitions/2019/teams',{
        headers:{
            'X-Auth-Token': 'c2589cae3b4e4530bf33db2666b727c3'
        }
    }).then(response => response.json())
    .catch(err => console.log(err))

    data.teams.forEach(team => {
        let name = team.name;

        if(replaceLogoList.includes(name)) {
            crests[name] = `/${team.name.split(' ').join('')}.png`
        }
        else{
            crests[name] = team.crestUrl
        }
    })

    return crests;
}


