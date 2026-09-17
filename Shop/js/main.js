document.addEventListener('DOMContentLoaded', () => {
    

    const largeCard = document.querySelector('.card-large');
    if(!largeCard) return;

    const track = largeCard.querySelector('.slider-track');
    const dots = largeCard.querySelectorAll('.slider-dots span');

    let currentIndex = 0;
    let autoSlideTimer = null;

    let isDraging = false;
    let startPosX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    function showSlide(index){
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');

        track.style.transition = 'transform 0.3s ease-in-out';

        currentTranslate = -index * 100;
        prevTranslate = currentTranslate;
        track.style.transform = `translateX(${currentTranslate}%)`;

        currentIndex = index;
    }

    function nextSlide(){
        let nextIndex = (currentIndex + 1) % dots.length;
        showSlide(nextIndex);
    }

    function startAutoSlide(){
        autoSlideTimer = setInterval(nextSlide, 3500);
    }

    function resetAutoSlide(){
        clearInterval(autoSlideTimer);
        startAutoSlide();
    }

    function getPositionX(event){
        return event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
    }

    function dragStart(event){
        isDraging = true;
        startPosX = getPositionX(event);

        track.style.transition = 'none';

        clearInterval(autoSlideTimer);
    }

    function dragMove(event){
        if(!isDraging) return;

        const currentPositionX = getPositionX(event);
        const diffX = currentPositionX - startPosX;

        let movedPercent = (diffX / largeCard.offsetWidth) * 100;
        let targetTranslate = prevTranslate + movedPercent;
        const maxTranslate = -(dots.length - 1) * 100;

        if(targetTranslate > 0){
            currentTranslate = targetTranslate * 0.3;
        }else if(targetTranslate < maxTranslate){
            const overflow = targetTranslate - maxTranslate;
            currentTranslate = maxTranslate + (overflow * 0.3);
        }else{
            currentTranslate = targetTranslate;
        }

        track.style.transform = `translateX(${currentTranslate}%)`;
    }

    function dragEnd(){
        if (!isDraging) return;
        isDraging = false;

        const movedBy = currentTranslate - prevTranslate;
        
        if (movedBy < -15 && currentIndex < dots.length - 1){
            currentIndex += 1;
        }else if(movedBy > 15 && currentIndex > 0){
            currentIndex -= 1;
        }

        showSlide(currentIndex);
        resetAutoSlide()
    }


    track.addEventListener('mousedown', dragStart);
    window.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', dragEnd);

    track.addEventListener('touchstart', dragStart);
    window.addEventListener('touchmove', dragMove);
    window.addEventListener('touchend', dragEnd);


    track.querySelectorAll('img').forEach(img =>{
        img.addEventListener('dragstart', (e) => e.preventDefault());
    })

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetAutoSlide();
        });
    });

    startAutoSlide();
});



document.addEventListener('DOMContentLoaded', () => {
    

    const categories = document.querySelector('.categories-section');
    const trackC = categories.querySelector('.categories-list');
    const itemsC = categories.querySelectorAll('.categories-list > a');
    const btnNextC = categories.querySelector('.btn-next');
    const btnPrevC = categories.querySelector('.btn-prev');

    if(!trackC || itemsC.length === 0) return;

    let currentIndex = 0;
    const visibleCount = 6;
    const maxIndex = itemsC.length - visibleCount;

    function updateSlider(){
        if(maxIndex <= 0){
            btnNextC.classList.add('disabled');
            btnPrevC.classList.add('disabled');
            btnNextC.disabled = true;
            btnPrevC.disabled = true;
            return;
        }

        const itemWidth = itemsC[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(trackC).gap) || 24;

        const moveDistance = (itemWidth + gap) * currentIndex;
        trackC.style.transform = `translateX(-${moveDistance}px)`;


        if(currentIndex === 0){
            btnPrevC.classList.add('disabled');
            btnPrevC.disabled = true;
        }else{
            btnPrevC.classList.remove('disabled');
            btnPrevC.disabled = false;
        }

        if(currentIndex >= maxIndex){
            btnNextC.classList.add('disabled');
            btnNextC.disabled = true;
        }else{
            btnNextC.classList.remove('disabled');
            btnNextC.disabled = false;
        }
    }


    btnPrevC.addEventListener('click', () => {
        if(currentIndex > 0){
            currentIndex--;
            updateSlider();
        }
    });

    btnNextC.addEventListener('click', () => {
        if(currentIndex < maxIndex){
            currentIndex++;
            updateSlider();
        }
    });

    window.addEventListener('resize', updateSlider);
    updateSlider();
});


document.addEventListener('DOMContentLoaded', () => {
    
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 5);

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateTimer(){
        const now = new Date();
        const diffT = targetDate - now;

        if(diffT <= 0){
            clearInterval(timerInterval);
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(diffT / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diffT / (1000 * 60 * 60) % 24);
        const minutes = Math.floor(diffT / (1000 * 60) % 60);
        const seconds = Math.floor(diffT / (1000) % 60);

        daysEl.textContent = days < 10 ? '0' + days : days;
        hoursEl.textContent = hours < 10 ? '0' + hours : hours;
        minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
        secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
    }

    const timerInterval = setInterval(updateTimer, 1000);

    updateTimer();
});


document.addEventListener('DOMContentLoaded', () => {
    const feedback = document.querySelector('.feedback-section');
    const trackF = feedback.querySelector('.feedback-grid');
    const cardsF = feedback.querySelectorAll('.feedback-card');
    const btnNextF = feedback.querySelector('.btn-next');
    const btnPrevF = feedback.querySelector('.btn-prev');

    if(!trackF.length === 0) return;

    let currentPage = 0;
    const cardsPerPage = 3;

    const totalPages = Math.ceil(cardsF.length - 3);
    
    function updateFeedbackSlider(){
        const gapF = parseInt(window.getComputedStyle(trackF).gap) || 25;

        const windowWidth = feedback.querySelector('.feedback-window').offsetWidth;
        const moveDistanceF = ((windowWidth / 3) + gapF / 3) * currentPage;

        trackF.style.transform = `translateX(-${moveDistanceF}px)`;

        if(currentPage === 0){
            btnPrevF.classList.add('disabled');
            btnPrevF.disabled = true;
        }else{
            btnPrevF.classList.remove('disabled');
            btnPrevF.disabled = false;
        }

        if(currentPage >= totalPages){
            btnNextF.classList.add('disabled');
            btnNextF.disabled = true;
        }else{
            btnNextF.classList.remove('disabled');
            btnNextF.disabled = false;
        }
    }


    btnNextF.addEventListener('click', () => {
        if(currentPage < totalPages ){
            currentPage++;
            updateFeedbackSlider();
        }
    });

    btnPrevF.addEventListener('click', () => {
        if(currentPage > 0){
            currentPage--;
            updateFeedbackSlider();
        }
    });

    window.addEventListener('resize', updateFeedbackSlider);
    updateFeedbackSlider();
});