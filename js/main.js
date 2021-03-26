import './modules/swiper.js';
import './modules/scroll.js';

//cart
const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
//view all, goods
const viewAll = document.querySelectorAll('.view-all');
const navigationLink = document.querySelectorAll('.navigation-link:not(.view-all)');// исключение, чтобы элементы с этим классом   	.view-all не попадали в querySelectorAll
const longGoodsList = document.querySelector('.long-goods-list');
const cartTableGoods = document.querySelector('.cart-table__goods');
const cardTableTotal = document.querySelector('.card-table__total');
const cartCount = document.querySelector('.cart-count');
const buttonClear = document.querySelector('.button-clear');


//получать товары с сервера
const getGoods = async () => {
	const res = await fetch('db/db.json');
	if (!res.ok) {
		throw 'Ошибка' + res.status;
	}
	return await res.json();
}

// корзина
const cart = {
	cartGoods: [],
	cartGoodsCounter() {//колво всех товаров в корзине
		cartCount.textContent = this.cartGoods.reduce((sum, item) => {
			return sum + item.count;
		}, 0);
	},
	clearCart() {
		this.cartGoods.length = 0;
		this.cartGoodsCounter();
		this.renderCart();
	},
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
	deleteGood(id) {//удаление товара из корзины
		this.cartGoods = this.cartGoods.filter(item => id !== item.id);
		this.renderCart();
		this.cartGoodsCounter();
	},
	minusGood(id) {//уменьшение колва товаров
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
		this.cartGoodsCounter();
	},
	plusGood(id) {//увеличение колва товаров
		for (const item of this.cartGoods) {
			if (item.id === id) {
				item.count += 1;
				break;
			} 
		}
		this.renderCart();
		this.cartGoodsCounter();
	},
	addCartGoods(id){//добавление товара
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
					this.cartGoodsCounter();
				});
		}
	},
}

// buttonClear.addEventListener('click', cart.clearCart.bind(cart));//очищение корзины
buttonClear.addEventListener('click', () => {
	cart.clearCart();
});//очищение корзины

document.body.addEventListener('click', e => {//кнопка Добавления в корзину через бади делегированием
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

const createCard = (objCard) => {//создаю карточку
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';
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

const showAll = (e) => {//функция показывания
	e.preventDefault();
	getGoods().then(renderCards);
};

viewAll.forEach(elem => {// All
	elem.addEventListener('click', showAll);
})



//фильтр одежды
const filterCards = (field, value) => {
	getGoods()
		.then(data => data.filter(good => good[field] === value))
		.then(renderCards);
};


navigationLink.forEach(link => {// Womens, Mens
	link.addEventListener('click', e => { 
		e.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		filterCards(field, value);
	});
});



//отправка на сервер
const modalForm = document.querySelector('.modal-form');

const postData = dataUser => fetch('server.php', {
	method: 'POST',
	body: dataUser,
});

modalForm.addEventListener('submit', e => {
	e.preventDefault();
	const formData = new FormData(modalForm);
	formData.append('goods', JSON.stringify(cart.cartGoods));

	postData(formData)
		.then(response => {
			if (!200 || !response.ok) {
				throw new Error(response.status);
			}
			alert('Заказ получен, свяжусь с вами');
		})
		.catch(err => {
			alert('Ошибка');
			console.log(err);
		})
		.finally(() => {
			closeModal();//закрываю корзину
			modalForm.reset();//очищаю форму
			cart.cartGoods.length = 0;//очищаю товары
		})
});