import axios from "axios";

const getAllHeroes = () => {
    console.log('requesting all heroes')
    return(axios.get('https://api.opendota.com/api/heroes'));
}

const getHeroCounters = (id) => {
    console.log('requesting counters for '+id)
    if(id === undefined){
        console.log('not requesting')
        return axios.get('https://api.opendota.com/api/heroes/'+id+'/matchups')
    }
    return(axios.get('https://api.opendota.com/api/heroes/'+id+'/matchups'))
}

export {getAllHeroes, getHeroCounters};