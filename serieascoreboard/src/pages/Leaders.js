import { useEffect, useState } from "react";
import {getClubCrests} from './services.js';
import LeaderCard from "../Cards/LeaderCard.js";
import matchStatsService from '../services/matchStatsService.js';


function Leaders() {
    const[isLoading, setIsLoading] = useState(true);
    const[scorers, setScorers] = useState([]);
    const[assistors, setAssistors] = useState([]);
    const[cleanSheetLeaders, setCleanSheetLeaders] = useState([]);
    const[clubCrests, setClubCrests] = useState({});

    useEffect( () => {
        const fetchStats = async () => {
            const scorersPromise = matchStatsService.getGoalLeaders().then(res => setScorers(res));
            const assistsPromise = matchStatsService.getAssistLeaders().then(res => setAssistors(res));
            const cleanSheetsPromise = matchStatsService.getCleanSheetLeaders().then(res => setCleanSheetLeaders(res));
            const crestsPromise = getClubCrests().then(res => setClubCrests(res));
            await Promise.all([scorersPromise, assistsPromise, cleanSheetsPromise, crestsPromise])
            setIsLoading(false)
        };

        fetchStats();
    }, [])

    if(isLoading){
        return <section className='loading'>
            <p>Loading...</p>
        </section> 
    }
    else {
        return(
            <>
                <LeaderCard category='Goals' leaders={scorers} crests={clubCrests}></LeaderCard>
                <LeaderCard category='Assists' leaders={assistors} crests={clubCrests}></LeaderCard>
                <LeaderCard category='Clean Sheets' leaders={cleanSheetLeaders} crests={clubCrests}></LeaderCard>
            </>
        )
    }
}

export default Leaders;