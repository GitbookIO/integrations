(function () {
    var w = window;
    var d = document;

    const doneTranslations = {
        en: 'Done',
        'en-us': 'Done',
        'zh-cn': '完成',
        'zh-hans': '完成',
        'zh-hant': '完成',
        'zh-tw': '完成',
        'ja-jp': '完了する',
        ja: '完了する',
        'ko-kr': '완료',
        'en-in': 'Done',
        'en-au': 'Done',
        'en-sg': 'Done',
        'id-id': 'Selesai',
        'th-th': 'เสร็จสิ้น',
        'vi-vn': 'done',
        'en-ph': 'Done',
        'en-my': 'Done',
        'en-gb': 'Done',
        'cs-cz': 'Hotovo',
        'da-dk': 'Udført',
        'de-de': 'Fertig',
        'es-es': 'Hecho',
        'fi-fi': 'Valmis',
        'fr-fr': 'Terminé',
        'it-it': 'Fine',
        'nb-no': 'Ferdig',
        'nl-nl': 'Gereed',
        'pl-pl': 'Gotowe',
        'ro-ro': 'Gata',
        'ru-ru': 'Готово',
        'sv-se': 'Klart',
        'tr-tr': 'Bitti',
        'fr-be': 'Terminé',
        'de-at': 'Fertig',
        'en-eu': 'Done',
        'en-me': 'Done',
        'es-la': 'Listo',
        'pt-br': 'Concluído',
    };

    function injectOneTrust() {
        const stub = d.getElementById('onetrust-sdk-stub');
        if (stub) return;

        var s = d.createElement('script');
        s.id = 'onetrust-sdk-stub';
        s.type = 'text/javascript';
        s.async = true;
        s.charset = 'UTF-8';
        s.setAttribute('data-document-language', 'true');
        s.setAttribute('data-domain-script', '<DOMAIN_SCRIPT_ID>');
        s.src = 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js';
        d.head.appendChild(s);

        if (typeof w.OptanonWrapper !== 'function') {
            w.OptanonWrapper = () => {};
        }
    }

    function l() {
        if (!w.GitBook || typeof w.GitBook.registerCookieBanner !== 'function') return;

        const cookieState = w.GitBook.isCookiesTrackingDisabled();
        const hasRecordedConsent = cookieState !== undefined;

        w.GitBook.registerCookieBanner(function ({ onApprove, onReject }) {
            injectOneTrust();

            function emitConsent() {
                try {
                    var groups = (w.OnetrustActiveGroups || '').split(',');
                    var hasNonEssential = groups.some(function (g) {
                        var t = g && g.trim();
                        return t && t !== 'C0001';
                    });
                    if (hasNonEssential) {
                        onApprove();
                    } else {
                        onReject();
                    }
                } catch (e) {
                    onReject();
                }
            }

            // When GPC is enabled, replace Accept/Reject with a Done button
            function applyGPCBanner() {
                try {
                    if (
                        typeof w.OneTrust !== 'undefined' &&
                        w.OneTrust.IsAlertBoxClosed &&
                        w.OneTrust.IsAlertBoxClosed()
                    ) {
                        return;
                    }

                    const acceptBtn = d.getElementById('onetrust-accept-btn-handler');
                    const rejectBtn = d.getElementById('onetrust-reject-all-handler');
                    const btnGroup = d.getElementById('onetrust-button-group');

                    if (!btnGroup) return;
                    if (d.getElementById('gpc-done-btn-handler')) return;

                    if (acceptBtn) acceptBtn.style.display = 'none';
                    if (rejectBtn) rejectBtn.style.display = 'none';

                    const lang = (d.documentElement.lang || 'en').toLowerCase();
                    const baseLang = lang.split('-')[0];
                    const matchKey =
                        doneTranslations[lang] !== undefined
                            ? lang
                            : Object.keys(doneTranslations).find(function (k) {
                                  return k.startsWith(baseLang);
                              });
                    const doneBtn = d.createElement('button');
                    doneBtn.id = 'gpc-done-btn-handler';
                    doneBtn.textContent =
                        (matchKey && doneTranslations[matchKey]) || doneTranslations['en'];

                    if (acceptBtn) {
                        doneBtn.className = acceptBtn.className;
                    }

                    doneBtn.addEventListener('click', function () {
                        try {
                            if (typeof w.OneTrust !== 'undefined' && w.OneTrust.RejectAll) {
                                w.OneTrust.RejectAll();
                            } else {
                                onReject();
                            }
                        } catch (e) {
                            onReject();
                        }
                    });

                    btnGroup.appendChild(doneBtn);
                } catch (e) {}
            }

            let previousOptanonWrapper = w.OptanonWrapper;
            w.OptanonWrapper = function () {
                previousOptanonWrapper && previousOptanonWrapper();
                try {
                    w.dispatchEvent(new Event('onetrust-banner-loaded'));
                    // Emit initial consent for returning visitors (OnetrustActiveGroups
                    // is populated from stored consent; OTConsentApplied won't fire)
                    if (!hasRecordedConsent && w.OnetrustActiveGroups !== undefined) {
                        emitConsent();
                    }
                } catch (e) {}

                // When GPC is enabled, apply the GPC banner
                if (
                    typeof w.GitBook.isGlobalPrivacyControlEnabled === 'function' &&
                    w.GitBook.isGlobalPrivacyControlEnabled()
                ) {
                    requestAnimationFrame(function () {
                        applyGPCBanner();
                    });
                }
            };

            // OTConsentApplied fires when user clicks Accept/Reject
            w.addEventListener('OTConsentApplied', function () {
                if (!hasRecordedConsent) {
                    emitConsent();
                }
            });
        });
    }

    if (w.attachEvent) {
        w.attachEvent('onload', l);
    } else {
        w.addEventListener('load', l, false);
    }
})();
