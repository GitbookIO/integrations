import * as bridge from './bridge';
import { Response } from './response';

export interface CustomRequestInit extends RequestInit {
    timeout?: number;
    readTimeout?: number;
    certificate?: {
        key?: string | Buffer | Array<string | Buffer>;
        cert?: string | Buffer | Array<string | Buffer>;
        ca?: string | Buffer | Array<string | Buffer>;
        pfx?: string | Buffer | Array<string | Buffer>;
        passphrase?: string;
    };
    tls?: {
        servername?: string;
    };
}

/**
 * Starts the process of fetching a network request.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
 * @global
 * @param req - The direct URL or Request for the resource you wish to fetch
 * @param init - Options for the request
 * @return A Promise that resolves to a {@linkcode Response} object
 */
export function fetch(req: RequestInfo, init?: CustomRequestInit): Promise<Response> {
    return new Promise(function fetchPromise(resolve, reject) {
        const fetchCb = new bridge._ivm.Reference((err, nodeRes, nodeBody) => {
            if (err && typeof err === 'string' && err.includes('timeout')) {
                return reject(new TimeoutError(err));
            }
            if (err) {
                return reject(new Error(err));
            }

            resolve(new Response(nodeBody, nodeRes));
        });

        try {
            if (typeof req === 'string') {
                req = new Request(req, init);
            }
            const url = req.url;
            init = {
                method: req.method,
                headers: (req.headers && req.headers.toJSON()) || {},
                timeout: init && init.timeout,
                readTimeout: (init && init.readTimeout) || 30 * 1000,
                certificate: init && init.certificate,
                tls: init && init.tls,
            };
            if (!req.bodySource) {
                bridge._fetch(url, init, null, fetchCb);
            } else if (typeof req.bodySource === 'string') {
                bridge._fetch(url, init, req.bodySource, fetchCb);
            } else {
                req.arrayBuffer()
                    .then((body) => {
                        bridge._fetch(url, init, body, fetchCb);
                    })
                    .catch(reject);
            }
        } catch (err) {
            reject(err);
        }
    });
}

export class TimeoutError extends Error {}
