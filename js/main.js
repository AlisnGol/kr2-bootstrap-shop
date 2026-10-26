/* ==========================================================================
   МяуМаркет — собственный скрипт поверх Bootstrap

   Bootstrap сам отвечает за открытие модалки, гармошку, вкладки и карусель —
   всё это работает через data-bs-* атрибуты, без нашего кода.
   Здесь только то, чего во фреймворке нет:
     1) подстановка товара в заявку по кнопке «Заказать»;
     2) проверка группы чекбоксов «выбран хотя бы один товар»;
     3) показ сообщения об успехе вместо перезагрузки страницы.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* --------------------------------------------------------------------
     Общая настройка формы заявки.
     Одна и та же логика нужна и в модальном окне, и на странице order.html,
     поэтому вынесена в функцию, а не продублирована дважды.
     -------------------------------------------------------------------- */
  function setupOrderForm(formId, successId, errorId, counterId) {

    var form = document.getElementById(formId);
    if (!form) return null;                 // этой формы на странице нет

    var success = document.getElementById(successId);
    var error = document.getElementById(errorId);
    var counter = document.getElementById(counterId);
    var boxes = form.querySelectorAll('input[name="products"]');

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
      if (n > 0) error.classList.add('d-none');
    }

    boxes.forEach(function (box) {
      box.addEventListener('change', updateCounter);
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();               // не перезагружаем страницу: бэкенда нет

      var fieldsOk = form.checkValidity();   // это за нас проверяет браузер
      var productsOk = countChecked() > 0;   // а это приходится вручную

      if (!productsOk) error.classList.remove('d-none');

      if (!fieldsOk || !productsOk) {
        form.classList.add('was-validated');  // Bootstrap подсветит проблемные поля
        return;
      }

      form.classList.remove('was-validated');
      success.classList.remove('d-none');
      form.reset();
      updateCounter();
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    form.addEventListener('reset', function () {
      form.classList.remove('was-validated');
      success.classList.add('d-none');
      error.classList.add('d-none');
      setTimeout(updateCounter, 0);          // ждём, пока браузер очистит поля
    });

    return { form: form, boxes: boxes, update: updateCounter };
  }

  /* Форма в модальном окне — есть на всех страницах */
  var quick = setupOrderForm('quickOrderForm', 'orderSuccess', 'productsError', 'productsCount');

  /* Форма на странице order.html — только там */
  setupOrderForm('orderPageForm', 'orderPageSuccess', 'orderPageError', 'orderPageCount');

  /* --------------------------------------------------------------------
     Открыли модалку кнопкой «Заказать» — отмечаем в ней нужный товар.
     show.bs.modal — событие Bootstrap, relatedTarget это та самая кнопка.
     Отметки не сбрасываются, поэтому в одну заявку можно набрать
     несколько товаров, открывая окно с разных карточек.
     -------------------------------------------------------------------- */
  var modal = document.getElementById('orderModal');

  if (modal && quick) {
    modal.addEventListener('show.bs.modal', function (event) {
      var button = event.relatedTarget;
      if (!button) return;                  // окно открыли кнопкой «Быстрый заказ»

      var product = button.getAttribute('data-product');
      if (!product) return;

      quick.boxes.forEach(function (box) {
        if (box.value === product) box.checked = true;
      });
      quick.update();
    });
  }

});
