import {Card as BSCard, Table} from 'react-bootstrap';
import '../Cards/MatchCard.css'
import {useEffect, useState} from 'react';
import matchStatsServices from '../services/matchStatsService.js';


function MatchCard(props) {
    const[matchStatus, setMatchStatus] = useState('')
    const[seeStatistics, setSeeStatistics] = useState(false);
    const[matchStats, setMatchStats] = useState(null);
    const[showStats, setShowStats] = useState(false);
    
    

    useEffect( () => {
        if(props.match.status === 'FINISHED' || props.match.status === 'IN_PLAY'){
            matchStatsServices.getMatchStats(matchGoalScorers.gameId).then(data => setMatchStats(data))
        }

    }, [])

    useEffect(() => {
        if (props.match.status === 'FINISHED'){
            setMatchStatus("FT");
            setShowStats(true); //only show statistics if the match has finished or is in play
        }

        else if(props.match.status === 'IN_PLAY'){
            setShowStats(true); //show match stats if the game is in play
            setMatchStatus(matchGoalScorers.gameTime)
        }
        
        else{
            setMatchStatus(matchGoalScorers.gameTime)
        }
    }, [props.match.status])

    let homeTeam = props.match.homeTeam.name;
    let homeTeamGoals = props.match.score.fullTime.homeTeam;
    let awayTeam = props.match.awayTeam.name;
    let awayTeamGoals = props.match.score.fullTime.awayTeam;
    let homeTeamCrest = props.crests[homeTeam];
    let awayTeamCrest = props.crests[awayTeam]; 
    let matchGoalScorers = props.fixtureScorers //home team and away team scorers for the match
    
    if(seeStatistics){
        return (
        
            <BSCard className='cardDesign' style={{ height:'auto', width: '55rem'}}>
                <BSCard.Body>
                    <Table variant='dark' responsive style={{backgroundColor:'black'}}>
                        <thead>
                            <tr>
                                <th className='text-center'><img src={homeTeamCrest} height='40' width='40'/> </th>
                                <th></th>
                                <th className='text-center'><img src={awayTeamCrest} height='40' width='40'/></th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td className='text-center'>{matchStats.home.shots}</td>
                                <td className='text-center'>Shots</td>
                                <td className='text-center'>{matchStats.away.shots}</td>
                            </tr>

                            <tr>
                                <td className='text-center'>{matchStats.home.shotsOnTarget}</td>
                                <td className='text-center'>Shots on Target</td>
                                <td className='text-center'>{matchStats.away.shotsOnTarget}</td>
                            </tr>

                            <tr>
                                <td className='text-center'>{matchStats.home.possession}</td>
                                <td className='text-center'>Possession</td>
                                <td className='text-center'>{matchStats.away.possession}</td>
                            </tr>

                            <tr>
                                <td className='text-center'>{matchStats.home.fouls}</td>
                                <td className='text-center'>Fouls</td>
                                <td className='text-center'>{matchStats.away.fouls}</td>
                            </tr>

                            <tr>
                                <td className='text-center'>{matchStats.home.yellowCards}</td>
                                <td className='text-center'>Yellow Cards</td>
                                <td className='text-center'>{matchStats.away.yellowCards}</td>
                            </tr>

                            <tr>
                                <td className='text-center'>{matchStats.home.redCards}</td>
                                <td className='text-center'>Red Cards</td>
                                <td className='text-center'>{matchStats.away.redCards}</td>
                            </tr>

                            <tr>
                                <td className='text-center'>{matchStats.home.offsides}</td>
                                <td className='text-center'>Offsides</td>
                                <td className='text-center'>{matchStats.away.offsides}</td>
                            </tr>

                            <tr>
                                <td className='text-center'>{matchStats.home.corners}</td>
                                <td className='text-center'>Corners</td>
                                <td className='text-center'>{matchStats.away.corners}</td>
                            </tr>

                            <tr>
                                <td className='text-center'>{matchStats.home.saves}</td>
                                <td className='text-center'>Saves</td>
                                <td className='text-center'>{matchStats.away.saves}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <div className='buttonContainer'>
                        <button className='button' onClick={() => setSeeStatistics(false)}>See Score</button>
                    </div> 
                </BSCard.Body>
            </BSCard>

            
        ) 
    }

    return (
        <BSCard className='cardDesign' style={{ height:'auto', minHeight:'10rem', width: '60rem' }}>
            <BSCard.Body>
                <div>

                    <div className='homeTeam'>
                        <p style={{float:'right', fontSize:'20px'}}>
                            <img style={{marginRight:'10px'}} alt={`${homeTeam} club crest`} src={homeTeamCrest} height='40' width='40'/>
                            {homeTeam}
                            <span style={{color:'yellow', paddingLeft: '12px'}}>{homeTeamGoals}</span>
                        </p>
                    </div>

                    <div className='matchStatusStyle'>
                        <p id="matchStatus">{matchStatus}</p>
                    </div>

                    <div className='awayTeam'>
                        <p style={{float:'left', fontSize:'20px'}}>
                            <span style={{color:'yellow', paddingRight:'12px'}}>{awayTeamGoals}</span>
                            <img src={awayTeamCrest} alt={`${awayTeam} club crest`} height='40' width='40' />
                            {awayTeam}
                        </p>
                    </div>
                </div>

                <div className='goalScorerContainer'>
                    <div className='homeTeamScorers'>
                        {
                            matchGoalScorers.homeTeam.scorers.map(goalScorer => 
                                <p key={goalScorer}>{goalScorer}</p>
                                )
                        }
                    </div>

                    <div className='awayTeamScorers'>
                        {
                            matchGoalScorers.awayTeam.scorers.map(goalScorer =>
                                <p key={goalScorer}>{goalScorer}</p>
                            )
                        }
                    </div>
                </div>
                
                {
                    showStats ?
                    <div className='buttonContainer'>
                        {
                            matchStats ?
                            <button className='button' onClick={() => setSeeStatistics(true)}>Statistics</button> :
                            <p>Loading Stats...</p>
                        }
                    </div> :<></>

                }   

            </BSCard.Body>
        </BSCard>
    )
}

export default MatchCard;