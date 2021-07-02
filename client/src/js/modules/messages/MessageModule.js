import {oalog} from "../../helpers/log";
import {deepScanStartingWith, replaceGlobalText} from "../../helpers/domhelper";

export class MessageModule {

    constructor(openAudioMc) {
        this.messages = {};
        this.seeded = false;
        this.seededValues = [];
        this.currentLangFile = "";
        this.forcedValues = {};

        this.languageMappings = {
            "gb": "en.lang",
            "us": "en.lang",
            "nl": "nl.lang",
            "be": "nl.lang",
            "fr": "fr.lang",
            "ru": "ru.lang",
        }

        window.getMessageString = this.getString;
        window.debugHooks.loadLanguage = this.load
    }

    setKey(key, value) {
        this.forcedValues[key] = value;
    }

    async handleCountry(countryCode) {
        countryCode = countryCode.toLowerCase();
        let bestLangFile = this.languageMappings[countryCode]
        if (bestLangFile != null) {
            oalog("Switching to " + countryCode + " > " + bestLangFile)
            await this.load(bestLangFile)
        }
    }

    updateBanner() {
        if (Cookies.get("preferred-lang") === this.currentLangFile) {
            document.getElementById("lang-change-banner").style.display = "none";
            return
        }

        let placeholders =[["%langName", getMessageString("lang.name")]]
        replaceGlobalText("{{ ui.lang.detectedAs }}", getMessageString("lang.detectedAs", placeholders))
        replaceGlobalText("{{ ui.lang.toEn }}", getMessageString("lang.toEn", placeholders))
        replaceGlobalText("{{ ui.lang.keep }}", getMessageString("lang.keep", placeholders))


        document.getElementById("lang-back-to-en").onclick = async () => {
            await this.load("en.lang")
            document.getElementById("lang-change-banner").style.display = "none";
        }
        document.getElementById("lang-keep").onclick = () => {
            Cookies.set("preferred-lang", this.currentLangFile, {expires: 30});
            document.getElementById("lang-change-banner").style.display = "none";
        };
        document.getElementById("lang-change-banner").style.display = "";
    }

    getString(key, variables = []) {
        let v = window.openAudioMc.messageModule.messages[key];
        if (v == null) {
            oalog("Couldn't find message key " + key)
            return "?? " + key + " ??"
        }

        for (let i = 0; i < variables.length; i++) {
            v = v.replace(variables[i][0], variables[i][1])
        }

        return v;
    }

    renderKeyToDom(domKey, messageKey, variables = []) {
        let message = this.getString(messageKey, variables);

        let forced = this.forcedValues[domKey]
        if (forced != null) {
            message = forced;
        }

        replaceGlobalText(domKey, message, true)
    }

    seedStatic(staticPlaceholders) {
        let staticVariables = deepScanStartingWith("{%")
        let translations = {};

        for (let i = 0; i < staticVariables.length; i++) {
            var a = staticVariables[i];
            let temp = "";
            let fs = false
            for(let t of a)
                if (fs) {
                    temp += t;
                } else {
                    if (t !== " " && t !== "\n") {
                        fs = true;
                        temp += t;
                    }
                }
            a = temp;
            translations[a] = a.split(" ")[1];
        }

        for (let translationsKey in translations) {
            this.seededValues.push({
                "key": translationsKey,
                "value": translations[translationsKey],
                "placeholders": staticPlaceholders
            })
            this.renderKeyToDom(translationsKey, translations[translationsKey], staticPlaceholders)
        }

        this.seeded = true;
    }

    async load(file) {
        if (this.currentLangFile === file) return

        // fetch
        let request = await fetch(window.location.pathname + window.location.search + file);
        let body = await request.text();
        let lines = body.split("\n");

        // parse format:
        // # comment
        // key=value with text, no matter what, just don't use new lines
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (line.startsWith("#") || line.length < 5) continue;
            let finishedKey = false;
            let key = "";
            let value = "";
            for (let j = 0; j < line.length; j++) {
                let char = line[j];
                if (!finishedKey) {
                    if (char !== "=") {
                        key += char;
                    } else {
                        finishedKey = true;
                    }
                } else {
                    value += char;
                }
            }

            if (value !== "") {
                // complete set
                window.openAudioMc.messageModule.messages[key] = value;
            }
        }

        this.currentLangFile = file;
        if (window.openAudioMc.messageModule.seeded) {
            // reload
            for (let i = 0; i < window.openAudioMc.messageModule.seededValues.length; i++) {
                let sv = window.openAudioMc.messageModule.seededValues[i];
                window.openAudioMc.messageModule.renderKeyToDom(sv.key, sv.value, sv.placeholders)
            }
            window.openAudioMc.messageModule.updateBanner()
        }
    }
}