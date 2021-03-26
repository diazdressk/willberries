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