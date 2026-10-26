/* МяуМаркет — логика модального окна заявки */

document.addEventListener('DOMContentLoaded', function () {

  var modal = document.getElementById('orderModal');
  var form = document.getElementById('quickOrderForm');
  var success = document.getElementById('orderSuccess');
  var error = document.getElementById('productsError');
  var counter = document.getElementById('productsCount');

  if (!modal || !form) return;

  /* Все чекбоксы товаров */
  var boxes = form.querySelectorAll('input[name="products"]');

  /* Пересчитать, сколько товаров отмечено */
  function countChecked() {
    var n = 0;
    boxes.forEach(function (box) {
      if (box.checked) n++;
    });
    return n;
  }

  function updateCounter() {
    var n = countChecked();
    counter.textContent = 'Выбрано товаров: ' + n;
    if (n > 0) {
      error.classList.add('d-none');
    }
  }

  boxes.forEach(function (box) {
    box.addEventListener('change', updateCounter);
  });

  /* 1. Открыли окно кнопкой «Заказать» — отмечаем этот товар */
  modal.addEventListener('show.bs.modal', function (event) {
    var button = event.relatedTarget;
    if (!button) return;

    var product = button.getAttribute('data-product');
    if (!product) return;

    boxes.forEach(function (box) {
      if (box.value === product) {
        box.checked = true;
      }
    });
    updateCounter();
  });

  /* 2. Отправка формы */
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var formOk = form.checkValidity();
    var productsOk = countChecked() > 0;

    /* Чекбоксы одной группой браузер проверять не умеет — делаем вручную */
    if (!productsOk) {
      error.classList.remove('d-none');
    }

    if (!formOk || !productsOk) {
      form.classList.add('was-validated');
      return;
    }

    form.classList.remove('was-validated');
    success.classList.remove('d-none');
    form.reset();
    updateCounter();
  });

  /* 3. Кнопка «Очистить» — сбрасываем и подсветку, и счётчик */
  form.addEventListener('reset', function () {
    form.classList.remove('was-validated');
    success.classList.add('d-none');
    error.classList.add('d-none');
    setTimeout(updateCounter, 0);
  });

});