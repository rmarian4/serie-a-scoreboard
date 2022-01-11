import { useEffect, useState } from "react";
import {Table as BSTable} from 'react-bootstrap';
import './Table.css';


/*
change crest for:
-inter
-rube
-atalanta
-venezia
-salernitana
*/
const replaceLogoList = [
    'FC Internazionale Milano',
    'Juventus FC',
    'Atalanta BC',
    'US Salernitana 1919',
    'Venezia FC'
];

function Table() {
    const [standings, setStandings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('https://api.football-data.org/v2/competitions/2019/standings', {
            headers: {
                'X-Auth-Token': 'c2589cae3b4e4530bf33db2666b727c3'
            }
        }).then(response => response.json())
        .then(data => {
            console.log(data.standings[0].table)
            setStandings(data.standings[0].table)
            setIsLoading(false)
        })
        .catch(err => console.log(err))
    }, [])

    if(isLoading) {
        return <section className='loading'>
                <p>Loading....</p>
            </section> 
    }
    else{
        return (
            <BSTable id='standings' variant="dark" responsive>
                <thead>
                    <tr>
                    <th className='text-center' colSpan='2' >Club</th>
                    <th className='text-center' >GP</th>
                    <th className='text-center' >PTS</th>
                    <th className='text-center' >W</th>
                    <th className='text-center' >L</th>
                    <th className='text-center' >D</th>
                    <th className='text-center' >GF</th>
                    <th className='text-center' >GA</th>
                    <th className='text-center' >GD</th>
                    </tr>
                </thead>
                <tbody>
                    {standings.map(elem => {
                        return (
                            <tr key={elem.team.id}>
                                <td className='text-center'>{elem.position}</td>
                                <td>
                                    {replaceLogoList.includes(elem.team.name) ? 
                                        <img src={`/${elem.team.name.split(' ').join('')}.png`} alt={`${elem.team.name} club crest`} height="20" width="20"/> :
                                        <img src={elem.team.crestUrl} alt={`${elem.team.name} club crest`} height="20" width="20"/>
                                    }
                                    <span className="teamName">{elem.team.name}</span>
                                </td>
                                <td className='text-center'>{elem.playedGames}</td>
                                <td className='text-center'>{elem.points}</td>
                                <td className='text-center'>{elem.won}</td>
                                <td className='text-center'>{elem.lost}</td>
                                <td className='text-center'>{elem.draw}</td>
                                <td className='text-center'>{elem.goalsFor}</td>
                                <td className='text-center'>{elem.goalsAgainst}</td>
                                <td className='text-center'>{elem.goalDifference}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </BSTable>
        )
    }
    
}

export default Table;