(function () {
  const container = document.getElementById('article-grid');

  if (!container) {
    return;
  }

  fetch('./data/articles.json')
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Failed to load articles');
      }
      return response.json();
    })
    .then(function (articles) {
      if (!articles.length) {
        container.innerHTML = '<p class="empty-state">No articles available right now.</p>';
        return;
      }

      container.innerHTML = articles.map(function (article) {
        return `
          <article class="article-card fade-in">
            <h3>${article.title}</h3>
            <p>${article.description}</p>
            <a class="btn-secondary" href="#">Read More</a>
          </article>
        `;
      }).join('');
    })
    .catch(function () {
      container.innerHTML = '<p class="empty-state">Unable to load articles right now.</p>';
    });
}());
