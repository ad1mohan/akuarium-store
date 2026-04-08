(function () {
  const heroVideo = document.getElementById('hero-video');

  if (!heroVideo) {
    return;
  }

  const MOBILE_BREAKPOINT = 768;
  let currentSource = '';
  let resizeTimer = null;

  function getSource() {
    return window.innerWidth < MOBILE_BREAKPOINT
      ? './assets/hero/hero-mobile.mp4'
      : './assets/hero/hero-desktop.mp4';
  }

  function updateHeroVideo() {
    const nextSource = getSource();

    if (nextSource === currentSource) {
      return;
    }

    currentSource = nextSource;
    heroVideo.src = nextSource;
    heroVideo.load();

    const playPromise = heroVideo.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        return null;
      });
    }
  }

  function debounceUpdate() {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(updateHeroVideo, 180);
  }

  updateHeroVideo();
  window.addEventListener('resize', debounceUpdate);
}());
