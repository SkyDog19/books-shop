'use strict';
/*jshint -W097*/

addEventListener("DOMContentLoaded", () => {
    const basket = document.querySelector('.action-header__basket');
    const basketMobile = document.querySelector('.action-menu__basket-mobile');
    const iconMenu = document.querySelector('.icon-menu');
    const menuBody = document.querySelector('.menu__body');
    let activeCategoryIndex = 0;
    const buyBooks = document.querySelector('.buy-books');

    //menu-burger
    if (iconMenu) {
        iconMenu.addEventListener("click", () => {
            document.body.classList.toggle('_lock'); //заблокируем скроллинг страницы при открытом меню бургере
            iconMenu.classList.toggle('_active-icon');
            menuBody.classList.toggle('_active-body');
        });
    }

    //slider
    function sliderStart() {
        let images = [{
            url: 'image/forSlider/banner-1.svg'
        }, {
            url: 'image/forSlider/banner-2.svg'
        }, {
            url: 'image/forSlider/banner-3.svg'
        }];

        const sliderImages = document.querySelector('.swiper-hello-slider'); //родитель для картинок
        const sliderDots = document.querySelector('.swiper-pagination'); //Родитель точек

        let initImages = () => {
            images.forEach((image, index) => {
                let imageDiv = `
                <div data-index="${index}" class="swiper-hello-slider__slide swiper-slide n${index} ${index === 0 ? 'show-slide' : ''}">
                    <div class="swiper-slide__image">
                        <img src="${images[index].url}" alt="Изображение слайдера №${index + 1}">
                    </div>
                </div>
                `;
                sliderImages.innerHTML += imageDiv;
            });
        };

        initImages();

        let sliderMove = (num) => {
            const dotItems = document.querySelectorAll('.swiper-pagination__bullet');
            sliderImages.querySelector('.show-slide').classList.remove('show-slide'); //у элмента с классом show-slide удаляем класс show-slide
            sliderImages.querySelector('.n' + num).classList.add('show-slide'); //элементу, который соответсвует аргументу num, добавляем класс show-slide

            sliderDots.querySelector('.active-dot').classList.remove('active-dot');
            dotItems[num].classList.add('active-dot');
        };

        let initAutoplay = () => {
            let counter = 1;
            setInterval(() => {
                const dotItems = document.querySelectorAll('.swiper-pagination__bullet');
                sliderImages.querySelector('.show-slide').classList.remove('show-slide'); //у элмента с классом show-slide удаляем класс show-slide
                sliderImages.querySelector('.n' + counter).classList.add('show-slide'); //элементу, который соответсвует аргументу num, добавляем класс show-slide

                sliderDots.querySelector('.active-dot').classList.remove('active-dot');
                dotItems[counter].classList.add('active-dot');
                counter++;
                if (counter > images.length - 1) {
                    counter = 0;
                }

            }, 5000);
        };

        initAutoplay();

        let initDotsTitles = () => {
            images.forEach((image, index) => {
                let dot = `<button data-index=${index} class="swiper-pagination__bullet dot-bullet ${index === 0 ? 'active-dot' : ''}"></button>`;
                sliderDots.innerHTML += dot;
            });

            document.querySelectorAll('.dot-bullet').forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    document.querySelectorAll('.active-dot').forEach((dot, index) => {
                        dot.classList.remove('active-dot');
                    });
                    dot.classList.add('active-dot');
                    sliderMove(index);
                });
            });
        };

        initDotsTitles();

    }

    sliderStart();

    //===========google-books====================
    function load() {
        const div = document.createElement('div');
        div.setAttribute('id', 'loading-indicator');
        buyBooks.append(div);
    }

    function setRatingActiveWidth(index) { //функция для генерации количества px для звезд
        const ratingActiveWidth = index * 15;
        return `${ratingActiveWidth}`;
    }

    function initBooksHtml(data) { //генерирует html структуру, данные в которые будут получены из объекта data
        load();
        buyBooks.innerHTML = '';

        data.items.forEach((item, index) => {
            let srcImage = `
                <div class="buy-books__item">
                <div class="buy-books__image">
                    <img src="${item.volumeInfo.imageLinks.thumbnail ? item.volumeInfo.imageLinks.thumbnail : 'image/question.jpg'}" alt="${item.volumeInfo.title}">
                </div>
                <div class="buy-books__body">
                    <p class="buy-books__author">${item.volumeInfo.authors ? data.items[0].volumeInfo.authors : 'Authors are absent'}</p>
                    <h2 class="buy-books__title">${item.volumeInfo.title ? data.items[0].volumeInfo.title : 'Title is absent'}</h2>
                    ${
                    item.volumeInfo.averageRating && item.volumeInfo.ratingsCount ? `<div class="buy-books__rating">
                        <div class="buy-books__estimation">
                        <div class="buy-books__reviews star-rating">
                            <div class="star-rating__active" style="width: ${setRatingActiveWidth(item.volumeInfo.averageRating)}px;"></div>
                            <div class="star-rating__items">
                            <input type="radio" class="star-rating__item" value="1" name="rating">
                            <input type="radio" class="star-rating__item" value="2" name="rating">
                            <input type="radio" class="star-rating__item" value="3" name="rating">
                            <input type="radio" class="star-rating__item" value="4" name="rating">
                            <input type="radio" class="star-rating__item" value="5" name="rating">
                            </div>
                        </div>
                        </div>
        
                        <div class="buy-books__reviews">${item.volumeInfo.ratingsCount} reviews</div>
                    </div>` : ''
                    }
    
                    <div class="buy-books__general-info">
                    ${
                        item.volumeInfo.description ? `
                        <div class="buy-books__description">
                            <p>
                            ${item.volumeInfo.description}
                            </p>
                        </div>
                        ` : ''
                        }
            
                        ${
                        item.saleInfo.retailPrice?.amount ? `
                        <div class="buy-books__price">
                            <p>$${item.saleInfo.retailPrice?.amount || ''}</p>
                        </div>
                        ` : ''
                        }
                        <button class="buy-books__in-the-cart">buy now</button>
                    </div>
                </div>
                </div>
            `;
            buyBooks.innerHTML += srcImage;
        });

        const btnBasket = document.querySelectorAll('.buy-books__in-the-cart');

        let count = localStorage.getItem('cartCount') || 0;
        btnBasket.forEach(btn => {
            basket.innerHTML = `<p class="circle-qt">${count}</p>`;
            basketMobile.innerHTML = `<p class="circle-qt-mobile">${count}</p>`;
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                count++;
                localStorage.setItem('cartCount', count);
                basket.innerHTML = `<p class="circle-qt">${count}</p>`;
                basketMobile.innerHTML = `<p class="circle-qt-mobile">${count}</p>`;
            });
        });

    }



    async function initBooks() {
        const categoryArray = ['Architecture', 'Art & Fashion', 'Biography', 'Business', 'Crafts & Hobbies', 'Drama', 'Fiction', 'Food & Drink', 'Health & Wellbeing', 'History & Politics', 'Humor', 'Poetry', 'Psychology', 'Science', 'Technology', 'Travel & Maps'];
        let categoryDiv = document.querySelector('.category-shop__list'); //родитель для ссылок


        categoryArray.forEach((item, index) => { //создаём ссылки
            let link = `<li><button class="category-shop__press">${item}</button></li>`;
            categoryDiv.innerHTML += link;
        });

        const categoryLinks = document.querySelectorAll('.category-shop__press');

        const btnLoadMore = document.querySelector('.load-more__press');
        let nextPage = 0; // Номер следующей страницы для загрузки
        const pageSize = 6; // Количество элементов, загружаемых за один раз

        async function fetchBooks() { //генерируем объект по умолчанию при заходе на страницу
            try {
                const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=%27%27+subject=Architecture&startIndex=${nextPage}&maxResults=${pageSize}`);
                const data = await response.json();
                categoryLinks[0].classList.add('category-active');
                initBooksHtml(data);

                if (data.length < pageSize) {
                    btnLoadMore.style.display = 'none'; // Скрываем кнопку "Загрузить еще"
                } else {
                    nextPage++; // Увеличиваем номер следующей страницы для загрузки
                }

            } catch {
                buyBooks.innerHTML = `<div class="mistake-api"><p>Произошла ошибка!</p></div>`;
            }
        }

        fetchBooks();

        async function clickLinks() { //меняем активную ссылку и получаем данные из другой категории2
            categoryLinks.forEach((item, index) => {
                item.addEventListener('click', async (e) => {
                    e.preventDefault();
                    activeCategoryIndex = index;
                    load();
                    categoryLinks.forEach((link) => {
                        if (link !== Event.target) {
                            link.classList.remove('category-active'); //удаляем активный класс с прошлой(любой) ссылки
                        }
                    });
                    item.classList.add('category-active'); //добавляем активный класс на ссылку, на которую кликнули
                    try {
                        const response = await fetch( //создаём запрос на конкретную категорию на сервере
                            `https://www.googleapis.com/books/v1/volumes?q=%27%27+subject=${categoryArray[index]}&startIndex=${nextPage}&maxResults=${pageSize}`
                        );
                        const data = await response.json(); //превращаем полученный объект в js
                        if (data.length < pageSize) {
                            btnLoadMore.style.display = 'none'; // Скрываем кнопку "Загрузить еще"
                        } else {
                            nextPage++; // Увеличиваем номер следующей страницы для загрузки
                        }

                        initBooksHtml(data); //добоавляем полученный объект в функцию, генерирующую html код
                    } catch (error) {
                        buyBooks.innerHTML = `<div class="mistake-api"><p>Произошла ошибка!</p></div>`;
                    }
                });
            });
        }



        btnLoadMore.addEventListener('click', (e) => {
            btnLoadMore.classList.add('animation-load-more');
            let newPageSize = pageSize + 6;
            e.preventDefault();
            try {
                fetch(`https://www.googleapis.com/books/v1/volumes?q=%27%27+subject=${categoryArray[activeCategoryIndex]}&startIndex=${nextPage}&maxResults=${newPageSize}`).then(response => response.json())
                    .then(data => {
                        btnLoadMore.classList.remove('animation-load-more');
                        initBooksHtml(data);
                        if (data.length < newPageSize) {
                            btnLoadMore.style.display = 'none'; // Скрываем кнопку "Загрузить еще"
                        }
                    });

            } catch {
                buyBooks.innerHTML = `<div class="mistake-api"><p>Произошла ошибка!</p></div>`;
            }
        });


        clickLinks();
    }
    initBooks();



});