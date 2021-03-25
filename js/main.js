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
//view all, goods
const viewAll = document.querySelectorAll('.view-all');
const navigationLink = document.querySelectorAll('.navigation-link:not(.view-all)');// исключение, чтобы элементы с этим классом   	.view-all не попадали в querySelectorAll
const longGoodsList = document.querySelector('.long-goods-list');//скрыт
const showAccessories = document.querySelectorAll('.show-accessories');
const showClothing = document.querySelectorAll('.show-clothing');
const cartTableGoods = document.querySelector('.cart-table__goods');
const cardTableTotal = document.querySelector('.card-table__total');


//получать товары с сервера
const getGoods = async () => {
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



//карточка корзина
const cart = {
	cartGoods: [],
	renderCart() {
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({ id, name, price, count }) => {//таблица корзины
			const trGood = document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;

			trGood.innerHTML = `
				<td>${name}</td>
				<td>${price}$</td>
				<td><button class="cart-btn-minus">-</button></td>
				<td>${count}</td>
				<td><button class="cart-btn-plus">+</button></td>
				<td>${price * count}$</td>
				<td><button class="cart-btn-delete">x</button></td>
			`;
			cartTableGoods.append(trGood);
		});

		const totalPrice = this.cartGoods.reduce((sum, item) => {//общая сумма корзины
			return sum + item.price * item.count;
		}, 0);

		cardTableTotal.textContent = totalPrice + '$';
	},
	deleteGood(id) {
		this.cartGoods = this.cartGoods.filter(item => id !== item.id);
		this.renderCart();
	},
	minusGood(id) {
		for (const item of this.cartGoods) {
			if (item.id === id) {
				if (item.count <= 1) {
					this.deleteGood(id);
				} else {
					item.count -= 1;
				}
				break;
			}
		}
		this.renderCart();
	},
	plusGood(id) {
		for (const item of this.cartGoods) {
			if (item.id === id) {
				item.count += 1;
				break;
			} 
		}
		this.renderCart();
	},
	addCartGoods(id){
		const goodItem = this.cartGoods.find(item => item.id === id);
		if (goodItem) {
			this.plusGood(id);
		} else {
			getGoods()
				.then(data => data.find(item => item.id === id))
				.then(({ id, name, price }) => {
					this.cartGoods.push({
						id,
						name,
						price,
						count: 1,
					});
				});
		}
	},
}

document.body.addEventListener('click', e => {//Добавление в корзину через бади делегированием
	const addToCart = e.target.closest('.add-to-cart');//поднимается до адтукарт,спан и батон вместе
	if (addToCart) {
		cart.addCartGoods(addToCart.dataset.id);
	}
});

cartTableGoods.addEventListener('click', e => {//удалять, изменять колво товаров в корзине
	const target = e.target;
	if (target.tagName === "BUTTON") {
		const id = target.closest('.cart-item').dataset.id;//ищу через родителя
		if (target.classList.contains('cart-btn-delete')) {
			cart.deleteGood(id);
		}
		if (target.classList.contains('cart-btn-minus')) {
			cart.minusGood(id);
		}
		if (target.classList.contains('cart-btn-plus')) {
			cart.plusGood(id);
		}
	}
});

const openModal = () => {
	cart.renderCart();
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
const renderCards = (data) => {
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

viewAll.forEach(elem => {
	elem.addEventListener('click', showAll);
})



//фильтр одежды
const filterCards = (field, value) => {
	getGoods()
		.then(data => data.filter(good => good[field] === value))
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

showAccessories.forEach(item => {
	item.addEventListener('click', e => {
		e.preventDefault();
		filterCards('category', 'Accessories');
	});
});
showClothing.forEach(item => {
	item.addEventListener('click', e => {
		e.preventDefault();
		filterCards('category', 'Clothing');
	});
});
