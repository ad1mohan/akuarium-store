(function () {
  const container = document.getElementById('video-grid');

  if (!container) {
    return;
  }

  fetch('./data/videos.json')
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Failed to load videos');
      }
      return response.json();
    })
    .then(function (videos) {
      if (!videos.length) {
        container.innerHTML = '<p class="empty-state">No videos available right now.</p>';
        return;
      }

      container.innerHTML = videos.map(function (video) {
        return `
          <article class="video-card fade-in">
            <iframe
              src="https://www.youtube.com/embed/${video.youtubeId}"
              title="${video.title}"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
            <div class="video-card-body">
              <h3>${video.title}</h3>
            </div>
          </article>
        `;
      }).join('');
    })
    .catch(function () {
      container.innerHTML = '<p class="empty-state">Unable to load videos right now.</p>';
    });
}());
