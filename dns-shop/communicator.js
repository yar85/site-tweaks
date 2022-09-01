($ => {
  if (!$ || !($ = String($).trim()).length) return;
  const [$d] = [document];
  window[$] = $ = window[$] ?? {
    first: $d.querySelector.bind($d),
    all  : $d.querySelectorAll.bind($d),
    rnd  : (to, from = 0) => Math.floor(from + Math.random() * (to - from)),
    run  : main,
    cleanup,
    processTopic,
    processWidgets,
  };
  if (document.readyState === 'complete') return void main();
  document.addEventListener('readystatechange', () => {
    if (document.readyState !== 'complete') return;
    new Promise(resolve => setTimeout(resolve, 1000)).then(main);
  });
  
  function main() {
    cleanup();
    processTopic();
    processWidgets();
  }
  
  function cleanup(parentEl=$d.body) {
    for (const el of parentEl.querySelectorAll('.c-items-container, script.ysts:not(:last-child)'))
      el.remove();
  }
  function processTopic() {
    if ($.first('.theme-page__theme + .mentioned-products .mentioned-products__item')) return;
    const { description='', products=[] } = (window.__NUXT__?.state.communicatorStore?.themeData ?? {}),
          configs = description.match(/(?<=\[rsu\])[^[]+/gi) ?? [];
    const configsCntnrEl = insertItemsHtml($.first('.theme-page__theme'), { configs }, 'afterEnd');
    configsCntnrEl?.insertAdjacentHTML('afterEnd', `
      <div class="c-items-container mentioned-products theme-page__mentioned-products">
        <ul class="mentioned-products__list" style="margin: 0; gap: 0 3rem;">${
          products.map(itm => `
            <li class="mentioned-products__item">
              <div>
                <a href="${itm.shopUrl}" rel="noopener nofollow" target="_blank" class="mentioned-product__link none-decoration">
                  <div class="mentioned-product__content">
                    <div class="mentioned-product__top-row" style="align-items: center;">
                      <h5 class="mentioned-product__title">${itm.title}</h5>
                      <div class="mentioned-product__img-wrapper">
                        <img src="${itm.imageUrl}" alt="Изображение товара" title="${itm.title}" class="mentioned-product__img">
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </li>
          `).join('')
        }</ul>
      </div>
    `);
    return configsCntnrEl ?? null;
  }
  function processWidgets(parentEl='#comments') {
    parentEl = (parentEl instanceof Element) ? parentEl : $.first(String(parentEl));
    if (!(parentEl instanceof Element)) return null;
    for (const el of parentEl.querySelectorAll('[data-code]')) {
      if (el.children.length) continue;
      const uuid = el.dataset.code,
            category = /-product/i.test(el.dataset.role) ? 'products' : 'configs';
      if (!uuid) continue;
      insertItemsHtml(el, { [category]: [uuid] }, 'afterEnd');
    }
    return parentEl;
  }
  function insertItemsHtml(el, { products, configs }, position='beforeEnd') {
    if (!(el instanceof Element)) return null;
    ([products, configs] = [products, configs].map(v => Array.isArray(v) ? v : []));
    el.insertAdjacentHTML(position, `
      <div class="c-items-container small" style="display: flex; flex-flow: row wrap; justify-content: center; margin: 2rem 0 0.5rem;">
        ${products.map((uuid, i) => `
          <a class="btn_simple-white is-product" href="//www.dns-shop.ru/product/${uuid}" target="_blank" title="${uuid}" style="margin: 0 0.5em 1em;">Товар${!i ? '' : ` ${i + 1}`}</a>
        `).join('')}
        ${configs.map((uuid, i) => `
          <a class="btn_simple-white is-config" href="//www.dns-shop.ru/custompc/user-pc/configuration/${uuid}" target="_blank" title="${uuid}" style="margin: 0 0.5em 1em;">Сборка${!i ? '' : ` ${i + 1}`}</a>
        `).join('')}
      </div>
    `);
    return el;
  }
})('__ywt_dns-club');
