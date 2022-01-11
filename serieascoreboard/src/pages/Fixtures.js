import { useEffect, useState } from "react";
import {getMatchDates, getMatchDayFixtures, getClubCrests} from './services.js';
import {Pagination } from 'react-bootstrap';
import './Fixture.css';
import MatchCard from '../Cards/MatchCard.js';
import matchStatsService from "../services/matchStatsService.js";

function Fixtures() {

    function differenceBetweenDates(date1, date2){
        var timeDifference = Math.abs(date1.getTime() - date2.getTime());
        timeDifference = Math.round(timeDifference / (1000*3600*24));
        return timeDifference;
    }

    function defaultDate(dates){
        /**
         * function takes in an object where the keys are match days in the form "Month Day" and the values are in the form "YYY-MM-DD"
         * Function returns the date that is closest to the current date
         */
        let minDifference = Number.MAX_VALUE;
        let date = "";


        for(let key in dates){
            let month = dates[key].slice(5,7);
            let day = dates[key].slice(8,10);
            let year = dates[key].slice(0,4);
            let currentDate = new Date();
            let otherDate = new Date(month + "/" + day + "/" + year);


            if(differenceBetweenDates(currentDate, otherDate) < minDifference){
                minDifference = differenceBetweenDates(currentDate, otherDate);
                date = key;
            }

        }

        return date;
       
        
    }

    const [selectedDate, setSelectedDate] = useState('') //variable refers to the date the user has selected
    const [clubCrests, setClubCrests] = useState({}) //variable holds an object where the keys are the team name and the values are the links to the club crests
    const [matchDates, setMatchDates] = useState([]) //variable holds an object where the keys are of the format "Month Day" and the values are of the format "YYYYMMDD"
    const [matchDayFixtures, setMatchDayFixtures] = useState(null) //variable holds an object where the keys are the match date and the values are all the matches occuring on that date
    const [isLoading, setIsLoading] = useState(true);
    const [matchDatesKeys, setMatchDatesKeys] = useState([]);//returns an array where the elements are the keys of the matchDates object
    const [fixturesData, setFixturesData] = useState([]); //variable that holds the scorers for each match on a particular match day aswell as the game time for each match on a particular date

    useEffect(() => {
        fetch('https://api.football-data.org/v2/competitions/2019/matches',{
            headers:{
                'X-Auth-Token': 'c2589cae3b4e4530bf33db2666b727c3'
            }
        }).then(response => response.json())
        .then(data => {
            const dates = getMatchDates(data.matches); //getMatchDates function returns an array of all the match dates in the form "month day"
            setMatchDayFixtures(getMatchDayFixtures(dates, data.matches));
            setMatchDates(dates)
            getClubCrests().then(crests => setClubCrests(crests));
            setMatchDatesKeys(Object.keys(dates))
            setSelectedDate(defaultDate(dates))
            setIsLoading(false)
        })
        .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        if (selectedDate) { //if selected date is not null then retrieve the match goalscorers for each match that occurs on selectedDate.
            const date = matchDates[selectedDate].split('-').join('');
            setIsLoading(true);
            matchStatsService.getMatchesForDate(date).then(data => {
                setFixturesData(data)
                setIsLoading(false);
            });
        }
    }, [selectedDate])

    
    if(isLoading){
        return <section className='loading'>
            <p>Loading...</p>
        </section>
    }
    else {
        return (
            <>
                <Pagination id='design'>
                    {
                        matchDatesKeys.map(elem => {
                            return (
                                <Pagination.Item
                                    key={elem}
                                    className='item'
                                    active={elem === selectedDate}
                                    onClick={() => setSelectedDate(elem)}
                                >
                                    {elem}
                                </Pagination.Item>
                            )
                        })
                    }
                </Pagination>
                <div>
                    {
                        matchDayFixtures[selectedDate].map(match => {
                            let matchedFixture = null; //variable that holds which match from the fixturesData array corresponds to the match in the matchDayFixtures array
                            fixturesData.forEach(fixture => {
                                //if the home and away team from the fixture match the home and away team from the matchDayFixture element then assign the fixture to the matchedFixture variable
                                if(match.homeTeam.name.includes(fixture.homeTeam.name) && match.awayTeam.name.includes(fixture.awayTeam.name)){
                                    matchedFixture = fixture
                                }
                            })
                            if (matchedFixture)
                                return <MatchCard key={match.id} match={match} crests={clubCrests} fixtureScorers={matchedFixture}></MatchCard>
                        })
                    }
                </div>
            </>
        )
    }
        
    
}

export default Fixtures;