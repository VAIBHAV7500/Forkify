//http://food2fork.com/api/search
//494e135dc7c1f27df543a7380c4c77f7
import Search from './models/Search';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
import * as listView from './view/listView';
import * as likesView from './view/likesView';
import { elements, renderLoader, clearLoader } from './view/base';
import Recipe from './models/Recipe';
import List from './models/list';
import Likes from './models/Likes';


const state ={};
 
//SEARCH CONTROLLER
const controlSearch = async ()=>{
    //1. Get query from view
    const query = searchView.getInput();
    if(query)
    {
        //2. New search object and add to state
        state.search=new Search(query);
        //3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchresult)
        //4.Search for recipes
        await state.search.getResults();
        //5. Render results to UI
        clearLoader();
        searchView.renderResult(state.search.result);
    }
}

elements.searchForm.addEventListener('submit',e=>{
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click',e=>{
    const btn = e.target.closest('.btn-inline');
    if(btn)
    {
        const gotoPage = parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderResult(state.search.result, gotoPage);
    }
});


//RECIPE CONTROLLER

const recipeControl =async ()=>
{
    const id = window.location.hash.replace('#','');
    if(id)
    {
        renderLoader(elements.recipe);
        //highlighed text
        if(state.Search)
        searchView.highlightSelected(id);
        state.recipe = new Recipe(id);
        
        await state.recipe.getRecipe();
        state.recipe.calcTime();
        state.recipe.calcServe();
        state.recipe.parseIngredients();
        clearLoader();
        recipeView.clearRecipe();
        recipeView.renderRecipe(state.recipe, state.likes.isLiked(id)); 
    }
};

//window.addEventListener('hashchange',recipeControl);
//window.addEventListener('load',recipeControl);

['hashchange','load'].forEach(el=>window.addEventListener(el,recipeControl));

//LIST CONTROLLER

const controlList = ()=>{
    if(!state.list)
        state.list = new List;
    state.recipe.ingredients.forEach(el => {
        const item =state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item); 
    });
}

//handle delete and update
elements.shopping.addEventListener('click', e=>{
    const id = e.target.closest(".shopping__item").dataset.itemid;
    if(e.target.matches('.shopping__delete, .shopping__delete *'))
    {
       // console.log("clicked");
        //Delete from State
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);
    }
    else if(e.target.matches('.shopping__count-value'))
    {
        const ncount = parseFloat(e.target.value,10);
        state.list.updateCount(id,ncount);
    }
});

///LIKE CONTROLLER

const controlLikes=()=>{
    if(!state.likes)
        state.likes = new Likes();
    const currentID = state.recipe.id;
    if(!state.likes.isLiked(currentID))
    {
         const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.image
         );
         likesView.toggleLikeBtn(state.likes.isLiked(currentID));
        likesView.renderLike(newLike);
    }
    else
    { 
        //console.log("Unlike Called");
        state.likes.deleteLike(state.recipe.id);
        likesView.toggleLikeBtn(state.likes.isLiked(currentID));
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes()); 
}
window.addEventListener('load', ()=>{
    
    state.likes = new Likes();
    state.likes.readStorage();
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

elements.recipe.addEventListener('click', e=>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.serve>1)
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
    }
    else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    }
    else if(e.target.matches('.recipe__love, .recipe__love *'))
    {
        controlLikes();
    }
    //console.log(state.recipe);
});

