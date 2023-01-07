import UrlReader from "../util/UrlReader";
import {API_ENDPOINT} from "../config/ApiEndpoints";
import {ReportError} from "../util/ErrorReporter";
import {setGlobalState} from "../../state/store";

export default class ClientTokenSet {

    constructor(publicServerKey, playerUUID, playerName, playerToken, scope) {
        this.publicServerKey = publicServerKey;
        this.uuid = playerUUID;
        this.name = playerName;
        this.token = playerToken;
        this.scope = scope;
        this.attempts = 0;
    }

    initialize() {
        return new Promise((resolve => {
            let url = window.location.href;
            if (url == null) {
                console.error("No URL found");
                resolve(null);
                return
            }
            if (url.split('?').length >= 2) {
                const params = UrlReader.getParametersFromUrl(url.split('?')[1]);

                // if the params does not contain shit, dont return shit either
                // fuck off
                if (params.data == null) {
                    console.error("No data found in URL");
                    resolve(null);
                    return
                }

                let query = atob(params.data).split(":");

                // validate all data
                if (query.length !== 4) {
                    console.log("Invalid query length")
                    resolve(null);
                    return null;
                } // must be 4 arguments
                const playerName = query[0];
                const playerUuid = query[1];
                const serverUuid = query[2];
                const playerToken = query[3];

                // validate the given data
                if (!(playerName != null && playerName.length <= 16 && // player name cant be null and must be 16 chars or less
                    playerUuid != null && playerUuid.length <= 40 &&   // player uuid cant be null or less than 40 char
                    serverUuid != null && serverUuid.length <= 40 &&   // server uuid cant be null or less than 40 char
                    playerToken != null && playerToken.length <= 5)) { // player token cant be null or less than 5 char
                    console.log("Failed parsing the token")
                    resolve(null);
                }

                // all appears to be okay! thats good! give a session
                const out = new ClientTokenSet(serverUuid, playerUuid, playerName, playerToken)
                resolve(out);
            } else if (url.split('#').length >= 2) {
                // try to load via fetch
                let token = url.split('#')[1];
                fetch(API_ENDPOINT.CLIENT_SESSION_SERVER + "?token=" + token)
                    .then(body => {
                        body.json().then(sessionValidationResponse => {
                            if (sessionValidationResponse.errors.length > 0) {
                                if (this.attempts < 3) {
                                    setGlobalState({loadingState: "Logging in failed, attempt " + (this.attempts + 1) + " of 3."})

                                    setTimeout(() => {
                                        this.requestWasPreviouslyAttempted = true;
                                        this.initialize()
                                            .then(resolve)
                                        this.attempts++;
                                    }, 1000)
                                } else {
                                    console.log("Session error")
                                    resolve(null);
                                }
                                return
                            }
                            let ses = sessionValidationResponse.response;

                            const out = new ClientTokenSet(ses.publicKey, ses.playerUuid, ses.playerName, ses.session, ses.scope)
                            resolve(out);
                        }).catch(e => {
                            console.error(e);
                        });
                    })
                    .catch(error => {
                        ReportError('Something went while requesting tokens. Error: ' + error.toJSON(), window.tokenCache.name)
                        console.error(error);
                    });
            } else {
                resolve(null);
            }
        }));
    }

}
