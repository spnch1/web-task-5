function swapContent() {
    const blockX = document.querySelector('header .xy');
    const blockY = document.querySelector('footer .xy');

    if (blockX && blockY) {
        const temp = blockX.innerHTML;
        blockX.innerHTML = blockY.innerHTML;
        blockY.innerHTML = temp;
    }
}

function calculateArea() {
    const width = 10;
    const height = 20;
    const area = width * height;

    const resultContainer = document.getElementById('task2-result');
    if (resultContainer) {
        resultContainer.innerHTML = `<p>Rectangle Area (Width: ${width}, Height: ${height}): <strong>${area}</strong></p>`;
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function deleteCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function handleMinNumbersTask() {
    const cookieName = 'minCountResult';
    const savedResult = getCookie(cookieName);
    const formContainer = document.getElementById('task3-form-container');
    const form = document.getElementById('min-numbers-form');

    if (savedResult) {
        const retain = confirm(`Saved result found: ${savedResult}. Do you want to keep it?`);
        if (retain) {
            alert('Cookies are present. Reload the page if you want to reset.');
            if (formContainer) formContainer.style.display = 'none';
        } else {
            deleteCookie(cookieName);
            location.reload();
        }
    } else {
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                const inputs = form.querySelectorAll('input[name="num"]');
                const numbers = Array.from(inputs).map(input => parseFloat(input.value));
                const min = Math.min(...numbers);
                const count = numbers.filter(n => n === min).length;

                alert(`Minimum number is ${min}. It appears ${count} times.`);
                setCookie(cookieName, `Min: ${min}, Count: ${count}`, 7);
                location.reload();
            });
        }
    }
}

function handleItalicsTask() {
    const block3 = document.querySelector('nav'); // Block 3 is nav
    const checkbox = document.getElementById('italic-checkbox');
    const storageKey = 'italicizeBlock3';

    const isItalic = localStorage.getItem(storageKey) === 'true';
    if (isItalic) {
        if (block3) block3.style.fontStyle = 'italic';
        if (checkbox) checkbox.checked = true;
    }

    document.addEventListener('keypress', function (e) {
        if (checkbox && checkbox.checked) {
            if (block3) {
                block3.style.fontStyle = 'italic';
                localStorage.setItem(storageKey, 'true');
            }
        }
    });

    if (checkbox) {
        checkbox.addEventListener('change', function () {
            if (!this.checked) {
                if (block3) block3.style.fontStyle = 'normal';
                localStorage.setItem(storageKey, 'false');
            }
        });
    }
}

function handleCssEditorTask() {
    const task5Container = document.getElementById('task5-container');
    const asideBlock = document.querySelector('aside'); // Block 2
    const storageKey = 'cssRules';

    let rules = JSON.parse(localStorage.getItem(storageKey)) || [];
    applyRules(rules);
    renderDeleteButtons(rules);

    document.addEventListener('dblclick', function (e) {
        const targetBlock = e.target.closest('footer .xy');
        if (targetBlock) {
            if (task5Container) {
                task5Container.innerHTML = `
                    <h3>Task 5: CSS Editor</h3>
                    <form id="css-editor-form">
                        <input type="text" id="css-selector" placeholder="Selector (e.g., p, .block)" required>
                        <input type="text" id="css-property" placeholder="Property (e.g., color)" required>
                        <input type="text" id="css-value" placeholder="Value (e.g., red)" required>
                        <button type="submit">Save CSS Rule</button>
                    </form>
                `;

                const form = document.getElementById('css-editor-form');
                form.addEventListener('submit', function (e) {
                    e.preventDefault();
                    const selector = document.getElementById('css-selector').value;
                    const property = document.getElementById('css-property').value;
                    const value = document.getElementById('css-value').value;

                    const newRule = { id: Date.now(), selector, property, value };
                    rules.push(newRule);
                    localStorage.setItem(storageKey, JSON.stringify(rules));

                    applyRules(rules);
                    renderDeleteButtons(rules);
                    form.reset();
                    alert('CSS Rule Saved!');
                });

                task5Container.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    function applyRules(rulesToApply) {
        let styleTag = document.getElementById('custom-css-styles');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'custom-css-styles';
            document.head.appendChild(styleTag);
        }

        let cssString = '';
        rulesToApply.forEach(rule => {
            cssString += `${rule.selector} { ${rule.property}: ${rule.value} !important; } `;
        });
        styleTag.textContent = cssString;
    }

    function renderDeleteButtons(currentRules) {
        const existingButtons = document.querySelectorAll('.delete-css-btn');
        existingButtons.forEach(btn => btn.remove());

        if (asideBlock) {
            currentRules.forEach(rule => {
                const btn = document.createElement('button');
                btn.textContent = `Delete ${rule.selector} { ${rule.property}: ${rule.value} }`;
                btn.className = 'delete-css-btn';
                btn.style.display = 'block';
                btn.style.margin = '5px 0';
                btn.onclick = function () {
                    rules = rules.filter(r => r.id !== rule.id);
                    localStorage.setItem(storageKey, JSON.stringify(rules));
                    applyRules(rules);
                    renderDeleteButtons(rules);
                };
                asideBlock.appendChild(btn);
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    swapContent(); // task 1
    calculateArea(); // task 2
    handleMinNumbersTask(); // task 3
    handleItalicsTask(); // task 4
    handleCssEditorTask(); // task 5
});
