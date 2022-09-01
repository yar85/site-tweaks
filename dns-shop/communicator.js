($ => {
	if (!$ || !($ = String($).trim()).length) return;
	const [$d] = [document];
	window[$] = $ = window[$] ?? Object.assign({}, {
		first: $d.querySelector.bind($d),
		all	 : $d.querySelectorAll.bind($d),
		rnd  : (to, from = 0) => Math.floor(from + Math.random() * (to - from)),
		run  : main,
		cleanup,
		processWidgets,
	});
  if (document.readyState === 'complete') return void main();
  document.addEventListener('readystatechange', () => {
		if (document.readyState !== 'complete') return;
		new Promise(resolve => setTimeout(resolve, 500)).then(main);
  });
  
  function main() {
  	cleanup();
  	processWidgets();
  }
  
  function cleanup(parentEl=$d.body) {
  	for (const el of parentEl.querySelectorAll('.c-items-container'))
  		el.remove();
  }
  function processWidgets(parentEl='#comments') {
  	parentEl = (parentEl instanceof Element) ? parentEl : $.first(String(parentEl));
  	if (!(parentEl instanceof Element)) return;
  	for (const el of parentEl.querySelectorAll('[data-code]')) {
			if (el.children.length) continue;
			const uuid = el.dataset.code,
						category = /-product/i.test(el.dataset.role) ? 'products' : 'configs';
			if (!uuid) continue;
			insertItemsHtml(el, { [category]: [uuid] }, 'afterEnd');
		}
  }
	function insertItemsHtml(el, { products, configs }, position='beforeEnd') {
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
