/* =========================================
   JARVIS APEX
   Browser Voice + Command Engine
========================================= */

const input = document.getElementById("commandInput");
const sendButton = document.getElementById("sendButton");

const lastCommand = document.getElementById("lastCommand");
const commandCount = document.getElementById("commandCount");

const notification = document.getElementById("notification");

const reactorText = document.getElementById("reactorText");
const power = document.getElementById("power");

const voiceState = document.getElementById("voiceState");
const listenText = document.getElementById("listenText");

const browserStatus = document.getElementById("browserStatus");
const audioStatus = document.getElementById("audioStatus");

let commands = 0;
let recognition = null;
let listening = false;


/* =========================================
   CLOCK
========================================= */

function updateClock(){

    const now = new Date();

    const h = String(now.getHours()).padStart(2,"0");
    const m = String(now.getMinutes()).padStart(2,"0");
    const s = String(now.getSeconds()).padStart(2,"0");

    document.getElementById("clock").textContent =
        `${h}:${m}:${s}`;
}

setInterval(updateClock,1000);
updateClock();


/* =========================================
   RANDOM SYSTEM DATA
========================================= */

setInterval(()=>{

    const neural =
        (96 + Math.random()*3).toFixed(1);

    document.getElementById("neural").textContent =
        neural + "%";

    const latency =
        Math.floor(18 + Math.random()*20);

    document.getElementById("latency").textContent =
        latency + " MS";

    const temperature =
        (30 + Math.random()*3).toFixed(1);

    document.getElementById("temperature").textContent =
        temperature + "°";

},1500);


/* =========================================
   NOTIFICATION
========================================= */

function notify(message){

    notification.textContent = message;

    notification.classList.add("show");

    setTimeout(()=>{
        notification.classList.remove("show");
    },2500);
}


/* =========================================
   SPEAK
========================================= */

function speak(text){

    if(!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const speech =
        new SpeechSynthesisUtterance(text);

    speech.rate = 1.0;
    speech.pitch = 0.9;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
}


/* =========================================
   REACTOR
========================================= */

function activateReactor(){

    reactorText.textContent =
        "REACTOR ONLINE";

    power.textContent =
        "POWER 100%";

    notify("REACTOR CORE ACTIVATED");

    speak("Reactor core activated.");

    setTimeout(()=>{

        power.textContent =
            "POWER STABLE";

    },3000);
}


/* =========================================
   GOOGLE SEARCH
========================================= */

function googleSearch(query){

    const clean =
        query.replace(/search google for/i,"")
             .replace(/google search/i,"")
             .trim();

    if(!clean) return;

    browserStatus.textContent =
        "SEARCHING";

    notify("GOOGLE SEARCH // " + clean);

    speak("Searching Google for " + clean);

    setTimeout(()=>{

        window.open(
            "https://www.google.com/search?q=" +
            encodeURIComponent(clean),
            "_blank"
        );

        browserStatus.textContent =
            "READY";

    },700);
}


/* =========================================
   OPEN WEBSITE
========================================= */

function openWebsite(site){

    let url = site.trim();

    if(!url) return;

    if(!url.startsWith("http")){
        url = "https://" + url;
    }

    browserStatus.textContent =
        "OPENING";

    notify("OPENING // " + url);

    speak("Opening website.");

    setTimeout(()=>{

        window.open(url,"_blank");

        browserStatus.textContent =
            "READY";

    },600);
}


/* =========================================
   NORMAL WEBSITE COMMANDS
========================================= */

function openKnownWebsite(name,url){

    notify("OPENING " + name.toUpperCase());

    speak("Opening " + name);

    browserStatus.textContent =
        "OPENING";

    setTimeout(()=>{

        window.open(url,"_blank");

        browserStatus.textContent =
            "READY";

    },600);
}


/* =========================================
   COMMAND ENGINE
========================================= */

function executeCommand(raw){

    const command =
        raw.trim().toLowerCase();

    if(!command) return;

    commands++;

    commandCount.textContent =
        String(commands).padStart(3,"0");

    lastCommand.textContent =
        raw.toUpperCase();

    /* WAKE WORD */

    let cmd = command
        .replace(/^jarvis[\s,:-]*/,"")
        .trim();


    /* REACTOR */

    if(
        cmd.includes("activate reactor") ||
        cmd.includes("start reactor") ||
        cmd.includes("reactor on")
    ){

        activateReactor();
        return;
    }


    /* GOOGLE */

    if(
        cmd.startsWith("search google") ||
        cmd.startsWith("google search") ||
        cmd.startsWith("search for")
    ){

        googleSearch(cmd);
        return;
    }


    /* YOUTUBE */

    if(
        cmd === "open youtube" ||
        cmd === "youtube"
    ){

        openKnownWebsite(
            "YouTube",
            "https://www.youtube.com"
        );

        return;
    }


    /* GOOGLE */

    if(
        cmd === "open google" ||
        cmd === "google"
    ){

        openKnownWebsite(
            "Google",
            "https://www.google.com"
        );

        return;
    }


    /* GITHUB */

    if(
        cmd === "open github" ||
        cmd === "github"
    ){

        openKnownWebsite(
            "GitHub",
            "https://github.com"
        );

        return;
    }


    /* GMAIL */

    if(
        cmd === "open gmail" ||
        cmd === "gmail"
    ){

        openKnownWebsite(
            "Gmail",
            "https://mail.google.com"
        );

        return;
    }


    /* WHATSAPP */

    if(
        cmd === "open whatsapp" ||
        cmd === "whatsapp"
    ){

        openKnownWebsite(
            "WhatsApp",
            "https://web.whatsapp.com"
        );

        return;
    }


    /* WIKIPEDIA */

    if(
        cmd === "open wikipedia" ||
        cmd === "wikipedia"
    ){

        openKnownWebsite(
            "Wikipedia",
            "https://www.wikipedia.org"
        );

        return;
    }


    /* CALCULATOR */

    if(
        cmd === "open calculator" ||
        cmd === "calculator"
    ){

        openKnownWebsite(
            "Calculator",
            "https://www.google.com/search?q=calculator"
        );

        return;
    }


    /* DIRECT URL */

    if(
        cmd.startsWith("open website") ||
        cmd.startsWith("open site")
    ){

        const site =
            cmd.replace("open website","")
               .replace("open site","")
               .trim();

        openWebsite(site);

        return;
    }


    /* BRIGHTNESS */

    if(
        cmd.includes("increase brightness") ||
        cmd.includes("decrease brightness")
    ){

        notify(
            "DEVICE CONTROL REQUIRES LOCAL JARVIS AGENT"
        );

        speak(
            "Device brightness control requires the local Jarvis agent."
        );

        return;
    }


    /* VOLUME */

    if(
        cmd.includes("increase volume") ||
        cmd.includes("decrease volume") ||
        cmd === "mute"
    ){

        notify(
            "AUDIO CONTROL REQUIRES LOCAL AGENT"
        );

        speak(
            "Audio control requires the local Jarvis agent."
        );

        return;
    }


    /* HELLO */

    if(
        cmd.includes("hello") ||
        cmd.includes("hi jarvis") ||
        cmd === "hello"
    ){

        notify("NEURAL LINK ESTABLISHED");

        speak(
            "Hello. All primary systems are ready."
        );

        return;
    }


    /* STATUS */

    if(
        cmd.includes("system status") ||
        cmd === "status"
    ){

        notify(
            "ALL PRIMARY SYSTEMS NOMINAL"
        );

        speak(
            "All primary systems are nominal. Voice, browser and command systems are online."
        );

        return;
    }


    /* UNKNOWN */

    notify(
        "COMMAND NOT RECOGNISED"
    );

    speak(
        "I did not recognise that command."
    );
}


/* =========================================
   MANUAL INPUT
========================================= */

sendButton.addEventListener("click",()=>{

    executeCommand(input.value);

    input.value = "";

    input.focus();

});


input.addEventListener("keydown",(event)=>{

    if(event.key === "Enter"){

        executeCommand(input.value);

        input.value = "";

    }

});


/* =========================================
   VOICE RECOGNITION
========================================= */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if(SpeechRecognition){

    recognition =
        new SpeechRecognition();

    recognition.continuous = true;

    recognition.interimResults = false;

    recognition.lang = "en-IN";


    recognition.onstart = ()=>{

        listening = true;

        voiceState.textContent =
            "LISTENING";

        listenText.textContent =
            "VOICE CHANNEL ACTIVE";

        audioStatus.textContent =
            "LISTENING";

    };


    recognition.onend = ()=>{

        listening = false;

        voiceState.textContent =
            "STANDBY";

        listenText.textContent =
            "JARVIS READY";

        audioStatus.textContent =
            "READY";

        /*
        Automatically restart recognition.
        Browser may ask for microphone permission
        the first time.
        */

        setTimeout(()=>{

            try{
                recognition.start();
            }catch(e){}

        },500);

    };


    recognition.onerror = (event)=>{

        console.log(
            "Voice error:",
            event.error
        );

    };


    recognition.onresult = (event)=>{

        const result =
            event.results[
                event.results.length - 1
            ];

        const text =
            result[0].transcript.trim();

        console.log(
            "VOICE:",
            text
        );

        /*
        We accept commands containing JARVIS.
        */

        if(
            text.toLowerCase()
              .includes("jarvis")
        ){

            listenText.textContent =
                "COMMAND RECEIVED";

            executeCommand(text);

        }

    };


    /*
    Start automatically.
    Browser microphone permission is
    still required.
    */

    window.addEventListener(
        "load",
        ()=>{
            setTimeout(()=>{
                try{
                    recognition.start();
                }catch(e){}
            },1200);
        }
    );

}else{

    voiceState.textContent =
        "UNSUPPORTED";

    listenText.textContent =
        "VOICE NOT SUPPORTED";

}


/* =========================================
   KEYBOARD SHORTCUT
========================================= */

document.addEventListener("keydown",(event)=>{

    /*
    Press / to focus command terminal
    */

    if(event.key === "/"){

        event.preventDefault();

        input.focus();

    }

});


/* =========================================
   STARTUP SEQUENCE
========================================= */

window.addEventListener("load",()=>{

    const messages = [
        "BOOTING NEURAL CORE",
        "CALIBRATING REACTOR",
        "INITIALIZING VOICE LINK",
        "CONNECTING BROWSER SYSTEM",
        "JARVIS ONLINE"
    ];

    let i = 0;

    function boot(){

        if(i >= messages.length){

            notify(
                "JARVIS APEX ONLINE"
            );

            return;
        }

        notify(messages[i]);

        i++;

        setTimeout(
            boot,
            900
        );
    }

    boot();

});
