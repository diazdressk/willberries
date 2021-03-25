const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

//cart
const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');

const openModal = () => {
	modalCart.classList.add('show');
};

const closeModal = () => {
	modalCart.classList.remove('show');
};

buttonCart.addEventListener('click', openModal);
modalCart.addEventListener('click', e => {
	const target = e.target;
	if (target.classList.contains('modal-close') || target === modalCart) {
		closeModal();
	}
});


//scroll
// (function() {//скроллер
// 	const  scrollLinks = document.querySelectorAll('a.scroll-link');//все ссылки с классом

// 	for (let i = 0; i < scrollLinks.length; i += 1) {
// 		scrollLinks[i].addEventListener('click', e => {
// 			e.preventDefault();
// 			const id = scrollLinks[i].getAttribute('href');//#body
// 			document.querySelector(id).scrollIntoView({
// 				behavior: "smooth",
// 				block: 'start',
// 			})
// 		});
// 	}
// })()


// {//новый способ самовызывающейся функции
// 	const  scrollLinks = document.querySelectorAll('a.scroll-link');//все ссылки с классом

// 	for (let i = 0; i < scrollLinks.length; i += 1) {
// 		scrollLinks[i].addEventListener('click', e => {
// 			e.preventDefault();
// 			const id = scrollLinks[i].getAttribute('href');//#body
// 			document.querySelector(id).scrollIntoView({
// 				behavior: "smooth",
// 				block: 'start',
// 			})
// 		});
// 	}
// }

// 2
{
	const  scrollLinks = document.querySelectorAll('a.scroll-link');//все ссылки с классом

	for (const scrollLink of scrollLinks) {
		scrollLink.addEventListener('click', e => {
			e.preventDefault();
			const id = scrollLink.getAttribute('href');//#body
			document.querySelector(id).scrollIntoView({
				behavior: "smooth",
				block: 'start',
			})
		});
	}
}



//view all, goods
const viewAll = document.querySelectorAll('.view-all');
const navigationLink = document.querySelectorAll('.navigation-link:not(.view-all)');// исключение, чтобы элементы с этим классом   	.view-all не попадали в querySelectorAll
const longGoodsList = document.querySelector('.long-goods-list');//скрыт



//получать товары с сервера
const getGoods = async function() {
	const res = await fetch('db/db.json');
	if (!res.ok) {
		throw 'Ошибка' + res.status;
	}
	return await res.json();
}

// fetch('db/db.json')
// 	.then(response => {
// 		return response.json();
// 	})
// 	.then(data => {
// 		console.log(data);
// 	})

const createCard = (objCard) => {//создаю карточку
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';
	console.log(objCard)
	card.innerHTML = `
		<div class="goods-card">
			${objCard.label ? `<span class="label">${objCard.label}</span>` : ''}
			<img src="db/${objCard.img}" alt="${objCard.name}" class="goods-image">
			<h3 class="goods-title">${objCard.name}</h3>
			<p class="goods-description">${objCard.description}</p>
			<button class="button goods-card-btn add-to-cart" data-id="${objCard.id}">
				<span class="button-price">${objCard.price}</span>
			</button>
		</div>
	`;
	return card;
};

//показывает карточку
const renderCards = function (data) {
	longGoodsList.textContent = '';
	const cards = data.map(createCard);//каждый пришедший элемент из даты забираю и отдаю её функции, он создаст карточку с данными
	cards.forEach(card => {//либо форичем
		longGoodsList.append(card);
	})
	// longGoodsList.append(...cards);//либо спред оператором апендю
	document.body.classList.add('show-goods');
};

const showAll = (e) => {
	e.preventDefault();
	getGoods().then(renderCards);
};

viewAll.forEach(function(elem) {
	elem.addEventListener('click', showAll);
})



//фильтр одежды
const filterCards = (field, value) => {
	getGoods()
		.then(function (data) {
			const filteredGoods = data.filter(function(good) {
				return good[field] === value;
			});
			return filteredGoods;
		})
		.then(renderCards);
};

navigationLink.forEach(link => {
	link.addEventListener('click', e => { 
		e.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		filterCards(field, value);
	});
});

