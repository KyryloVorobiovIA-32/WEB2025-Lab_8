const input = document.querySelector("#datetime-picker");
const startBtn = document.querySelector("[data-start]");

const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let timerId = null;

// Flatpickr initialization
flatpickr(input, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,

    onClose(selectedDates) {
        const pickedDate = selectedDates[0];

        if (pickedDate <= new Date()) {
            iziToast.error({
                message: "Please choose a date in the future",
                position: "topRight",
            });
            startBtn.disabled = true;
            userSelectedDate = null;
            return;
        }

        userSelectedDate = pickedDate;
        startBtn.disabled = false;
    },
});

// Start button click
startBtn.addEventListener("click", () => {
    if (!userSelectedDate) return;

    startBtn.disabled = true;
    input.disabled = true;

    timerId = setInterval(() => {
        const now = new Date();
        const diff = userSelectedDate - now;

        if (diff <= 0) {
            clearInterval(timerId);
            updateTimerUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            input.disabled = false;
            return;
        }

        const timeLeft = convertMs(diff);
        updateTimerUI(timeLeft);
    }, 1000);
});

// Utility functions
function updateTimerUI({ days, hours, minutes, seconds }) {
    daysEl.textContent = days.toString();
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}
