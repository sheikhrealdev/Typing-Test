const words = [
"apple","river","shadow","mountain","whisper","flame","ocean","dream","forest","cloud",
"stone","mirror","light","storm","field","echo","valley","breeze","ember","wave",
"leaf","dust","sky","meadow","rain","thunder","path","flower","spark","mist",
"hill","sunrise","twilight","branch","dew","feather","sand","shell","ice","glow",
"wind","brook","cliff","canyon","trail","pine","maple","willow","oak","riverbank",
"lake","pond","waterfall","island","shore","tide","current","reef","coral","lagoon",
"desert","dune","oasis","savanna","jungle","swamp","marsh","plain","plateau","ridge",
"peak","summit","volcano","crater","lava","ash","smoke","fog","haze","drift",
"glacier","frost","snow","blizzard","hail","sleet","rainbow","sunbeam","moonlight","starlight",
"galaxy","planet","comet","asteroid","orbit","cosmos","universe","void","nebula","eclipse",
"gravity","energy","matter","particle","atom","molecule","cell","organ","system","pulse",
"heartbeat","breath","mind","thought","memory","dreamer","vision","focus","clarity","wisdom",
"knowledge","truth","idea","concept","theory","logic","reason","insight","curiosity","wonder",
"imagination","creativity","art","music","melody","rhythm","harmony","song","dance","poetry",
"story","legend","myth","fable","novel","script","scene","actor","stage","audience",
"film","camera","lens","frame","image","picture","portrait","sketch","canvas","brush",
"color","shade","tone","texture","pattern","design","shape","form","structure","balance",
"symmetry","contrast","depth","perspective","angle","line","point","curve","space","dimension",
"time","moment","second","minute","hour","day","night","week","month","year",
"past","present","future","history","memory","event","journey","adventure","quest","mission",
"goal","purpose","plan","strategy","tactic","effort","work","task","project","result",
"success","failure","growth","progress","change","evolution","transformation","development","learning","skill",
"talent","ability","strength","power","energy","force","motion","speed","velocity","acceleration",
"direction","pathway","route","road","street","bridge","tunnel","gateway","portal","door",
"window","wall","roof","floor","foundation","pillar","tower","castle","village","city",
"country","nation","world","community","society","culture","tradition","custom","belief","value",
"ethics","morality","justice","law","order","peace","war","conflict","resolution","agreement",
"friend","family","partner","team","group","leader","follower","mentor","student","teacher",
"child","adult","elder","neighbor","stranger","guest","host","citizen","hero","villain",
"character","personality","emotion","feeling","joy","sadness","anger","fear","love","hate",
"hope","faith","trust","doubt","courage","bravery","strength","resilience","patience","kindness"
];

const textContainer = document.getElementById("text-container");
const timerElement = document.getElementById("timer");
const tryAgainButton = document.getElementById("try-again");
const finalScoreElement = document.getElementById("final-score");

let totalTyped = ""; 
let errors = 0; 
let currentCharIndex = 0;
let longText = generatingLongText();
let timeLeft = 60;
let timerInterval;
let typingStarted = false;




//Shuffle words array
function shuffleArray(array) {
    for (let i = array.length-1; i > 0; i--) {
        const j = Math.floor(Math.random()*(i+1));
        [array[i] , array[j]] = [array[j] , array[i]];
    }
    return array;
}

//Combine shuffle words into one string with spaces
function generatingLongText() {
    const shuffleWords = shuffleArray([...words]);
    return shuffleWords.join(" ");
}

//Start countdown tiemer
function startTimer() {
    if (!typingStarted) {
        typingStarted = true;
        timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `Time left: ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                endTest();
            }
        }, 1000);
    }
}

//End the test and display alert
function endTest() {
    timerElement.textContent = `Time's up!`;
    finalScoreElement.textContent = `Final WPM: ${calculateWPM()}`;
    textContainer.style.display = "none";
    tryAgainButton.style.display = "block";
}

//Calculate words per minute
function calculateWPM() {
    const wordsTyped = totalTyped.trim().split(/\s+/).length;
    const baseWPM = Math.round((wordsTyped / 60) * 60);
    const adjustWPM = Math.max(baseWPM - errors , 0);
    return adjustWPM;
}

//Handle typing over the displayed text and scrolling
document.addEventListener("keydown" , (e) =>{
    startTimer();
    if (e.key === "Backspace") {
        if (totalTyped.length>0) {
            currentCharIndex = Math.max(currentCharIndex - 1,0);
            totalTyped = totalTyped.slice(0,-1);

        }
    }else if(e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            totalTyped += e.key;
            currentCharIndex ++;
        }

    
    const textArray = longText.split("");
    textContainer.innerText = "";
    
    errors = 0;
    
    for (let i = 0; i < textArray.length; i++) {
        const span = document.createElement("span");

        if (i<totalTyped.length) {
            if(totalTyped[i] === textArray[i]){
                span.classList.add("correct");
            }else {
                span.classList.add("error");
                errors++; 
                console.log(errors);
            }
        }
        
        span.textContent = textArray[i];
        textContainer.appendChild(span);
    }
    
    //Scroll after 20 chharacters
    if (totalTyped.length >= 20) {
        const scrollAmount = (totalTyped.length-20)*14;
        textContainer.scrollLeft = scrollAmount;
    }
});

//Reset the test
function resetTest() {
    clearInterval(timerInterval);
    timeLeft = 60;
    timerElement.textContent = `Time left: ${timeLeft}s`;
    finalScoreElement.textContent = "";
    textContainer.style.display = "block";
    tryAgainButton.style.display = "none";
    totalTyped = "";
    typingStarted = false;
    currentCharIndex = 0;
    errors = 0;
    textContainer.scrollLeft = 0;
    longText = generatingLongText();
}

//Initialize the test
function init() {
    if (isMobileDevice()) {
        showMobileMessage();
    } else {
        textContainer.innerText = longText;
    timerElement.textContent = `Time left: ${timeLeft}s`;
    }
}

//Try again button
tryAgainButton.addEventListener("click",resetTest);

//Detect if the device is mobile
function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 800;
}

//Show message for mobile user
function showMobileMessage() {
    textContainer.textContent = "This typing test is designed for desktop use only";
}

//Startup
init();