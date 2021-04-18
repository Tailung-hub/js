const catalog = {
    catalogBlock: null,
    cart: null,
    list: [
        {
            id_product: 322,
            product_name: 'Процессор',
            price: 2000,
        },
        {
            id_product: 1945,
            product_name: 'Мат. плата',
            price: 3000,
        },
        {
            id_product: 2020,
            product_name: 'ОЗУ',
            price: 500,
        },
        {
            id_product: 998,
            product_name: 'HDD',
            price: 700,
        }
    ],

    /**
     * @param catalogBlockClass
     * @param cart
     */

    init(catalogBlockClass, cart) {
        this.catalogBlock = document.querySelector(`.${catalogBlockClass}`);
        this.cart = cart;
        this.render();
        this.addEventHandlers();
    },

    render() {
        if (this.getCatalogListLength() > 0) {
            this.renderCatalogList();
        } else {
            this.renderEmptyCatalog();
        }
    },

    addEventHandlers() {
        this.catalogBlock.addEventListener('click', event => this.addToBasket(event));
    },

    addToBasket(event) {
        if (!event.target.classList.contains('product__add-to-cart')) return;
        const id_product = +event.target.dataset.id_product;
        this.cart.addToBasket(id_product);
    },

    /** @returns {number} */

    getCatalogListLength() {
        return this.list.length;
    },

    renderCatalogList() {
        this.catalogBlock.innerHTML = '';
        this.list.forEach(item => {
            this.catalogBlock.insertAdjacentHTML('beforeend', this.renderCatalogItem(item));
        });
    },

    /**
     * @param item
     * @returns {string}
     */

    renderCatalogItem(item) {
        return `<div class="product">
                <h3>${item.product_name}</h3>
                <p>${item.price} руб.</p>
                <button class="product__add-to-cart" data-id_product="${item.id_product}">В корзину</button>
            </div>`;
    },

    renderEmptyCatalog() {
        this.catalogBlock.innerHTML = '';
        this.catalogBlock.insertAdjacentHTML('beforeend', `Каталог товаров пуст!`);
    },
};


const cart = {
    cartBlock: null,
    clearCartButton: null,
    catalogList: [],
    goods: [
        {
            id_product: 777,
            product_name: 'Корпус',
            price: 200,
            quantity: 2,
        }
    ],

    /**
     * @param cartBlockClass
     * @param clearCartButton
     * @param catalogList
     */

    init(cartBlockClass, clearCartButton, catalogList) {
        this.cartBlock = document.querySelector(`.${cartBlockClass}`);
        this.clearCartButton = document.querySelector(`.${clearCartButton}`);
        this.catalogList = catalogList;
        this.addEventHandlers();
        this.render();
    },

    addEventHandlers() {
        this.clearCartButton.addEventListener('click', this.dropCart.bind(this));
    },

    dropCart() {
        this.goods = [];
        this.render();
    },

    render() {
        if (this.getCartGoodsLength() > 0) {
            this.renderCartList();
        } else {
            this.renderEmptyCart();
        }
    },

    findProductInCatalog(id_product) {
        return this.catalogList.find(product => product.id_product === id_product);
    },

    addToBasket(id_product) {
        const product = this.findProductInCatalog(id_product);
        if (product) {
            const findInBasket = this.goods.find(({ id_product }) => product.id_product === id_product);
            if (findInBasket) {
                findInBasket.quantity++;
            } else {
                this.goods.push({ ...product, quantity: 1 });
            }
            this.render();
        } else {
            alert('Возникла ошибка добавления.');
        }
    },

    /** @returns {number} */

    getCartGoodsLength() {
        return this.goods.length;
    },

    renderEmptyCart() {
        this.cartBlock.innerHTML = '';
        this.cartBlock.insertAdjacentHTML('beforeend', 'Корзина пуста!');
    },

    renderCartList() {
        this.cartBlock.innerHTML = '';
        this.goods.forEach(item => {
            this.cartBlock.insertAdjacentHTML('beforeend', this.renderCartItem(item));
        });
    },

    /**
     * @param item
     * @returns {string}
     */

    renderCartItem(item) {
        return `<div>
                <h4>${item.product_name}</h4>
                <p>${item.price} у.е.</p>
                <p>${item.quantity} шт.</p>
            </div>`;
    },
};
catalog.init('catalog', cart);
cart.init('cart', 'clear-cart', catalog.list);
