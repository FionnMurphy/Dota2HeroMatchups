import React from 'react';
import { useState, useEffect } from 'react';
import {getAllHeroes, getHeroCounters} from './services/Heroes';

const HeroesList = ({heroes, setSelectedHero}) => {
    console.log('Rendering heroes list')
    const list = heroes.map(hero => (
        <tr key={hero.id}>
            <td>{hero.id}</td>
            <td>
                <button onClick={() => {setSelectedHero(hero.id);console.log('selected '+hero.id)}}>
                    {hero.localized_name}
                </button>
            </td>
        </tr>
    ))
    return(
        <table>
            <tbody>
                {list}
            </tbody>
        </table>
    );
}

const getIndexOfHeroId = (id) =>{
    if(id<=23){
        return id-1;
    }else if(id<=114){
        return id-2;
    }else if(id<=121){
        return id-6;
    }else if(id<=123){
        return id-7;
    }else if(id<=128){
        return id-9;
    }else if(id<=129){
        return id-10;
    }else if(id<=137){
        return id-15;
    }
}

const HeroCounters = ({heroID, heroes, counters, setCounters, role}) => {
    console.log('Rendering counters list')
    useEffect(()=>{
        getHeroCounters(heroID).then(
            res => {
                let countersList = res.data.sort((a, b) => {return b.wins/b.games_played - a.wins/a.games_played})
                countersList = countersList.filter((counter) => {
                    if(role === 'all' || heroes[getIndexOfHeroId(counter.hero_id)].roles.includes(role)){
                        return counter
                    }
                })
                let tmp = []
                tmp.push(...countersList.slice(0,10))
                tmp.push(...countersList.slice(countersList.length-10))
                console.log('Matchups for '+heroID)
                console.log(tmp)
                setCounters(tmp)
            }
        )
    },[heroID, role])
    
    const list = counters.map(counter => (
        <tr key={counter.hero_id}>
            <td>{counter.hero_id}</td>
            <td>{heroes[getIndexOfHeroId(counter.hero_id)].localized_name}</td>
            <td>{(counter.wins/counter.games_played*100).toFixed(2)}% win rate</td>
            <td>{counter.games_played} game{counter.games_played===1?'':'s'}</td>
        </tr>
    ))
    return(
        <>
            <h1>Matchups for {heroes[getIndexOfHeroId(heroID)].localized_name}</h1>
            <table>
                <tbody>
                    {list}
                </tbody>
            </table>
        </>
    )
}

const HerosPage = () =>{
    const [heroes, setHeroes] = useState([])
    const [currHeroes, setCurrHeroes] = useState([])
    const [counters, setCounters] = useState([])
    const [selectedHero, setSelectedHero] = useState(1)
    const [role, setRole] = useState('all')

    useEffect(()=>{
        getAllHeroes().then(
            res => {
                setHeroes(res.data)
                console.log(res.data)
                setCurrHeroes(res.data)
            }
        )
    },[])

    const filterHeroes = (event) => {
        const query = event.target.value;
        console.log(query)
        const newList = heroes.filter((hero) => {return hero.localized_name.toLowerCase().indexOf(query.toLowerCase()) !== -1})
        setCurrHeroes(newList)
    }

    const filterMatchups = (event) => {
        const role = event.target.value;
        console.log(role)
        setRole(role)
    }

    return (
        <>
            <h1>Heroes</h1>
            <form>
                <input type='text' onChange={filterHeroes}/>
                <div>
                    <select onChange={filterMatchups}>
                        <option value='all'>All</option>
                        <option value='Carry'>Carry</option>
                        <option value='Support'>Support</option>
                        <option value='Durable'>Tank</option>

                    </select>
                </div>
            </form>
            <>
                {heroes.length!==0?<HeroCounters heroID={selectedHero} heroes={heroes} counters={counters} setCounters={setCounters} role={role}/>:null}
            </>
            <HeroesList heroes={currHeroes} setSelectedHero={setSelectedHero}/>
        </>
    );
}

export default HerosPage;