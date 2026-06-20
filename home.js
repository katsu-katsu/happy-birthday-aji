let clickCount = 0;
let isAngry = false;
let isHoveringButton = false; // ตัวแปรเช็คว่าเมาส์ชี้ปุ่มอยู่ไหม

const character = document.getElementById('landing-character');
const btnPlay = document.getElementById('btn-play');
const btnExit = document.getElementById('btn-exit');

// 1. ระบบกระพริบตาอัตโนมัติ
setInterval(() => {
    // จะกระพริบตาก็ต่อเมื่อ ไม่ได้โกรธ และ ไม่ได้ชี้ปุ่มอยู่
    if (!isAngry && !isHoveringButton && character.src.includes('impress.png')) {
        character.src = 'blink.png';
        
        setTimeout(() => {
            if (!isAngry && !isHoveringButton && character.src.includes('blink.png')) {
                character.src = 'impress.png';
            }
        }, 150);
    }
}, 3000); 

// 2. ระบบนับจำนวนครั้งที่โดนจิ้มจนโกรธ
character.addEventListener('click', () => {
    if (isAngry) return;

    clickCount++;

    if (clickCount >= 3) {
        isAngry = true;
        character.src = 'angry.png'; 
        
        setTimeout(() => {
            isAngry = false;
            clickCount = 0; 
            // ถ้าตอนหายโกรธ เมาส์ไม่ได้ชี้ปุ่มอะไรอยู่ ให้กลับเป็นหน้ายิ้ม
            if(!isHoveringButton) character.src = 'impress.png'; 
        }, 3000);
    }
});

// ==========================================
// 3. ระบบปุ่ม Play (ชี้แล้วเป็นหน้า Love)
// ==========================================
btnPlay.addEventListener('mouseenter', () => {
    isHoveringButton = true;
    if (!isAngry) character.src = 'love.png';
});

btnPlay.addEventListener('mouseleave', () => {
    isHoveringButton = false;
    if (!isAngry) character.src = 'impress.png';
});


// ==========================================
// 4. ระบบปุ่ม Exit (ชี้หน้าเศร้า, กดร้องไห้ + Alert)
// ==========================================
btnExit.addEventListener('mouseenter', () => {
    isHoveringButton = true;
    if (!isAngry) character.src = 'sad.png';
});

btnExit.addEventListener('mouseleave', () => {
    isHoveringButton = false;
    if (!isAngry) character.src = 'impress.png';
});

btnExit.addEventListener('click', () => {
    if (!isAngry) character.src = 'cry.png'; // เปลี่ยนเป็นรูปร้องไห้
    
    // หน่วงเวลา 50 มิลลิวินาที ให้คอมพิวเตอร์โหลดรูปร้องไห้เสร็จก่อน ค่อยเด้ง Alert
    setTimeout(() => {
        // ใช้ \n เพื่อขึ้นบรรทัดใหม่ให้เหมือนเป็น หัวข้อ กับ รายละเอียด ครับ
        alert("Don't you enjoy your gift ? T-T\n\nPlease try my game ....");
        
        // พอกด OK ปิด Alert แล้ว เมาส์ยังค้างอยู่ที่ปุ่ม ให้กลับมาเป็นหน้าเศร้า (sad)
        if (!isAngry) character.src = 'sad.png';
    }, 50);
});

// ==========================================
// 5. ระบบกล่องคำพูดวนลูป (Chat Bubble Loop)
// ==========================================
const chatBubble = document.getElementById('chat-bubble');

// ลิสต์รายชื่อรูปภาพที่ต้องการให้วนลูป (เรียงตามที่คุณบอกเป๊ะๆ)
const chatImages = [
    'chat_name.png',
    'chat_ily.png',
    'chat_heart.png',
    'chat_start.png',
    'chat_hm.png',
    'chat_....png' // ชื่อไฟล์มีจุด 4 จุด ตามรูปที่คุณส่งมาครับ
];

let chatIndex = 0;

setInterval(() => {
    // บวกค่าตำแหน่งขึ้นไป 1 เพื่อเปลี่ยนรูปถัดไป
    chatIndex++;
    
    // ถ้าแสดงรูปจนครบแล้ว ให้กลับไปเริ่มรูปแรกใหม่ (วนลูป)
    if (chatIndex >= chatImages.length) {
        chatIndex = 0;
    }
    
    // สั่งเปลี่ยนรูป
    chatBubble.src = chatImages[chatIndex];
    
}, 2000); // 1500 มิลลิวินาที = 1.5 วินาที