const RESUME = "28820213ff0841e6530039ed1f4d5a62564b47";
const MESSAGE = (Name = '') => `Добрый день! 
Меня заинтересовала предложенная Вами вакансия ${Name}. Ознакомившись с перечнем требований к кандидатам, пришел к выводу, что мой опыт работы позволяют мне претендовать на данную должность. 
Обладаю высоким уровнем бэкенд-разработки. В работе ответствен, пунктуален и коммуникабелен.
Буду с нетерпением ждать ответа и возможности обсудить условия работы и взаимные ожидания на собеседовании. Спасибо, что уделили время. 
Для связи предпочтительней использовать телеграм`;

// Пауза
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

class HHClicker {
    constructor() {
        this.vacancies = document.querySelectorAll('[data-qa="vacancy-serp__vacancy_response"]');
        this.vacancy = document.querySelector('[data-qa="vacancy-response-link-top"]');
    }

    async init() {
        if (this.vacancy) {
            return this.vacancyClick(vacancy);
        }
        this.vacancies.forEach(el => this.vacancyClick(el))
    }

    async selectResume() { // Выбор Резюме
        document.querySelector(`#resume_${RESUME}`).click();
        return document.querySelector('[data-qa="vacancy-response-letter-toggle"]')?.click();
    }

    async handlerCoverLetter() {
        const vacancyTitle = document.querySelector(
            '.bloko-modal-header_outlined > div'
        )?.textContent;
        const vacancyName = vacancyTitle.slice(1, vacancyTitle.length - 1);
        const messageArea = document.querySelector(
            '[data-qa="vacancy-response-popup-form-letter-input"]'
        );
        messageArea.value = MESSAGE(vacancyName ?? '');
        const evt = document.createEvent('HTMLEvents');
        evt.initEvent('change', true, true);
        messageArea.dispatchEvent(evt);

        // Отправить отклик
        return document.querySelector('[data-qa="vacancy-response-submit-popup"]')?.click();
    }

    async vacancyClick(vacancyElement) {
        await vacancyElement.click();
        await delay(1000);
        await this.selectResume();
        await delay(500);
        return await this.handlerCoverLetter();
    }
}

// Добавить на панель доп. функционал
(async function addNavLinks() {
    await delay(1000);

    const navLinks = document.querySelectorAll(
        '.supernova-navi-item.supernova-navi-item_lvl-2.supernova-navi-item_no-mobile'
    );

    const itemLetters = document.createElement('div');

    function createElement(item, attribute, title) {
        item.classList.add(
            'supernova-navi-item',
            'supernova-navi-item_lvl-2',
            'supernova-navi-item_no-mobile'
        );

        item.innerHTML = `
    <a
      data-qa="mainmenu_vacancyResponses"
      class="supernova-link"
      ${attribute}
    >
      ${title}
    </a>
    <div class="supernova-navi-underline">${title}</div>
    `;
    }

    createElement(itemLetters, 'handler-letters', 'Отправить отклики');

    navLinks[2].append(itemLetters);
    document.querySelector('[handler-letters]').addEventListener('click', () => new HHClicker().init());
})();