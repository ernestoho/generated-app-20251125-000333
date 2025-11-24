document.addEventListener('DOMContentLoaded', () => {
    const dailyMenus = {
        monday: ["Cerdo Guisado Criollo", "Pollo Guisado Casero"],
        tuesday: ["Bistec Encebollado", "Res Guisada Tradicional"],
        wednesday: ["Pollo al Horno Doradito", "Pollo Frito Crocante"],
        thursday: ["Pechuga a la Plancha", "Pechurina Empanizada"],
        friday: ["Pechuga Salteada Vegetales", "Pechuga a la Crema"],
        saturday: ["Cerdo Guisado Criollo", "Bistec Encebollado"],
        sunday: []
    };
    const defaultGuarniciones = ["Arroz Blanco", "Habichuelas Rojas", "Ensalada Verde"];
    const WHATSAPP_NUMBER = "18097891080";
    const state = {
        menu: null,
        selectedPlato: null,
        selectedGuarniciones: new Set(),
    };
    const selectors = {
        loadingState: document.getElementById('loading-state'),
        appContent: document.getElementById('app-content'),
        platosHeader: document.getElementById('platos-header'),
        platosContainer: document.getElementById('platos-container'),
        platosCard: document.getElementById('platos-card'),
        platoError: document.getElementById('plato-error'),
        guarnicionesIncluded: document.getElementById('guarniciones-included'),
        guarnicionesAdditional: document.getElementById('guarniciones-additional'),
        previewContainer: document.getElementById('preview-container'),
        whatsappBtn: document.getElementById('whatsapp-btn'),
    };
    const fallbackMenu = {
      "Plato_Del_Día_1": [
        { "item": "Cerdo Guisado Criollo", "price": 250 },
        { "item": "Bistec Encebollado", "price": 275 },
        { "item": "Res Guisada Tradicional", "price": 250 },
        { "item": "Pollo Guisado Casero", "price": 250 }
      ],
      "Plato_Del_Día_2": [
        { "item": "Pollo Frito Crocante", "price": 250 },
        { "item": "Pollo al Horno Doradito", "price": 250 },
        { "item": "Pechurina Empanizada", "price": 250 },
        { "item": "Pechuga a la Plancha", "price": 400 },
        { "item": "Pechuga Salteada Vegetales", "price": 400 },
        { "item": "Pechuga a la Crema", "price": 400 }
      ],
      "Guarniciones_1": ["Puré de Yautía", "Puré de Papa", "Plátanos Maduros"],
      "Guarniciones_2": ["Arroz con Maíz", "Moro de Habichuelas Negras"]
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
        return days[dayIndex];
    }
    function findPlatosForToday(menu, todayKey) {
        const todaysPlatoNames = dailyMenus[todayKey] || [];
        const allPlatos = [...menu.Plato_Del_Día_1, ...menu.Plato_Del_Día_2];
        return allPlatos.filter(plato => todaysPlatoNames.includes(plato.item));
    }
    function renderPlatos(platos) {
        if (platos.length === 0) {
            selectors.platosHeader.textContent = "Hoy no hay Plato del Día";
            selectors.platosContainer.innerHTML = '<p>El Cucharón JR está cerrado los Domingos. ¡Te esperamos mañana!</p>';
            return;
        }
        selectors.platosContainer.innerHTML = platos.map((plato, index) => `
            <div class="control-item">
                <input type="radio" id="plato-${index}" name="plato" value="${plato.item}">
                <span class="control-indicator"></span>
                <label for="plato-${index}">
                    <span class="item-name">${plato.item}</span>
                    <span class="item-price">$${plato.price.toFixed(2)}</span>
                </label>
            </div>
        `).join('');
    }
    function renderGuarniciones(menu) {
        selectors.guarnicionesIncluded.innerHTML = defaultGuarniciones.map(g => `<span class="chip">${g}</span>`).join('');
        const allGuarniciones = [...(menu.Guarniciones_1 || []), ...(menu.Guarniciones_2 || [])];
        const additionalGuarniciones = allGuarniciones.filter(g => !defaultGuarniciones.includes(g));
        selectors.guarnicionesAdditional.innerHTML = additionalGuarniciones.map((guarnicion, index) => `
            <div class="control-item">
                <input type="checkbox" id="guarnicion-${index}" value="${guarnicion}">
                <span class="control-indicator"></span>
                <label for="guarnicion-${index}">
                    <span class="item-name">${guarnicion}</span>
                </label>
            </div>
        `).join('');
    }
    function updatePreview() {
        if (!state.selectedPlato) {
            selectors.previewContainer.innerHTML = '<p class="empty-preview">Selecciona un plato para ver tu pedido.</p>';
            selectors.whatsappBtn.disabled = true;
            return;
        }
        const guarnicionesList = [
            ...defaultGuarniciones,
            ...Array.from(state.selectedGuarniciones)
        ].map(g => `<li>${g}</li>`).join('');
        selectors.previewContainer.innerHTML = `
            <div class="preview-item main-dish">
                <span class="item-name">${state.selectedPlato.item}</span>
                <span class="item-price">$${state.selectedPlato.price.toFixed(2)}</span>
            </div>
            <div class="preview-item">
                <ul>${guarnicionesList}</ul>
            </div>
        `;
        selectors.whatsappBtn.disabled = false;
    }
    function handlePlatoSelection(event) {
        const selectedValue = event.target.value;
        const allPlatos = [...state.menu.Plato_Del_Día_1, ...state.menu.Plato_Del_Día_2];
        state.selectedPlato = allPlatos.find(p => p.item === selectedValue);
        selectors.platoError.classList.add('hidden');
        updatePreview();
    }
    function handleGuarnicionSelection(event) {
        const { value, checked } = event.target;
        if (checked) {
            state.selectedGuarniciones.add(value);
        } else {
            state.selectedGuarniciones.delete(value);
        }
        updatePreview();
    }
    function buildWhatsAppMessage() {
        const date = new Date();
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        let message = `*Pedido de El Cucharón JR*\n\n`;
        message += `*Fecha:* ${formattedDate}\n\n`;
        message += `*Plato:* ${state.selectedPlato.item}\n`;
        message += `*Guarniciones:*\n`;
        [...defaultGuarniciones, ...state.selectedGuarniciones].forEach(g => {
            message += `- ${g}\n`;
        });
        message += `\n*Total:* $${state.selectedPlato.price.toFixed(2)}`;
        return encodeURIComponent(message);
    }
    function sendOrder() {
        if (!state.selectedPlato) {
            selectors.platoError.classList.remove('hidden');
            selectors.platosCard.classList.add('shake');
            setTimeout(() => selectors.platosCard.classList.remove('shake'), 500);
            selectors.platosCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        const message = buildWhatsAppMessage();
        const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${message}`;
        window.open(url, '_blank');
    }
    async function init() {
        state.menu = await fetchMenu();
        const todayKey = getTodayKey();
        const todaysPlatos = findPlatosForToday(state.menu, todayKey);
        renderPlatos(todaysPlatos);
        renderGuarniciones(state.menu);
        updatePreview();
        selectors.loadingState.classList.add('hidden');
        selectors.appContent.classList.remove('hidden');
        selectors.platosContainer.addEventListener('change', handlePlatoSelection);
        selectors.guarnicionesAdditional.addEventListener('change', handleGuarnicionSelection);
        selectors.whatsappBtn.addEventListener('click', sendOrder);
    }
    init();
});