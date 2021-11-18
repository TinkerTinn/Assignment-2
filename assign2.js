

const api = 'https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php';

document.addEventListener('DOMContentLoaded', function () {
  const playlist = JSON.parse(plays);
  let radios = document.querySelectorAll('input[type=radio][name="sort"]')
  let aside = document.querySelector("aside");
  let playHere = document.getElementById("playHere");

  nameSort(playlist);
  writeList(playlist);

  radios.forEach(radio => radio.addEventListener('change', () => {
    if (radio.id == 'name') {
      nameSort(playlist);
      writeList(playlist);
    }
    else if (radio.id == 'date') {
      playlist.sort(function (t1, t2) {
        return t1.likelyDate - t2.likelyDate;
      })
      writeList(playlist);
    }
  }))

  let clickablePlay = document.querySelector("#playList ul");
  clickablePlay.addEventListener('click', event => {
    let playID = event.target.getAttribute('data-id');
    let aPlay = playlist.find(p => p.id == playID);
    playInfoAside(aPlay, aside);
    playInfoHere(aPlay, playHere);
    open(aside, playHere, playlist, aPlay);
  })



});

function nameSort(playlist) {
  playlist.sort(function (t1, t2) {
    let title1 = t1.title.toLowerCase();
    let title2 = t2.title.toLowerCase();
    if (title1 < title2) { return -1; }
    if (title1 > title2) { return 1; }
    return 0;
  })
}

function writeList(playlist) {
  const list = document.createElement("ul");
  if (document.querySelector("#playList ul") == null) {
    for (let p of playlist) {
      let node = document.createElement("li");
      node.textContent = p.title;
      if (hasText(p)) {
        node.textContent = p.title + "📕";
      }
      node.setAttribute('tabindex', '1');
      node.setAttribute("data-id", p.id);
      list.appendChild(node);
    }
    document.querySelector("#playList").appendChild(list);
  } else {
    document.querySelector("#playList ul").innerHTML = '';
    for (let p of playlist) {
      let node = document.createElement("li");
      node.textContent = p.title;
      if (hasText(p)) {
        node.textContent = p.title + "📕";
      }
      node.setAttribute('tabindex', '1');
      node.setAttribute("data-id", p.id);
      list.appendChild(node);
    }
    document.querySelector("#playList ul").replaceChildren(list);
  }
}

function playInfoAside(aPlay, aside) {
  let pTitle = document.createElement("h2");
  let pSyn = document.createElement("p")


  aside.innerHTML = '';

  pTitle.textContent = aPlay.title;

  pSyn.textContent = aPlay.synopsis;


  aside.appendChild(pTitle);
  aside.appendChild(pSyn);

  if (hasText(aPlay)) {
    let pBut = document.createElement("button");
    pBut.setAttribute('id', "view-text");
    pBut.setAttribute('data-id', aPlay.id);
    pBut.textContent = "View Play Text";
    aside.appendChild(pBut);
  }
}

function playInfoHere(aPlay, playHere) {
  let header = document.createElement("h2");
  let pDofC = document.createElement("p");
  let pGen = document.createElement("p");
  let pWiki = document.createElement("a");
  let pGute = document.createElement("a");
  let pShSp = document.createElement("a");
  let pDesc = document.createElement("p");

  playHere.innerHTML = '';

  header.textContent = aPlay.title + "Details ";
  pDofC.textContent = "Likely Date of Composition: " + aPlay.likelyDate;
  pGen.textContent = "Genre: " + aPlay.genre;
  pWiki.textContent = "Wikipedia: " + aPlay.wiki;
  pGute.textContent = "Gutenberg: " + aPlay.gutenberg;
  pShSp.textContent = "Shakespeare.org: " + aPlay.shakespeareOrg;
  pDesc.textContent = aPlay.desc;

  pWiki.setAttribute('href', aPlay.wiki);
  pGute.setAttribute('href', aPlay.gutenberg);
  pShSp.setAttribute('href', aPlay.shakespeareOrg);

  playHere.appendChild(header);
  playHere.appendChild(pDofC);
  playHere.appendChild(pGen);
  playHere.appendChild(pWiki);
  linebreak(playHere);
  linebreak(playHere);
  playHere.appendChild(pGute);
  linebreak(playHere);
  linebreak(playHere);
  playHere.appendChild(pShSp);
  playHere.appendChild(pDesc);
}

async function playScript(url, aside, playHere, playlist) {
  var playscript;
  if (false) {//check if in local
    //in local
  } else {
    playscript = await getPlay(url);
    //store to local
  }


  let playID = document.getElementById("view-text").getAttribute('data-id');
  let aPlay = playlist.find(p => p.id == playID);

  let pInterField = document.createElement("fieldset");
  let pTitle = document.createElement("h2");
  let pActlist = document.createElement("select");
  let pScenelist = document.createElement("select");
  let pInnerField = document.createElement("fieldset");
  let pPlayerList = document.createElement("select");
  let pSearch = document.createElement("input");
  let pSearchBut = document.createElement("button");
  let closeBut = document.createElement("button");

  aside.innerHTML = '';

  pInterField.setAttribute('id', 'interface');
  pTitle.textContent = playscript.title;
  pActlist.setAttribute('id', 'actList');
  pScenelist.setAttribute('id', 'sceneList');
  pPlayerList.setAttribute('id', 'playerList');
  pSearch.setAttribute('type', 'text');
  pSearch.setAttribute('id', 'txtHighlight');
  pSearch.setAttribute('placeholder', 'Enter a search term');
  pSearchBut.setAttribute('id', 'btnHighlight');
  pSearchBut.textContent = "Filter";
  closeBut.setAttribute('id', 'btnClose');
  closeBut.textContent = "Close";

  let players = playscript.persona;
  for (let i = 0; i < players.length; i++) {
    let op3 = document.createElement('option');
    op3.setAttribute('value', players[i].player);
    op3.textContent = players[i].player;
    if (i == 0) { op3.selected = true; }
    pPlayerList.appendChild(op3);
  }


  let acts = playscript.acts;

  let op = document.createElement('option');
  op.setAttribute('value', 'choose-an-act');
  op.textContent = 'Choose an Act';
  op.selected = true;
  pActlist.appendChild(op);

  popList(acts, pActlist, false);
  noAct(pScenelist);

  pActlist.addEventListener('change', () => {
    while (pScenelist.hasChildNodes()) {
      pScenelist.removeChild(pScenelist.firstChild);
    }
    if (pActlist.options[pActlist.selectedIndex].value == 'choose-an-act') {
      noAct(pScenelist);
      playInfoHere(aPlay, playHere);
    } else {
      let scenes = acts[pActlist.selectedIndex - 1].scenes;

      let op2 = document.createElement('option');
      op2.setAttribute('value', 'choose-a-scene');
      op2.textContent = 'Choose a Scene';
      op2.selected = true;
      pScenelist.appendChild(op2);

      popList(scenes, pScenelist, false);

      pScenelist.addEventListener('change', () => {
        if (pScenelist.options[pScenelist.selectedIndex].value == 'choose-a-scene') {
          playInfoHere(aPlay, playHere);
        } else {
          let scene = scenes[pScenelist.selectedIndex - 1];
          playScriptText(playscript, scene, pActlist.options[pActlist.selectedIndex].value);
        }
      })
    }
  })

  pInnerField.appendChild(pPlayerList);
  pInnerField.appendChild(pSearch);
  pInnerField.appendChild(pSearchBut);

  pInterField.appendChild(pTitle);
  pInterField.appendChild(pActlist);
  pInterField.appendChild(pScenelist);
  pInterField.appendChild(pInnerField);

  aside.appendChild(pInterField);
  aside.appendChild(closeBut);

  close(aside, playHere, playlist, aPlay);
}

function playScriptText(playscript, scene, act) {

  playHere.innerHTML = '';
  let sTitle = document.createElement("h2");
  let article = document.createElement("article");
  let actTitle = document.createElement("h3");
  let divScene = document.createElement("div");
  let sceneNum = document.createElement("h4");
  let sceneTitle = document.createElement("p");
  let stageDirection = document.createElement("p");

  sTitle.textContent = playscript.title;
  article.setAttribute('id', 'actHere');
  actTitle.textContent = act;
  divScene.setAttribute('id', 'sceneHere');
  sceneNum.textContent = scene.name;
  sceneTitle.setAttribute('class', 'title');
  sceneTitle.textContent = scene.title;
  stageDirection.setAttribute('class', 'direction');
  stageDirection.textContent = scene.stageDirection;

  divScene.appendChild(sceneNum);
  divScene.appendChild(sceneTitle);
  divScene.appendChild(stageDirection);

  let speeches = scene.speeches;
  for (let s of speeches) {
    let node = document.createElement('div');
    node.setAttribute('class', 'speech');
    let speaker = document.createElement('span')
    speaker.textContent = s.speaker;
    node.appendChild(speaker);
    let lines = s.lines;
    for (let l of lines) {
      let line = document.createElement('p');
      line.textContent = l;
      node.appendChild(line);
    }
    if (s.hasOwnProperty('stagedir')) {
      let sd = document.createElement('p');
      sd.setAttribute('class', 'direction');
      sd.textContent = s.stagedir;
      node.appendChild(sd);
    }
    divScene.appendChild(node);
  }

  article.appendChild(actTitle);
  article.appendChild(divScene);

  playHere.appendChild(sTitle);
  playHere.appendChild(article);

  search(scene);
}

function search() {
  let sBtn = document.getElementById('btnHighlight');

  sBtn.addEventListener('click', () => {
    let sTxt = document.getElementById('txtHighlight').value;
    let sPls = document.getElementById('playerList').value;
    let speeches = document.getElementsByClassName("speech");
    for(s of speeches){
      if(s.firstChild.innerText == sPls){
        
        s.innerHTML = s.innerText.replaceAll(sTxt, "<mark>" + sTxt + "</mark>");
      }
    }

  })
}

function open(aside, playHere, playlist, aPlay) {
  let clickableViewText = document.getElementById("view-text");
  if (clickableViewText != null) {
    clickableViewText.addEventListener('click', event => {
      let playFromAPI = api + "?name=" + event.target.getAttribute('data-id');
      playScript(playFromAPI, aside, playHere, playlist, aPlay);
    })
  }
}

function close(aside, playHere, playlist, aPlay) {
  let cBtn = document.getElementById('btnClose');
  if (cBtn != null) {
    cBtn.addEventListener('click', () => {
      playInfoAside(aPlay, aside);
      playInfoHere(aPlay, playHere);
      open(aside, playHere, playlist, aPlay);
    })
  }

}

function linebreak(source) {
  let NL = document.createElement("br");
  source.appendChild(NL);
}

function hasText(play) {
  return play.filename.length != 0;
}

async function getPlay(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

function popList(src, list, bool) {
  for (let i = 0; i < src.length; i++) {
    let op = document.createElement('option');
    op.setAttribute('value', src[i].name);
    op.textContent = src[i].name;
    if (bool) {
      if (i == 0) { op.selected = true; }
    }
    list.appendChild(op);
  }
}

function noAct(list) {
  let op = document.createElement('option');
  op.setAttribute('value', 'no-act-chosen');
  op.textContent = 'Scenes';
  op.selected = true;
  list.appendChild(op);
}

