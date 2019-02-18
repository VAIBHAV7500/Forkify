
import axios from 'axios';
import {proxy, key} from '../config';
export default class Search
{
    constructor(query)
    {
        this.query = query;
    }
    async getResults(query) {
        try{
                
        this.result=await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
        this.result=this.result.data.recipes;
       /* for(let i=0;i<30;i++)
        {
            console.log(this.result[i].title)
        }*/
        }
        catch(error)
        {
                alert(error);
        }
}

}