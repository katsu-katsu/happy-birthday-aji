// ==========================================
// ระบบเพลงประกอบ (BGM)
// ==========================================
let isMusicPlaying = false;
const bgm = document.getElementById('bgm-player');

// เพลงจะเริ่มเล่นทันทีที่คลิกหน้าจอครั้งแรก
document.addEventListener('click', () => {
    if (!isMusicPlaying && bgm) {
        bgm.volume = 0.4; // ปรับความดัง (0.4 คือกำลังชิลๆ ครับ)
        bgm.play();
        isMusicPlaying = true;
    }
});


let itemsAdded = 0;
const totalItems = 5; // แป้ง, ไข่, เนย, น้ำตาล, นม


function changeExpression(imgName, text) {
    // เปลี่ยนรูปตัวละคร (สมมติว่า ID ของตัวละครในฉากแรกคือ 'character')
    const char = document.getElementById('character');
    if (char) char.src = imgName;
    
    // เปลี่ยนข้อความในกล่องแชท
    const dialogueBox = document.getElementById('dialogue-box');
    if (dialogueBox) dialogueBox.innerText = text;
}

function putInBowl(itemId) {
    playSFX('sfx-pick');
    // ซ่อนรูปวัตถุดิบที่ถูกกด
    document.getElementById(itemId).classList.add('hidden');
    itemsAdded = itemsAdded + 1;

    // เปลี่ยนหน้าชั่วคราว
    changeExpression('impress.png', 'Great job!');

    // เช็คว่าใส่ครบ 5 อย่างหรือยัง
    if (itemsAdded === totalItems) {
        setTimeout(() => {
            // พอใส่ครบ ให้โชว์ไม้ตีแป้ง
            changeExpression('love.png', 'Perfect! Now click the whisk to mix it!');
            document.getElementById('whisk').classList.remove('hidden');
        }, 800); 
    }
}

// ฟังก์ชันนี้จะทำงานตอนแฟนคลิกที่รูป 'whisk.PNG'
function mixIngredients() {
    // 1. ซ่อนไม้ตีแป้ง
    document.getElementById('whisk').classList.add('hidden');
    
    // 2. สั่งให้ชามขยับสั่นๆ
    document.getElementById('bowl').classList.add('shake');
    
    // 3. เปลี่ยนหน้าเป็น talk
    changeExpression('talk.png', 'Mixing... Mixing...!');

    // 4. รอ 2 วินาที ค่อยเปลี่ยนรูปชาม
    setTimeout(() => {
        // หยุดสั่น
        document.getElementById('bowl').classList.remove('shake');
        
        // เปลี่ยนรูปชามเปล่า เป็นชามที่มีส่วนผสม (mixbowl.PNG)
        document.getElementById('bowl').src = 'mixbowl.PNG';
        
        // จบด่านทำเค้ก!
        changeExpression('love.png', 'It looks delicious! Time for the oven!');
    }, 2000); // 2000 มิลลิวินาที = 2 วินาที
}

// ==========================================
// ระบบกระพริบตาอัตโนมัติ (Blink Animation)
// ==========================================
setInterval(() => {
    let charImg = document.getElementById('character');
    
    // เช็คว่าตอนนี้เป็นหน้า default อยู่หรือเปล่า (จะได้ไม่ไปกวนตอนหน้า talk หรือ love)
    // เพิ่มการเช็คว่ามี charImg อยู่จริงไหม ป้องกัน Error ตอนสลับฉาก
    if (charImg && charImg.src.includes('default.png')) {
        
        charImg.src = 'blink.png'; // สั่งให้หลับตา
        
        // ตั้งเวลาให้ลืมตาขึ้นมาใหม่ในอีก 0.15 วินาที (150 มิลลิวินาที)
        setTimeout(() => {
            // เช็คอีกรอบเพื่อความชัวร์ ว่าแฟนไม่ได้กดอะไรไปตอนกำลังหลับตาพอดี
            if (charImg.src.includes('blink.png')) {
                charImg.src = 'default.png'; // สั่งให้กลับมาลืมตา (หน้า default)
            }
        }, 150); 
        
    }
}, 3500); // ลูปให้กระพริบตาทุกๆ 3.5 วินาที (3500 มิลลิวินาที)

// ==========================================
// ระบบฉากเตาอบ (Baking Scene)
// ==========================================
let ovenState = 0; // 0: เตาปิด, 1: เปิด, 2: วางชามแล้ว, 3: ปิดเตาเตรียมอบ, 4: เค้กสุก
let isDraggingBowl = false;

const ovenFull = document.getElementById('oven-full');
const charFull = document.getElementById('char-full');
const dragBowl = document.getElementById('drag-bowl');


// ==========================================
// ระบบผสมแป้ง และ เปลี่ยนฉาก (Transition)
// ==========================================
const whisk = document.getElementById('whisk'); // ไม้ตีแป้ง

whisk.addEventListener('click', () => {
    // 1. ซ่อนไม้ตีแป้งเมื่อกดแล้ว
    whisk.classList.add('hidden'); 
    
    // 2. เปลี่ยนคำพูดเพื่อบอกให้แฟนรู้ว่าต้องคลิกหน้าจอ
    changeExpression('impress.png', 'All mixed! Click anywhere to bake! ✨');

    // 3. สร้างระบบ "รอรับการคลิก 1 ครั้ง" ทั่วทั้งหน้าจอ
    setTimeout(() => {
        // ใช้ setTimeout หน่วงเวลาไว้ 0.1 วิ เพื่อป้องกันไม่ให้การคลิกไม้ตีแป้งเมื่อกี้ ถูกนับรวมเป็นการคลิกหน้าจอ
        document.addEventListener('click', function transitionToBake() {
            
            // กวาดล้างของเก่าให้หมด (เคลียร์โต๊ะ)
            document.getElementById('character').style.display = 'none';
            document.getElementById('bowl').style.display = 'none';
            document.getElementById('cabinet-container').style.display = 'none';
            
            // เรียกใช้ฉากเตาอบ
            startBakingScene();
            
            // ลบคำสั่งคลิกหน้าจอนี้ทิ้งไปซะ จะได้ไม่เผลอทำงานซ้ำตอนอบเค้ก
            document.removeEventListener('click', transitionToBake);
            
        });
    }, 100); 
});

// ฟังก์ชันนี้เอาไว้เรียกใช้ตอนตีส่วนผสมเสร็จ เพื่อสลับมาฉากนี้
function startBakingScene() {
    // โชว์ฉากอบเค้ก (เนื่องจากเราตั้ง z-index ไว้หน้าสุด มันจะบังฉากเก่าเอง)
    document.getElementById('baking-scene').style.display = 'block';
    
    // เปลี่ยนคำพูดในกล่องแชท
    const dialogueBox = document.getElementById('dialogue-box');
    dialogueBox.style.zIndex = '25'; // ดึงกล่องข้อความมาไว้หน้าสุด
    dialogueBox.innerText = "Let's bake! Open the oven and put the cake in!";
}

// 1. ระบบกดที่เตาอบ (เปิด / ปิด)
ovenFull.addEventListener('click', () => {
    console.log("Oven clicked! Current ovenState is:", ovenState);

    // ดึงกล่องข้อความมาเพื่อเตรียมเปลี่ยนคำพูด
    const dialogueBox = document.getElementById('dialogue-box');

    if (ovenState === 0) {
        // เตาปิดอยู่ -> กดแล้วเปิด
        ovenFull.src = 'step1.png';
        ovenState = 1;
        dialogueBox.innerText = "The oven is open! Put the bowl in.";
    } 
    else if (ovenState === 1) {
        // เตาเปิดอยู่ แต่ยังไม่ได้ใส่ชาม -> ห้ามปิดเตา!
        dialogueBox.innerText = "Wait! Put the bowl in the oven first!";
    }
    else if (ovenState === 2) {
        // ใส่ชามเรียบร้อยแล้ว -> กดแล้วปิดเตาเพื่ออบ
        ovenFull.src = 'step3.png';
        ovenState = 3;
        
        dialogueBox.innerText = "Baking in progress... Please wait!";
        
        // เริ่มอบ (3 วินาที)
        setTimeout(() => {
            playSFX('sfx-done');
            ovenFull.src = 'step4.png';
            ovenState = 4;
            dialogueBox.innerText = "Ding! The cake is ready! You're the best! (Click to continue)";
            
            // หน่วงเวลาเล็กน้อย 0.1 วิ ก่อนรอรับคลิก เพื่อป้องกันการกดเบิ้ล
            setTimeout(() => {
                document.addEventListener('click', function readyToLightsOut() {
                    triggerLightsOut();
                }, { once: true });
            }, 100);

        }, 3000); 
    }
});

// 2. ระบบกดค้างที่ตัวละครเพื่อถือชาม (Hold)
charFull.addEventListener('pointerdown', (e) => {
    if (ovenState >= 2) return; 
    
    isDraggingBowl = true;
    charFull.src = 'standing.png'; 
    dragBowl.style.display = 'block';
    
    // ส่งค่า event เมาส์ (e) ไปให้ฟังก์ชันคำนวณ
    moveBowlToMouse(e);
});

// ให้ชามขยับตามเมาส์
document.addEventListener('pointermove', (e) => {
    if (isDraggingBowl) {
        moveBowlToMouse(e);
    }
});

// เมื่อปล่อยเมาส์ (Release)
document.addEventListener('pointerup', (e) => {
    if (!isDraggingBowl) return;
    isDraggingBowl = false;
    dragBowl.style.display = 'none'; 
    
    const ovenRect = ovenFull.getBoundingClientRect();
    const isOverOven = (
        e.clientX >= ovenRect.left &&
        e.clientX <= ovenRect.right &&
        e.clientY >= ovenRect.top &&
        e.clientY <= ovenRect.bottom
    );
    
    if (isOverOven && ovenState === 1) {
        ovenFull.src = 'step2.png';
        ovenState = 2;
        charFull.src = 'standing.png'; 
        document.getElementById('dialogue-box').innerText = "Great! Now close the oven.";
    } else {
        charFull.src = 'holdingbowl.png';
    }
});

// 📍 คำนวณตำแหน่งชามเทียบกับกรอบเกม 📍
function moveBowlToMouse(e) {
    // หาตำแหน่งและขนาดของกล่องฉากอบเค้ก
    const sceneBox = document.getElementById('baking-scene').getBoundingClientRect();
    
    // คำนวณพิกัดเมาส์ หักลบด้วยขอบกล่องเกม
    const x = e.clientX - sceneBox.left;
    const y = e.clientY - sceneBox.top;
    
    // สั่งให้ชามไปอยู่ตรงนั้น และหาร 2 ให้กึ่งกลางชามตรงกับเมาส์เป๊ะๆ
    dragBowl.style.left = (x - dragBowl.offsetWidth / 2) + 'px';
    dragBowl.style.top = (y - dragBowl.offsetHeight / 2) + 'px';
}

// ฟังก์ชันสั่งดับไฟและรอรับการคลิก
function triggerLightsOut() {
    const overlay = document.getElementById('dark-overlay');
    const dialogueBox = document.getElementById('dialogue-box');

    // สั่งให้ฟิล์มสีดำเข้มขึ้น (มืดลง)
    overlay.style.opacity = '1'; 
    overlay.style.pointerEvents = 'auto'; // กันไม่ให้กดโดนเตาอบข้างหลังแล้ว

    // ดึงกล่องข้อความแชททะลุความมืดขึ้นมาอยู่หน้าสุด แล้วเปลี่ยนข้อความ
    dialogueBox.style.zIndex = '60';
    dialogueBox.innerText = ". . .";

    // หน่วงเวลา 1.5 วินาทีหลังจากไฟดับสนิท ค่อยอนุญาตให้คลิกเพื่อไปฉากต่อไปได้ 
    // (ป้องกันแฟนเผลอกดรัวๆ ตั้งแต่ตอนเค้กสุก)
    setTimeout(() => {
        document.addEventListener('click', function transitionToSurprise() {
            // ลบ Event ออกเพื่อไม่ให้ทำงานซ้ำ
            document.removeEventListener('click', transitionToSurprise);
            
            // สั่งทำงานฉากเซอร์ไพรส์ (เขียนโครงทิ้งไว้รอรูปของคุณครับ)
            startSurpriseScene();
        });
    }, 1500); 
}

// ==========================================
// ระบบฉากเซอร์ไพรส์ & เป่าเทียน (Microphone)
// ==========================================
let surpriseStep = 0;
let micStream = null;
let audioContext = null;

// ฟังก์ชันนี้ถูกเรียกใช้ตอนไฟดับสนิท (จาก triggerLightsOut)
function startSurpriseScene() {
    // ปิดฉากเก่า
    document.getElementById('baking-scene').style.display = 'none';
    document.getElementById('dark-overlay').style.display = 'none'; // ปิดฟิล์มดำของเตาอบ

    // โชว์ฉากเซอร์ไพรส์ (ตอนนี้ยังมืดสนิทอยู่เพราะโดน surprise-overlay บัง)
    document.getElementById('surprise-scene').style.display = 'block';

    // อัปเดตกล่องแชทให้ทะลุความมืดขึ้นมา
    const dialogueBox = document.getElementById('dialogue-box');
    dialogueBox.style.zIndex = '100006'; 
    dialogueBox.innerText = ". . ."; // ใส่จุดไข่ปลาให้ฟีลเหมือนกำลังสะลึมสะลือ

    // สั่งให้ค่อยๆ ลืมตา (เฟดความมืดออก) หลังฉากโหลด 0.1 วิ
    setTimeout(() => {
        document.getElementById('surprise-overlay').classList.add('lights-on');
        
        // รอจนกว่าจะสว่างเต็มที่ (2.5 วินาที) ค่อยขึ้นข้อความเซอร์ไพรส์
        setTimeout(() => {
            playSFX('sfx-party');
            dialogueBox.innerText = "Happy Birthday Aji!";
        }, 2500);

    }, 100);
}

// ควบคุมการคลิกหน้าจอในฉากเซอร์ไพรส์
document.addEventListener('click', (e) => {
    // เช็คว่าฉากเซอร์ไพรส์เปิดอยู่ไหม
    if (document.getElementById('surprise-scene').style.display === 'block') {
        playSFX('sfx-click');
        const dialogueBox = document.getElementById('dialogue-box');
        const letterItem = document.getElementById('letter-item');

        if (surpriseStep === 0) {
            dialogueBox.innerText = "Make a wish... ✨";
            surpriseStep = 1;
        } 
        else if (surpriseStep === 1) {
            dialogueBox.innerText = "(Blow into your microphone to blow out the candles!) 🌬️🎂";
            surpriseStep = 2;
            
            if (bgm) bgm.volume = 0.1; // 👈 เพิ่มบรรทัดนี้: หรี่เสียงรอเป่าเทียน
            setupMicrophone(); 
        }
        else if (surpriseStep === 3) {
            dialogueBox.innerText = "I have something for you...";
            surpriseStep = 4;
        } 
        else if (surpriseStep === 4) {
            dialogueBox.innerText = "(Click the letter to read it 💌)";
            letterItem.style.display = 'block'; // โชว์ซองจดหมาย
            surpriseStep = 5;
        } 
        else if (surpriseStep === 7) {
            // จบเกม กลับหน้าแรก
            // *หากไฟล์หน้าแรกคุณชื่ออื่น ให้แก้ตรง index.html นะครับ*
            window.location.href = 'home.html'; 
        }
    }
});

// ควบคุมการคลิกที่ "ตัวจดหมาย" แยกต่างหาก
document.getElementById('letter-item').addEventListener('click', (e) => {
    e.stopPropagation(); // กันไม่ให้ไปโดนคำสั่งคลิกจอของด้านบน
    playSFX('sfx-click');

    const letterItem = document.getElementById('letter-item');
    
    if (surpriseStep === 5) {
        letterItem.src = 'openletter.PNG'; // เปิดซอง
        surpriseStep = 6;
    } 
    else if (surpriseStep === 6) {
        letterItem.src = 'paper.PNG'; // ดึงกระดาษออกมาอ่าน
        letterItem.style.width = '800px'; // ขยายให้อ่านง่าย
        document.getElementById('dialogue-box').innerText = "I love you so much (click here to Home)";
        surpriseStep = 7;
    }
});

// ------------------------------------------
// ระบบไมโครโฟน (ดักจับเสียงเป่า)
// ------------------------------------------
function setupMicrophone() {
    // ขออนุญาตใช้ไมค์ (เบราว์เซอร์จะเด้งถาม Aji)
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            micStream = stream;
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);
            const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

            analyser.smoothingTimeConstant = 0.8;
            analyser.fftSize = 1024;

            microphone.connect(analyser);
            analyser.connect(scriptProcessor);
            scriptProcessor.connect(audioContext.destination);

            scriptProcessor.onaudioprocess = function() {
                const array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                let values = 0;

                const length = array.length;
                for (let i = 0; i < length; i++) {
                    values += (array[i]);
                }

                const average = values / length;
                
                // ถ้าระดับเสียงดังเกิน 40 (มีเสียงลมเป่า) ให้ดับเทียน!
                // *ถ้าเป่ายากไป ให้ลดเลข 40 ลง / ถ้าเป่าง่ายไป ให้เพิ่มเลขครับ*
                if (average > 40) { 
                    blowCandles();
                }
            };
        })
        .catch(function(err) {
            console.error('ไมค์มีปัญหา: ', err);
            // เผื่อไมค์เสีย หรือ Aji ไม่กด Allow ให้คลิกจอเพื่อเป่าแทนได้
            document.getElementById('dialogue-box').innerText = "(Mic not found! Click anywhere to blow the candles!)";
            document.addEventListener('click', function fallbackBlow() {
                if (surpriseStep === 2) blowCandles();
                document.removeEventListener('click', fallbackBlow);
            });
        });
}

function blowCandles() {
    if (surpriseStep !== 2) return; // ทำได้แค่ครั้งเดียว
    
    // ปิดไมค์เพื่อไม่ให้ทำงานค้าง
    if (micStream) micStream.getTracks().forEach(track => track.stop());
    if (audioContext) audioContext.close();

    if (bgm) bgm.volume = 0.4;

    // เปลี่ยนรูปเค้กเป็นเทียนดับ
    document.getElementById('surprise-bg').src = 'afterblowcake.PNG';
    document.getElementById('dialogue-box').innerText = "Yay! Happy Birthday! 🎉 (Click to continue)";
    surpriseStep = 3;
}

// ==========================================
// ฟังก์ชันกลางสำหรับเรียกใช้เสียง SFX
// ==========================================
function playSFX(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0; // รีเซ็ตเสียงให้กลับไปวิที่ 0 เสมอ (กดย้ำได้)
        sound.play();
    }
}