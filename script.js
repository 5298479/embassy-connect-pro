document.addEventListener("DOMContentLoaded", () => {
    const centerPara = document.getElementById("center-paragraph");
    const button = document.getElementById("start-button");

    const messages = [
        "Here you will get all the information about visas, the application process, and the required documents — so you can apply with confidence.",
        "Let's start! If you already have an account so login. If you don’t have an account, register first and then login by entering your credentials.",
        "Hope you will get all the information you require 😊"
    ];

    let messageIndex = 0;
    let charIndex = 0;

    function typeMessage() {
        if (charIndex < messages[messageIndex].length) {
            centerPara.textContent += messages[messageIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typeMessage, 30); // typing speed
        } else {
            centerPara.classList.remove("typing");
            if (messageIndex < messages.length - 1) {
                setTimeout(() => {
                    fadeOutText(() => {
                        messageIndex++;
                        charIndex = 0;
                        centerPara.textContent = "";
                        centerPara.classList.add("typing");
                        centerPara.classList.add("slide-up");

                        // Start typing after slide-up starts
                        setTimeout(() => {
                            typeMessage();
                        }, 200);

                    });
                }, 1000); // shortened hold time before fade
            } else {
                setTimeout(() => {
                    button.classList.remove("hidden");
                    button.classList.add("slide-up-fade");
                }, 800); // shorter delay for button
            }
        }
    }

    function fadeOutText(callback) {
        centerPara.style.opacity = 0;
        setTimeout(() => {
            centerPara.style.opacity = 1;
            centerPara.classList.remove("slide-up");
            callback();
        }, 250); // slightly faster fade
    }

    centerPara.classList.add("typing");
    centerPara.classList.add("slide-up");

    // First paragraph starts after slide-up begins
    setTimeout(() => {
        typeMessage();
    }, 200);
});
