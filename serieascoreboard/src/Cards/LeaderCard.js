import {Card, Table, Button} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import styles from './LeaderCard.module.css';

function LeaderCard(props) {
    const [seeAll, setSeeAll] = useState(false);
    const leaders = seeAll ? props.leaders : props.leaders.slice(0, 5);
    const clubCrests = props.crests

    function getClubCrest(teamName){
        for(let key in clubCrests){
            if(key.includes(teamName)) return clubCrests[key];
        }
    }

    function getStat(player) {
        switch(props.category) {
            case 'Goals':
                return player.goals;
            case 'Assists':
                return player.assists;
            case 'Clean Sheets':
                return player.cleanSheets;
            default:
                return;
        }
    }
    
    return (
        <Card className={styles.cardDesign} style={{ width:'45rem'}}>
            <Card.Body>
                <div>
                    <h2 className={styles.title}>{props.category}</h2>
                    <Table className={styles.tableDesign} variant='dark' responsive>

                        <thead>
                            <tr>
                                <td colSpan='3' style={{textAlign:'right'}}>{props.category}</td>
                            </tr>
                            
                        </thead>
                       
                        <tbody>
                            {
                                leaders.map((player, i) => (
                                    <tr key={`${props.category}-${player.name}`}>
                                        <td className='text-center'>{i+1}</td>
                                        <td>
                                            <img alt={`${player.team} club crest`}src={getClubCrest(player.team)} height='20' width='20' />
                                            <span>{player.name}</span>
                                        </td>
                                        <td style={{textAlign:'right'}}>{getStat(player)}</td>
                                    </tr>
                                ))
                            }
                        </tbody>

                    </Table>
                    <div className={styles.buttonContainer}>
                        {
                            seeAll ?
                            <Button className={styles.buttonDesign} onClick={() => setSeeAll(false)}>See Less</Button> :
                            <Button className={styles.buttonDesign} onClick={() => setSeeAll(true)}>See All</Button>
                        }
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
}

export default LeaderCard;