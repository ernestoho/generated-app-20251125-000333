document.addEventListener('DOMContentLoaded', () => {
    const dayTabs = {
        monday: "Lunes",
        tuesday: "Martes",
        wednesday: "Miércoles",
        thursday: "Jueves",
        friday: "Viernes",
        saturday: "Sábado",
    };
    const WHATSAPP_NUMBER = "18097891080";
    const state = {
        menu: null,
        selectedDay: getTodayKey(),
        selectedMain: null,
        selectedGuarniciones: new Set(),
        selectedExtras: new Set(),
        selectedJugos: new Set(),
    };
    const selectors = {
        loadingState: document.getElementById('loading-state'),
        appContent: document.getElementById('app-content'),
        tabsContainer: document.getElementById('tabs-container'),
        mainSelectionCard: document.getElementById('main-selection-card'),
        especialContainer: document.getElementById('especial-container'),
        platoDiaContainer: document.getElementById('plato-dia-container'),
        mainError: document.getElementById('main-error'),
        guarnicionesAdditional: document.getElementById('guarniciones-additional'),
        extrasContainer: document.getElementById('extras-container'),
        jugosContainer: document.getElementById('jugos-container'),
        previewContainer: document.getElementById('preview-container'),
        whatsappBtn: document.getElementById('whatsapp-btn'),
    };
    const fallbackMenu = {
        "ESPECIAL": [
            { "item": "Sancocho de 3 Carnes", "price": 375 },
            { "item": "Mondongo a la Criolla", "price": 375 },
            { "item": "Pati Mongó y Compañía", "price": 350 }
        ],
        "PLATO_DEL_DÍA": [
            { "item": "Cerdo Guisado Criollo", "price": 250 },
            { "item": "Bistec Encebollado", "price": 275 },
            { "item": "Res Guisada Tradicional", "price": 250 },
            { "item": "Pollo Guisado Casero", "price": 250 },
            { "item": "Pollo Frito Crocante", "price": 250 },
            { "item": "Pollo al Horno Doradito", "price": 250 },
            { "item": "Pechurina Empanizada", "price": 250 },
            { "item": "Pechuga a la Plancha", "price": 400 },
            { "item": "Pechuga Salteada Vegetales", "price": 400 },
            { "item": "Pechuga a la Crema", "price": 400 }
        ],
        "GUARNICIONES": [
            "Puré de Yautía", "Puré de Papa", "Plátanos Maduros", "Mangú de Plátano Verde", "Mangú de Guineo", "Guineito Hervido", "Puré de Yuca", "Arroz con Maíz", "Arroz Blanco", "Moro de Habichuelas Negras", "Moro de Habichuelas Rojas", "Moro de Guandules", "Ensalada Verde", "Ensalada de Pasta", "Ensalada de Vegetales", "Ensalada Tipile"
        ],
        "EXTRAS": [
            { "item": "Tostones", "price": 100 }, { "item": "Arepita Maíz", "price": 25 }, { "item": "Arepita Yuca", "price": 25 }, { "item": "Batata Frita", "price": 100 }
        ],
        "JUGOS": [
            { "item": "Cereza", "price": 100 }, { "item": "Limón", "price": 100 }, { "item": "Chinola", "price": 100 }, { "item": "Tamarindo", "price": 100 }
        ]
    };
    async function fetchMenu() {
        try {
            const response = await fetch('menu.json');
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.warn('Could not fetch menu.json, using fallback data.', error);
            return fallbackMenu;
        }
    }
    function getTodayKey() {
        const dayIndex = new Date().getDay();
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = days[dayIndex];
        return today === 'sunday' ? 'monday' : today;
    }
    function renderTabs() {
        selectors.tabsContainer.innerHTML = Object.entries(dayTabs).map(([key, label]) =>
            `<button class="tab-btn ${key === state.selectedDay ? 'active' : ''}" data-day="${key}">${label}</button>`
        ).join('');
    }
    function renderMenuSection(container, items, type, name, isPriced = true) {
        container.innerHTML = items.map((item, index) => {
            const id = `${name}-${index}`;
            const value = isPriced ? JSON.stringify(item) : item;
            const priceHTML = isPriced ? `<span class="item-price">RD${item.price.toFixed(2)}</span>` : '';
            const itemName = isPriced ? item.item : item;
            return `
                <div class="control-item">
                    <input type="${type}" id="${id}" name="${name}" value='${value}'>
                    <span class="control-indicator"></span>
                    <label for="${id}">
                        <span class="item-name">${itemName}</span>
                        ${priceHTML}
                    </label>
                </div>`;
        }).join('');
    }
    function renderFullMenu() {
        const { menu } = state;
        if (!menu) return;
        renderMenuSection(selectors.especialContainer, menu.ESPECIAL, 'radio', 'main');
        renderMenuSection(selectors.platoDiaContainer, menu['PLATO_DEL_DÍA'], 'radio', 'main');
        renderMenuSection(selectors.guarnicionesAdditional, menu.GUARNICIONES, 'checkbox', 'guarnicion', false);
        renderMenuSection(selectors.extrasContainer, menu.EXTRAS, 'checkbox', 'extra');
        renderMenuSection(selectors.jugosContainer, menu.JUGOS, 'checkbox', 'jugo');
    }
    function updatePreview() {
        if (!state.selectedMain) {
            selectors.previewContainer.innerHTML = '<p class="empty-preview">Selecciona un plato principal para ver tu pedido.</p>';
            selectors.whatsappBtn.disabled = true;
            return;
        }
        let total = state.selectedMain.price;
        let previewHTML = `<div class="preview-day">Pedido para: ${dayTabs[state.selectedDay]}</div>`;
        previewHTML += `<div class="preview-section"><div class="preview-section-title">Principal</div><div class="preview-item"><span>${state.selectedMain.item}</span><span>RD${state.selectedMain.price.toFixed(2)}</span></div></div>`;
        if (state.selectedGuarniciones.size > 0) {
            const allGuarniciones = Array.from(state.selectedGuarniciones);
            previewHTML += `<div class="preview-section"><div class="preview-section-title">Guarniciones</div><div class="preview-item"><span>${allGuarniciones.join(', ')}</span></div></div>`;
        }
        if (state.selectedExtras.size > 0) {
            previewHTML += `<div class="preview-section"><div class="preview-section-title">Extras</div>`;
            state.selectedExtras.forEach(item => {
                previewHTML += `<div class="preview-item"><span>${item.item}</span><span>RD${item.price.toFixed(2)}</span></div>`;
                total += item.price;
            });
            previewHTML += `</div>`;
        }
        if (state.selectedJugos.size > 0) {
            previewHTML += `<div class="preview-section"><div class="preview-section-title">Jugos</div>`;
            state.selectedJugos.forEach(item => {
                previewHTML += `<div class="preview-item"><span>${item.item}</span><span>RD${item.price.toFixed(2)}</span></div>`;
                total += item.price;
            });
            previewHTML += `</div>`;
        }
        previewHTML += `<div class="preview-total"><span>Total</span><span>RD${total.toFixed(2)}</span></div>`;
        selectors.previewContainer.innerHTML = previewHTML;
        selectors.whatsappBtn.disabled = false;
    }
    function handleSelection(event) {
        const input = event.target;
        if (!input.matches('input[type="radio"], input[type="checkbox"]')) return;
        const value = input.value;
        const checked = input.checked;
        try {
            const parsedValue = JSON.parse(value);
            if (input.name === 'main') {
                state.selectedMain = parsedValue;
                selectors.mainError.classList.add('hidden');
            } else if (input.name === 'extra') {
                checked ? state.selectedExtras.add(parsedValue) : state.selectedExtras.forEach(i => i.item === parsedValue.item && state.selectedExtras.delete(i));
            } else if (input.name === 'jugo') {
                checked ? state.selectedJugos.add(parsedValue) : state.selectedJugos.forEach(i => i.item === parsedValue.item && state.selectedJugos.delete(i));
            }
        } catch (e) { // For non-JSON values like guarniciones
            if (input.name === 'guarnicion') {
                checked ? state.selectedGuarniciones.add(value) : state.selectedGuarniciones.delete(value);
            }
        }
        updatePreview();
    }
    function buildWhatsAppMessage() {
        let total = state.selectedMain.price;
        let message = `Hola, quiero hacer un pedido para el *${dayTabs[state.selectedDay]}* en El Cucharón JR:\n\n`;
        message += `*Principal:*\n- ${state.selectedMain.item} (RD${state.selectedMain.price.toFixed(2)})\n\n`;
        if (state.selectedGuarniciones.size > 0) {
            const allGuarniciones = Array.from(state.selectedGuarniciones);
            message += `*Guarniciones:*\n- ${allGuarniciones.join('\n- ')}\n\n`;
        }
        if (state.selectedExtras.size > 0) {
            message += `*Extras:*\n`;
            state.selectedExtras.forEach(item => {
                message += `- ${item.item} (RD${item.price.toFixed(2)})\n`;
                total += item.price;
            });
            message += `\n`;
        }
        if (state.selectedJugos.size > 0) {
            message += `*Jugos:*\n`;
            state.selectedJugos.forEach(item => {
                message += `- ${item.item} (RD${item.price.toFixed(2)})\n`;
                total += item.price;
            });
            message += `\n`;
        }
        message += `*Total: RD${total.toFixed(2)}*`;
        return encodeURIComponent(message);
    }
    function sendOrder() {
        if (!state.selectedMain) {
            selectors.mainError.classList.remove('hidden');
            selectors.mainSelectionCard.classList.add('shake');
            setTimeout(() => selectors.mainSelectionCard.classList.remove('shake'), 500);
            selectors.mainSelectionCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        const message = buildWhatsAppMessage();
        const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${message}`;
        window.open(url, '_blank');
    }
    function handleTabClick(event) {
        const button = event.target.closest('.tab-btn');
        if (!button) return;
        state.selectedDay = button.dataset.day;
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        // Reset selections when changing day
        state.selectedMain = null;
        state.selectedGuarniciones.clear();
        state.selectedExtras.clear();
        state.selectedJugos.clear();
        document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => input.checked = false);
        updatePreview();
    }
    async function init() {
        state.menu = await fetchMenu();
        renderTabs();
        renderFullMenu();
        updatePreview();
        selectors.loadingState.classList.add('hidden');
        selectors.appContent.classList.remove('hidden');
        selectors.tabsContainer.addEventListener('click', handleTabClick);
        selectors.appContent.addEventListener('change', handleSelection);
        selectors.whatsappBtn.addEventListener('click', sendOrder);
    }
    init();
});