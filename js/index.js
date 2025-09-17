let currentTheme = localStorage.getItem("app-theme") || "dark";
document.documentElement.className = `theme-${currentTheme}`;

window.addEventListener("load", () => {
    document.querySelector(".theme-switcher__icon").src =
        currentTheme == "dark" ? "assets/icons/dark-mode.svg" : "assets/icons/light-mode.svg";
        
    const feedbackDialog = document.getElementById("feedback-dialog");
    const feedbackForm = document.querySelector(".feedback-dialog__form");
    const feedbackBtn = document.getElementById("feedback");
    const feedbackCloseBtn = document.getElementById("feedback-close");

    if (feedbackDialog != null && feedbackForm != null && feedbackBtn != null && feedbackCloseBtn != null) {
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
                    email.setCustomValidity("Введите корректный e-mail, например name@example.com");
                }
                feedbackForm.reportValidity(); // показать браузерные подсказки
                // A11y: подсветка проблемных полей
                [...feedbackForm.elements].forEach((el) => {
                    if (el.willValidate) el.toggleAttribute("aria-invalid", !el.checkValidity());
                });
                return;
            }
            // 3) Успешная «отправка» (без сервера)
            e.preventDefault();
            // Если форма внутри <dialog>, закрываем окно:
            feedbackDialog.close("success");
            feedbackDialog.reset();
        });
    }

    const themeSwitcher = document.getElementById("switch-theme");
    themeSwitcher.addEventListener("click", switchTheme);
});

function switchTheme() {
    currentTheme = currentTheme == "dark" ? "light" : "dark";
    localStorage.setItem("app-theme", currentTheme);
    document.documentElement.className = `theme-${currentTheme}`;

    document.querySelector(".theme-switcher__icon").src =
        currentTheme == "dark" ? "assets/icons/dark-mode.svg" : "assets/icons/light-mode.svg";
}
