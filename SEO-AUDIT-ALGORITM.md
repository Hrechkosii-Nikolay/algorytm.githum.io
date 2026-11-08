# SEO-аудит сайту АО «АЛГОРИТМ»

Дата перевірки: 8 листопада 2026 року. Основний URL, підтверджений метаданими, `robots.txt`, sitemap і публічним хостом: `https://hrechkosii-nikolay.github.io/algorytm.githum.io/`.

## 1. Загальний висновок

Проєкт є статичним сайтом на HTML5, CSS3 і Vanilla JavaScript без шаблонізатора, package manager, PHP, бази даних або окремої збірки. Вихідні й публічні файли зараз збігаються та лежать у корені репозиторію; українські сторінки розміщені в корені, англійські — у `/en/`. Спільні елементи продубльовані у HTML, стилі та поведінка винесені у `css/style.css` і `js/main.js`. Хостинг — GitHub Pages; `.htaccess` є додатковою конфігурацією для Apache, але GitHub Pages її не застосовує.

Локальна версія після виправлень технічно узгоджена: 67 HTML-файлів, 65 індексованих self-canonical URL у sitemap, 32 взаємні мовні пари, одна окрема англомовна сторінка `/en/military.html`, неканонічний AMP-дублікат і службова 404. Автоматичний аудит не знаходить відсутніх title, description, H1, canonical, дубльованих метаданих, випадкового noindex, битих внутрішніх посилань, загублених сторінок, відсутніх зображень, невалідного JSON-LD або помилок sitemap/hreflang.

Критичний залишковий ризик стосується не коду, а публікації: чинний публічний GitHub Pages ще не містить 37 із 65 URL локального sitemap (усі 33 англомовні URL і 4 нові українські сторінки) та повертає для них 404. Публікацію не виконано відповідно до обмеження завдання.

## 2. Структура та призначення сторінок

- `/` — головна, інформація про об’єднання, послуги, процес, статті, FAQ і контакти.
- `vlk.html`, `tck.html`, `ekopfo.html`, `dismissal.html`, `payments.html`, `disability.html`, `pensions.html` — основні напрями військового права.
- `disputes.html`, `family.html`, `criminal.html`, `police.html`, `osbb-debt-recovery.html`, `loan-debt-recovery.html` — інші юридичні напрями.
- `legal-services-for-foreigners.html` і `/en/legal-services-for-foreigners/` — допомога іноземцям та клієнтам за кордоном.
- `articles.html` і 14 українських практичних матеріалів — каталог і юридичні публікації; відповідні англійські версії розміщені в `/en/`.
- `/en/` — англомовна головна; `/en/military.html` — окремий англомовний хаб військових послуг.
- `privacy-policy.html`, `/en/privacy-policy.html` — політики конфіденційності.
- `404.html` — службова сторінка з `noindex, follow`.
- `/amp/` — AMP-версія головної з canonical на `/`, тому не включена до sitemap.

## 3. Знайдені проблеми та статус

| Пріоритет | Проблема | Статус |
|---|---|---|
| P0 | Публічний хост повертає 404 для 37 локально підготовлених URL | Потребує публікації; код готовий |
| P1 | 26 українських сторінок не мали взаємних `uk/en/x-default`, хоча англійські відповідники вже посилалися на них | Виправлено |
| P1 | Sitemap містив зайві `changefreq` і `priority`, а автоматична перевірка/генерація була відсутня | Виправлено |
| P2 | `/en/articles.html` не мав Open Graph і Twitter Card | Виправлено |
| P2 | AMP-дублікат містив мовні alternate, які створювали невзаємний hreflang-кластер | Виправлено |
| P2 | GitHub Pages віддає `/index.html` з 200 замість редиректу на `/` | Прийнятно: canonical веде на `/`; `.htaccess` на GitHub Pages не діє |
| P2 | `www.hrechkosii-nikolay.github.io` не має валідного сертифіката | Не використовувати `www` для домену GitHub Pages |
| P2 | Польові LCP/CLS/INP і дані Google Search Console недоступні локально | Перевірити після публікації |

## 4. Виконані виправлення

- Додано взаємні `hreflang="uk"`, `hreflang="en"` і `x-default` до 26 українських сторінок, для яких існують переклади.
- Англомовні сторінки залишено з self-canonical; canonical не перенаправлено на українські оригінали.
- Прибрано hreflang із неканонічної AMP-копії головної.
- Додано унікальні OG/Twitter-метадані до `/en/articles.html`.
- Очищено `sitemap.xml` від `changefreq` і `priority`; збережено наявні `lastmod` без штучного оновлення дат.
- Додано `scripts/seo-audit.mjs`, який перевіряє title, description, H1, canonical, noindex, дублікати, внутрішні посилання та фрагменти, зображення, alt, viewport, favicon, OG/Twitter, JSON-LD, hreflang, orphan pages і sitemap.
- Додано `scripts/generate-sitemap.mjs`; він включає лише indexable self-canonical HTML і зберігає вже підтверджені `lastmod`.
- Дизайн, URL, контакти, анімації та бізнес-логіку форм не змінено.

Змінені в межах цього аудиту файли: 26 українських HTML-сторінок із мовними парами, `amp/index.html`, `en/articles.html`, `sitemap.xml`, `scripts/seo-audit.mjs`, `scripts/generate-sitemap.mjs` і цей звіт. Інші незакомічені зміни вже були в робочому дереві до початку аудиту та не приписуються цій роботі.

## 5. Мови, canonical, sitemap і внутрішні посилання

Локально є 34 українські та 33 англійські HTML-файли. Індексоване ядро складається з 32 українських і 33 англійських URL. Усі 65 мають унікальні title/description/H1 та self-canonical і присутні в sitemap. 64 сторінки утворюють 32 взаємні мовні пари. `/en/military.html` є самостійним англомовним хабом без неповного українського дубля, тому hreflang для нього не вигадувався.

Внутрішній граф не містить orphan pages серед canonical URL. Головні, каталоги, меню й футер дають звичайні HTML-посилання на послуги; статті посилаються на тематичні матеріали та каталоги. Битих локальних посилань або фрагментів не знайдено.

## 6. Структуровані дані, довіра й юридичний контент

JSON-LD є на 66 сторінках і синтаксично валідний. Використовуються Organization, LegalService, WebSite/WebPage та релевантні типи сторінок; фіктивних `aggregateRating`, review або Person не знайдено. Контакти узгоджені: телефон `+38 063 244 65 82`, email `ao.algorytm@ukr.net`, Telegram `@ao_algorytm`.

На сайті немає гарантій виграшу; тексти прямо застерігають про залежність результату від фактів, доказів і чинної редакції норм. Знайдено 11 посилань на офіційний портал Верховної Ради: 9 віддають 200 при автоматичній перевірці, 2 повертають 403 для автоматизованого клієнта (`Закон про статус ветеранів` і наказ МВС №260), що саме по собі не доводить недоступність у браузері.

Перед публікацією власнику/юридичному редактору потрібно підтвердити:

- фактичний перелік послуг, особливо широкий перелік для іноземців;
- твердження про роботу з фінансовими установами, ОСББ і поліцейськими;
- години роботи «щодня 09:00–18:00», які є у видимому тексті та Schema.org;
- згадку «у Києві» в title головної сторінки та фактичну географію прийому;
- актуальність норм і процедур на дату звернення, зокрема ВЛК, мобілізації, ЕКОПФО, виплат, пенсій, міграції, спадщини та процесуальних строків;
- право публікувати всі зазначені контакти й соціальні профілі.

Рекомендовано додати лише після фактичного підтвердження: юридичну адресу/офіс, реєстраційні відомості об’єднання, реальних адвокатів і їхні профілі, відповідального автора та дату юридичної перевірки статей. Не створювати вигадані відгуки, рейтинги, сертифікати чи міські сторінки.

## 7. Продуктивність, мобільна версія, форми та безпека

Головне зображення WebP має 70 КБ, прелоадиться з високим пріоритетом; шрифт WOFF2 прелоадиться; CSS — 40 КБ, JS — 10 КБ. Основні растрові ресурси оптимізовані, логотипи мають явні width/height, карта завантажується ліниво. Важких бібліотек немає. Реальні LCP/CLS/INP або Lighthouse не заявляються: Lighthouse у середовищі не встановлений, а польові дані потребують опублікованої версії та достатнього трафіку.

Мобільне меню й мовний перемикач реалізовані у `js/main.js`; статичний аудит підтвердив існування всіх їхніх цільових URL. Чотири контактні форми на двох головних сторінках не відправляють дані на backend або Telegram API: після валідації вони використовують `navigator.share`, а за його відсутності копіюють текст у clipboard. Тестові звернення не надсилалися.

`.htaccess` містить HTTPS/www/index redirects, захист прихованих файлів, кешування, стиснення, CSP, HSTS та custom 404, але GitHub Pages цей файл ігнорує. На поточному хості HTTP→HTTPS працює через 301, неіснуючий URL повертає 404. Для реального custom domain потрібні окремі DNS/hosting налаштування і перевірка заголовків після запуску.

## 8. Результати тестування

Команди:

```bash
node scripts/seo-audit.mjs
node scripts/generate-sitemap.mjs
```

Результат: `67 HTML pages`, `65 sitemap URLs`, `Issues: none`; sitemap current. Локальна HTTP-перевірка: 67/67 HTML — 200; robots, sitemap, CSS, JS, WebP — 200; неіснуючий шлях — 404. Публічна перевірка: головна, robots і sitemap — 200; HTTP→HTTPS — один 301; 37 нових URL — 404 до публікації.

Неможливо підтвердити без доступу до відповідних систем: статуси після майбутнього деплою, server headers custom domain, DNS, Search Console, реальну індексацію, crawl budget, ручні санкції, пошукові запити, CTR/позиції, польові Core Web Vitals і доставлення заявок через зовнішні канали.

## 9. Повна URL-таблиця

Позначення: `self` — canonical на саму сторінку; «вхідні» — кількість внутрішніх HTML-посилань у локальному графі.

| URL | Мова | Title | H1 | Description | Canonical | Hreflang | Sitemap | Внутрішні посилання | SEO-статус | Виправлення |
|---|---|---|---|---|---|---|---|---|---|---|
| / | uk | Адвокат для військових у Києві та Україні | Професійний юридичний захист у важливі періоди життя | Допомога військовим, ветеранам, поліцейським, цивільним, ОСББ і фінансовим установам | self | uk/en/x-default | так | 277 вхідних | OK локально | hreflang перевірено |
| /404.html | uk | Сторінку не знайдено | Сторінку не знайдено | Повідомлення про відсутню сторінку | self | — | ні | 0 | noindex | перевірено |
| /amp/ | uk | Адвокат для військових у Києві та Україні | Професійний юридичний захист у важливі періоди життя | AMP-опис головної | / | — | ні | 0 | canonical-дублікат | прибрано hreflang |
| /articles.html | uk | Статті про ВЛК, ТЦК і права військових | Корисні матеріали | Каталог практичних статей | self | uk/en/x-default | так | 83 | OK локально | додано hreflang |
| /vlk.html | uk | Оскарження рішень ВЛК | Оскарження рішень ВЛК | Аналіз постанови, медичних документів і способів оскарження | self | uk/en/x-default | так | 33 | OK локально | додано hreflang |
| /tck.html | uk | ТЦК та військовий облік | ТЦК та військовий облік | Мобілізація, відстрочка, облік та оскарження | self | uk/en/x-default | так | 33 | OK локально | додано hreflang |
| /ekopfo.html | uk | Рішення ЕКОПФО | Рішення ЕКОПФО | Аналіз рішень експертної команди та медичних матеріалів | self | uk/en/x-default | так | 33 | OK локально | додано hreflang |
| /dismissal.html | uk | Звільнення з військової служби | Звільнення з військової служби | Підстави, рапорт і супровід розгляду | self | uk/en/x-default | так | 36 | OK локально | додано hreflang |
| /payments.html | uk | Виплати й соціальні гарантії | Виплати й соціальні гарантії | Грошове забезпечення, винагороди, компенсації та допомога | self | uk/en/x-default | так | 34 | OK локально | додано hreflang |
| /disability.html | uk | Статус особи з інвалідністю внаслідок війни | Статус особи з інвалідністю внаслідок війни | Оформлення статусу, пільг, виплат і оскарження | self | uk/en/x-default | так | 28 | OK локально | додано hreflang |
| /pensions.html | uk | Військові пенсії | Військові пенсії | Призначення, перерахунок, відмови й розрахунок | self | uk/en/x-default | так | 28 | OK локально | додано hreflang |
| /disputes.html | uk | Адміністративні та цивільні спори | Адміністративні та цивільні спори | Спори з органами влади, установами й підприємствами | self | uk/en/x-default | так | 29 | OK локально | додано hreflang |
| /family.html | uk | Сімейні, спадкові та майнові справи | Сімейні, спадкові, земельні, майнові й трудові питання | Приватні справи, документи, переговори та суд | self | uk/en/x-default | так | 28 | OK локально | додано hreflang |
| /criminal.html | uk | Захист у кримінальних провадженнях | Захист у кримінальних провадженнях | Допомога підозрюваним, обвинуваченим і потерпілим | self | uk/en/x-default | так | 28 | OK локально | додано hreflang |
| /police.html | uk | Звільнення та виплати поліцейським | Звільнення, виплати та компенсації поліцейським | Звільнення, розрахунок, допомога та компенсація відпусток | self | uk/en/x-default | так | 55 | OK локально | перевірено hreflang |
| /osbb-debt-recovery.html | uk | Стягнення боргів ОСББ через суд | Стягнення заборгованості співвласників через суд | Документи, розрахунок, наказ/позов і виконання | self | uk/en/x-default | так | 55 | OK локально | перевірено hreflang |
| /loan-debt-recovery.html | uk | Стягнення боргу за договором позики | Стягнення заборгованості за договорами позики та кредиту | Аудит договору, розрахунок, позов і виконання | self | uk/en/x-default | так | 55 | OK локально | перевірено hreflang |
| /legal-services-for-foreigners.html | uk | Юридична допомога іноземцям в Україні | Юридична допомога іноземцям в Україні | Нерухомість, спадщина, бізнес, спори, борги й міграція | self | uk/en/x-default | так | 55 | OK локально | перевірено hreflang |
| /after-ekopfo.html | uk | Отримали рішення ЕКОПФО: з чого почати | Отримали рішення ЕКОПФО: з чого почати | Перші дії й збереження медичних документів | self | uk/en/x-default | так | 3 | OK локально | додано hreflang |
| /appeal-tcc-actions.html | uk | Оскарження дій ТЦК та СП: алгоритм захисту | Оскарження дій ТЦК та СП | Фіксація порушень, документи й спосіб оскарження | self | uk/en/x-default | так | 4 | OK локально | додано hreflang |
| /combatant-status.html | uk | Статус УБД: оформлення та документи | Статус учасника бойових дій: підготовка документів | Докази, пакет документів і відмова | self | uk/en/x-default | так | 3 | OK локально | додано hreflang |
| /deferment-mobilization.html | uk | Відстрочка від мобілізації: документи | Відстрочка від мобілізації | Підстава, документи, заява й результат | self | uk/en/x-default | так | 4 | OK локально | додано hreflang |
| /documents-for-vlk.html | uk | Що підготувати для аналізу рішення ВЛК | Що підготувати для аналізу рішення ВЛК | Постанова, медичні документи та хронологія | self | uk/en/x-default | так | 4 | OK локально | додано hreflang |
| /electronic-vlk-referral.html | uk | Електронне направлення на ВЛК: що перевірити | Електронне направлення на ВЛК | Дані направлення й дії при помилці | self | uk/en/x-default | так | 3 | OK локально | додано hreflang |
| /family-missing-service-member.html | uk | Зниклий безвісти військовий: дії родини | Що робити родині зниклого безвісти військовослужбовця | Перші звернення, документи та грошові питання | self | uk/en/x-default | так | 3 | OK локально | додано hreflang |
| /first-consultation.html | uk | Як підготуватися до першої консультації | Як підготуватися до першої консультації | Хронологія й копії ключових документів | self | uk/en/x-default | так | 2 | OK локально | додано hreflang |
| /fitness-categories.html | uk | Категорії придатності до військової служби | Категорії придатності до військової служби | Висновки ВЛК і порушення функцій | self | uk/en/x-default | так | 3 | OK локально | додано hreflang |
| /injury-payments.html | uk | Виплати після поранення військового | Виплати після поранення: документи та послідовність дій | Документи, причинний зв’язок і затримка виплат | self | uk/en/x-default | так | 3 | OK локально | додано hreflang |
| /military-discharge-guide.html | uk | Звільнення з військової служби: з чого почати | Звільнення з військової служби: з чого почати | Підстава, рапорт, документи й контроль | self | uk/en/x-default | так | 3 | OK локально | додано hreflang |
| /military-payments-guide.html | uk | Військові виплати: як перевірити нарахування | Як перевірити військові виплати | Нарахування, винагорода, лікування й поранення | self | uk/en/x-default | так | 4 | OK локально | додано hreflang |
| /tcc-fine-appeal.html | uk | Оскарження штрафу ТЦК: порядок дій | Штраф ТЦК: як перевірити та оскаржити постанову | Постанова, докази та строк оскарження | self | uk/en/x-default | так | 3 | OK локально | додано hreflang |
| /transfer-military-unit.html | uk | Переведення до іншої військової частини | Переведення до іншої військової частини | Підстави, рапорт і відмова | self | uk/en/x-default | так | 3 | OK локально | додано hreflang |
| /vlk-reexamination.html | uk | Повторне проходження ВЛК: підстави та підготовка | Повторне проходження ВЛК | Підстави, медичні документи й незгода | self | uk/en/x-default | так | 3 | OK локально | додано hreflang |
| /en/ | en | Ukrainian Legal Support in Europe | Ukrainian legal support wherever you are in Europe | Remote Ukrainian legal support in Europe | self | uk/en/x-default | так | 165 | OK локально | перевірено |
| /en/military.html | en | Ukrainian Military Lawyer: Discharge and Payments | Legal support for service members and veterans | Military discharge, payments, MMC and disputes | self | — | так | 33 | OK, окрема EN-сторінка | перевірено |
| /en/articles.html | en | Legal Guides on Ukrainian Military and Civil Matters | Legal Guides on Ukrainian Military and Civil Matters | Practical English-language legal overviews | self | uk/en/x-default | так | 66 | OK локально | додано OG/Twitter |
| /en/legal-services-for-foreigners/ | en | Legal Services for Foreign Nationals in Ukraine | Legal services for foreign nationals in Ukraine | Property, inheritance, business, disputes, debt and immigration | self | uk/en/x-default | так | 66 | OK локально | перевірено |
| /en/vlk.html | en | Appealing Military Medical Commission Decisions | Appealing Military Medical Commission Decisions | MMC decisions, medical evidence and appeals | self | uk/en/x-default | так | 35 | OK локально | перевірено |
| /en/tck.html | en | Recruitment Centres and Military Registration | Recruitment Centres and Military Registration | TCC, registration, deferment and contested actions | self | uk/en/x-default | так | 35 | OK локально | перевірено |
| /en/ekopfo.html | en | Review of EKOPFO Decisions | Review of EKOPFO Decisions | EKOPFO decisions, records and appeal preparation | self | uk/en/x-default | так | 34 | OK локально | перевірено |
| /en/dismissal.html | en | Discharge from Military Service in Ukraine | Discharge from Military Service in Ukraine | Grounds, service report and consideration | self | uk/en/x-default | так | 35 | OK локально | перевірено |
| /en/payments.html | en | Military Payments and Social Guarantees | Military Payments and Social Guarantees | Remuneration, payments, compensation and assistance | self | uk/en/x-default | так | 35 | OK локально | перевірено |
| /en/disability.html | en | War-Related Disability Status | War-Related Disability Status | Documents and procedures for war-related disability | self | uk/en/x-default | так | 34 | OK локально | перевірено |
| /en/pensions.html | en | Military Pensions in Ukraine | Military Pensions in Ukraine | Service periods, certificates and recalculation | self | uk/en/x-default | так | 34 | OK локально | перевірено |
| /en/disputes.html | en | Administrative and Civil Disputes | Administrative and Civil Disputes | Disputes with authorities, organisations and private parties | self | uk/en/x-default | так | 34 | OK локально | перевірено |
| /en/family.html | en | Family, Inheritance, Land, Property and Employment Matters | Family, Inheritance, Land, Property and Employment Matters | Private-law matters for clients in Ukraine and abroad | self | uk/en/x-default | так | 35 | OK локально | перевірено |
| /en/criminal.html | en | Defence in Criminal Proceedings | Defence in Criminal Proceedings | Procedural status and early defence | self | uk/en/x-default | так | 34 | OK локально | перевірено |
| /en/police.html | en | Police Dismissal and Payments in Ukraine | Police dismissal, payments and compensation | Dismissal, settlement, assistance and leave | self | uk/en/x-default | так | 67 | OK локально | перевірено |
| /en/osbb-debt-recovery.html | en | Condominium Debt Recovery in Ukraine | Court recovery of unpaid condominium contributions | Calculations, court orders, claims and enforcement | self | uk/en/x-default | так | 67 | OK локально | перевірено |
| /en/loan-debt-recovery.html | en | Loan and Credit Debt Recovery in Ukraine | Court recovery of loans and credit debt in Ukraine | Claims, evidence, court and enforcement | self | uk/en/x-default | так | 66 | OK локально | перевірено |
| /en/after-ekopfo.html | en | What to Do After Receiving an EKOPFO Decision | What to Do After Receiving an EKOPFO Decision | First steps after an expert-team decision | self | uk/en/x-default | так | 2 | OK локально | перевірено |
| /en/appeal-tcc-actions.html | en | Appealing Actions of a Recruitment Centre | Appealing Actions of a Recruitment Centre | Contested action, evidence and remedy | self | uk/en/x-default | так | 3 | OK локально | перевірено |
| /en/combatant-status.html | en | Combatant Status: Preparing the Documents | Combatant Status: Preparing the Documents | Evidence and commission decisions | self | uk/en/x-default | так | 2 | OK локально | перевірено |
| /en/deferment-mobilization.html | en | Deferment from Mobilisation in Ukraine | Deferment from Mobilisation in Ukraine | Documents and procedure for deferment | self | uk/en/x-default | так | 3 | OK локально | перевірено |
| /en/documents-for-vlk.html | en | Documents for Reviewing an MMC Decision | Documents for Reviewing an MMC Decision | Structured medical file for review | self | uk/en/x-default | так | 3 | OK локально | перевірено |
| /en/electronic-vlk-referral.html | en | Electronic Referral to an MMC | Electronic Referral to an MMC | Referral review and examination preparation | self | uk/en/x-default | так | 2 | OK локально | перевірено |
| /en/family-missing-service-member.html | en | What Families of Missing Service Members Should Do | What Families of Missing Service Members Should Do | First response for a family | self | uk/en/x-default | так | 2 | OK локально | перевірено |
| /en/first-consultation.html | en | How to Prepare for the First Legal Consultation | How to Prepare for the First Legal Consultation | Chronology, deadlines and documents | self | uk/en/x-default | так | 2 | OK локально | перевірено |
| /en/fitness-categories.html | en | Fitness Categories for Military Service | Fitness Categories for Military Service | MMC wording and supporting documents | self | uk/en/x-default | так | 2 | OK локально | перевірено |
| /en/injury-payments.html | en | Payments After Injury: Documents and Next Steps | Payments After Injury: Documents and Next Steps | Medical, service and incident documents | self | uk/en/x-default | так | 2 | OK локально | перевірено |
| /en/military-discharge-guide.html | en | Military Discharge: Where to Start | Military Discharge: Where to Start | Ground, evidence and service report | self | uk/en/x-default | так | 2 | OK локально | перевірено |
| /en/military-payments-guide.html | en | How to Check Military Payments | How to Check Military Payments | Missing or incorrect military payments | self | uk/en/x-default | так | 3 | OK локально | перевірено |
| /en/tcc-fine-appeal.html | en | Recruitment Centre Fine: Review and Appeal | Recruitment Centre Fine: Review and Appeal | Fine document review and appeal | self | uk/en/x-default | так | 2 | OK локально | перевірено |
| /en/transfer-military-unit.html | en | Transfer to Another Military Unit | Transfer to Another Military Unit | Reasoned transfer request and evidence | self | uk/en/x-default | так | 2 | OK локально | перевірено |
| /en/vlk-reexamination.html | en | Repeat Military Medical Examination | Repeat Military Medical Examination | Repeat examination and medical file | self | uk/en/x-default | так | 2 | OK локально | перевірено |
| /privacy-policy.html | uk | Політика конфіденційності | Політика конфіденційності | Дані, мета обробки та контакт | self | uk/en/x-default | так | 34 | OK локально | перевірено |
| /en/privacy-policy.html | en | Privacy Policy | Privacy policy | Privacy information for English-speaking visitors | self | uk/en/x-default | так | 33 | OK локально | перевірено |

## 10. Публікація і Google Search Console

1. Переглянути `git diff`, особливо всі наявні до аудиту незакомічені зміни.
2. Запустити обидва локальні скрипти; очікується нуль issues і current sitemap.
3. Опублікувати репозиторій через чинний процес GitHub Pages; не змінювати DNS без окремого рішення.
4. Після завершення деплою повторити HTTP-перевірку всіх 65 sitemap URL; кожен має повертати 200, а довільний неіснуючий URL — 404.
5. Перевірити головну, мобільне меню, мовний перемикач і форми вручну на реальних мобільному й desktop браузерах.
6. У Search Console перевірити правильну property, надіслати `https://hrechkosii-nikolay.github.io/algorytm.githum.io/sitemap.xml`, оглянути ключові URL і за потреби запросити індексацію.
7. Перевірити Page indexing, HTTPS, Core Web Vitals, Mobile usability і Enhancements; не маскувати 404 редиректом на головну.
8. Протягом наступних тижнів відстежувати покази, кліки, CTR, позиції, запити й сторінки; порівнювати окремо український та англійський сегменти.
9. Оновлювати `lastmod` лише після суттєвої зміни конкретної сторінки.

Індексація, строки потрапляння в індекс і позиції не гарантуються змінами коду. Вони залежать від публікації, доступності URL, якості й актуальності контенту, сигналів сайту та рішень пошукової системи.
