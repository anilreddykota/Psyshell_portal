document.addEventListener('DOMContentLoaded', () => {
    let isEyeStepCompleted = false;
    let isHandStepCompleted = false;
    let isEarStepCompleted = false;
    let isNoseStepCompleted = false;
    let isTasteStepCompleted = false;

    const statusText = document.getElementById('status-text');
    const repeatButton = document.getElementById('repeat-button');
    const doneButton = document.getElementById('done-button');

    const eyeButton = document.getElementById('eye-button');
    const handButton = document.getElementById('hand-button');
    const earButton = document.getElementById('ear-button');
    const noseButton = document.getElementById('nose-button');
    const tasteButton = document.getElementById('taste-button');

    const eyeCheckboxesContainer = document.getElementById('eye-checkboxes');
    const handCheckboxesContainer = document.getElementById('hand-checkboxes');
    const earCheckboxesContainer = document.getElementById('ear-checkboxes');
    const noseCheckboxesContainer = document.getElementById('nose-checkboxes');
    const tasteCheckbox = document.getElementById('taste-checkbox-input');

    eyeButton.addEventListener('click', () => {
        if (isEyeStepCompleted) return;

        createCheckboxes(eyeCheckboxesContainer, 5, () => {
            isEyeStepCompleted = true;
            isHandStepCompleted = false;
            statusText.textContent = 'See 5 Things around you and check boxes';
        });
    });

    handButton.addEventListener('click', () => {
        if (!isEyeStepCompleted || isHandStepCompleted) return;

        createCheckboxes(handCheckboxesContainer, 4, () => {
            isHandStepCompleted = true;
            isEarStepCompleted = false;
            statusText.textContent = 'Touch 4 things around you';
        });
    });

    earButton.addEventListener('click', () => {
        if (!isHandStepCompleted || isEarStepCompleted) return;

        createCheckboxes(earCheckboxesContainer, 3, () => {
            isEarStepCompleted = true;
            isNoseStepCompleted = false;
            statusText.textContent = 'Hear 3 things around you';
        });
    });

    noseButton.addEventListener('click', () => {
        if (!isEarStepCompleted || isNoseStepCompleted) return;

        createCheckboxes(noseCheckboxesContainer, 2, () => {
            isNoseStepCompleted = true;
            isTasteStepCompleted = false;
            statusText.textContent = 'Smell 2 things around you';
        });
    });

    tasteButton.addEventListener('click', () => {
        if (!isNoseStepCompleted || isTasteStepCompleted) return;

        tasteCheckbox.disabled = false;
        tasteCheckbox.addEventListener('change', () => {
            if (tasteCheckbox.checked) {
                isTasteStepCompleted = true;
                statusText.textContent = 'Congratulations. You Completed the Task';
                repeatButton.disabled = false;
                doneButton.disabled = false;
            } else {
                statusText.textContent = 'Complete task please!';
                repeatButton.disabled = true;
                doneButton.disabled = true;
            }
        });
    });

    repeatButton.addEventListener('click', () => {
        window.location.reload();
    });

    doneButton.addEventListener('click', () => {
        alert('Task Completed!');
    });

    function createCheckboxes(container, count, callback) {
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.addEventListener('change', () => {
                if ([...container.querySelectorAll('input')].every(checkbox => checkbox.checked)) {
                    callback();
                }
            });
            container.appendChild(checkbox);
        }
    }
});
