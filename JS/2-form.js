// Глобальний об’єкт formData
let formData = {
    email: "",
    message: "",
};

const STORAGE_KEY = "feedback-form-state";
const form = document.querySelector(".feedback-form");
const emailInput = form.elements.email;
const messageInput = form.elements.message;

// Відновлення даних із localStorage при завантаженні
const savedData = localStorage.getItem(STORAGE_KEY);

if (savedData) {
    try {
        const parsed = JSON.parse(savedData);

        formData.email = parsed.email || "";
        formData.message = parsed.message || "";

        emailInput.value = formData.email;
        messageInput.value = formData.message;
    } catch (error) {
        console.error("Помилка читання localStorage:", error);
    }
}

// Делегування події "input"
form.addEventListener("input", (event) => {
    const field = event.target.name;
    const value = event.target.value.trim();

    formData[field] = value;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
});

// Сабміт форми
form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (formData.email === "" || formData.message === "") {
        alert("Fill please all fields");
        return;
    }

    console.log("Submitted data:", formData);

    // Очищення
    localStorage.removeItem(STORAGE_KEY);

    formData.email = "";
    formData.message = "";

    form.reset();
});
