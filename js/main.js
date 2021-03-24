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
const modalClose = document.querySelector('.modal-close');
const overlay = document.querySelector('.overlay');

const openModal = function() {
	modalCart.classList.add('show');
};

const closeModal = function() {
	modalCart.classList.remove('show');
};

buttonCart.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);

overlay.addEventListener('click', (e) => {
	const target = e.target;
	if (target.classList.contains('modal-close') || target === overlay) {
		closeModal();
	}
});


//scroll

// (function() {//скроллер
// 	const  scrollLinks = document.querySelectorAll('a.scroll-link');//все ссылки с классом

// 	for (let i = 0; i < scrollLinks.length; i += 1) {
// 		scrollLinks[i].addEventListener('click', (e) => {
// 			e.preventDefault();
// 			const id = scrollLinks[i].getAttribute('href');//#body
// 			document.querySelector(id).scrollIntoView({
// 				behavior: "smooth",
// 				block: 'start',
// 			})
// 		});
// 	}
// })()


{//новый способ самовызывающейся функции
	const  scrollLinks = document.querySelectorAll('a.scroll-link');//все ссылки с классом

	for (let i = 0; i < scrollLinks.length; i += 1) {
		scrollLinks[i].addEventListener('click', (e) => {
			e.preventDefault();
			const id = scrollLinks[i].getAttribute('href');//#body
			document.querySelector(id).scrollIntoView({
				behavior: "smooth",
				block: 'start',
			})
		});
	}
}