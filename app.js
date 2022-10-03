const RESULTS = document.querySelector('#output')
const INPUT = document.querySelector('#query')

const WIKI = MediaWikiJS('https://oldschool.runescape.wiki')
let allITEMS = []
let options = {
    action: 'query',
    list: 'categorymembers',
    cmtitle: 'Category:Free-to-play items',
    cmlimit: 'max',
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

function populateField(regex) {
    RESULTS.innerHTML = ''
    let response = ''
    allITEMS.forEach(i => {
        i = ('? ? ? ?'==i)?'&#63; &#63; &#63; &#63;':i
        if (i.search(regex) > -1) {
            response +=`<a href="https://osrs.wiki/${('&#63; &#63; &#63; &#63;'==i)?'%3f %3f %3f %3f':i}" target="_blank">${i}</a></br>`
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