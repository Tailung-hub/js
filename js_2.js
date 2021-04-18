// 2. Сделать генерацию корзины динамической: верстка корзины не должна находиться в HTML-структуре. Там должен быть только div, в который будет вставляться корзина, сгенерированная на базе JS:
// 2.1. Пустая корзина должна выводить строку «Корзина пуста»;
// 2.2. Наполненная должна выводить «В корзине: n товаров на сумму m рублей».

const cartItem = {
    render(good) {
        return `<div class="good"> 
                    <div><b>Наименование</b>: ${good.name}</div>
                    <div><b>Цена за шт.</b>: ${good.price}</div>
                    <div><b>Количество</b>: ${good.quanity}</div>
                    <div><b>Стоимость</b>: ${good.quanity * good.price}</div>
                </div>`;
    }
}

const cart = {
    cartListBlock: null,
    cartItem,
    goods: [
        {
            name: 'Процессор',
            price: 2000,
            quanity: 3
        },
        {
            name: 'Мат. плата',
            price: 3000,
            quanity: 4
        },
        {
            name: 'ОЗУ',
            price: 500,
            quanity: 5
        },
        {
            name: 'HDD',
            price: 700,
            quanity: 4
        }

    ],
    init() {
        this.cartListBlock = document.querySelector('.cart-list');
        this.render();
    },
    render() {
        if (this.goods.length) {
            this.goods.forEach(good => {
                this.cartListBlock.insertAdjacentHTML('beforeend', this.cartItem.render(good));
            });
            this.cartListBlock.insertAdjacentHTML('beforeend', `В корзине ${this.goods.length} позиций общей стоимостью ${this.getPrice()}`);
        } else {
            this.cartListBlock.textContent = 'Корзина пуста.';
        }
    },
    getPrice() {
        return this.goods.reduce((totalPrice, cartItem) => totalPrice + cartItem.price * cartItem.quanity, 0);
    },
};

cart.init();