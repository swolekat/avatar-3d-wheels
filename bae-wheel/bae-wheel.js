const octagon = document.getElementById('octagon');
const face0 = document.getElementById('face0');
const face1 = document.getElementById('face1');
const face2 = document.getElementById('face2');
const face3 = document.getElementById('face3');
const face4 = document.getElementById('face4');
const face5 = document.getElementById('face5');
const face6 = document.getElementById('face6');
const face7 = document.getElementById('face7');
const face0Content = document.getElementById('face0Content');
const face1Content = document.getElementById('face1Content');
const face2Content = document.getElementById('face2Content');
const face3Content = document.getElementById('face3Content');
const face4Content = document.getElementById('face4Content');
const face5Content = document.getElementById('face5Content');
const face6Content = document.getElementById('face6Content');
const face7Content = document.getElementById('face7Content');

const faceElements = [
    {
    face: face0,
    content: face0Content,
},
    {
        face: face1,
        content: face1Content,
    },
    {
        face: face2,
        content: face2Content,
    },
    {
        face: face3,
        content: face3Content,
    },
    {
        face: face4,
        content: face4Content,
    },
    {
        face: face5,
        content: face5Content,
    },
    {
        face: face6,
        content: face6Content,
    },
    {
        face: face7,
        content: face7Content,
    },
];

let octagonInterval = setInterval(() => {
    const width = face0.getBoundingClientRect()?.width;
    if(width === 0){
        return;
    }
    clearInterval(octagonInterval);
    initOctagon();
}, 300);

const initOctagon = () => {
    const { height } = face0.getBoundingClientRect();
    //22.5 is half of 45
    const zDistance = (height / (Math.sin(22.5 * (Math.PI / 180)))) * 0.5;
    face0.style = `transform: rotateX(0deg) translateY(-${height/2}px) translateZ(${zDistance}px)`;
    const face1Y = height * -0.4296;
    const face1Z = zDistance * 0.70738;
    face1.style = `transform: rotateX(315deg) translateY(${face1Y}px) translateZ(${face1Z}px) `;
    const face2Y = height * -0.1074;
    const face2Z = zDistance * 0.5404;
    face2.style = `transform: rotateX(270deg) translateY(${face2Y}px) translateZ(${face2Z}px) `;
    const face3Y = height * 0.2704;
    const face3Z = zDistance * 0.59375;
    face3.style = `transform: rotateX(225deg) translateY(${face3Y}px) translateZ(${face3Z}px)`;
    const face4Y = height * 0.4962;
    const face4Z = zDistance * 0.835227;
    face4.style = `transform: rotateX(180deg) translateY(${face4Y}px) translateZ(${face4Z}px) `;
    const face5Y = height * 0.4296;
    const face5Z = zDistance * 1.125;
    face5.style = `transform: rotateX(135deg) translateY(${face5Y}px) translateZ(${face5Z}px) `;
    const face6Y = height * 0.1185;
    const face6Z = zDistance * 1.298;
    face6.style = `transform: rotateX(90deg) translateY(${face6Y}px) translateZ(${face6Z}px) `;
    const face7Y = height * -0.2777;
    const face7Z = zDistance * 1.2443;
    face7.style = `transform: rotateX(45deg) translateY(${face7Y}px) translateZ(${face7Z}px)`;

    drawWheel();
    preload();
};

const colors = ['#e75480', '#cc7483', '#C61618', '#ffc0cb'];



let fieldData = {};
let apiToken;
let isSpinning = false;
let realItems = [];
let currentItemIndex = 0;
let currentFaceIndex = 0;
let segmentsToGo = 0;
let winnerIndex;
let maxSegments;

let container = document.getElementById('container');

const checkPrivileges = (data, privileges) => {
    const {tags, userId} = data;
    const {mod, subscriber, badges} = tags;
    const required = privileges || fieldData.privileges;
    const isMod = parseInt(mod);
    const isSub = parseInt(subscriber);
    const isVip = (badges.indexOf("vip") !== -1);
    const isBroadcaster = (userId === tags['room-id']);
    if (isBroadcaster) return true;
    if (required === "justSubs" && isSub) return true;
    if (required === "mods" && isMod) return true;
    if (required === "vips" && (isMod || isVip)) return true;
    if (required === "subs" && (isMod || isVip || isSub)) return true;
    return required === "everybody";
};

const showWheel = () => {
    container.className = '';
    octagon.style = 'transform: rotateX(0deg)';
    drawWheel();
    currentItemIndex = 0;
    currentFaceIndex = 0;
};

const hideWheel = () => {
    container.className = 'hidden';
    isSpinning = false;
};

const spinEnd = () => {
    const {doTTS, ttsVoice, ttsMessage, showDuration, volume} = fieldData;
    if(showDuration > 0){
        setTimeout(hideWheel, showDuration * 1000);
    } else {
        isSpinning = false;
    }

    if(!doTTS){
        return;
    }
    const winningSegment = realItems[winnerIndex];
    const message = ttsMessage.replace('$NAME', winningSegment.name);
    const url = `//api.streamelements.com/kappa/v2/speech?voice=${ttsVoice.replace('$', '')}&text=${encodeURI(message)}&key=${apiToken}`
    const myAudio = new Audio(url);
    myAudio.volume = volume;
    myAudio.play();
};


const createHtml = ({name, image, tagline}) => {
    return `
        <div class="avatar-card">
            <img src="${image}"/>
            <div class="avatar-name-and-info">
                 <div class="avatar-name">
                    ${name}
                </div>
                <div class="avatar-tagline">
                    ${tagline}
                </div>
            </div>
        </div>
    `
};

const drawWheel = () => {
    face0.style.background = colors[0];
    face0Content.innerHTML = createHtml(realItems[0]);

    face1.style.background = colors[1 % colors.length];
    face1Content.innerHTML = createHtml(realItems[1]);

    face2.style.background = colors[2 % colors.length];
    face2Content.innerHTML = createHtml(realItems[2]);

    face3.style.background = colors[3 % colors.length];
    face3Content.innerHTML = createHtml(realItems[3]);

    face4.style.background = colors[4 % colors.length];
    face4Content.innerHTML = createHtml(realItems[4]);

    face5.style.background = colors[5 % colors.length];
    face5Content.innerHTML = createHtml(realItems[5]);

    face6.style.background = colors[6 % colors.length];
    face6Content.innerHTML = createHtml(realItems[6]);

    // last face is special. Need to give it the illusion that it's the last item in the array
    face7.style.background = colors[(realItems.length -1) % colors.length];
    face7Content.innerHTML = createHtml(realItems[(realItems.length -1)]);

};

const getSpeed = () => {
    const segmentsAlreadyGone = maxSegments - segmentsToGo;
    const segmentPercentage = segmentsAlreadyGone / maxSegments;
    const easingValue =  segmentPercentage < 0.5 ? 4 * segmentPercentage * segmentPercentage * segmentPercentage : 1 - Math.pow(-2 * segmentPercentage + 2, 3) / 2;
    return 100 + (400 * easingValue);
};

const spinSection = () => {
    if(segmentsToGo === 0){
        spinEnd();
        return;
    }
    const newSelectedIndex = currentItemIndex + 1;
    const newItemIndex = (newSelectedIndex + 5) % realItems.length;
    const faceToUpdateIndex = (currentFaceIndex + 6) % 8;

    const faceToUpdate = faceElements[faceToUpdateIndex];
    faceToUpdate.face.style.background = colors[newItemIndex % colors.length];
    faceToUpdate.content.innerHTML = createHtml(realItems[newItemIndex]);
    currentItemIndex = (currentItemIndex + 1) % realItems.length;
    currentFaceIndex = (currentFaceIndex + 1) % 8;
    const speed = getSpeed();
    segmentsToGo -=1;
    const currentAngle = Number.parseInt(octagon.style.transform.replace('rotateX(', '').replace('deg)', ''), 10);
    const newAngle = currentAngle + 45;

    $('#octagon').velocity({rotateX: `${newAngle}deg`}, {duration: speed, easing: 'linear', complete: spinSection});

};

const spin = () => {
    if(isSpinning){
        return;
    }
    isSpinning = true;

    showWheel();
    const numberOfSpins = 1;
    winnerIndex = Math.round((Math.random() * 10000)) % realItems.length;
    segmentsToGo = (numberOfSpins * realItems.length) + winnerIndex;
    maxSegments = segmentsToGo;

    setTimeout( () => {
        spinSection();
    }, 1000);

};

window.addEventListener('onEventReceived', function (obj) {
    const {listener, event} = obj.detail;
    if (listener !== "message") {
        return;
    }
    const {data} = event;
    if(!checkPrivileges(data)) {
        return;
    }
    const { spinCommand } = fieldData;
    const {text} = data;
    const textIsSpin = text.toLowerCase() === spinCommand.toLowerCase();
    if(textIsSpin){
        spin();
        return;
    }
});

const processItems = () => {
    const items = [
        {
            name: 'Swolebae 1.0',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/swolebae1.0.png',
            tagline: 'The original waifu'
        },
        {
            name: 'Christmas Swolebae 1.0',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/christmasSwolebae1.0.png',
            tagline: 'Vintage Padoru'
        },
        {
            name: 'Swolebae 2.0',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/swolebae2.0.png',
            tagline: 'Waifu perfection re-imagined'
        },
        {
            name: 'Maid Swolebae',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/maid.png',
            tagline: 'Here to clean up the chat'
        },
        {
            name: 'Schoolgirl Swolebae',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/schoolgirl.png',
            tagline: 'Just like in one of my animes'
        },
        {
            name: 'Asuka',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/asuka.png',
            tagline: 'It\'s not like I want you to pick me or anything'
        },
        {
            name: 'Rei',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/rei.png',
            tagline: 'Understood.'
        },
        {
            name: 'Chibi Swolebae',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/chibiSwolebae.png',
            tagline: 'Chibi with the biggest bitties'
        },
        {
            name: 'Retro Swolebae',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/retroSwolebae.png',
            tagline: 'Better than Laura'
        },
        {
            name: 'Subnautica Swolebae',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/subnautica.png',
            tagline: 'Subzero Waifu'
        },
        {
            name: 'Nunbae',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/nunbae.png',
            tagline: 'You definitely need Jesus'
        },
        {
            name: 'Gothbae',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/gothbae.png',
            tagline: 'Ebony Dark\'ness Dementia Raven Way'
        },
        {
            name: 'Western Bae',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/westernBae.png',
            tagline: 'Y\'all best behave. There\'s a new sherrif in town'
        },
        {
            name: 'Penny',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/penny.png',
            tagline: 'Got any crops for me?'
        },
        {
            name: 'Baeloaf',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/baeLoaf.png',
            tagline: '100% pure honey bun!'
        },
        {
            name: 'Gothbae Dress',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/gothDress.png',
            tagline: 'Mistress of the Chat OwO'
        },
        {
            name: 'Maika',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/maika.png',
            tagline: 'Smile'
        },
        {
            name: 'Kaho',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/kaho.png',
            tagline: 'Sweet'
        },
        {
            name: 'Mafuyu',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/mafuyu.png',
            tagline: 'Sister'
        },
        {
            name: 'Miu',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/miu.png',
            tagline: 'Sadistic'
        },
        {
            name: 'Hideri',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/hideri.png',
            tagline: 'Surprise'
        },
        {
            name: 'Emerald Herald',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/emeraldHerald.png',
            tagline: 'Seek Seek Lest'
        },
        {
            name: 'Lady D',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/ladyD.png',
            tagline: '7ft tall dommy mommy OwO'
        },
        {
            name: 'ThiccBae',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/thiccbae.png',
            tagline: 'Gaddamn she thick'
        },
        {
            name: 'GothiccBae',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/gothicc.png',
            tagline: 'Gaddamn she thick (and goth)'
        },
        {
            name: 'Komaru',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/komaru.png',
            tagline: 'That\'s one crazy bear!'
        },
        {
            name: 'Christmas Swolebae 2.0',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/christmasSwolebae2.0.png',
            tagline: 'UPGRADED PADORU'
        },
        {
            name: 'Baiken',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/baiken2.png',
            tagline: 'One arm swordswoman'
        },
        {
            name: 'Cowbae',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/cowbae2.png',
            tagline: 'Be careful for unexpected moovements'
        },
        {
            name: 'Recette',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/recette.png',
            tagline: 'Want to buy something from my item shop?'
        },
        {
            name: 'Uzaki',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/uzaki.png',
            tagline: 'You like me, don\'t you senpai!'
        },
        {
            name: 'Grungebae',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/grungeBae.png',
            tagline: 'Wake up honey! Time to mosh!'
        },
        {
            name: 'Maid Loaf',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/maidloaf.png',
            tagline: 'Da service loaf UwU'
        },
        {
            name: 'Swolebae 3.0',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/swolebae3.0.png',
            tagline: 'Mo bae mo booty'
        },
        {
            name: 'BAEyonetta',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/baeyonetta.png',
            tagline: 'Charachter Action Waifu'
        },
        {
            name: 'Gothloaf',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/gothLoaf.png',
            tagline: 'Bred out of pure darkness'
        },
        {
            name: 'Bunny Bae',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/bunnyBae.png',
            tagline: 'No sword riding though'
        },
        {
            name: 'Rosa',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/rosa.png',
            tagline: 'Cecil\'s Waifu'
        },
        {
            name: 'Bloodborne Doll',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/bloodborne.png',
            tagline: 'You can use the doll however you like'
        },
        {
            name: 'Satsuki',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/satsuki.png',
            tagline: 'GAMAGOORI! I\'m H...ungry'
        },
        {
            name: 'Secretary Bae',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/secretary.png',
            tagline: 'Let\'s go to Atami!'
        },
        {
            name: 'TetsuBae',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/tetsuBae.png',
            tagline: 'Do you need another continue?'
        },
        {
            name: 'Lara',
            image: 'https://swolekat.github.io/avatar-3d-wheels/images/laura.png',
            tagline: 'Raidin tombs and fillin... streams with fun!'
        },
    ];
    if(items.length >= 8) {
        realItems = [...items];
        return;
    }
    do {
        realItems = [...realItems, ...items];
    } while(realItems.length < 8)
};

const preload = () => {
    const element = document.getElementById('preload');
    realItems.forEach(i => {
        const item = createHtml(i);
        element.insertAdjacentHTML('beforeend', item);
    });
};

window.addEventListener('onWidgetLoad', function (obj) {
    fieldData = obj.detail.fieldData;
    apiToken = obj.detail.channel.apiToken;
    processItems();
});
