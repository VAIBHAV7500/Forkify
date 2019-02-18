import { elements } from './base';

export const getInput = ()=> elements.searchInput.value;

export const clearInput = ()=>{
    elements.searchInput.value='';
};

export const clearResults = ()=>
{
    elements.searchResList.innerHTML='';
    elements.searchResPages.innerHTML='';
};

export const highlightSelected = id =>{
    const resultsArr = Array.from(document.querySelectorAll('results__link'));
    resultsArr.forEach(el=>
       { el.classList.remove('results__link--active')});
    document.querySelector(`.results__link[href *= "${id}"]`).classList.add('results__link--active');
};

const renderRecipe = (recipe)=>{

    const markup = `
            <li>
            <a class="results__link results__link--active" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="Test">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitTitleRecipe(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML("beforeend",markup);
};
export const limitTitleRecipe = (title,limit=17)=>{
    const newTitle = [];
    if(title.length>limit)
    {
        title.split(' ').reduce((acc,cur) => {
            if(acc+cur.length <=limit)
            {
                newTitle.push(cur);
            }
            return acc+cur.length;
        }, 0);
        return `${newTitle.join(' ')}...`;
    }
    return title;
};

const createButton= (page,type)=>
    `
    <button class="btn-inline results__btn--${type}" data-goto="${(type==='prev')?page-1: page+1}">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${(type==='prev')?'left':'right'}"></use>
                    </svg>
                    <span>Page ${(type==='prev')?page-1:page+1}</span>
    </button>
    `;

const renderButton =(page, numResults, recPerPage)=>
{
        const pages= (numResults)/recPerPage;
        let button;
        if(page==1 && pages>1)
        {
            //only next button should be there
            button = createButton(page,'next');
        }
        else if(page==pages)
        {
            //only the prev button should be there
            button = createButton(page,'prev');
        }
        else
        {
            //both the button should be there
            button =`
                    ${createButton(page,'prev')}
                    ${createButton(page,'next')}
            `;
        }
        elements.searchResPages.insertAdjacentHTML('afterbegin',button);
};

export const renderResult = (recipes, page=1, recPerPage=10) => {
        const start = (page-1)*recPerPage;
        const end= page*recPerPage;

        recipes.slice(start,end).forEach(renderRecipe);

        renderButton(page,recipes.length,recPerPage);
}
