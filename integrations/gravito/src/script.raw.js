(function () {
    var w = window;
    var d = document;

    var CONFIG_URL = '<CONFIG_URL>';
    var SDK_URL = 'https://cdn.gravito.net/sdk/v6/latest/sdk.js';
    var SDK_SCRIPT_ID = 'gravito-sdk-stub';
    var LOG_PREFIX = '[GitBook Gravito integration]';

    // Events dispatched by the Gravito CMP components.
    // See https://docs.gravito.net/Gravito_V6_CMP/Components/StandardCMP/gravito_cmp/
    // and https://docs.gravito.net/Gravito_V6_CMP/Components/TCFCMP/tcf_cmp/
    var STANDARD_CMP_EVENT = 'gravito:cmp:light';
    var TCF_CMP_EVENT = 'gravito:tcfv2:client';

    var OPT_IN_ALL_EVENTS = ['layer1:opt-in:all', 'layer2:opt-in:all'];
    var OPT_OUT_ALL_EVENTS = ['layer1:opt-out:all', 'layer2:opt-out:all'];
    // For these, the decision has to be read from the stored consent state.
    // Note that both can represent a rejection: `layer2:opt-in:selected` fires
    // from the Save button even if nothing is ticked, and `opt-in:previously`
    // replays whatever the visitor chose before, including "reject all".
    var INSPECT_STATE_EVENTS = ['layer2:opt-in:selected', 'opt-in:previously'];
    var REPLAY_EVENT = 'opt-in:previously';

    function logError() {
        try {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(LOG_PREFIX);
            console.error.apply(console, args);
        } catch (e) {}
    }

    function getCookie(name) {
        var prefix = name + '=';
        var parts = d.cookie.split(';');
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i].replace(/^\s+/, '');
            if (part.indexOf(prefix) === 0) {
                return decodeURIComponent(part.substring(prefix.length));
            }
        }
        return null;
    }

    function anyTrue(obj) {
        if (!obj || typeof obj !== 'object') return false;
        for (var key in obj) {
            if (obj[key] === true) return true;
        }
        return false;
    }

    // Standard (non-TCF) CMP: each entry of the consent model is a cookie category;
    // strictly necessary ones are flagged isConsentable=false. The live model is
    // exposed on gravito.cmp.standard.currentState; the JSON cookie named by
    // gravito.config.cmp.standard.core.cookieName is the fallback.
    // Returns null when the state cannot be read.
    function hasStandardNonEssentialConsent() {
        var cmp = w.gravito && w.gravito.cmp;
        var model = cmp && cmp.standard && cmp.standard.currentState;

        if (!Array.isArray(model)) {
            var config = w.gravito && w.gravito.config;
            var core = config && config.cmp && config.cmp.standard && config.cmp.standard.core;
            var raw = core && core.cookieName ? getCookie(core.cookieName) : null;
            if (!raw) return null;
            var state = JSON.parse(raw);
            model = state && state.Model;
        }
        if (!Array.isArray(model)) return null;

        return model.some(function (category) {
            return !!category && category.isConsentable !== false && category.consent === true;
        });
    }

    // TCF CMP: the consent state is exposed on gravito.cmp.tcf.currentState.
    // Returns null when the state cannot be read.
    function hasTcfNonEssentialConsent() {
        var cmp = w.gravito && w.gravito.cmp;
        var state = cmp && cmp.tcf && cmp.tcf.currentState;
        if (!state) return null;

        return (
            anyTrue(state.purposes && state.purposes.consent) ||
            anyTrue(state.specialFeatures) ||
            anyTrue(state.customPurposes && state.customPurposes.consent) ||
            (state.nonTCFVendors || []).some(function (vendor) {
                return !!vendor && vendor.consent === true;
            })
        );
    }

    // The config URL is a build-time constant, so start fetching it right away
    // instead of waiting for the window load event.
    var config = null;
    var configError = null;
    var configCallbacks = [];

    function onConfigReady(callback) {
        if (config || configError) {
            callback();
        } else {
            configCallbacks.push(callback);
        }
    }

    function settleConfig(loaded, error) {
        config = loaded;
        configError = error;
        var callbacks = configCallbacks;
        configCallbacks = [];
        callbacks.forEach(function (callback) {
            callback();
        });
    }

    function loadConfig() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', CONFIG_URL, true);
        xhr.onload = function () {
            try {
                if (xhr.status < 200 || xhr.status >= 300) {
                    throw new Error('config request returned HTTP ' + xhr.status);
                }
                var parsed = JSON.parse(xhr.response);
                if (!parsed || !parsed.cmp) {
                    throw new Error(
                        'config has no "cmp" section. Only Gravito CMP v6 configurations are supported; legacy Light/TCF (SDK v3) and Pro CMP tokens will not work',
                    );
                }
                settleConfig(parsed, null);
            } catch (e) {
                settleConfig(null, e);
            }
        };
        xhr.onerror = xhr.ontimeout = function () {
            settleConfig(null, new Error('config request to ' + CONFIG_URL + ' failed'));
        };
        xhr.send();
    }

    function injectGravito() {
        if (d.getElementById(SDK_SCRIPT_ID)) return;

        if (configError || !config) {
            logError('Could not load the Gravito CMP configuration from ' + CONFIG_URL + '.', configError);
            return;
        }

        // Gravito is already on the page (e.g. through Google Tag Manager or a custom
        // header). Loading a second SDK would reset it and render two banners.
        if (w.gravitoSDKV2 === true || (w.gravito && w.gravito.config)) {
            logError(
                'Gravito is already installed on this page. Remove the other Gravito installation so that the GitBook integration can manage it.',
            );
            return;
        }

        var componentURL = config.cmp.settings && config.cmp.settings.componentURL;
        if (componentURL && String(componentURL).indexOf('https://cdn.gravito.net/') !== 0) {
            logError(
                'The configuration loads its CMP bundle from ' +
                    componentURL +
                    ', which is not allowed by the integration Content Security Policy.',
            );
        }

        w.gravito = w.gravito || {};
        w.gravito.config = config;

        var s = d.createElement('script');
        s.id = SDK_SCRIPT_ID;
        s.type = 'text/javascript';
        s.async = true;
        s.src = SDK_URL;
        s.onload = function () {
            if (w.gravito && typeof w.gravito.init === 'function') {
                w.gravito.init();
            }
        };
        s.onerror = function () {
            logError('Failed to load the Gravito SDK from ' + SDK_URL + '.');
        };
        d.body.appendChild(s);
    }

    function l() {
        if (!w.GitBook || typeof w.GitBook.registerCookieBanner !== 'function') return;

        w.GitBook.registerCookieBanner(function ({ onApprove, onReject }) {
            function isGpcEnabled() {
                return (
                    typeof w.GitBook.isGlobalPrivacyControlEnabled === 'function' &&
                    w.GitBook.isGlobalPrivacyControlEnabled() === true
                );
            }

            // Returns the decision GitBook already holds: true/false, or undefined
            // when the visitor has not answered yet.
            function recordedApproval() {
                if (typeof w.GitBook.isCookiesTrackingDisabled !== 'function') return undefined;
                var disabled = w.GitBook.isCookiesTrackingDisabled();
                return disabled === undefined ? undefined : !disabled;
            }

            function forwardDecision(hasNonEssential, isReplay) {
                // A visitor broadcasting Global Privacy Control must not be tracked,
                // whatever the banner says. GitBook rejects on its own under GPC, so
                // forwarding an approval would only cause a reload and a mismatch.
                var approve = hasNonEssential === true && !isGpcEnabled();

                // Gravito replays the stored decision on every page load, and GitBook's
                // onApprove/onReject reload the page to reinitialize scripts. Only forward
                // a replay when GitBook has no decision recorded yet, or a different one;
                // a live choice in the banner is always forwarded.
                if (isReplay && recordedApproval() === approve) return;

                if (approve) {
                    onApprove();
                } else {
                    onReject();
                }
            }

            function handleCmpEvent(event) {
                var eventType = event && event.detail && event.detail.eventType;
                var isReplay = eventType === REPLAY_EVENT;

                try {
                    if (OPT_IN_ALL_EVENTS.indexOf(eventType) !== -1) {
                        forwardDecision(true, false);
                    } else if (OPT_OUT_ALL_EVENTS.indexOf(eventType) !== -1) {
                        forwardDecision(false, false);
                    } else if (INSPECT_STATE_EVENTS.indexOf(eventType) !== -1) {
                        var hasNonEssential =
                            event.type === TCF_CMP_EVENT
                                ? hasTcfNonEssentialConsent()
                                : hasStandardNonEssentialConsent();
                        // Unreadable state fails closed: never enable tracking on a guess.
                        forwardDecision(hasNonEssential === true, isReplay);
                    }
                } catch (e) {
                    logError('Failed to read the Gravito consent state.', e);
                    forwardDecision(false, isReplay);
                }
            }

            // Gravito dispatches its events with bubbling from an element in <body>,
            // so listening on the document is enough.
            d.addEventListener(STANDARD_CMP_EVENT, handleCmpEvent);
            d.addEventListener(TCF_CMP_EVENT, handleCmpEvent);

            onConfigReady(injectGravito);
        });
    }

    loadConfig();

    if (w.attachEvent) {
        w.attachEvent('onload', l);
    } else {
        w.addEventListener('load', l, false);
    }
})();
