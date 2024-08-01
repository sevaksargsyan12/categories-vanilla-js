import { parseToJSON } from './helpers.js';
import { checkScreenSize, setupMenu, setupBooking } from './utils.js';

const tabletWidth = 768;
let wasTablet = window.innerWidth < tabletWidth;

const listItems = document.querySelectorAll('.category-btn');
const categoriesWrapper = document.querySelector('.main-category-block');
const categoryImage = document.getElementById('category-image');

handleResize();
setupMenu();
setupBooking();

window.addEventListener('resize', handleResize);

/* remove opened category Lists when screen design changes */

function handleResize() {
    const isTablet = window.innerWidth < tabletWidth;

    if ((wasTablet && !isTablet) || (!wasTablet && isTablet)) {
        _removeAllLists();
    }

    wasTablet = isTablet;
    setScreenAttributes();
}

/* set class attribute to elements for checking in design */

function setScreenAttributes() {
    checkScreenSize() === 'desktop'
        ? categoriesWrapper.classList.remove('is-mobile')
        : categoriesWrapper.classList.add('is-mobile');
}

/* adds listener to all category buttons exiting in DOM initially */

function initListItems(listItems) {
    listItems.forEach((item, index) => {
        item.addEventListener(
            'click',
            _listItemClickHandler.bind(this, item, index)
        );
    });
}

function _listItemClickHandler(item, index, e) {
    e.preventDefault();
    e.stopPropagation();
    const subData = _getSubData(item);

    if (!item.getAttribute('id')) {
        item.setAttribute('id', 0 + '-' + index);
    }

    _removeActiveLists(item);

    const parent = item.parentElement;
    parent.classList.add('active');
    [].forEach.call(parent.children, (item) => item.classList.remove('active'));

    if (!subData) {
        item.classList.add('active', 'default');
        return;
    }

    if (!subData || item.classList.contains('active')) {
        return;
    }

    if (!categoryImage.classList.contains('none')) {
        categoryImage.classList.add('none');
    }

    item.classList.add('active');

    const parentLevel = _getItemLevel(item);
    const parentId = item.getAttribute('id');

    const el = _createSubCategoryElement(subData, parentLevel, parentId);

    if (checkScreenSize() === 'desktop') {
        categoriesWrapper.appendChild(el);
    } else {
        item.appendChild(el);
    }
}

/* remove all no needed hierarchy if we click on new category button */

function _removeActiveLists(item) {
    const level = _getItemLevel(item);
    const subCategoriesLists =
        categoriesWrapper.querySelectorAll('.sub-category');

    subCategoriesLists.forEach((subCat) => {
        const subCatLevel = subCat.getAttribute('level');
        if (+subCatLevel > +level) {
            subCat.remove();
        }
    });
}

/* remove all category lists except from initial one (which exists in html) */

function _removeAllLists() {
    const subCategoriesLists =
        categoriesWrapper.querySelectorAll('.sub-category');

    subCategoriesLists.forEach((subCat) => subCat.remove());
}

/* check in which level of hierarchi category button is */

function _getItemLevel(item) {
    return item.getAttribute('id').split('-')[0];
}

/* get data for rendering child List */

function _getSubData(item) {
    let data = item.getAttribute('data-sub');
    return data ? parseToJSON(data) : null;
}

/* creates category list node */

function _createSubCategoryElement(subData, parentLevel, parentId) {
    const el = document.createElement('ul');
    el.classList.add('sub-category');
    const level = +parentLevel + 1;
    el.setAttribute('level', level);
    el.setAttribute('parent-id', parentId);

    el.innerHTML = `
    ${subData
        .map((item, index) =>
            item?.id
                ? `
        <li
            id="${level + '-' + index}" 
            data-name="${item.name}"
        > <span>${item.name}</span> </li>`
                : `
        <li
            id="${level + '-' + index}"
            data-name="${Object.keys(item)[0]}"
            data-sub="${JSON.stringify(Object.values(item)[0]).replaceAll('"', "'")}"
        > <span>${Object.keys(item)[0]}</span> </li>`
        )
        .join('')}`;

    [].forEach.call(el.children, (item, index) => {
        item.addEventListener(
            'click',
            _listItemClickHandler.bind(this, item, index)
        );
    });

    return el;
}

initListItems(listItems);
