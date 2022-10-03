const RESULTS = document.querySelector('#output')
const INPUT = document.querySelector('#query')

const WIKI = MediaWikiJS('https://oldschool.runescape.wiki')
let allITEMS = []
let options = {
    action: 'query',
    list: 'categorymembers',
    cmtitle: 'Category:Item_inventory_images',
    cmlimit: '500',
    cmcontinue: ''
}

WIKI.send(options, continueQuery)

function continueQuery(data) {
    options.cmcontinue = data.continue?.cmcontinue
    for (let item of data.query?.categorymembers) {

        allITEMS.push(item.title)
    }
    if (options.cmcontinue == undefined) {
        INPUT.value = ''
        INPUT.focus();
        renderField()
        return
    }
    WIKI.send(options, continueQuery)

}
// https://oldschool.runescape.wiki/images/'Beedy-eye' Jones chathead.png.png
// https://oldschool.runescape.wiki/images/'Beedy-eye'_Jones_chathead.png
// https://oldschool.runescape.wiki/images/'Beedy-eye'_Jones chathead.png"
function populateField(regex) {
    RESULTS.innerHTML = ''
    let response = ''
    allITEMS.forEach(i => {
        i = ('? ? ? ?'==i)?'&#63; &#63; &#63; &#63;':i
        
        let filename = i.replaceAll(/File\:/ig, '').replace(/\s/ig,'_')
        let pathName = i.replaceAll(/File\:/ig, '')
        .replaceAll(/Category\:/ig, '')
        .replace(/\s/ig,'_')
        .replaceAll(/_chathead.png/ig,'')
        .replaceAll(/_1.png/ig,'')
        .replaceAll(/_2.png/ig,'')
        .replaceAll(/_3.png/ig,'')
        .replaceAll(/_4.png/ig,'')
        .replaceAll(/_5.png/ig,'')
        .replaceAll(/_6.png/ig,'')
        .replaceAll(/_7.png/ig,'')
        .replaceAll(/_8.png/ig,'')
        .replaceAll(/_9.png/ig,'')
        .replaceAll(/_10.png/ig,'')
        .replaceAll(/_20.png/ig,'')
        .replaceAll(/_25.png/ig,'')
        .replaceAll(/_100.png/ig,'')
        .replaceAll(/_250.png/ig,'')
        .replaceAll(/_1000.png/ig,'')
        .replaceAll(/_10000.png/ig,'')
        .replace(/.png/ig,'')
        if (i.search(regex) > -1) {
            response +=`<div class="rule"><a href="https://osrs.wiki/${('&#63; &#63; &#63; &#63;'==pathName)?'%3f %3f %3f %3f':pathName}" target="_blank">${pathName}</a><img src="https://oldschool.runescape.wiki/images/${filename}"></div>`
        }
    })
    RESULTS.innerHTML = (response == '' ? `\n No NPC found with "${INPUT.value}" in their name, try something different \n` : response)
}

function searchQuery(query) {
    let temp = {}
    let out = ''
    query = query.split(' ').join('')
    let regex = query.split('')
    regex.forEach((element) => {
        element = (element =='?')? '&#63;':element
        temp[element] = (temp[element] > 0) ? temp[element] + 1 : 1;
    })
    for (key in temp) {
        let tempkey = key
        tempkey = (tempkey.search(/[[\]\\\^\*\+\?\{\}\|\(\)\$\.]/) == 0) ? '\\' + tempkey : tempkey
        out += `((?=.*${tempkey}){${temp[key]}})`
    }
    regex = `\\b${out}\\w+\\b`

    return new RegExp(regex, 'i')

}

function renderField() {
    populateField(searchQuery(INPUT.value));
}

INPUT.addEventListener('change', () => {
    renderField()
})