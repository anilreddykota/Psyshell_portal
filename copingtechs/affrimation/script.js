// script.js

const affirmations = [
    {
        title: 'Grateful Mood',
        sentences: [
            "I am grateful for the abundance in my life.",
            "Every day, I find new reasons to be thankful.",
            "My life is filled with love, joy, and prosperity.",
            "I appreciate the simple pleasures that life brings.",
            "I am surrounded by positive energy and supportive people.",
            "Gratitude is the key to unlocking my inner peace.",
            "I am thankful for the lessons that challenges bring.",
            "My heart is open, and I am ready to receive blessings.",
            "I choose to focus on what I have rather than what I lack.",
            "Gratitude transforms my life in miraculous ways.",
        ],
    },
    {
        title: 'Motivated Mood',
        sentences: [
            "I am capable of achieving any goal I set for myself.",
            "Challenges are opportunities for growth and learning.",
            "I am motivated, focused, and unstoppable.",
            "My actions align with my goals and aspirations.",
            "I have the power to create positive change in my life.",
            "I am persistent, and I never give up on my dreams.",
            "Every step I take brings me closer to my success.",
            "I am fueled by my passion and determination.",
            "I trust in my abilities to overcome obstacles.",
            "I am a magnet for success, and I attract opportunities.",
        ],
    },
    {
        title: "Calm Mood",
        sentences: [
            "I am at peace with the present moment.",
            "My mind is serene, and my heart is tranquil.",
            "I release tension and embrace relaxation.",
            "I trust the journey and enjoy the process of life.",
            "I breathe deeply, letting go of stress with each exhale.",
            "I am in control of my thoughts and emotions.",
            "Peace surrounds me, and I am centered.",
            "I choose peace over worry and calm over chaos.",
            "I find stillness in the midst of life's demands.",
            "I am grounded, balanced, and at ease.",
        ],
    },
    {
        title: "Confident Mood",
        sentences: [
            "I believe in my abilities and unique talents.",
            "Confidence radiates from every cell of my being.",
            "I am worthy of success and accomplishments.",
            "I trust myself and my decisions.",
            "Challenges are opportunities to showcase my strength.",
            "I am bold, fearless, and ready to take on the world.",
            "My self-esteem is high, and I hold my head high.",
            "I am confident in my ability to overcome obstacles.",
            "I am a magnet for positive outcomes and opportunities.",
            "I trust that I am on the right path, and I am capable of achieving my goals.",
        ],
    },
    {
        title: "Joyful/Happy",
        sentences: [
            "I am grateful for the abundance of joy in my life.",
            "My heart is open, and I radiate happiness.",
            "I choose to focus on the positive and celebrate the good in my life.",
            "Every day, in every way, I am getting happier and happier.",
            "I am surrounded by love and joy, and I am at peace.",
            "Happiness is my birthright, and I choose to live a joyful life.",
            "I attract positivity and create a harmonious atmosphere around me.",
            "I find joy in the simple moments and appreciate the beauty of life.",
            "Today, I choose to be happy, and I let go of any negativity.",
            "My life is filled with laughter, love, and positive energy.",
        ],
    },
    {
        title: "Confident/Empowered",
        sentences: [
            "I believe in my abilities and trust in my potential.",
            "I am strong, capable, and confident in all that I do.",
            "Challenges are opportunities for growth, and I am resilient.",
            "I trust myself to make the right decisions for my life.",
            "I am worthy of success and deserve all the good things life has to offer.",
            "I radiate confidence, self-respect, and inner harmony.",
            "I am in control of my thoughts, feelings, and actions.",
            "I am a magnet for positive opportunities, and I attract success.",
            "My confidence grows with each new challenge I face.",
            "I am deserving of love, happiness, and success.",
        ],
    },
    {
        title: "Calm/Relaxed",
        sentences: [
            "I am at peace with the present moment.",
            "I release tension from my body and mind, allowing calmness to flow.",
            "I breathe in relaxation and exhale stress.",
            "I am a powerful creator, and I manifest my dreams into reality.",
            "Every step I take brings me closer to my goals.",
            "I am inspired by the limitless possibilities of my life.",
            "Challenges are stepping stones to my success, and I welcome them.",
            "I am focused, persistent, and driven to achieve my dreams.",
            "My potential is limitless, and I am capable of extraordinary things.",
            "Today, I am filled with energy, purpose, and the motivation to succeed.",
        ],
    },
    {
        title: "Grateful/Thankful",
        sentences: [
            "I am grateful for the abundance of blessings in my life.",
            "Every day, I find new reasons to be thankful.",
            "I appreciate the simple joys that life brings me.",
            "My heart is full of gratitude for the people and experiences in my life.",
            "I am thankful for the lessons that challenges bring and the growth they provide.",
            "I choose to see the good in every situation, and I am grateful for each moment.",
            "Gratitude is my attitude, and it transforms my life.",
            "I am thankful for the love and support that surrounds me.",
            "Today, I express gratitude for the gift of life and the opportunities it presents.",
            "I am grateful for the journey I am on, and I embrace the lessons it brings.",
        ],
    },
    {
        title: "Optimistic/Positive",
        sentences: [
            "I choose to see the positive in every situation.",
            "My thoughts are focused on creating a positive and optimistic future.",
            "I am a beacon of positivity, and I inspire others with my optimism.",
            "I attract positive energy and opportunities into my life.",
            "I am resilient, and I believe in my ability to overcome challenges.",
            "Positive thinking is a habit that comes naturally to me.",
            "I radiate positivity, and my life is a reflection of my optimistic mindset.",
            "I choose thoughts that empower me and contribute to my well-being.",
            "My positive attitude attracts positive people and experiences.",
            "I am surrounded by an abundance of positivity, and it enriches my life.",
        ],
    },





    // Add more affirmations as needed
];

const affirmationList = document.getElementById('affirmationList');
const affirmationTitle = document.getElementById('affirmationTitle');
const affirmationSentence = document.getElementById('affirmationSentence');
const startButton = document.getElementById('startButton');
const doneButton = document.getElementById('doneButton');

let currentAffirmation = null;
let currentSentenceIndex = 0;
let timer = null;

function populateAffirmationList() {
    affirmations.forEach((affirmation, index) => {
        const item = document.createElement('div');
        item.className = 'affirmation-item';
        item.textContent = affirmation.title;
        item.onclick = () => selectAffirmation(index);
        affirmationList.appendChild(item);
    });
}

function selectAffirmation(index) {
    currentAffirmation = affirmations[index];
    currentSentenceIndex = 0;
    affirmationTitle.textContent = currentAffirmation.title;
    affirmationSentence.textContent = currentAffirmation.sentences[currentSentenceIndex];
    startButton.disabled = false;
    doneButton.disabled = true;
    clearInterval(timer);
}

function startTimer() {
    startButton.disabled = true;
    doneButton.disabled = false;
    speakSentence(currentAffirmation.sentences[currentSentenceIndex]);
    timer = setInterval(() => {
        currentSentenceIndex++;
        if (currentSentenceIndex >= currentAffirmation.sentences.length) {
            currentSentenceIndex = 0;
        }
        affirmationSentence.textContent = currentAffirmation.sentences[currentSentenceIndex];
        speakSentence(currentAffirmation.sentences[currentSentenceIndex]);
    }, 5000);
}

function stopTimer() {
    clearInterval(timer);
    startButton.disabled = false;
    doneButton.disabled = true;
}

function speakSentence(sentence) {
    const utterance = new SpeechSynthesisUtterance(sentence);
    window.speechSynthesis.speak(utterance);
}

startButton.onclick = startTimer;
doneButton.onclick = stopTimer;

populateAffirmationList();
