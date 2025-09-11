window.addEventListener("load", () => {
    const feedbackDialog = document.getElementById("feedback-dialog");
    const feedbackForm = document.querySelector(".feedback-form");
    const feedbackBtn = document.getElementById("feedback");
    const feedbackCloseBtn = document.getElementById("feedback-close");

    feedbackBtn.addEventListener("click", () => {
        feedbackDialog.showModal();
    });

    feedbackCloseBtn.addEventListener("click", () => {
        feedbackDialog.close();
    });

    feedbackForm.addEventListener("submit", (e) => {
        // 1) Сброс кастомных сообщений
        [...feedbackForm.elements].forEach((el) => el.setCustomValidity?.(""));
        // 2) Проверка встроенных ограничений
        if (!feedbackForm.checkValidity()) {
            e.preventDefault();
            // Пример: таргетированное сообщение
            const email = feedbackForm.elements.email;
            if (email?.validity.typeMismatch) {
                email.setCustomValidity(
                    "Введите корректный e-mail, например name@example.com"
                );
            }
            feedbackForm.reportValidity(); // показать браузерные подсказки
            // A11y: подсветка проблемных полей
            [...feedbackForm.elements].forEach((el) => {
                if (el.willValidate)
                    el.toggleAttribute("aria-invalid", !el.checkValidity());
            });
            return;
        }
        // 3) Успешная «отправка» (без сервера)
        e.preventDefault();
        // Если форма внутри <dialog>, закрываем окно:
        feedbackDialog.close("success");
        feedbackDialog.reset();
    });
});
