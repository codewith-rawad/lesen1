/* Deutsch mit Rawad · Gratis-Version: nur Lesen Teil 1, ohne Login */
window.FILE_KEY = 'lesen1'

/* Daten kommen direkt aus lesen1.js – kein Netzwerk nötig */
window.loadQuestionsFile = function () { return Promise.resolve(window.LESEN1_DATA || null) }

/* ================= UI helpers (Themes · Szenen · Prefetch) ================= */
window.THEMES = [['nacht', '#17141f', '#ffcc00'], ['tag', '#f4f6fb', '#e63946'], ['meer', '#08323d', '#ff7a59'], ['wald', '#10291c', '#f2b84b']]
document.documentElement.dataset.theme = localStorage.getItem('theme') || 'nacht'
window.setTheme = function (t) {
    document.documentElement.dataset.theme = t
    localStorage.setItem('theme', t)
    document.querySelectorAll('.tdot').forEach(b => b.classList.toggle('on', b.dataset.t === t))
}
window.mountThemes = function (el) {
    if (!el) return
    el.innerHTML = window.THEMES.map(t => `<button type="button" class="tdot" data-t="${t[0]}" aria-label="Theme ${t[0]}" style="background:linear-gradient(135deg,${t[1]} 50%,${t[2]} 50%)"></button>`).join('')
    el.onclick = e => { const b = e.target.closest('.tdot'); if (b) window.setTheme(b.dataset.t) }
    window.setTheme(localStorage.getItem('theme') || 'nacht')
}
window.SCENES = [
    [/wohn|haus|miet|nachbar|zimmer|möbel|umzug|سكن|شقة|جار|منزل/i, '🏠', '🛋️', '🔑', 28],
    [/arbeit|job|beruf|chef|büro|firma|kollege|fachkräfte|عمل|وظيفة|شركة/i, '💼', '🏢', '🤝', 215],
    [/reise|urlaub|flug|hotel|ferien|koffer|سفر|رحلة|عطلة|فندق/i, '✈️', '🧳', '🏝️', 190],
    [/essen|restaurant|kochen|kuchen|café|frühstück|brot|طعام|مطعم|طبخ/i, '🍽️', '🥨', '☕', 18],
    [/schule|uni|kurs|lehr|student|prüfung|lernen|مدرسة|جامعة|دورة|امتحان/i, '🎓', '📚', '✏️', 250],
    [/arzt|gesund|krank|medizin|apotheke|sport|طبيب|صحة|مريض|دواء/i, '🩺', '💊', '🏥', 160],
    [/bahn|zug|bus|auto|verkehr|bahnhof|taxi|قطار|حافلة|سيارة|مواصلات/i, '🚆', '🚌', '🎫', 205],
    [/wald|natur|park|berg|wandern|tier|hund|katze|غابة|طبيعة|حديقة|جبل/i, '🌲', '🦌', '🍄', 135],
    [/fahrrad|rad|radfahr|دراجة/i, '🚲', '🌳', '☀️', 95],
    [/handy|computer|internet|app|telefon|anruf|nachricht|هاتف|جوال|حاسوب|انترنت/i, '📱', '💻', '📞', 265],
    [/familie|kind|eltern|mutter|vater|oma|opa|freund|hochzeit|عائلة|طفل|أم|أب|صديق|زفاف/i, '👨‍👩‍👧', '🎈', '💛', 340],
    [/geld|bank|preis|kosten|miete|kauf|laden|markt|einkauf|مال|بنك|سعر|تسوق|سوق/i, '💶', '🛒', '🏦', 50],
    [/wetter|regen|sonne|schnee|winter|sommer|طقس|مطر|شمس|ثلج/i, '⛅', '🌧️', '❄️', 200],
    [/musik|konzert|film|kino|theater|fest|party|موسيقى|حفل|فيلم|سينما/i, '🎵', '🎬', '🎭', 300],
    [/stadt|berlin|hamburg|münchen|köln|frankfurt|deutschland|مدينة|ألمانيا|برلين/i, '🏙️', '🥨', '🇩🇪', 8],
    [/frau|mann|moderator|radio|sendung|interview|رجل|امرأة|مقدم|برنامج/i, '🎙️', '🎧', '📻', 175]
]
window.sceneFor = function (text, seed) {
    const s = String(text || '')
    let hit = window.SCENES.find(x => x[0].test(s))
    if (!hit) {
        let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
        const pool = [['📖', '✨', '🔤'], ['🧠', '💡', '📝'], ['🗺️', '🧭', '📮'], ['🥨', '🍺', '🏰']][(h + (seed || 0)) % 4]
        hit = [null, pool[0], pool[1], pool[2], h % 360]
    }
    const ph = window.photoFor(s, seed)
    const img = ph ? `<img class="ph" loading="lazy" alt="" src="${ph}" onerror="this.remove()">` : ''
    return `<div class="scene" style="--h:${hit[4]}"><i class="sun"></i><b class="e1">${hit[1]}</b><b class="e2">${hit[2]}</b><b class="e3">${hit[3]}</b><u></u>${img}</div>`
}

/* ===== Echte Fotos passend zum Inhalt ===== */
window.PHOTO_WORDS = [
    [/fahrrad|radfahr|\brad\b|دراجة/i, 'bicycle'],
    [/umzug|umziehen|karton|انتقال|نقل/i, 'moving,boxes'],
    [/nachbar|جار/i, 'neighbor,apartment'],
    [/wohnung|miete|vermieter|mieter|zimmer|möbel|شقة|إيجار|غرفة|أثاث/i, 'apartment'],
    [/\bhaus\b|häuser|منزل|بيت/i, 'house'],
    [/wald|wandern|spazier|غابة|مشي/i, 'forest'],
    [/berg|جبل/i, 'mountain'],
    [/park|natur|baum|حديقة|طبيعة/i, 'park'],
    [/garten|blume|بستان/i, 'garden'],
    [/hund|كلب/i, 'dog'],
    [/katze|قطة|قط\b/i, 'cat'],
    [/tier|حيوان/i, 'animals'],
    [/handy|smartphone|nachricht|هاتف|جوال|رسالة/i, 'smartphone'],
    [/telefon|anruf|اتصال/i, 'telephone'],
    [/computer|laptop|internet|e-?mail|app\b|حاسوب|انترنت|إنترنت/i, 'laptop'],
    [/arzt|ärztin|krank|krankenhaus|medizin|طبيب|مريض|مستشفى/i, 'doctor'],
    [/apotheke|medikament|tablette|صيدلية|دواء/i, 'pharmacy'],
    [/prüfung|test\b|امتحان|اختبار/i, 'exam'],
    [/universität|studium|student|جامعة|طالب/i, 'university'],
    [/schule|lehrer|unterricht|klasse|kurs|مدرسة|معلم|دورة|صف/i, 'classroom'],
    [/bewerbung|vorstellungsgespräch|مقابلة|تقديم/i, 'interview'],
    [/praktikum|arbeit|job\b|beruf|büro|chef|kollege|firma|عمل|وظيفة|مكتب|شركة|تدريب/i, 'office'],
    [/restaurant|kellner|speisekarte|مطعم/i, 'restaurant'],
    [/kochen|küche|rezept|طبخ|مطبخ/i, 'cooking'],
    [/frühstück|فطور/i, 'breakfast'],
    [/kuchen|torte|كعكة/i, 'cake'],
    [/kaffee|café|قهوة/i, 'coffee'],
    [/bäckerei|brot|brötchen|خبز|مخبز/i, 'bakery'],
    [/essen\b|mittagessen|abendessen|طعام|غداء|عشاء/i, 'food'],
    [/supermarkt|einkauf|einkaufen|\bmarkt\b|\bladen\b|kaufen|تسوق|سوق|متجر/i, 'supermarket'],
    [/kleidung|jacke|hose|schuhe|mantel|pullover|ملابس|جاكيت|حذاء/i, 'clothes'],
    [/friseur|حلاق/i, 'hairdresser'],
    [/koffer|gepäck|حقيبة|أمتعة/i, 'suitcase'],
    [/flughafen|flug\b|flugzeug|مطار|طائرة|رحلة جوية/i, 'airport'],
    [/hotel|فندق/i, 'hotel'],
    [/urlaub|reise|ferien|strand|meer|سفر|عطلة|رحلة|شاطئ|بحر/i, 'travel'],
    [/bahnhof|\bzug\b|\bbahn\b|قطار|محطة/i, 'train'],
    [/\bbus\b|haltestelle|حافلة|باص/i, 'bus'],
    [/taxi|تاكسي/i, 'taxi'],
    [/führerschein|\bauto\b|fahren|verkehr|stau|سيارة|رخصة|مرور/i, 'car'],
    [/baby|kinder|\bkind\b|طفل|أطفال/i, 'children'],
    [/familie|eltern|mutter|vater|oma\b|opa\b|schwester|bruder|عائلة|أم\b|أب\b|أخت|أخ\b/i, 'family'],
    [/hochzeit|زفاف|عرس/i, 'wedding'],
    [/geburtstag|عيد ميلاد/i, 'birthday'],
    [/party|feier|fest\b|حفلة|احتفال/i, 'party'],
    [/konzert|musik|حفل موسيقي|موسيقى/i, 'concert'],
    [/kino|film|سينما|فيلم/i, 'cinema'],
    [/theater|مسرح/i, 'theater'],
    [/fußball|fussball|كرة القدم/i, 'football'],
    [/schwimm|schwimmbad|سباحة|مسبح/i, 'swimming'],
    [/fitness|training|sport|rennen|joggen|رياضة|تمرين|جري/i, 'gym'],
    [/regen|مطر/i, 'rain'],
    [/schnee|ثلج/i, 'snow'],
    [/sonne|sommer|wetter|شمس|صيف|طقس/i, 'sunny'],
    [/winter|شتاء/i, 'winter'],
    [/bank\b|konto|geld|überweisung|بنك|حساب|مال/i, 'bank'],
    [/paket|post\b|brief|طرد|بريد|رسالة بريدية/i, 'parcel'],
    [/polizei|شرطة/i, 'police'],
    [/bibliothek|buch\b|bücher|lesen|مكتبة|كتاب/i, 'books'],
    [/radio|moderator|sendung|interview|إذاعة|مقدم|برنامج/i, 'microphone'],
    [/freund|freundin|treffen|صديق|لقاء/i, 'friends'],
    [/japan|اليابان/i, 'japan'],
    [/mexiko|المكسيك/i, 'mexico'],
    [/berlin|برلين/i, 'berlin'],
    [/deutschland|ألمانيا/i, 'germany'],
    [/stadt|مدينة/i, 'city'],
    [/foto|kamera|صورة|كاميرا/i, 'camera'],
    [/sprache|deutsch|lernen|لغة|تعلم/i, 'books']
]
window.photoFor = function (text, seed) {
    const s = String(text || '')
    const hit = window.PHOTO_WORDS.find(x => x[0].test(s))
    if (!hit) return null
    let h = 11; for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0
    return 'https://loremflickr.com/640/360/' + hit[1] + '?lock=' + ((h + (seed || 0)) % 997)
}
window.toast = function (msg) {
    let t = document.getElementById('toast')
    if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t) }
    t.textContent = msg; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2400)
}
window.markDone = function (fileKey, id) {
    try {
        const k = 'done_' + fileKey, set = new Set(JSON.parse(localStorage.getItem(k) || '[]'))
        set.add(String(id)); localStorage.setItem(k, JSON.stringify([...set]))
        const p = JSON.parse(localStorage.getItem('progress_' + fileKey) || '{}')
        p.completed = set.size; localStorage.setItem('progress_' + fileKey, JSON.stringify(p))
    } catch (e) { }
}
window.doneCount = function (fileKey) { try { return JSON.parse(localStorage.getItem('done_' + fileKey) || '[]').length } catch (e) { return 0 } }