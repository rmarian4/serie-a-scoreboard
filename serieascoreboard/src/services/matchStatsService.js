const baseUrl = '/api/matches';

function getMatchesForDate(date) {
    /**
     * returns an array of objects which contain the goalscorers for each game on a particular date
     */
    return fetch(`${baseUrl}/${date}`).then(data => data.json());
}

function getMatchStats(gameId) {
    /**
     * returns the match stats like shots, shots on target, etc. for a particular match
     */
    return fetch(`${baseUrl}/statistics/${gameId}`).then(data => data.json());
}

function getGoalLeaders() {
    /**
     * returns a list of the players with the most goals in the league
     */

    return fetch(`${baseUrl.slice(0,4)}/statistics/goals`).then(data => data.json());
}

function getAssistLeaders(){
    /**
     * returns a list of players with the most assists in the league
     */

    return fetch(`${baseUrl.slice(0,4)}/statistics/assists`).then(data => data.json());
}

function getCleanSheetLeaders(){
    /**
     * returns a list of players with the most clean sheets in the league
     */

    return fetch(`${baseUrl.slice(0,4)}/statistics/cleansheets`).then(data => data.json());
}

export default {
    getMatchesForDate,
    getMatchStats,
    getGoalLeaders,
    getAssistLeaders,
    getCleanSheetLeaders
};