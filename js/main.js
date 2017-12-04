/**!
 * Alison and Daniel site
 * Copyright 2017 Daniel Lo Nigro (https://dan.cx/)
 */

(function() {
  const PARALLAX_START = 30;
  const PARALLAX_MAX = 150;

  const requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    // This should really debounce, but it's Good Enough for now.
    (fn => window.setTimeout(fn, 1000 / 60));

  // Parallax header image
  function initParallax() {
    const heroEl = document.querySelector('.hero');
    if (!heroEl) {
      return;
    }

    const navHeight = document.querySelector('.main-nav').offsetHeight;

    function updateParallax() {
      const bodyScrollTop = -document.body.getBoundingClientRect().top;
      const offset = Math.min(
        PARALLAX_START + (bodyScrollTop / heroEl.scrollHeight * (PARALLAX_MAX - PARALLAX_START)),
        PARALLAX_MAX
      );
      heroEl.style.backgroundPositionY = offset + '%';

      const heroBottom = heroEl.getBoundingClientRect().bottom;
      if (heroBottom < navHeight) {
        document.body.classList.add('hero-nearly-offscreen');
        if (heroBottom > 0) {
          document.body.classList.remove('hero-offscreen');
        } else {
          document.body.classList.add('hero-offscreen');
        }
      } else {
        document.body.classList.remove('hero-nearly-offscreen');
      }
    }

    document.addEventListener('scroll', () => {
      requestAnimationFrame(updateParallax);
    });
    updateParallax();
  }

  // Countdown
  function showCountdown() {
    const MS_PER_SEC = 1000;
    const SEC_PER_MINUTE = 60;
    const SEC_PER_HOUR = 3600;
    const SEC_PER_DAY = 86400;

    const weddingDate = Date.parse(document.querySelector('.wedding-date').getAttribute('datetime'));
    const $daysEl = document.querySelector('.days .count');
    const $hoursEl = document.querySelector('.hours .count');
    const $minutesEl = document.querySelector('.minutes .count');
    const $secondsEl = document.querySelector('.seconds .count');

    function updateCountdown() {
      let dateDiff = (weddingDate - Date.now()) / MS_PER_SEC;
      if (dateDiff < 0) {
        return;
      }

      const days = Math.floor(dateDiff / SEC_PER_DAY);
      dateDiff %= SEC_PER_DAY;
      const hours = Math.floor(dateDiff / SEC_PER_HOUR);
      dateDiff %= SEC_PER_HOUR;
      const minutes = Math.floor(dateDiff / SEC_PER_MINUTE);
      dateDiff %= SEC_PER_MINUTE;
      const seconds = Math.floor(dateDiff);

      $daysEl.textContent = days;
      $hoursEl.textContent = hours;
      $minutesEl.textContent = minutes;
      $secondsEl.textContent = seconds;
    }
    updateCountdown();
    window.setInterval(updateCountdown, 1000);
  }

  function showEmails() {
    // 'mailto:foo'.split('').map(char => '%' + char.charCodeAt(0).toString(16)).join('')
    document.getElementById('alison-email').href = unescape('%6d%61%69%6c%74%6f%3a%61%6c%69%73%6f%6e%76%69%63%74%6f%72%69%61%79%6f%75%73%73%65%66%40%67%6d%61%69%6c%2e%63%6f%6d');
    document.getElementById('daniel-email').href = unescape('%6d%61%69%6c%74%6f%3a%77%65%64%64%69%6e%67%40%64%61%6e%2e%63%78');
  }

  initParallax();
  showCountdown();
  showEmails();
}());
