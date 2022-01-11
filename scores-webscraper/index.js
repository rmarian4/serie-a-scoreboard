const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

const espnUrl = 'https://www.espn.com/soccer/scoreboard/_/league/ITA.1';
const statsUrl = 'https://www.espn.com/soccer/matchstats?gameId='
const goalLeadersUrl = 'https://www.bbc.com/sport/football/italian-serie-a/top-scorers'
const assistLeadersUrl = 'https://www.bbc.com/sport/football/italian-serie-a/top-scorers/assists'
const cleanSheetsLeadersUrl = 'https://www.transfermarkt.us/serie-a/weisseweste/pokalwettbewerb/IT1';
let session = null;

const startPuppeteerSession = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    return {browser, page};
};

app.get('/api/matches/:date', async (req, res) => {
    if (!req.params.date) {
        return res.sendStatus(400);
    }

    const date = req.params.date;

    if (!session) {
        session = await startPuppeteerSession();
    }

    await session.page.goto(`${espnUrl}/date/${date}`);
    const data = await session.page.evaluate(async () => {
        const getScorers = (scorersList) => {
            const scorers = [];
        
            if (scorersList) {
                for (let scorerElem of scorersList.getElementsByTagName('li')) {
                    let innerText = scorerElem.innerText;
                    const lastChar = innerText.charAt(innerText.length - 1);
                    if (lastChar === ',')
                        innerText = innerText.substr(0, innerText.length - 1);
                    scorers.push(innerText);
                }
        
                return scorers;
            }
        
            return scorers;
        }

        const games = document.querySelectorAll('#events article.scoreboard');
        const scores = [];
        for (let elem of games) {
            const gameId = elem.id;
            const homeTeam = elem.querySelector('.team-a .team-info .short-name').innerHTML;
            const awayTeam = elem.querySelector('.team-b .team-info .short-name').innerHTML;
            const homeScorersList = elem.querySelector('.game-details .team-a ul');
            const homeScorers = getScorers(homeScorersList);
            const awayScorersList = elem.querySelector('.game-details .team-b ul');
            const awayScorers = getScorers(awayScorersList);
            const gameTime = elem.querySelector('.game-time').innerText;
            
            scores.push({
                gameId,
                gameTime,
                homeTeam: { name: homeTeam, scorers: homeScorers },
                awayTeam: { name: awayTeam, scorers: awayScorers },
            });
        }
        return scores;
    });

    res.json(data);
});

app.get('/api/matches/statistics/:id', async (req, res) => {
    if (!req.params.id) {
        return res.sendStatus(400);
    }

    const matchId = req.params.id;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`${statsUrl}${matchId}`, { timeout: 0 });
    const data = await page.evaluate(async () => {
        if (document.querySelector('.Error404')) {
            return null
        }

        const homeTeam = document.querySelector('.away .team-name span.long-name').innerText;
        const awayTeam = document.querySelector('.home .team-name span.long-name').innerText;
        const homeFouls = document.querySelector('td[data-home-away="home"][data-stat="foulsCommitted"]').innerText;
        const awayFouls = document.querySelector('td[data-home-away="away"][data-stat="foulsCommitted"]').innerText;
        const homeYellowCards = document.querySelector('td[data-home-away="home"][data-stat="yellowCards"]').innerText;
        const awayYellowCards = document.querySelector('td[data-home-away="away"][data-stat="yellowCards"]').innerText;
        const homeRedCards = document.querySelector('td[data-home-away="home"][data-stat="redCards"]').innerText;
        const awayRedCards = document.querySelector('td[data-home-away="away"][data-stat="redCards"]').innerText;
        const homeOffsides = document.querySelector('td[data-home-away="home"][data-stat="offsides"]').innerText;
        const awayOffsides = document.querySelector('td[data-home-away="away"][data-stat="offsides"]').innerText;
        const homeCorners = document.querySelector('td[data-home-away="home"][data-stat="wonCorners"]').innerText;
        const awayCorners = document.querySelector('td[data-home-away="away"][data-stat="wonCorners"]').innerText;
        const homeSaves = document.querySelector('td[data-home-away="home"][data-stat="saves"]').innerText;
        const awaySaves = document.querySelector('td[data-home-away="away"][data-stat="saves"]').innerText;
        const homePossession = document.querySelector('span[data-home-away="home"][data-stat="possessionPct"]').innerText;
        const awayPossession = document.querySelector('span[data-home-away="away"][data-stat="possessionPct"]').innerText;
        const homeShots = document.querySelector('span[data-home-away="home"][data-stat="shotsSummary"]').innerText;
        const awayShots = document.querySelector('span[data-home-away="away"][data-stat="shotsSummary"]').innerText;

        return {
            home: {
                name: homeTeam,
                possession: homePossession,
                shots: homeShots.slice(0, homeShots.indexOf('(') - 1),
                shotsOnTarget: homeShots.slice(homeShots.indexOf('(') + 1, homeShots.indexOf(')')),
                fouls: homeFouls,
                yellowCards: homeYellowCards,
                redCards: homeRedCards,
                offsides: homeOffsides,
                corners: homeCorners,
                saves: homeSaves
            },
            away: {
                name: awayTeam,
                possession: awayPossession,
                shots: awayShots.slice(0, awayShots.indexOf('(') - 1),
                shotsOnTarget: awayShots.slice(awayShots.indexOf('(') + 1, awayShots.indexOf(')')),
                fouls: awayFouls,
                yellowCards: awayYellowCards,
                redCards: awayRedCards,
                offsides: awayOffsides,
                corners: awayCorners,
                saves: awaySaves
            }
        };
    })

    await browser.close();

    if (!data) {
        res.sendStatus(404);
    } else {
        res.json(data);
    }
})

app.get('/api/statistics/goals', async(req, res) => {
    const { browser, page } = await startPuppeteerSession();

    await page.goto(`${goalLeadersUrl}`);

    const data = await page.evaluate(async () => {
        const tableRowElements = document.querySelectorAll('.gs-o-table .gel-long-primer tr');
        const goalLeaders = [];

        for(let i=0; i<tableRowElements.length; i++){
            let goalScorer = {}
            goalScorer.name = tableRowElements[i].getElementsByClassName('gs-u-vh@l')[0].innerText;
            goalScorer.team = tableRowElements[i].getElementsByClassName('gs-u-vh@m')[0].innerText;

            if(goalScorer.team === 'Inter Milan') goalScorer.team = 'Internazionale'

            if(goalScorer.team === 'FC Empoli') goalScorer.team = 'Empoli'

            goalScorer.goals = tableRowElements[i].getElementsByClassName('gs-o-table__cell gs-o-table__cell--right')[0].innerText;
            goalLeaders.push(goalScorer);
        }

        return goalLeaders;
    })

    await browser.close();

    res.json(data);
})

app.get('/api/statistics/assists', async(req, res) => {
    const { browser, page } = await startPuppeteerSession();

    await page.goto(`${assistLeadersUrl}`);

    const data = await page.evaluate(async () => {
        const tableRowElements = document.querySelectorAll('.gs-o-table .gel-long-primer tr');
        const assistLeaders = [];

        for(let i=0; i<tableRowElements.length; i++){
            let assistor = {};
            assistor.name = tableRowElements[i].getElementsByClassName('gs-u-vh gs-u-display-inherit@l')[0].innerText;
            assistor.team = tableRowElements[i].getElementsByClassName('gs-u-vh@m')[0].innerText

            if(assistor.team === 'Inter Milan') assistor.team = "Internazionale"
            if(assistor.team === 'FC Empoli') assistor.team = 'Empoli'

            assistor.assists = tableRowElements[i].getElementsByClassName('gs-o-table__cell gs-o-table__cell--right')[0].innerText

            assistLeaders.push(assistor);
        }

        return assistLeaders;

    })

    await browser.close();
    res.json(data);
})

app.get('/api/statistics/cleansheets', async(req, res) => {
    const { browser, page } = await startPuppeteerSession();

    await page.goto(`${cleanSheetsLeadersUrl}`);

    const data = await page.evaluate(async () => {
        const oddNumTableRows = document.querySelectorAll('.items tbody .odd') //represents an odd numbered row
        const evenNumTableRows = document.querySelectorAll('.items tbody .even') // represents an even numbered row
        const cleanSheetLeaders = []
        
        /*
        to get player names:
            tablerows[0].getElementsByClassName('spielprofil_tooltip tooltipstered')[0].innerText

        to get num clean sheets:
            tablerows[0].querySelectorAll('.zentriert')[2].innerText

        to get team name:
            tablerows[0].querySelectorAll('td')[3].innerText
         */
        
        //use i<Math.min(oddNumTableRows.length, evenNumTableRows.length) since if one list is longer than the other then you could run into the case where you are trying to access an element that does not exist in the shorter list
        for(let i=0; i<Math.min(oddNumTableRows.length, evenNumTableRows.length); i++){
            let player1 = {}
            let player2 = {}
            
            player1.name =  oddNumTableRows[i].getElementsByClassName('spielprofil_tooltip tooltipstered')[0].innerText
            player1.cleanSheets = oddNumTableRows[i].querySelectorAll('.zentriert')[2].innerText
            player1.team = oddNumTableRows[i].querySelectorAll('td')[4].innerText

            player2.name =  evenNumTableRows[i].getElementsByClassName('spielprofil_tooltip tooltipstered')[0].innerText
            player2.cleanSheets = evenNumTableRows[i].querySelectorAll('.zentriert')[2].innerText
            player2.team = evenNumTableRows[i].querySelectorAll('td')[4].innerText

           

            if(player1.team === 'Inter Milan') player1.team = 'Internazionale'
            if(player1.team === 'FC Empoli') player1.team = 'Empoli'

            if(player2.team === 'Inter Milan') player2.team = 'Internazionale'
            if(player2.team === 'FC Empoli') player2.team = 'Empoli'

            cleanSheetLeaders.push(player1)
            cleanSheetLeaders.push(player2);
        }
        

        return cleanSheetLeaders;
    })

    await browser.close();
    res.json(data);
})

app.listen(3001, () => {
    console.log('listening on port 3001');
})