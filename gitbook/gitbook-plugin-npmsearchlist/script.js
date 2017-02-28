const get = query => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();

  xhr.open('GET', `https://api.npms.io/v2/search?q=${query}`);
  xhr.addEventListener('load', () => {
    try {
      resolve(JSON.parse(xhr.responseText));
    } catch (ex) {
      reject(ex);
    }
  });

  xhr.send();
});

require(['gitbook'], (gitbook) => {
  gitbook.events.bind('page.change', () => {
    [...document.querySelectorAll('.npmsearchlist')].map(el => {
      const query = el.getAttribute('data-query');

      get(query)
        .then(({ results }) => (
          `<div>
            <h2>${results.length} packages found</h2>
            <hr />
            <ul>
              ${results.map(({ package }) => (`
                <li>
                  <h3>
                    <a class="package-name" href="${package.links.npm}">${package.name}</a>
                    <a class="author-name" href="https://www.npmjs.com/~${package.author.username}">${package.author.username}</a>
                  </h3>
                  <p class="description">${package.description}</p>
                  <p class="stats">
                    <span class="version">v${package.version}</span>
                  </p>
                </li>
              `)).join('')}
            </ul>
          </div>`
        ))
        .then(markup => el.innerHTML = markup);
    });
  });
});
